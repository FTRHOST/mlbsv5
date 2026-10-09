import { useState, useEffect } from "react";
import {
  BRACKET_DEFAULTS,
  BRACKET_KEY,
  SESAATLAGI_DEFAULTS,
  SESAATLAGI_KEY,
  WINNER_KEY,
  OVERLAY_CONTROL_CHANNEL,
  remainingSec,
  writeBracketRow,
  writeSesaatLagiRow,
  type BracketData,
  type SesaatLagiData,
  type SesaatLagiRow,
} from "../hooks/useBracketControl";
import { supabase } from "../hooks/useRoomData";

function postControl(msg: Record<string, unknown>) {
  try {
    const bc = new BroadcastChannel(OVERLAY_CONTROL_CHANNEL);
    bc.postMessage(msg);
    bc.close();
  } catch {
    /* noop */
  }
}

function DbHint({ status }: { status: string | null }) {
  if (!status) return null;
  const missing = status.includes("belum ada");
  return (
    <p className={`text-xs rounded-lg px-3 py-1.5 border ${missing ? "text-red-300 bg-red-950/60 border-red-800" : "text-emerald-300 bg-emerald-950/60 border-emerald-800"}`}>
      {status}
    </p>
  );
}

function dbErrorText(table: string, err: Error): string {
  if (err.message.includes("42P01") || err.message.includes("PGRST205") || err.message.toLowerCase().includes("could not find the table"))
    return `⚠️ Tabel "${table}" belum ada di Supabase — jalankan supabase/migrations/20261009000000_bracket_sesaatlagi.sql di SQL Editor, lalu kirim ulang.`;
  return `⚠️ Gagal tulis ke database: ${err.message}`;
}

const BRACKET_FIELDS: { key: keyof BracketData; label: string }[] = [
  { key: "m1a", label: "M1 · Tim A" },
  { key: "m1b", label: "M1 · Tim B" },
  { key: "m2a", label: "M2 · Tim A" },
  { key: "m2b", label: "M2 · Tim B" },
  { key: "m3a", label: "M3 · Tim A" },
  { key: "m3b", label: "M3 · Tim B" },
  { key: "m4a", label: "M4 · Tim A" },
  { key: "m4b", label: "M4 · Tim B" },
  { key: "m5a", label: "M5 · Tim A" },
  { key: "m5b", label: "M5 · Tim B" },
  { key: "fa", label: "Final · Tim A" },
  { key: "fb", label: "Final · Tim B" },
];

export function BracketControls() {
  const [form, setForm] = useState<BracketData>(BRACKET_DEFAULTS);
  const [saved, setSaved] = useState(false);
  const [dbStatus, setDbStatus] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(BRACKET_KEY);
      if (raw) setForm({ ...BRACKET_DEFAULTS, ...JSON.parse(raw) });
    } catch {
      /* noop */
    }
    // Nilai awal dari database (bila tabel sudah ada).
    if (supabase) {
      supabase
        .from("bracket")
        .select("*")
        .eq("id", 1)
        .maybeSingle()
        .then(({ data, error }) => {
          if (!error && data) {
            setForm((prev) => {
              const next = { ...prev };
              (Object.keys(BRACKET_DEFAULTS) as (keyof BracketData)[]).forEach((k) => {
                if (typeof (data as Record<string, unknown>)[k] === "string")
                  next[k] = (data as Record<string, unknown>)[k] as string;
              });
              return next;
            });
          }
        });
    }
    // Echo dari operator lain di browser yang sama.
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel(OVERLAY_CONTROL_CHANNEL);
      bc.onmessage = (e) => {
        if (e.data?.type === "SET_BRACKET" && e.data.bracket)
          setForm((prev) => ({ ...prev, ...e.data.bracket }));
      };
    } catch {
      bc = null;
    }
    return () => {
      try {
        bc?.close();
      } catch {
        /* noop */
      }
    };
  }, []);

  const send = (data: BracketData) => {
    try {
      localStorage.setItem(BRACKET_KEY, JSON.stringify(data));
    } catch {
      /* noop */
    }
    postControl({ type: "SET_BRACKET", bracket: data });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    void writeBracketRow(data).then((err) => {
      setDbStatus(err ? dbErrorText("bracket", err) : "✅ Tersimpan di database Supabase.");
    });
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">
        8. Bracket Playoff (Database)
      </h2>
      <p className="text-xs text-neutral-400">
        Tersimpan di tabel Supabase <code className="text-amber-300">bracket</code> — halaman <code className="text-amber-300">/bracket</code> terupdate realtime di semua perangkat.
      </p>
      <DbHint status={dbStatus} />
      <div className="grid grid-cols-2 gap-2">
        {BRACKET_FIELDS.map((f) => (
          <label key={f.key} className="text-xs text-neutral-400 space-y-1">
            <span>{f.label}</span>
            <input
              value={form[f.key]}
              onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </label>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => send(form)}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs rounded-lg transition"
        >
          📡 Simpan ke Database
        </button>
        <button
          onClick={() => {
            setForm(BRACKET_DEFAULTS);
            send(BRACKET_DEFAULTS);
          }}
          className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 font-bold text-xs rounded-lg transition"
        >
          Reset default
        </button>
        {saved && <span className="text-xs text-emerald-300">✅ Terkirim!</span>}
      </div>
    </div>
  );
}

function toDatetimeLocal(ms: number | null): string {
  if (!ms) return "";
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromDatetimeLocal(v: string): number | null {
  if (!v) return null;
  const t = new Date(v).getTime();
  return Number.isNaN(t) ? null : t;
}

function formatTargetClock(ms: number | null): string {
  if (!ms) return "—";
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function SesaatLagiControls() {
  const [info, setInfo] = useState({ blue: "", red: "", game: "", stage: "" });
  const [targetInput, setTargetInput] = useState("");
  const [live, setLive] = useState<SesaatLagiData>(SESAATLAGI_DEFAULTS);
  const [tick, setTick] = useState(() => Date.now());
  const [dbStatus, setDbStatus] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESAATLAGI_KEY);
      if (raw) {
        const p = { ...SESAATLAGI_DEFAULTS, ...JSON.parse(raw) };
        setLive(p);
        setInfo({ blue: p.blue, red: p.red, game: p.game, stage: p.stage });
      }
    } catch {
      /* noop */
    }
    if (supabase) {
      supabase
        .from("sesaatlagi")
        .select("*")
        .eq("id", 1)
        .maybeSingle()
        .then(({ data, error }) => {
          if (!error && data) {
            const r = data as Record<string, unknown>;
            setLive((prev) => ({
              ...prev,
              ...(typeof r.blue === "string" ? { blue: r.blue as string } : {}),
              ...(typeof r.red === "string" ? { red: r.red as string } : {}),
              ...(typeof r.game === "string" ? { game: r.game as string } : {}),
              ...(typeof r.stage === "string" ? { stage: r.stage as string } : {}),
              ...(typeof r.total_sec === "number" ? { totalSec: Math.max(0, Math.floor(r.total_sec as number)) } : {}),
              ...(typeof r.running === "boolean" ? { running: r.running as boolean } : {}),
              ...((r.started_at === null || typeof r.started_at === "number") ? { startedAt: (r.started_at as number | null) ?? null } : {}),
              ...((r.target_at === null || typeof r.target_at === "number") ? { targetAt: (r.target_at as number | null) ?? null } : {}),
            }));
            if (r.target_at === null || typeof r.target_at === "number")
              setTargetInput(toDatetimeLocal((r.target_at as number | null) ?? null));
            setInfo({
              blue: typeof r.blue === "string" ? (r.blue as string) : "",
              red: typeof r.red === "string" ? (r.red as string) : "",
              game: typeof r.game === "string" ? (r.game as string) : "",
              stage: typeof r.stage === "string" ? (r.stage as string) : "",
            });
          }
        });
    }
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel(OVERLAY_CONTROL_CHANNEL);
      bc.onmessage = (e) => {
        if (e.data?.type === "SET_SESAATLAGI" && e.data.payload) {
          setLive((prev) => ({ ...prev, ...e.data.payload }));
        }
      };
    } catch {
      bc = null;
    }
    return () => {
      try {
        bc?.close();
      } catch {
        /* noop */
      }
    };
  }, []);

  useEffect(() => {
    if (!live.running && !live.targetAt) return;
    const t = setInterval(() => setTick(Date.now()), 500);
    return () => clearInterval(t);
  }, [live.running, live.startedAt, live.targetAt]);

  const sendPayload = (payload: Partial<SesaatLagiData>) => {
    const next = { ...live, ...payload };
    setLive(next);
    try {
      localStorage.setItem(SESAATLAGI_KEY, JSON.stringify(next));
    } catch {
      /* noop */
    }
    postControl({ type: "SET_SESAATLAGI", payload });
    const row: SesaatLagiRow = {};
    if (payload.blue !== undefined) row.blue = payload.blue;
    if (payload.red !== undefined) row.red = payload.red;
    if (payload.game !== undefined) row.game = payload.game;
    if (payload.stage !== undefined) row.stage = payload.stage;
    if (payload.totalSec !== undefined) row.total_sec = Math.max(0, Math.floor(payload.totalSec));
    if (payload.running !== undefined) row.running = payload.running;
    if (payload.startedAt !== undefined) row.started_at = payload.startedAt;
    if (payload.targetAt !== undefined) row.target_at = payload.targetAt;
    void writeSesaatLagiRow(row).then((err) => {
      setDbStatus(err ? dbErrorText("sesaatlagi", err) : "✅ Tersimpan di database Supabase.");
    });
  };

  const remaining = remainingSec(live, tick);
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">
        9. Sesaat Lagi + Countdown (Database)
      </h2>
      <p className="text-xs text-neutral-400">
        Tersimpan di tabel Supabase <code className="text-amber-300">sesaatlagi</code> — halaman <code className="text-amber-300">/sesaatlagi</code> terupdate realtime di semua perangkat. Nama tim kosong = otomatis dari live data.
      </p>
      <DbHint status={dbStatus} />
      <div className="grid grid-cols-2 gap-2">
        {(
          [
            ["blue", "Tim Biru (kiri)"],
            ["red", "Tim Merah (kanan)"],
            ["game", "Label Game (mis. GAME KE 2)"],
            ["stage", "Babak (mis. PENYISIHAN)"],
          ] as const
        ).map(([k, label]) => (
          <label key={k} className="text-xs text-neutral-400 space-y-1">
            <span>{label}</span>
            <input
              value={info[k]}
              onChange={(e) => setInfo((p) => ({ ...p, [k]: e.target.value }))}
              placeholder={k === "blue" || k === "red" ? "Kosong = dari live data" : ""}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-500"
            />
          </label>
        ))}
      </div>
      <button
        onClick={() => sendPayload(info)}
        className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 font-bold text-xs rounded-lg transition"
      >
        📡 Simpan info match
      </button>
      <div className="border-t border-neutral-800 pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-400">Sisa ke target: <span className="text-amber-300 font-mono font-bold text-base tabular-nums">{mm}:{ss}</span></span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${live.targetAt && remaining > 0 ? "bg-emerald-900/60 text-emerald-200" : "bg-neutral-800 text-neutral-400"}`}>
            {live.targetAt ? (remaining > 0 ? "● MENUJU TARGET" : "● WAKTUNYA TIBA") : "○ TANPA TARGET"}
          </span>
        </div>
        <p className="text-xs text-neutral-400">
          Target mulai: <span className="text-amber-300 font-mono font-bold">{formatTargetClock(live.targetAt)}</span>
        </p>
        <label className="text-xs text-neutral-400 space-y-1 block">
          <span>Jam target mulai (waktu perangkat operator)</span>
          <input
            type="datetime-local"
            value={targetInput}
            onChange={(e) => setTargetInput(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              const t = fromDatetimeLocal(targetInput);
              if (t) sendPayload({ targetAt: t });
            }}
            className="px-3 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition"
          >
            🎯 Set Target Jam
          </button>
          <button
            onClick={() => {
              setTargetInput("");
              sendPayload({ targetAt: null });
            }}
            className="px-3 py-2.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 font-bold text-xs rounded-lg transition"
          >
            ⏹ Hapus Target
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[5, 10, 15, 30].map((m) => (
            <button
              key={m}
              onClick={() => {
                const t = Date.now() + m * 60_000;
                setTargetInput(toDatetimeLocal(t));
                sendPayload({ targetAt: t });
              }}
              className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 font-bold text-xs rounded-lg transition"
            >
              +{m} mnt
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function WinControls() {
  const [winner, setWinnerState] = useState("");
  const [dbStatus, setDbStatus] = useState<string | null>(null);

  useEffect(() => {
    try {
      setWinnerState(localStorage.getItem(WINNER_KEY) || "");
    } catch {
      /* noop */
    }
    if (supabase) {
      supabase
        .from("sesaatlagi")
        .select("winner")
        .eq("id", 1)
        .maybeSingle()
        .then(({ data, error }) => {
          if (!error && data && typeof (data as Record<string, unknown>).winner === "string")
            setWinnerState((data as Record<string, unknown>).winner as string);
        });
    }
  }, []);

  const send = (name: string) => {
    setWinnerState(name);
    try {
      localStorage.setItem(WINNER_KEY, name);
    } catch {
      /* noop */
    }
    postControl({ type: "SET_WINNER", winner: name });
    void writeSesaatLagiRow({ winner: name }).then((err) => {
      setDbStatus(err ? dbErrorText("sesaatlagi", err) : "✅ Tersimpan di database Supabase.");
    });
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">
        10. Victory Moment (Database)
      </h2>
      <p className="text-xs text-neutral-400">
        Tersimpan di kolom <code className="text-amber-300">sesaatlagi.winner</code> — halaman <code className="text-amber-300">/win</code> terupdate realtime. Kosongkan = otomatis dari skor match / live data.
      </p>
      <DbHint status={dbStatus} />
      <div className="flex gap-2">
        <input
          value={winner}
          onChange={(e) => setWinnerState(e.target.value)}
          placeholder="Nama tim pemenang (opsional)"
          className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-500"
        />
        <button
          onClick={() => send(winner)}
          className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs rounded-lg transition"
        >
          📡 Simpan
        </button>
        <button
          onClick={() => send("")}
          className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 font-bold text-xs rounded-lg transition"
        >
          Auto
        </button>
      </div>
    </div>
  );
}
