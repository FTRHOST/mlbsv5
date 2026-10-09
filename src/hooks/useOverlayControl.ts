import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "./useRoomData";

// ─── Kontrol overlay bawah InMatch + Player Stats via Supabase ───
// Tabel `overlay_control` (id = 1), dibuat via
// supabase/migrations/20261009000000_bracket_sesaatlagi.sql.
// localStorage + BroadcastChannel dipertahankan sebagai lapisan lokal
// (update instan se-browser + fallback bila tabel belum ada / offline).

export type OverlayMode = "none" | "emblem" | "item";
export type PlayerStatsMetric = "gold" | "dealt" | "taken";

export const OVERLAY_ROW_ID = 1;
const CHANNEL = "mlbs_overlay_control";
const ACTIVE_KEY = "mlbs_active_overlay";
const SIDE_KEY = "mlbs_side_item_visible";
const STATS_KEY = "mlbs_player_stats";
const CASTER_KEY = "mlbs_caster_name";

export interface OverlayControlState {
  activeOverlay: OverlayMode;
  sideItemVisible: boolean;
  playerStatsVisible: boolean;
  playerStatsMetric: PlayerStatsMetric;
  casterName: string;
}

export const OVERLAY_DEFAULTS: OverlayControlState = {
  activeOverlay: "none",
  sideItemVisible: true,
  playerStatsVisible: false,
  playerStatsMetric: "gold",
  casterName: "",
};

export function parseOverlayMode(v: unknown): OverlayMode {
  return v === "emblem" || v === "item" ? v : "none";
}

export function parsePlayerStatsMetric(v: unknown): PlayerStatsMetric {
  return v === "dealt" || v === "taken" ? v : "gold";
}

function postControl(msg: Record<string, unknown>) {
  try {
    const bc = new BroadcastChannel(CHANNEL);
    bc.postMessage(msg);
    bc.close();
  } catch {
    /* noop */
  }
}

function persist(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* noop */
  }
}

let warnedMissing = false;
let chanSeq = 0;

function warnDb(err: unknown) {
  const code = (err as { code?: string })?.code;
  if (code === "42P01" || code === "PGRST205") {
    if (!warnedMissing) {
      warnedMissing = true;
      console.warn(
        '[overlay-db] Tabel "overlay_control" belum ada. Jalankan supabase/migrations/20261009000000_bracket_sesaatlagi.sql di Supabase SQL Editor.',
      );
    }
    return;
  }
  console.warn("[overlay-db] overlay_control:", (err as Error)?.message || err);
}

export interface OverlayControlRow {
  active_overlay?: string;
  side_item_visible?: boolean;
  player_stats_visible?: boolean;
  player_stats_metric?: string;
  caster_name?: string;
}

function rowToState(row: Record<string, unknown>): Partial<OverlayControlState> {
  const out: Partial<OverlayControlState> = {};
  if (typeof row?.active_overlay === "string") out.activeOverlay = parseOverlayMode(row.active_overlay);
  if (typeof row?.side_item_visible === "boolean") out.sideItemVisible = row.side_item_visible as boolean;
  if (typeof row?.player_stats_visible === "boolean")
    out.playerStatsVisible = row.player_stats_visible as boolean;
  if (typeof row?.player_stats_metric === "string")
    out.playerStatsMetric = parsePlayerStatsMetric(row.player_stats_metric);
  if (typeof row?.caster_name === "string") out.casterName = row.caster_name as string;
  return out;
}

export async function fetchOverlayRow(): Promise<Partial<OverlayControlState> | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("overlay_control")
      .select("*")
      .eq("id", OVERLAY_ROW_ID)
      .maybeSingle();
    if (error) {
      warnDb(error);
      return null;
    }
    if (!data) return null;
    return rowToState(data as Record<string, unknown>);
  } catch (e) {
    warnDb(e);
    return null;
  }
}

/** Tulis ke Supabase (fire-and-forget). Mengembalikan error bila gagal. */
export async function writeOverlayRow(patch: OverlayControlRow): Promise<Error | null> {
  if (!supabase) return null;
  try {
    const { error } = await supabase
      .from("overlay_control")
      .upsert(
        { id: OVERLAY_ROW_ID, ...patch, updated_at: new Date().toISOString() },
        { onConflict: "id" },
      );
    if (error) {
      warnDb(error);
      return new Error(error.message);
    }
    return null;
  } catch (e) {
    warnDb(e);
    return e instanceof Error ? e : new Error(String(e));
  }
}

export function subscribeOverlayControl(
  key: string,
  onState: (patch: Partial<OverlayControlState>) => void,
): (() => void) | undefined {
  if (!supabase) return undefined;
  try {
    // Nama channel unik per pemakai DAN per instance — supabase-js memakai ulang
    // topic yang sama, sehingga .on() kedua pada topic identik setelah
    // subscribe() akan diabaikan (realtime hilang diam-diam).
    chanSeq += 1;
    const channel = supabase
      .channel(`overlay-control-${key}-${chanSeq}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "overlay_control", filter: `id=eq.${OVERLAY_ROW_ID}` },
        (payload: { new?: Record<string, unknown> }) => {
          if (payload.new) {
            const patch = rowToState(payload.new);
            if (Object.keys(patch).length > 0) onState(patch);
          }
        },
      )
      .subscribe();
    return () => {
      try {
        if (supabase) supabase.removeChannel(channel);
      } catch {
        /* noop */
      }
    };
  } catch (e) {
    warnDb(e);
    return undefined;
  }
}

// ─── Active overlay (none/emblem/item) + hotkey E/I/H ───

function readActiveLocal(): OverlayMode {
  try {
    return parseOverlayMode(localStorage.getItem(ACTIVE_KEY));
  } catch {
    return "none";
  }
}

export function useActiveOverlay(): [
  OverlayMode,
  (mode: OverlayMode | ((prev: OverlayMode) => OverlayMode)) => void,
] {
  const [mode, setModeState] = useState<OverlayMode>(readActiveLocal);
  const ref = useRef(mode);
  ref.current = mode;

  const applyLocal = useCallback((next: OverlayMode) => {
    setModeState((prev) => (prev === next ? prev : next));
    persist(ACTIVE_KEY, next);
  }, []);

  const setMode = useCallback(
    (v: OverlayMode | ((prev: OverlayMode) => OverlayMode)) => {
      const next = typeof v === "function" ? (v as (p: OverlayMode) => OverlayMode)(ref.current) : v;
      const parsed = parseOverlayMode(next);
      applyLocal(parsed);
      postControl({ type: "SET_OVERLAY", mode: parsed });
      void writeOverlayRow({ active_overlay: parsed });
    },
    [applyLocal],
  );

  useEffect(() => {
    let cancelled = false;
    fetchOverlayRow().then((row) => {
      if (cancelled || !row || row.activeOverlay === undefined) return;
      applyLocal(row.activeOverlay);
    });
    const unsubDb = subscribeOverlayControl("active", (patch) => {
      if (patch.activeOverlay !== undefined) applyLocal(patch.activeOverlay);
    });

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel(CHANNEL);
      bc.onmessage = (e) => {
        if (e.data?.type === "SET_OVERLAY") applyLocal(parseOverlayMode(e.data.mode));
      };
    } catch {
      bc = null;
    }
    const onStorage = (e: StorageEvent) => {
      if (e.key === ACTIVE_KEY && e.newValue) applyLocal(parseOverlayMode(e.newValue));
    };
    window.addEventListener("storage", onStorage);

    // Polling fallback (OBS browser source) + hotkey.
    const poll = setInterval(() => {
      const cur = readActiveLocal();
      if (cur !== ref.current) applyLocal(cur);
    }, 500);
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === "e") setMode((p) => (p === "emblem" ? "none" : "emblem"));
      else if (key === "i") setMode((p) => (p === "item" ? "none" : "item"));
      else if (key === "h" || key === "escape") setMode("none");
    };
    window.addEventListener("keydown", onKey);

    return () => {
      cancelled = true;
      unsubDb?.();
      try {
        bc?.close();
      } catch {
        /* noop */
      }
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("keydown", onKey);
      clearInterval(poll);
    };
  }, [applyLocal, setMode]);

  return [mode, setMode];
}

// ─── Side item visibility (kotak 47px di sisi kartu) ───

function readSideLocal(): boolean {
  try {
    const s = localStorage.getItem(SIDE_KEY);
    return s === null ? true : s !== "false";
  } catch {
    return true;
  }
}

export function useSideItemVisibleDb(
  setGlobal: (v: boolean) => void,
): boolean {
  const [visible, setVisible] = useState<boolean>(readSideLocal);

  useEffect(() => {
    const applyLocal = (v: boolean) => {
      setVisible((prev) => (prev === v ? prev : v));
      setGlobal(v);
      persist(SIDE_KEY, String(v));
    };
    let cancelled = false;
    fetchOverlayRow().then((row) => {
      if (cancelled || !row || row.sideItemVisible === undefined) return;
      applyLocal(row.sideItemVisible);
    });
    const unsubDb = subscribeOverlayControl("side", (patch) => {
      if (patch.sideItemVisible !== undefined) applyLocal(patch.sideItemVisible);
    });

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel(CHANNEL);
      bc.onmessage = (e) => {
        if (e.data?.type === "SET_SIDE_ITEM_VISIBLE") applyLocal(e.data.visible !== false);
      };
    } catch {
      bc = null;
    }
    const onStorage = (e: StorageEvent) => {
      if (e.key === SIDE_KEY && e.newValue !== null) applyLocal(e.newValue !== "false");
    };
    window.addEventListener("storage", onStorage);
    return () => {
      cancelled = true;
      unsubDb?.();
      try {
        bc?.close();
      } catch {
        /* noop */
      }
      window.removeEventListener("storage", onStorage);
    };
  }, [setGlobal]);

  return visible;
}

// ─── Nama caster (teks hitam di atas info patch; ditulis dari /control) ───

function readCasterLocal(): string {
  try {
    return localStorage.getItem(CASTER_KEY) || "";
  } catch {
    return "";
  }
}

export function useCasterName(): string {
  const [name, setName] = useState<string>(readCasterLocal);

  useEffect(() => {
    const applyLocal = (v: string) => {
      setName((prev) => (prev === v ? prev : v));
      persist(CASTER_KEY, v);
    };
    let cancelled = false;
    fetchOverlayRow().then((row) => {
      if (cancelled || !row || row.casterName === undefined) return;
      applyLocal(row.casterName);
    });
    const unsubDb = subscribeOverlayControl("caster", (patch) => {
      if (patch.casterName !== undefined) applyLocal(patch.casterName);
    });

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel(CHANNEL);
      bc.onmessage = (e) => {
        if (e.data?.type === "SET_CASTER_NAME" && typeof e.data.name === "string")
          applyLocal(e.data.name);
      };
    } catch {
      bc = null;
    }
    const onStorage = (e: StorageEvent) => {
      if (e.key === CASTER_KEY && e.newValue !== null) applyLocal(e.newValue);
    };
    window.addEventListener("storage", onStorage);
    const poll = setInterval(() => {
      const cur = readCasterLocal();
      setName((prev) => (prev === cur ? prev : cur));
    }, 500);
    return () => {
      cancelled = true;
      unsubDb?.();
      try {
        bc?.close();
      } catch {
        /* noop */
      }
      window.removeEventListener("storage", onStorage);
      clearInterval(poll);
    };
  }, []);

  return name;
}

// ─── Player stats overlay (read-only di Inmatch; ditulis dari /control) ───

function readStatsLocal(): { visible: boolean; metric: PlayerStatsMetric } {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) {
      const p = JSON.parse(raw) as { visible?: boolean; metric?: unknown };
      return { visible: !!p.visible, metric: parsePlayerStatsMetric(p.metric) };
    }
  } catch {
    /* noop */
  }
  return { visible: false, metric: "gold" };
}

export function usePlayerStatsState(): {
  visible: boolean;
  metric: PlayerStatsMetric;
} {
  const [state, setState] = useState(readStatsLocal);

  useEffect(() => {
    const applyLocal = (visible: boolean, metric: PlayerStatsMetric) => {
      setState((prev) =>
        prev.visible === visible && prev.metric === metric ? prev : { visible, metric },
      );
      persist(STATS_KEY, JSON.stringify({ visible, metric }));
    };
    let cancelled = false;
    fetchOverlayRow().then((row) => {
      if (cancelled || !row) return;
      if (row.playerStatsVisible !== undefined || row.playerStatsMetric !== undefined) {
        applyLocal(
          row.playerStatsVisible ?? readStatsLocal().visible,
          row.playerStatsMetric ?? readStatsLocal().metric,
        );
      }
    });
    const unsubDb = subscribeOverlayControl("stats", (patch) => {
      if (patch.playerStatsVisible === undefined && patch.playerStatsMetric === undefined) return;
      setState((prev) => {
        const next = {
          visible: patch.playerStatsVisible ?? prev.visible,
          metric: patch.playerStatsMetric ?? prev.metric,
        };
        if (next.visible === prev.visible && next.metric === prev.metric) return prev;
        persist(STATS_KEY, JSON.stringify(next));
        return next;
      });
    });

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel(CHANNEL);
      bc.onmessage = (e) => {
        if (e.data?.type === "SET_PLAYER_STATS") {
          applyLocal(e.data.visible !== false, parsePlayerStatsMetric(e.data.metric));
        }
      };
    } catch {
      bc = null;
    }
    const onStorage = (e: StorageEvent) => {
      if (e.key === STATS_KEY && e.newValue) {
        try {
          const p = JSON.parse(e.newValue) as { visible?: boolean; metric?: unknown };
          applyLocal(!!p.visible, parsePlayerStatsMetric(p.metric));
        } catch {
          /* noop */
        }
      }
    };
    window.addEventListener("storage", onStorage);
    const poll = setInterval(() => {
      const cur = readStatsLocal();
      setState((prev) =>
        prev.visible === cur.visible && prev.metric === cur.metric ? prev : cur,
      );
    }, 500);
    return () => {
      cancelled = true;
      unsubDb?.();
      try {
        bc?.close();
      } catch {
        /* noop */
      }
      window.removeEventListener("storage", onStorage);
      clearInterval(poll);
    };
  }, []);

  return state;
}
