import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "./useRoomData";

export const OVERLAY_CONTROL_CHANNEL = "mlbs_overlay_control";
export const BRACKET_KEY = "mlbs_bracket";
export const SESAATLAGI_KEY = "mlbs_sesaatlagi";
export const WINNER_KEY = "mlbs_winner";

/** Single-row id yang dipakai kedua tabel overlay (single-room mode). */
const OVERLAY_ROW_ID = 1;

export interface BracketData {
  m1a: string;
  m1b: string;
  m2a: string;
  m2b: string;
  m3a: string;
  m3b: string;
  m4a: string;
  m4b: string;
  m5a: string;
  m5b: string;
  fa: string;
  fb: string;
}

export const BRACKET_DEFAULTS: BracketData = {
  m1a: "TIM 1",
  m1b: "TIM 2",
  m2a: "TIM 3",
  m2b: "TIM 4",
  m3a: "TIM 5",
  m3b: "TIM 6",
  m4a: "TIM 7",
  m4b: "WINNER M1",
  m5a: "WINNER M2",
  m5b: "WINNER M3",
  fa: "WINNER M4",
  fb: "WINNER M5",
};

const BRACKET_KEYS = Object.keys(BRACKET_DEFAULTS) as (keyof BracketData)[];

export interface SesaatLagiData {
  blue: string;
  red: string;
  game: string;
  stage: string;
  /** detik tersisa saat dijeda / total saat start (mode lama) */
  totalSec: number;
  running: boolean;
  startedAt: number | null;
  /** Target waktu mulai (epoch ms). Bila diisi, countdown = target - now. */
  targetAt: number | null;
}

export const SESAATLAGI_DEFAULTS: SesaatLagiData = {
  blue: "TEAM NAME",
  red: "TEAM NAME",
  game: "GAME KE 1",
  stage: "PENYISIHAN",
  totalSec: 0,
  running: false,
  startedAt: null,
  targetAt: null,
};

function readQuery(): URLSearchParams | null {
  try {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search);
  } catch {
    return null;
  }
}

function loadStored<T>(key: string, defaults: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return { ...defaults };
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return { ...defaults };
  }
}

function persist(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* noop */
  }
}

function postControl(msg: Record<string, unknown>) {
  try {
    const bc = new BroadcastChannel(OVERLAY_CONTROL_CHANNEL);
    bc.postMessage(msg);
    bc.close();
  } catch {
    /* noop */
  }
}

function nowIso(): string {
  return new Date().toISOString();
}

// ─── Supabase row helpers ───
// Tabel `bracket` / `sesaatlagi` dibuat via supabase/migrations/20261009000000_bracket_sesaatlagi.sql.
// Bila tabel belum ada (error 42P01) semua fungsi DB gagal diam-diam dan
// halaman tetap bekerja via localStorage + BroadcastChannel.

let warnedMissing: Record<string, boolean> = {};
let subSeq = 0;

function warnDb(table: string, err: unknown) {
  const code = (err as { code?: string })?.code;
  // 42P01 (Postgres) / PGRST205 (PostgREST schema cache) = tabel belum dibuat.
  if (code === "42P01" || code === "PGRST205") {
    if (!warnedMissing[table]) {
      warnedMissing[table] = true;
      console.warn(
        `[overlay-db] Tabel "${table}" belum ada. Jalankan supabase/migrations/20261009000000_bracket_sesaatlagi.sql di Supabase SQL Editor.`,
      );
    }
    return;
  }
  console.warn(`[overlay-db] ${table}:`, (err as Error)?.message || err);
}

function bracketFromRow(row: Record<string, unknown>): Partial<BracketData> {
  const out: Partial<BracketData> = {};
  BRACKET_KEYS.forEach((k) => {
    if (typeof row?.[k] === "string") out[k] = row[k] as string;
  });
  return out;
}

async function fetchBracketRow(): Promise<Partial<BracketData> | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from("bracket").select("*").eq("id", OVERLAY_ROW_ID).maybeSingle();
    if (error) {
      warnDb("bracket", error);
      return null;
    }
    if (!data) return null;
    return bracketFromRow(data as Record<string, unknown>);
  } catch (e) {
    warnDb("bracket", e);
    return null;
  }
}

/** Tulis ke Supabase (fire-and-forget). Mengembalikan error bila gagal. */
export async function writeBracketRow(patch: Partial<BracketData>): Promise<Error | null> {
  if (!supabase) return null;
  try {
    const { error } = await supabase
      .from("bracket")
      .upsert({ id: OVERLAY_ROW_ID, ...patch, updated_at: nowIso() }, { onConflict: "id" });
    if (error) {
      warnDb("bracket", error);
      return new Error(error.message);
    }
    return null;
  } catch (e) {
    warnDb("bracket", e);
    return e instanceof Error ? e : new Error(String(e));
  }
}

export interface SesaatLagiRow {
  blue?: string;
  red?: string;
  game?: string;
  stage?: string;
  total_sec?: number;
  running?: boolean;
  started_at?: number | null;
  target_at?: number | null;
  winner?: string;
}

function sesaatLagiFromRow(row: Record<string, unknown>): Partial<SesaatLagiData> & { winner?: string } {
  const out: Partial<SesaatLagiData> & { winner?: string } = {};
  if (typeof row?.blue === "string") out.blue = row.blue as string;
  if (typeof row?.red === "string") out.red = row.red as string;
  if (typeof row?.game === "string") out.game = row.game as string;
  if (typeof row?.stage === "string") out.stage = row.stage as string;
  if (typeof row?.total_sec === "number") out.totalSec = Math.max(0, Math.floor(row.total_sec as number));
  if (typeof row?.running === "boolean") out.running = row.running as boolean;
  if (row?.started_at === null || typeof row?.started_at === "number")
    out.startedAt = (row.started_at as number | null) ?? null;
  if (row?.target_at === null || typeof row?.target_at === "number")
    out.targetAt = (row.target_at as number | null) ?? null;
  if (typeof row?.winner === "string") out.winner = row.winner as string;
  return out;
}

async function fetchSesaatLagiRow(): Promise<(Partial<SesaatLagiData> & { winner?: string }) | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from("sesaatlagi").select("*").eq("id", OVERLAY_ROW_ID).maybeSingle();
    if (error) {
      warnDb("sesaatlagi", error);
      return null;
    }
    if (!data) return null;
    return sesaatLagiFromRow(data as Record<string, unknown>);
  } catch (e) {
    warnDb("sesaatlagi", e);
    return null;
  }
}

/** Tulis ke Supabase (fire-and-forget). Mengembalikan error bila gagal. */
export async function writeSesaatLagiRow(patch: SesaatLagiRow): Promise<Error | null> {
  if (!supabase) return null;
  try {
    const { error } = await supabase
      .from("sesaatlagi")
      .upsert({ id: OVERLAY_ROW_ID, ...patch, updated_at: nowIso() }, { onConflict: "id" });
    if (error) {
      warnDb("sesaatlagi", error);
      return new Error(error.message);
    }
    return null;
  } catch (e) {
    warnDb("sesaatlagi", e);
    return e instanceof Error ? e : new Error(String(e));
  }
}

function subscribeTable(
  table: "bracket" | "sesaatlagi",
  key: string,
  onRow: (row: Record<string, unknown>) => void,
): (() => void) | undefined {
  if (!supabase) return undefined;
  try {
    // Channel unik per pemakai DAN per instance (lihat catatan di useOverlayControl).
    subSeq += 1;
    const channel = supabase
      .channel(`overlay-${table}-${key}-${subSeq}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table, filter: `id=eq.${OVERLAY_ROW_ID}` },
        (payload: { new?: Record<string, unknown> }) => {
          if (payload.new) onRow(payload.new);
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
    warnDb(table, e);
    return undefined;
  }
}

// ─── Bracket ───

export function getBracketQueryOverride(): Partial<BracketData> {
  const q = readQuery();
  if (!q) return {};
  const out: Partial<BracketData> = {};
  BRACKET_KEYS.forEach((k) => {
    const v = q.get(k);
    if (v !== null && v !== "") out[k] = v;
  });
  return out;
}

export function useBracketData(): {
  bracket: BracketData;
  setBracket: (patch: Partial<BracketData>) => void;
} {
  const [bracket, setBracketState] = useState<BracketData>(() => ({
    ...BRACKET_DEFAULTS,
    ...loadStored(BRACKET_KEY, BRACKET_DEFAULTS),
    ...getBracketQueryOverride(),
  }));
  // Query override selalu menang atas data DB untuk instance OBS ini.
  const queryRef = useRef(getBracketQueryOverride());
  // Cegah echo: update DB yang berasal dari tulisan sendiri tidak perlu di-BC ulang.
  const selfWriteRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    // Sumber utama: database.
    fetchBracketRow().then((row) => {
      if (cancelled || !row) return;
      setBracketState((prev) => {
        const next = { ...prev, ...row, ...queryRef.current };
        persist(BRACKET_KEY, next);
        return next;
      });
    });
    const unsubDb = subscribeTable("bracket", "main", (row) => {
      const patch = bracketFromRow(row);
      if (Object.keys(patch).length === 0) return;
      setBracketState((prev) => {
        const next = { ...prev, ...patch, ...queryRef.current };
        persist(BRACKET_KEY, next);
        return next;
      });
    });

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel(OVERLAY_CONTROL_CHANNEL);
      bc.onmessage = (e) => {
        if (e.data?.type === "SET_BRACKET" && e.data.bracket) {
          selfWriteRef.current += 1;
          setBracketState((prev) => {
            const next = { ...prev, ...e.data.bracket };
            persist(BRACKET_KEY, next);
            return next;
          });
        }
      };
    } catch {
      bc = null;
    }
    const onStorage = (ev: StorageEvent) => {
      if (ev.key === BRACKET_KEY && ev.newValue) {
        try {
          setBracketState((prev) => ({ ...prev, ...JSON.parse(ev.newValue as string) }));
        } catch {
          /* noop */
        }
      }
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
  }, []);

  const setBracket = useCallback((patch: Partial<BracketData>) => {
    selfWriteRef.current += 1;
    setBracketState((prev) => {
      const next = { ...prev, ...patch };
      persist(BRACKET_KEY, next);
      return next;
    });
    postControl({ type: "SET_BRACKET", bracket: patch });
    void writeBracketRow(patch);
  }, []);

  return { bracket, setBracket };
}

// ─── Sesaat Lagi (match info + countdown) ───

export function getSesaatLagiQueryOverride(): Partial<SesaatLagiData> {
  const q = readQuery();
  if (!q) return {};
  const out: Partial<SesaatLagiData> = {};
  const blue = q.get("blue");
  const red = q.get("red");
  const game = q.get("game");
  const stage = q.get("stage");
  const cd = q.get("countdown");
  const targetAt = q.get("targetAt");
  if (blue) out.blue = blue;
  if (red) out.red = red;
  if (game) out.game = game;
  if (stage) out.stage = stage;
  if (cd !== null && cd !== "" && !Number.isNaN(Number(cd))) {
    out.totalSec = Math.max(0, Math.floor(Number(cd)));
    out.running = false;
    out.startedAt = null;
  }
  if (targetAt !== null && targetAt !== "" && !Number.isNaN(Number(targetAt))) {
    out.targetAt = Number(targetAt);
  }
  return out;
}

export function remainingSec(data: SesaatLagiData, now = Date.now()): number {
  // Mode utama: countdown menuju target waktu.
  if (data.targetAt) return Math.max(0, Math.ceil((data.targetAt - now) / 1000));
  if (!data.running || !data.startedAt) return Math.max(0, data.totalSec);
  const elapsed = Math.floor((now - data.startedAt) / 1000);
  return Math.max(0, data.totalSec - elapsed);
}

function toRowPayload(data: Partial<SesaatLagiData>): SesaatLagiRow {
  const row: SesaatLagiRow = {};
  if (data.blue !== undefined) row.blue = data.blue;
  if (data.red !== undefined) row.red = data.red;
  if (data.game !== undefined) row.game = data.game;
  if (data.stage !== undefined) row.stage = data.stage;
  if (data.totalSec !== undefined) row.total_sec = Math.max(0, Math.floor(data.totalSec));
  if (data.running !== undefined) row.running = data.running;
  if (data.startedAt !== undefined) row.started_at = data.startedAt;
  if (data.targetAt !== undefined) row.target_at = data.targetAt;
  return row;
}

export function useSesaatLagi(): {
  data: SesaatLagiData;
  remaining: number;
  setInfo: (patch: Partial<Pick<SesaatLagiData, "blue" | "red" | "game" | "stage">>) => void;
  setCountdown: (totalSec: number, running: boolean) => void;
  setTarget: (targetAt: number | null) => void;
} {
  const [data, setData] = useState<SesaatLagiData>(() => ({
    ...SESAATLAGI_DEFAULTS,
    ...loadStored(SESAATLAGI_KEY, SESAATLAGI_DEFAULTS),
    ...getSesaatLagiQueryOverride(),
  }));
  const [now, setNow] = useState(() => Date.now());
  const queryRef = useRef(getSesaatLagiQueryOverride());

  useEffect(() => {
    let cancelled = false;
    fetchSesaatLagiRow().then((row) => {
      if (cancelled || !row) return;
      const { winner: _w, ...rest } = row;
      void _w;
      setData((prev) => {
        const next = { ...prev, ...rest, ...queryRef.current };
        persist(SESAATLAGI_KEY, next);
        return next;
      });
    });
    const unsubDb = subscribeTable("sesaatlagi", "main", (row) => {
      const { winner: _w, ...rest } = sesaatLagiFromRow(row);
      void _w;
      if (Object.keys(rest).length === 0) return;
      setData((prev) => {
        const next = { ...prev, ...rest, ...queryRef.current };
        persist(SESAATLAGI_KEY, next);
        return next;
      });
    });

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel(OVERLAY_CONTROL_CHANNEL);
      bc.onmessage = (e) => {
        if (e.data?.type === "SET_SESAATLAGI" && e.data.payload) {
          const p = e.data.payload as Partial<SesaatLagiData>;
          setData((prev) => {
            const next = { ...prev, ...p };
            persist(SESAATLAGI_KEY, next);
            return next;
          });
        }
      };
    } catch {
      bc = null;
    }
    const onStorage = (ev: StorageEvent) => {
      if (ev.key === SESAATLAGI_KEY && ev.newValue) {
        try {
          setData((prev) => ({ ...prev, ...JSON.parse(ev.newValue as string) }));
        } catch {
          /* noop */
        }
      }
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
  }, []);

  useEffect(() => {
    if (!data.running && !data.targetAt) return;
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(t);
  }, [data.running, data.startedAt, data.targetAt]);

  const setInfo = useCallback(
    (patch: Partial<Pick<SesaatLagiData, "blue" | "red" | "game" | "stage">>) => {
      setData((prev) => {
        const next = { ...prev, ...patch };
        persist(SESAATLAGI_KEY, next);
        return next;
      });
      postControl({ type: "SET_SESAATLAGI", payload: patch });
      void writeSesaatLagiRow(toRowPayload(patch));
    },
    [],
  );

  const setCountdown = useCallback((totalSec: number, running: boolean) => {
    const payload: Partial<SesaatLagiData> = running
      ? { totalSec: Math.max(0, Math.floor(totalSec)), running: true, startedAt: Date.now() }
      : { totalSec: Math.max(0, Math.floor(totalSec)), running: false, startedAt: null };
    setData((prev) => {
      const next = { ...prev, ...payload };
      persist(SESAATLAGI_KEY, next);
      return next;
    });
    postControl({ type: "SET_SESAATLAGI", payload });
    void writeSesaatLagiRow(toRowPayload(payload));
  }, []);

  const setTarget = useCallback((targetAt: number | null) => {
    const payload: Partial<SesaatLagiData> = { targetAt };
    setData((prev) => {
      const next = { ...prev, ...payload };
      persist(SESAATLAGI_KEY, next);
      return next;
    });
    postControl({ type: "SET_SESAATLAGI", payload });
    void writeSesaatLagiRow(toRowPayload(payload));
  }, []);

  return { data, remaining: remainingSec(data, now), setInfo, setCountdown, setTarget };
}

// ─── Winner override untuk halaman Win (disimpan di kolom sesaatlagi.winner) ───

function readWinnerQuery(): string {
  try {
    return new URLSearchParams(window.location.search).get("winner") || "";
  } catch {
    return "";
  }
}

export function useWinnerOverride(autoWinner: string): {
  winner: string;
  setWinner: (name: string) => void;
} {
  const [manual, setManual] = useState<string>(() => {
    try {
      const q = readQuery();
      const qv = q?.get("winner");
      if (qv) return qv;
      return localStorage.getItem(WINNER_KEY) || "";
    } catch {
      return "";
    }
  });
  const queryRef = useRef<string>(readWinnerQuery());

  useEffect(() => {
    let cancelled = false;
    fetchSesaatLagiRow().then((row) => {
      if (cancelled || !row || queryRef.current) return;
      if (typeof row.winner === "string") {
        setManual(row.winner);
        persist(WINNER_KEY, row.winner);
      }
    });
    const unsubDb = subscribeTable("sesaatlagi", "winner", (row) => {
      if (queryRef.current) return;
      const w = sesaatLagiFromRow(row).winner;
      if (typeof w === "string") {
        setManual(w);
        persist(WINNER_KEY, w);
      }
    });

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel(OVERLAY_CONTROL_CHANNEL);
      bc.onmessage = (e) => {
        if (e.data?.type === "SET_WINNER" && typeof e.data.winner === "string") {
          setManual(e.data.winner);
          persist(WINNER_KEY, e.data.winner);
        }
      };
    } catch {
      bc = null;
    }
    const onStorage = (ev: StorageEvent) => {
      if (ev.key === WINNER_KEY) setManual(ev.newValue || "");
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
  }, []);

  const setWinner = useCallback((name: string) => {
    setManual(name);
    persist(WINNER_KEY, name);
    postControl({ type: "SET_WINNER", winner: name });
    void writeSesaatLagiRow({ winner: name });
  }, []);

  return { winner: manual.trim() || autoWinner, setWinner };
}
