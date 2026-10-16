import { useEffect, useState } from 'react';

/**
 * Baca history pertandingan yang disimpan telemetry server
 * (server.py -> public/historyMatch/[hh-mm_timA-timB].json + index.json).
 *
 * Endmatch cukup membaca data pada INDEX TERAKHIR history — hasil final
 * match yang sudah selesai (frozen), tidak ikut berubah saat match baru jalan.
 * Polling ringan tiap beberapa detik agar otomatis pindah ke file terbaru
 * saat match berikutnya selesai. Gagal fetch (belum ada history) -> null,
 * pemanggil fallback ke live room data.
 */

export interface MatchHistoryEntry {
  savedAt?: string;
  winnerCamp?: number;
  teamA?: string;
  teamB?: string;
  blueTeam?: string | null;
  redTeam?: string | null;
  data?: any;
}

export function useLastMatchHistory(pollMs: number = 5000): {
  entry: MatchHistoryEntry | null;
  file: string | null;
} {
  const [entry, setEntry] = useState<MatchHistoryEntry | null>(null);
  const [file, setFile] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        // Mode split-PC: arahkan ke HTTP history di PC telemetry,
        // mis. VITE_HISTORY_BASE_URL=http://192.168.1.10:8081/historyMatch
        const envBase = (import.meta.env.VITE_HISTORY_BASE_URL as string | undefined) || "";
        const base = envBase
          ? (envBase.endsWith("/") ? envBase : `${envBase}/`)
          : `${import.meta.env.BASE_URL}historyMatch/`;
        const idxRes = await fetch(`${base}index.json`, { cache: 'no-store' });
        if (!idxRes.ok) return;
        const files = await idxRes.json();
        if (!Array.isArray(files) || files.length === 0) return;
        const last = String(files[files.length - 1]);
        if (!last || last === 'index.json') return;
        const res = await fetch(`${base}${encodeURIComponent(last)}`, {
          cache: 'no-store',
        });
        if (!res.ok) return;
        const data = (await res.json()) as MatchHistoryEntry;
        if (!alive) return;
        setFile((prev) => (prev === last ? prev : last));
        setEntry((prev) => {
          // Hindari re-render bila isi identik (polling).
          try {
            const a = JSON.stringify(prev);
            const b = JSON.stringify(data);
            return a === b ? prev : data;
          } catch {
            return data;
          }
        });
      } catch {
        /* belum ada history / server overlay mati — fallback live */
      }
    }

    load();
    const timer = setInterval(load, Math.max(1000, pollMs));
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [pollMs]);

  return { entry, file };
}
