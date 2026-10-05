import { useRoomData, updateLocalLiveData, parseMlbbLiveData, parseMlbbKillEvent, getKillEventLabel } from './useRoomData';

/**
 * Broadcast local live data to all open tabs and local listeners on the machine
 */
export function sendLocalLiveData(dataMessage: any) {
  // 1. Update in-memory state for current tab immediately
  updateLocalLiveData(dataMessage);

  // 2. Broadcast to other local browser tabs via BroadcastChannel
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const bc = new BroadcastChannel('mlbb_local_live');
      bc.postMessage(dataMessage);
      bc.close();
    }
  } catch (e) {
    console.warn('BroadcastChannel send error:', e);
  }

  // 3. Dispatch CustomEvent for local page window listeners
  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('mlbb_local_data', { detail: dataMessage })
      );
    }
  } catch (e) {
    console.warn('CustomEvent dispatch error:', e);
  }
}

/**
 * Send a raw mlbb_kill_event packet (Python socket repr or JSON).
 * Returns the overlay label when the event should display, 'skipped' for
 * single kills (filtered), or null when the payload cannot be parsed.
 */
export function sendKillEvent(dataMessage: any): string | null {
  const event = parseMlbbKillEvent(dataMessage);
  if (!event) return null;
  updateLocalLiveData(dataMessage);
  return getKillEventLabel(event) || 'skipped';
}

/**
 * Hook to consume merged local live real-time data combined with DB metadata
 */
export function useLocalLiveData() {
  const roomData = useRoomData();

  return {
    rawRoomData: roomData,
    gameState: roomData?.gameState,
    draftPhase: roomData?.draftPhase,
    draftTimer: roomData?.draftTimer,
    players: Array.isArray(roomData?.players) ? roomData.players : [],
    battle: roomData?.battle || roomData?.Battle || {},
  };
}
