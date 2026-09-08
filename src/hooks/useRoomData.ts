import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { appConfig } from '../config';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
export const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

let globalRoomData: any = null;
const listeners = new Set<(data: any) => void>();
let isSubscribed = false;
let isLocalSubscribed = false;
let hasLocalLiveData = false;

/**
 * Super robust parser for MLBB live data packets.
 * Supports:
 * - Python repr string format: "message: {'type': 'send', 'payload': '{\"type\":\"mlbb_live_data\",...}'} data: None"
 * - Standard JSON: {"type": "send", "payload": "{\"type\":\"mlbb_live_data\",...}"}
 * - Direct payload object { gameState, draftPhase, players, Battle }
 * - Supabase payload wrapper object
 */
export function parseMlbbLiveData(rawMessage: any): any {
  if (!rawMessage) return null;

  const extractInnerPayload = (obj: any): any => {
    if (!obj || typeof obj !== 'object') return null;

    if (obj.type === 'mlbb_live_data' && obj.payload) {
      if (typeof obj.payload === 'string') {
        const sub = parseMlbbLiveData(obj.payload);
        if (sub) return sub;
      }
      return extractInnerPayload(obj.payload) || obj.payload;
    }

    if (obj.type === 'send' && obj.payload) {
      if (typeof obj.payload === 'string') {
        const sub = parseMlbbLiveData(obj.payload);
        if (sub) return sub;
      } else if (typeof obj.payload === 'object') {
        return extractInnerPayload(obj.payload) || obj.payload;
      }
    }

    if (obj.players || obj.Battle || obj.battle || obj.gameState !== undefined) {
      return obj;
    }

    return null;
  };

  if (typeof rawMessage === 'object') {
    const extracted = extractInnerPayload(rawMessage);
    if (extracted) return extracted;
  }

  if (typeof rawMessage === 'string') {
    let str = rawMessage.trim();

    // Unwrap double/triple JSON stringified string from Python json.dumps(payload)
    for (let depth = 0; depth < 3; depth++) {
      if (str.startsWith('"') && str.endsWith('"')) {
        try {
          const unwrapped = JSON.parse(str);
          if (typeof unwrapped === 'string') {
            str = unwrapped.trim();
          } else if (typeof unwrapped === 'object') {
            const extracted = extractInnerPayload(unwrapped);
            if (extracted) return extracted;
            break;
          }
        } catch (e) {
          break;
        }
      }
    }

    if (str.startsWith('message:')) {
      str = str.substring('message:'.length).trim();
    }
    const dataSuffixIdx = str.lastIndexOf(' data:');
    if (dataSuffixIdx !== -1) {
      str = str.substring(0, dataSuffixIdx).trim();
    }

    // 1. Try standard JSON parse
    try {
      const parsed = JSON.parse(str);
      const extracted = extractInnerPayload(parsed);
      if (extracted) return extracted;
    } catch (e) {}

    // 2. Try regex match for inner {"type":"mlbb_live_data",...}
    const matchLive = str.match(/\{"type"\s*:\s*"mlbb_live_data"[\s\S]*\}/);
    if (matchLive) {
      try {
        const parsed = JSON.parse(matchLive[0]);
        const extracted = extractInnerPayload(parsed);
        if (extracted) return extracted;
      } catch (e) {}
    }

    // 3. Try Python dict string conversion (single quotes, None, True, False)
    try {
      let py = str
        .replace(/\bNone\b/g, 'null')
        .replace(/\bTrue\b/g, 'true')
        .replace(/\bFalse\b/g, 'false');

      // Convert single quotes around keys/values to double quotes
      py = py.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, (_m, p1) => {
        const inner = p1.replace(/"/g, '\\"');
        return `"${inner}"`;
      });

      const parsed = JSON.parse(py);
      const extracted = extractInnerPayload(parsed);
      if (extracted) return extracted;
    } catch (e) {}
  }

  return null;
}

/**
 * Update real-time live data directly in local state (0 latency / no DB write required).
 */
export function updateLocalLiveData(rawMessage: any) {
  const livePayload = parseMlbbLiveData(rawMessage);
  if (!livePayload) return;

  hasLocalLiveData = true;
  const battle = livePayload.Battle || livePayload.battle;

  const newPlayers = (Array.isArray(livePayload.players) && livePayload.players.length > 0)
    ? livePayload.players
    : globalRoomData?.players;

  globalRoomData = {
    ...globalRoomData,
    ...livePayload,
    battle: battle || globalRoomData?.battle,
    Battle: battle || globalRoomData?.Battle,
    players: newPlayers,
    gameState: livePayload.gameState !== undefined ? livePayload.gameState : globalRoomData?.gameState,
    draftPhase: livePayload.draftPhase || globalRoomData?.draftPhase,
    draftTimer: livePayload.draftTimer !== undefined ? livePayload.draftTimer : globalRoomData?.draftTimer,
  };

  listeners.forEach((listener) => listener(globalRoomData));
}

function subscribeToLocalRealtime() {
  if (isLocalSubscribed) return;
  isLocalSubscribed = true;

  // 1. Listen via BroadcastChannel ('mlbb_local_live')
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const bc = new BroadcastChannel('mlbb_local_live');
      bc.onmessage = (event) => {
        if (event.data) {
          updateLocalLiveData(event.data);
        }
      };
    }
  } catch (e) {
    console.warn('BroadcastChannel not available:', e);
  }

  // 2. Listen via Window custom event or postMessage
  if (typeof window !== 'undefined') {
    window.addEventListener('mlbb_local_data', (event: any) => {
      if (event.detail) {
        updateLocalLiveData(event.detail);
      }
    });

    window.addEventListener('message', (event) => {
      if (event.data) {
        updateLocalLiveData(event.data);
      }
    });
  }

  // 3. Connect to Local WebSocket server (tries ws://127.0.0.1:8080 and ws://localhost:8080)
  const targets = Array.from(new Set([
    import.meta.env.VITE_LOCAL_WS_URL,
    'ws://127.0.0.1:8080',
    'ws://localhost:8080'
  ])).filter(Boolean) as string[];

  let targetIdx = 0;

  function connectWs() {
    const currentUrl = targets[targetIdx % targets.length];
    targetIdx++;

    try {
      const ws = new WebSocket(currentUrl);

      ws.onopen = () => {
        console.log(`[Local WS] ✅ Terhubung ke Frida Telemetry Server di ${currentUrl}`);
      };

      ws.onmessage = async (event) => {
        if (event.data) {
          let dataStr = event.data;
          if (typeof Blob !== 'undefined' && event.data instanceof Blob) {
            dataStr = await event.data.text();
          }
          updateLocalLiveData(dataStr);
        }
      };

      ws.onerror = () => {
        // Suppress errors when server is offline
      };

      ws.onclose = () => {
        setTimeout(connectWs, 2000);
      };
    } catch (e) {
      setTimeout(connectWs, 2000);
    }
  }

  connectWs();
}

function subscribeToSupabase() {
  if (isSubscribed || !supabase) return;
  isSubscribed = true;

  // Initial fetch for the first load
  const fetchInitialData = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('operator_id', appConfig.operatorId)
        .single();
      
      if (data) {
        if (hasLocalLiveData) {
          // Preserve active live WebSocket telemetry over DB fields
          const { players, battle, Battle, gameState, draftPhase, draftTimer, ...staticDbData } = data;
          globalRoomData = { ...staticDbData, ...globalRoomData };
        } else {
          const dbParsed = parseMlbbLiveData(data.data || data.payload || data.raw_payload);
          globalRoomData = { ...data, ...(dbParsed || {}), ...globalRoomData };
        }
        listeners.forEach((listener) => listener(globalRoomData));
      }
    } catch (e) {
      console.error('Error fetching initial data from Supabase:', e);
    }
  };
  
  fetchInitialData();

  // Listen to realtime updates
  supabase
    .channel('live-match')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'rooms',
      },
      (payload: any) => {
        if (globalRoomData && payload.new && globalRoomData.id) {
           if (String(payload.new.id) !== String(globalRoomData.id)) return;
        } else if (payload.new && payload.new.operator_id && String(payload.new.operator_id) !== String(appConfig.operatorId)) {
           return;
        }
        
        if (hasLocalLiveData) {
          // Preserve live local WebSocket telemetry over DBWAL fields
          const { players, battle, Battle, gameState, draftPhase, draftTimer, ...staticDbData } = payload.new;
          globalRoomData = { ...globalRoomData, ...staticDbData };
        } else {
          const dbParsed = parseMlbbLiveData(payload.new?.data || payload.new?.payload || payload.new?.raw_payload);
          globalRoomData = { ...globalRoomData, ...payload.new, ...(dbParsed || {}) };
        }
        listeners.forEach((listener) => listener(globalRoomData));
      }
    )
    .subscribe();
}

export function useRoomData() {
  const [data, setData] = useState<any>(globalRoomData);

  useEffect(() => {
    if (!isSubscribed) {
      subscribeToSupabase();
    }
    if (!isLocalSubscribed) {
      subscribeToLocalRealtime();
    }
    const listener = (newData: any) => setData(newData);
    listeners.add(listener);
    
    if (globalRoomData) {
      setData(globalRoomData);
    }
    
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return data;
}
