import { useState, useEffect } from 'react';
import { supabase, useRoomData } from './useRoomData';

/**
 * Resolves display team names automatically.
 *
 * Source of truth for names: `team_mappings` (team_name <-> player uid).
 * The side (blue/red) is derived from live players: each live player has an
 * `id` and a numeric `team` (1 = blue, 2 = red). Majority vote per side wins.
 *
 * Priority per side: manual `rooms.blue_team_name / red_team_name` wins when
 * it is NOT a placeholder ("BLUE TEAM" / "RED TEAM" / empty); otherwise the
 * auto-resolved name from mappings is used.
 */

let cachedUidToTeam: Record<string, string> | null = null;
let channelSeq = 0;
const mapListeners = new Set<(m: Record<string, string>) => void>();

async function fetchTeamNameMap(): Promise<Record<string, string>> {
  if (!supabase) return cachedUidToTeam || {};
  const { data } = await supabase.from('team_mappings').select('team_name,uid');
  const map: Record<string, string> = {};
  (data || []).forEach((row: any) => {
    // NOTE: uid in DB may contain stray whitespace/newlines — always trim.
    const uid = String(row?.uid ?? '').trim();
    const name = String(row?.team_name ?? '').trim();
    if (uid && name) map[uid] = name;
  });
  cachedUidToTeam = map;
  mapListeners.forEach((fn) => fn(map));
  return map;
}

export function useTeamNameMap(): Record<string, string> {
  const [map, setMap] = useState<Record<string, string>>(cachedUidToTeam || {});

  useEffect(() => {
    fetchTeamNameMap()
      .then(setMap)
      .catch(() => {});
    const listener = (m: Record<string, string>) => setMap(m);
    mapListeners.add(listener);

    let channel: any = null;
    if (supabase) {
      channelSeq += 1;
      channel = supabase
        .channel(`team-mappings-names-${channelSeq}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'team_mappings' }, () => {
          fetchTeamNameMap().catch(() => {});
        })
        .subscribe();
    }
    return () => {
      mapListeners.delete(listener);
      if (channel && supabase) supabase.removeChannel(channel);
    };
  }, []);

  return map;
}

export function isPlaceholderTeamName(value: unknown): boolean {
  if (typeof value !== 'string') return true;
  const v = value.trim();
  return v === '' || /^(blue|red)\s*team$/i.test(v);
}

export function resolveSideTeamNames(
  players: any[],
  uidToTeam: Record<string, string>
): { blue: string | null; red: string | null } {
  const votes: Record<'blue' | 'red', Record<string, number>> = { blue: {}, red: {} };
  (Array.isArray(players) ? players : []).forEach((p: any) => {
    const teamNum = Number(p?.team);
    const side = teamNum === 1 ? 'blue' : teamNum === 2 ? 'red' : null;
    if (!side) return;
    const uid = String(p?.id ?? '').trim();
    if (!uid) return;
    const name = uidToTeam[uid];
    if (name) votes[side][name] = (votes[side][name] || 0) + 1;
  });

  const pick = (v: Record<string, number>): string | null => {
    let best: string | null = null;
    let bestN = 0;
    Object.entries(v).forEach(([name, n]) => {
      if (n > bestN) {
        best = name;
        bestN = n;
      }
    });
    return best;
  };

  return { blue: pick(votes.blue), red: pick(votes.red) };
}

/**
 * Fully resolved display names (manual rooms value or auto from mappings).
 * Returns null per side when nothing but placeholders is available —
 * callers apply their own default label.
 */
export function useDisplayTeamNames(): { blue: string | null; red: string | null } {
  const roomData = useRoomData();
  const uidMap = useTeamNameMap();
  const players = Array.isArray(roomData?.players) ? roomData.players : [];
  const auto = resolveSideTeamNames(players, uidMap);

  const roomsBlue = roomData?.blue_team_name;
  const roomsRed = roomData?.red_team_name;

  return {
    blue: !isPlaceholderTeamName(roomsBlue) ? String(roomsBlue).trim() : auto.blue,
    red: !isPlaceholderTeamName(roomsRed) ? String(roomsRed).trim() : auto.red,
  };
}
