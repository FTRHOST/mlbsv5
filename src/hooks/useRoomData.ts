import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
export const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

let globalRoomData: any = null;
const listeners = new Set<(data: any) => void>();
let isSubscribed = false;
let isLocalSubscribed = false;
let hasLocalLiveData = false;
// operator_id baris rooms yang diadopsi (kunci realtime pengganti id).
let adoptedRoomOperator: string | null = null;

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

export interface MlbbKillParticipant {
  guid?: number;
  accId?: string;
  name?: string;
  heroid?: number;
  ipos?: number;
  team?: number;
}

export interface MlbbKillEvent {
  killer?: MlbbKillParticipant;
  deader?: MlbbKillParticipant;
  assists?: MlbbKillParticipant[];
  assistGuids?: number[];
  trigger?: string;
  firstBlood?: boolean;
  multKill?: number;
  contiKill?: number;
  eventType?: number;
  t?: number;
}

/**
 * Parser for MLBB kill event packets (mlbb_kill_event).
 * Supports the same Python socket repr wrapping as parseMlbbLiveData:
 * "message: {'type': 'send', 'payload': '{\"type\":\"mlbb_kill_event\",...}'} data: None"
 * plus standard JSON and direct { killer, ... } event objects.
 * Returns the inner `event` object or null.
 */
export function parseMlbbKillEvent(rawMessage: any): MlbbKillEvent | null {
  const extractKillEvent = (obj: any): MlbbKillEvent | null => {
    if (!obj || typeof obj !== 'object') return null;

    if (obj.type === 'mlbb_kill_event' && obj.event && typeof obj.event === 'object') {
      const inner = obj.event;
      if (typeof inner.payload === 'string') {
        const sub = parseMlbbKillEvent(inner.payload);
        if (sub) return sub;
      }
      return inner;
    }

    if (obj.type === 'send' && obj.payload) {
      if (typeof obj.payload === 'string') {
        const sub = parseMlbbKillEvent(obj.payload);
        if (sub) return sub;
      } else if (typeof obj.payload === 'object') {
        const sub = extractKillEvent(obj.payload);
        if (sub) return sub;
      }
    }

    // Direct event object (has killer + kill counters)
    if (obj.killer && typeof obj.killer === 'object' && (obj.multKill !== undefined || obj.trigger !== undefined || obj.firstBlood !== undefined)) {
      return obj as MlbbKillEvent;
    }

    return null;
  };

  if (typeof rawMessage === 'object') {
    return extractKillEvent(rawMessage);
  }

  if (typeof rawMessage === 'string') {
    let str = rawMessage.trim();

    for (let depth = 0; depth < 3; depth++) {
      if (str.startsWith('"') && str.endsWith('"')) {
        try {
          const unwrapped = JSON.parse(str);
          if (typeof unwrapped === 'string') {
            str = unwrapped.trim();
          } else if (typeof unwrapped === 'object') {
            const found = extractKillEvent(unwrapped);
            if (found) return found;
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

    try {
      const parsed = JSON.parse(str);
      const found = extractKillEvent(parsed);
      if (found) return found;
    } catch (e) {}

    const matchKill = str.match(/\{"type"\s*:\s*"mlbb_kill_event"[\s\S]*\}/);
    if (matchKill) {
      try {
        const parsed = JSON.parse(matchKill[0]);
        const found = extractKillEvent(parsed);
        if (found) return found;
      } catch (e) {}
    }

    try {
      let py = str
        .replace(/\bNone\b/g, 'null')
        .replace(/\bTrue\b/g, 'true')
        .replace(/\bFalse\b/g, 'false');

      py = py.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, (_m, p1) => {
        const inner = p1.replace(/"/g, '\\"');
        return `"${inner}"`;
      });

      const parsed = JSON.parse(py);
      const found = extractKillEvent(parsed);
      if (found) return found;
    } catch (e) {}
  }

  return null;
}

export const KILL_EVENT_CHANNEL = 'mlbs_kill_event';

/**
 * Forward a parsed kill event to all overlay tabs (Inmatch auto-subscribes).
 */
export function broadcastKillEvent(event: MlbbKillEvent) {
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const bc = new BroadcastChannel(KILL_EVENT_CHANNEL);
      bc.postMessage({ type: 'KILL_EVENT', event });
      bc.close();
    }
  } catch (e) {
    console.warn('Kill event BroadcastChannel error:', e);
  }

  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('mlbs_kill_event', { detail: event })
      );
    }
  } catch (e) {
    console.warn('Kill event CustomEvent error:', e);
  }
}

/**
 * Map a kill event to its overlay label.
 * Only FIRST BLOOD and multi-kill >= 2 are displayed; single kills return null.
 */
export function getKillEventLabel(event: MlbbKillEvent | null | undefined): string | null {
  if (!event) return null;
  if (event.firstBlood === true) return 'FIRST BLOOD';
  const mult = Number(event.multKill) || 0;
  if (mult === 2) return 'DOUBLE KILL';
  if (mult === 3) return 'TRIPLE KILL';
  if (mult === 4) return 'MANIAC';
  if (mult >= 5) return 'SAVAGE';
  return null;
}

/**
 * Update real-time live data directly in local state (0 latency / no DB write required).
 * Kill events (mlbb_kill_event) are forwarded to the kill channel instead of
 * being merged into room data. Returns 'kill' | 'live' | null.
 */
export function updateLocalLiveData(rawMessage: any): 'kill' | 'live' | null {
  const killEvent = parseMlbbKillEvent(rawMessage);
  if (killEvent) {
    broadcastKillEvent(killEvent);
    return 'kill';
  }

  const livePayload = parseMlbbLiveData(rawMessage);
  if (!livePayload) return null;

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
  return 'live';
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
      // Tanpa filter operator_id: ambil baris yang paling baru diupdate.
      // rooms tidak punya kolom id, jadi urutan deterministik penting.
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (data) {
        if (data.operator_id != null) {
          adoptedRoomOperator = String(data.operator_id);
        }
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
        // Tanpa filter operator_id: kunci ke baris yang sudah dikenal via
        // operator_id-nya (rooms tidak punya kolom id). Event pertama
        // diadopsi bila data awal belum ada.
        if (payload.new) {
          const incomingOp = payload.new.operator_id != null ? String(payload.new.operator_id) : null;
          if (adoptedRoomOperator !== null) {
            if (incomingOp !== null && incomingOp !== adoptedRoomOperator) return;
          } else if (incomingOp !== null) {
            adoptedRoomOperator = incomingOp;
          }
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
