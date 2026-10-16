import { useEffect, useState } from 'react';
import { supabase } from './useRoomData';

export interface HeroMatchDoc {
  players?: any[];
  Battle?: any;
  battle?: any;
}

function historyBase(): string {
  // Mode split-PC: VITE_HISTORY_BASE_URL=http://<ip-telemetry>:8081/historyMatch
  const envBase = (import.meta.env.VITE_HISTORY_BASE_URL as string | undefined) || '';
  return envBase
    ? (envBase.endsWith('/') ? envBase : `${envBase}/`)
    : `${import.meta.env.BASE_URL}historyMatch/`;
}

/**
 * Ambil semua pertandingan sebelumnya dari file historyMatch
 * (ditulis server.py tiap win + index.json). Mengembalikan doc payload
 * per match ({ players, Battle }) — format sama seperti baris stats.
 */
export async function fetchHistoryMatches(): Promise<HeroMatchDoc[]> {
  const base = historyBase();
  const idxRes = await fetch(`${base}index.json`, { cache: 'no-store' });
  if (!idxRes.ok) return [];
  const files: unknown = await idxRes.json();
  if (!Array.isArray(files) || files.length === 0) return [];
  const docs: HeroMatchDoc[] = [];
  for (const f of files) {
    if (typeof f !== 'string' || !f || f === 'index.json') continue;
    try {
      const res = await fetch(`${base}${encodeURIComponent(f)}`, { cache: 'no-store' });
      if (!res.ok) continue;
      const entry = await res.json();
      const d = entry?.data ?? entry;
      if (d && (Array.isArray(d.players) || d.Battle || d.battle)) docs.push(d as HeroMatchDoc);
    } catch {
      /* lewati file rusak */
    }
  }
  return docs;
}

/** Hitung win/pick/ban satu hero dari sekumpulan doc match (history atau stats). */
export function countHeroMatches(docs: HeroMatchDoc[], heroId: number): { wins: number; picks: number; bans: number } {
  let wins = 0;
  let picks = 0;
  let bans = 0;
  for (const doc of docs) {
    try {
      const players = doc?.players || [];
      const winCamp = doc?.Battle?.winCamp ?? doc?.battle?.winCamp;
      players.forEach((p: any) => {
        if (p.heroid === heroId || p.SelHeroID === heroId) {
          picks++;
          if (winCamp === p.team) {
            wins++;
          }
        }
        if (p.banHero === heroId) {
          bans++;
        }
      });
    } catch { /* abaikan baris rusak */ }
  }
  return { wins, picks, bans };
}

export function useHeroStats(heroId: number) {
  const [stats, setStats] = useState({ winRate: "0%", pick: 0, ban: 0, heroName: "UNKNOWN" });

  useEffect(() => {
    if (!heroId || heroId === 0) return;
    let isMounted = true;
    
    async function fetchStats() {
      try {
        // Fetch hero name
        let heroName = "UNKNOWN";
        try {
          const res = await fetch('/assets/heroes.json');
          const heroes = await res.json();
          // Adjust based on how heroes.json is structured. Usually an object mapping ID to name or object.
          if (heroes && heroes[heroId]) {
            heroName = heroes[heroId].name || heroes[heroId];
            if (typeof heroName !== 'string') heroName = "UNKNOWN";
          }
        } catch (e) {
          console.error("Failed to load heroes.json", e);
        }

        // Sumber utama: pertandingan sebelumnya dari file historyMatch.
        // Fallback: tabel Supabase stats (perilaku lama bila belum ada file).
        let counted = null as null | { wins: number; picks: number; bans: number };
        try {
          const historyDocs = await fetchHistoryMatches();
          if (historyDocs.length > 0) {
            counted = countHeroMatches(historyDocs, heroId);
          }
        } catch {
          /* fallback ke stats */
        }

        if (!counted && supabase) {
          const { data, error } = await supabase
            .from('stats')
            .select('data');
            
          if (error) throw error;
          
          const docs: HeroMatchDoc[] = [];
          if (data && data.length > 0) {
            data.forEach((row) => {
              try {
                const jsonData = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
                if (jsonData) docs.push(jsonData);
              } catch { /* abaikan baris rusak */ }
            });
          }
          counted = countHeroMatches(docs, heroId);
        }
        
        const wins = counted?.wins || 0;
        const picks = counted?.picks || 0;
        const bans = counted?.bans || 0;
        let winRate = picks > 0 ? ((wins / picks) * 100).toFixed(2) + "%" : "0.00%";
        
        if (isMounted) {
          setStats({ winRate, pick: picks, ban: bans, heroName: heroName.toUpperCase() });
        }
      } catch (err) {
        console.error("Error fetching hero stats:", err);
      }
    }
    
    fetchStats();
    
    return () => { isMounted = false; };
  }, [heroId]);

  return stats;
}
