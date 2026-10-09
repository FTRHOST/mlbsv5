import { useState, useEffect } from "react";
import { Link } from "react-router";
import { sendLocalLiveData, sendKillEvent } from "../../hooks/useLocalLiveData";
import { parseMlbbLiveData, parseMlbbKillEvent, getKillEventLabel } from "../../hooks/useRoomData";
import { BracketControls, SesaatLagiControls, WinControls } from "../../components/RemoteBracketControls";
import {
  fetchOverlayRow,
  writeOverlayRow,
} from "../../hooks/useOverlayControl";

function overlayDbError(err: Error): string {
  if (
    err.message.includes("42P01") ||
    err.message.includes("PGRST205") ||
    err.message.toLowerCase().includes("could not find the table")
  )
    return '⚠️ Tabel "overlay_control" belum ada — jalankan file SQL migrasi di Supabase SQL Editor, lalu kirim ulang.';
  return `⚠️ Gagal tulis ke database: ${err.message}`;
}

const KILL_SAMPLE_SINGLE = `message: {'type': 'send', 'payload': '{"type":"mlbb_kill_event","event":{"killer":{"guid":16,"accId":"1","name":"[Computer] Hayabusa","heroid":21,"ipos":1,"team":1},"deader":{"guid":33,"accId":"6","name":"[Computer] Lolita","heroid":20,"ipos":7,"team":2},"assists":[],"assistGuids":[],"trigger":"KILL","firstBlood":false,"multKill":1,"contiKill":1,"eventType":29,"t":439}}'} data: None`;

const KILL_SAMPLE_DOUBLE = `message: {'type': 'send', 'payload': '{"type":"mlbb_kill_event","event":{"killer":{"guid":32,"accId":"2178663653","name":"petwir-kepo","heroid":100,"ipos":6,"team":2},"deader":{"guid":16,"accId":"1","name":"[Computer] Hayabusa","heroid":21,"ipos":1,"team":1},"assists":[],"assistGuids":[],"trigger":"KILL","firstBlood":false,"multKill":2,"contiKill":2,"eventType":29,"t":474}}'} data: None`;

const KILL_SAMPLE_TRIPLE = `message: {'type': 'send', 'payload': '{"type":"mlbb_kill_event","event":{"killer":{"guid":32,"accId":"2178663653","name":"petwir-kepo","heroid":100,"ipos":6,"team":2},"deader":{"guid":19,"accId":"4","name":"[Computer] Moskov","heroid":31,"ipos":4,"team":1},"assists":[],"assistGuids":[],"trigger":"TRIPLE_KILL","firstBlood":false,"multKill":3,"contiKill":3,"eventType":29,"t":483}}'} data: None`;

const KILL_SAMPLE_FIRST_BLOOD = `message: {'type': 'send', 'payload': '{"type":"mlbb_kill_event","event":{"killer":{"guid":16,"accId":"1","name":"[Computer] Hayabusa","heroid":21,"ipos":1,"team":1},"deader":{"guid":33,"accId":"6","name":"[Computer] Lolita","heroid":20,"ipos":7,"team":2},"assists":[],"assistGuids":[],"trigger":"KILL","firstBlood":true,"multKill":1,"contiKill":1,"eventType":29,"t":120}}'} data: None`;

type PlayerStatsMetric = "gold" | "dealt" | "taken";

const PLAYER_STATS_KEY = "mlbs_player_stats";

const PLAYER_STATS_METRICS: { id: PlayerStatsMetric; label: string }[] = [
  { id: "gold", label: "Gold Rank" },
  { id: "dealt", label: "Total Damage" },
  { id: "taken", label: "Damage Taken" },
];

function parsePlayerStatsMetric(v: unknown): PlayerStatsMetric {
  return v === "dealt" || v === "taken" ? v : "gold";
}

export default function ControlPanel() {
  const [activeOverlay, setActiveOverlay] = useState<"none" | "emblem" | "item">("none");
  const [turtleActive, setTurtleActive] = useState(false);
  const [lordActive, setLordActive] = useState(false);
  const [mapDrawActive, setMapDrawActive] = useState(false);

  const [channel, setChannel] = useState<BroadcastChannel | null>(null);
  const [testIpos, setTestIpos] = useState<number>(1);
  const [testLevel, setTestLevel] = useState<number>(4);
  const [testKillIpos, setTestKillIpos] = useState<number>(1);
  const [testKillLabel, setTestKillLabel] = useState<string>("DOUBLE KILL");
  const [testKillName, setTestKillName] = useState<string>("");

  const INFOKILL_LABELS = [
    "FIRST BLOOD",
    "DOUBLE KILL",
    "TRIPLE KILL",
    "MANIAC",
    "SAVAGE",
    "SHUT DOWN",
    "UNSTOPPABLE",
    "GODLIKE",
  ];
  const [showSideItem, setShowSideItem] = useState<boolean>(true);
  const [playerStatsVisible, setPlayerStatsVisible] = useState<boolean>(false);
  const [playerStatsMetric, setPlayerStatsMetric] = useState<PlayerStatsMetric>("gold");
  // Status tulis ke Supabase untuk kontrol overlay (bagian 1 & 7).
  const [overlayDb, setOverlayDb] = useState<string | null>(null);
  const [casterName, setCasterName] = useState<string>("");

  const [rawPayloadInput, setRawPayloadInput] = useState<string>(
    `message: {'type': 'send', 'payload': '{"type":"mlbb_live_data","payload":{"gameState":0,"draftPhase":"PREPARATION","draftTimer":0,"players":[{"ipos":0,"id":"2178663653","name":"petwir-kepo","role":5,"team":2,"heroid":18,"uiHeroIDChoose":0,"battleSpell":20050,"emblem":0,"emblemSkills":[],"pickPhase":false,"banPhase":false,"SelHeroID":18,"banHero":0,"hp":3070,"maxHp":3070,"level":6,"deathTime":0,"kill":2,"dead":2,"assist":0,"ultActive":false,"equips":[2305,1001,2003,1004,0,0],"totalGold":2284,"damageDealt":16442,"damageTaken":7412},{"ipos":0,"id":"2231735373","name":"Tony Mark*66","role":3,"team":1,"heroid":10,"uiHeroIDChoose":0,"battleSpell":20050,"emblem":0,"emblemSkills":[],"pickPhase":false,"banPhase":false,"SelHeroID":10,"banHero":0,"hp":3440,"maxHp":3440,"level":4,"deathTime":0,"kill":1,"dead":2,"assist":0,"ultActive":false,"equips":[3562,1202,1203,0,0,0],"totalGold":1492,"damageDealt":7046,"damageTaken":9248}],"Battle":{"battleState":0,"winCamp":0,"waktuPertandingan":269,"blueTeamKill":1,"redTeamKill":2,"blueTeamGold":1492,"redTeamGold":2284,"blueTeamKillLord":0,"redTeamKillLord":0,"blueTeamDestroyTuret":0,"redTeamDestroyTuret":0}}}'} data: None`
  );
  const [sendLogs, setSendLogs] = useState<string>("");

  useEffect(() => {
    const bc = new BroadcastChannel("mlbs_overlay_control");
    setChannel(bc);

    const stored = localStorage.getItem("mlbs_active_overlay") as "none" | "emblem" | "item";
    if (stored) setActiveOverlay(stored);

    try {
      const storedItem = localStorage.getItem("mlbs_side_item_visible");
      if (storedItem !== null) setShowSideItem(storedItem !== "false");
    } catch {
      /* noop */
    }

    try {
      const storedCaster = localStorage.getItem("mlbs_caster_name");
      if (storedCaster !== null) setCasterName(storedCaster);
    } catch {
      /* noop */
    }

    try {
      const rawStats = localStorage.getItem(PLAYER_STATS_KEY);
      if (rawStats) {
        const parsed = JSON.parse(rawStats) as { visible?: boolean; metric?: unknown };
        setPlayerStatsVisible(!!parsed.visible);
        setPlayerStatsMetric(parsePlayerStatsMetric(parsed.metric));
      }
    } catch {
      /* noop */
    }

    // Nilai awal dari database (sumber utama lintas perangkat).
    fetchOverlayRow().then((row) => {
      if (!row) return;
      if (row.activeOverlay !== undefined) {
        setActiveOverlay(row.activeOverlay);
        try {
          localStorage.setItem("mlbs_active_overlay", row.activeOverlay);
        } catch {
          /* noop */
        }
      }
      if (row.sideItemVisible !== undefined) {
        setShowSideItem(row.sideItemVisible);
        try {
          localStorage.setItem("mlbs_side_item_visible", String(row.sideItemVisible));
        } catch {
          /* noop */
        }
      }
      if (row.playerStatsVisible !== undefined || row.playerStatsMetric !== undefined) {
        setPlayerStatsVisible((prev) => row.playerStatsVisible ?? prev);
        setPlayerStatsMetric((prev) => (row.playerStatsMetric ?? prev) as PlayerStatsMetric);
      }
      if (row.casterName !== undefined) {
        setCasterName(row.casterName);
        try {
          localStorage.setItem("mlbs_caster_name", row.casterName);
        } catch {
          /* noop */
        }
      }
    });

    return () => {
      bc.close();
    };
  }, []);

  const sendControl = (mode: "none" | "emblem" | "item") => {
    setActiveOverlay(mode);
    localStorage.setItem("mlbs_active_overlay", mode);
    channel?.postMessage({ type: "SET_OVERLAY", mode });
    void writeOverlayRow({ active_overlay: mode }).then((err) => {
      setOverlayDb(err ? overlayDbError(err) : "✅ Tersimpan di database Supabase.");
    });
  };

  const sendCasterName = (name: string) => {
    const v = name.trim();
    setCasterName(name);
    try {
      localStorage.setItem("mlbs_caster_name", v);
    } catch {
      /* noop */
    }
    channel?.postMessage({ type: "SET_CASTER_NAME", name: v });
    void writeOverlayRow({ caster_name: v }).then((err) => {
      setOverlayDb(err ? overlayDbError(err) : "✅ Tersimpan di database Supabase.");
    });
  };

  const triggerTurtle = () => {
    setTurtleActive(true);
    channel?.postMessage({ type: "TRIGGER_TURTLE" });
    setTimeout(() => setTurtleActive(false), 3000);
  };

  const triggerLord = () => {
    setLordActive(true);
    channel?.postMessage({ type: "TRIGGER_LORD" });
    setTimeout(() => setLordActive(false), 3000);
  };

  const triggerLevelUpTest = () => {
    channel?.postMessage({ type: "TRIGGER_LEVELUP", ipos: testIpos, level: testLevel });
  };

  const triggerMapDrawTest = () => {
    setMapDrawActive(true);
    channel?.postMessage({ type: "TRIGGER_MAPDRAW" });
    setTimeout(() => setMapDrawActive(false), 5000);
  };

  const triggerInfoKillTest = () => {
    channel?.postMessage({
      type: "TRIGGER_INFOKILL",
      ipos: testKillIpos,
      killLabel: testKillLabel,
      // Opsional: override nama (dipakai jika live data kosong / ingin nama custom).
      // Jika kosong, Inmatch otomatis pakai nama player dari live data via ipos.
      playerName: testKillName.trim() || undefined,
    });
  };

  const toggleSideItem = () => {
    const next = !showSideItem;
    setShowSideItem(next);
    try {
      localStorage.setItem("mlbs_side_item_visible", String(next));
    } catch {
      /* noop */
    }
    channel?.postMessage({ type: "SET_SIDE_ITEM_VISIBLE", visible: next });
    void writeOverlayRow({ side_item_visible: next }).then((err) => {
      setOverlayDb(err ? overlayDbError(err) : "✅ Tersimpan di database Supabase.");
    });
  };

  const sendPlayerStats = (visible: boolean, metric: PlayerStatsMetric) => {
    setPlayerStatsVisible(visible);
    setPlayerStatsMetric(metric);
    try {
      localStorage.setItem(PLAYER_STATS_KEY, JSON.stringify({ visible, metric }));
    } catch {
      /* noop */
    }
    channel?.postMessage({ type: "SET_PLAYER_STATS", visible, metric });
    void writeOverlayRow({ player_stats_visible: visible, player_stats_metric: metric }).then((err) => {
      setOverlayDb(err ? overlayDbError(err) : "✅ Tersimpan di database Supabase.");
    });
  };

  const handleSendLiveData = () => {
    const parsed = parseMlbbLiveData(rawPayloadInput);
    if (parsed) {
      sendLocalLiveData(rawPayloadInput);
      setSendLogs(`✅ Berhasil diparse & dikirim! (${parsed.players?.length || 0} pemain)`);
      return;
    }
    const killEvent = parseMlbbKillEvent(rawPayloadInput);
    if (killEvent) {
      const label = getKillEventLabel(killEvent);
      sendKillEvent(rawPayloadInput);
      if (label) {
        setSendLogs(`✅ Kill event: ${label} — ${killEvent.killer?.name || "?"} (heroid ${killEvent.killer?.heroid ?? "?"})`);
      } else {
        setSendLogs(`⏭️ Single kill (multKill ${Number(killEvent.multKill) || 1}) — overlay diskip sesuai filter.`);
      }
      return;
    }
    setSendLogs("❌ Gagal mem-parse payload string. Periksa kembali format string.");
  };

  const [rawKillInput, setRawKillInput] = useState<string>(KILL_SAMPLE_TRIPLE);
  const [killLogs, setKillLogs] = useState<string>("");

  const handleSendKill = (raw: string) => {
    const result = sendKillEvent(raw);
    if (result === null) {
      setKillLogs("❌ Gagal mem-parse kill payload.");
    } else if (result === "skipped") {
      setKillLogs("⏭️ Single kill — overlay diskip sesuai filter (hanya First Blood & multi-kill ≥ 2).");
    } else {
      setKillLogs(`✅ Kill event dikirim: ${result} — buka tab /inmatch untuk melihat overlay.`);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6 font-sans flex flex-col items-center">
      <div className="max-w-2xl w-full space-y-6">
        {/* Header */}
        <div className="border-b border-neutral-800 pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-amber-400">MLBS Stream Control Panel</h1>
            <p className="text-xs text-neutral-400">Panel Kontrol Operator Overlay Realtime</p>
          </div>
          <div className="flex gap-2">
            <Link to="/draftpick" target="_blank" className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-xs">
              DraftPick ↗
            </Link>
            <Link to="/inmatch" target="_blank" className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-xs">
              InMatch ↗
            </Link>
            <Link to="/endmatch" target="_blank" className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-xs">
              EndMatch ↗
            </Link>
            <Link to="/bracket" target="_blank" className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-xs">
              Bracket ↗
            </Link>
            <Link to="/sesaatlagi" target="_blank" className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-xs">
              SesaatLagi ↗
            </Link>
            <Link to="/win" target="_blank" className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-xs">
              Win ↗
            </Link>
          </div>
        </div>

        {/* Overlay Selector Section */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">
            1. Kontrol Tampilan Overlay Bawah (InMatch)
          </h2>
          <p className="text-xs text-neutral-400">
            Pilih grafik yang ingin ditampilkan di overlay stream. Anda juga dapat menggunakan Hotkey di keyboard saat fokus di window stream (E = Emblem, I = Item, H/Esc = Sembunyikan).
          </p>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => sendControl("none")}
              className={`p-4 rounded-lg font-bold text-sm border transition flex flex-col items-center gap-1 ${
                activeOverlay === "none"
                  ? "bg-red-950/80 border-red-500 text-red-300 shadow-lg shadow-red-950/50"
                  : "bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700"
              }`}
            >
              <span className="text-lg">🚫</span>
              <span>Sembunyikan Overlay</span>
              <span className="text-[10px] text-neutral-400 font-normal">[HotKey: H / ESC]</span>
            </button>

            <button
              onClick={() => sendControl("emblem")}
              className={`p-4 rounded-lg font-bold text-sm border transition flex flex-col items-center gap-1 ${
                activeOverlay === "emblem"
                  ? "bg-amber-950/80 border-amber-500 text-amber-300 shadow-lg shadow-amber-950/50"
                  : "bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700"
              }`}
            >
              <span className="text-lg">🛡️</span>
              <span>Emblem Build</span>
              <span className="text-[10px] text-neutral-400 font-normal">[HotKey: E]</span>
            </button>

            <button
              onClick={() => sendControl("item")}
              className={`p-4 rounded-lg font-bold text-sm border transition flex flex-col items-center gap-1 ${
                activeOverlay === "item"
                  ? "bg-blue-950/80 border-blue-500 text-blue-300 shadow-lg shadow-blue-950/50"
                  : "bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700"
              }`}
            >
              <span className="text-lg">⚔️</span>
              <span>Item Build</span>
              <span className="text-[10px] text-neutral-400 font-normal">[HotKey: I]</span>
            </button>
          </div>

          <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800 flex items-center justify-between text-xs">
            <span className="text-neutral-400">Status Overlay Aktif:</span>
            <span className="font-bold text-amber-400 uppercase tracking-widest">{activeOverlay}</span>
          </div>
          {overlayDb && (
            <p className="text-xs rounded-lg px-3 py-1.5 border text-neutral-300 bg-neutral-950 border-neutral-800">
              {overlayDb}
            </p>
          )}

          <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800 flex items-center justify-between text-xs gap-3">
            <span className="text-neutral-400">Item Kartu User (kotak 47px di sisi kartu):</span>
            <button
              onClick={toggleSideItem}
              className={`px-4 py-1.5 rounded-lg font-bold text-xs border transition ${
                showSideItem
                  ? "bg-emerald-900/60 border-emerald-500 text-emerald-200"
                  : "bg-neutral-800 border-neutral-700 text-neutral-400"
              }`}
            >
              {showSideItem ? "👁️ Tampil" : "🚫 Sembunyi"}
            </button>
          </div>

          <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800 text-xs space-y-2">
            <span className="text-neutral-400">Nama Caster (teks hitam di atas info patch):</span>
            <div className="flex gap-2">
              <input
                value={casterName}
                onChange={(e) => setCasterName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendCasterName(casterName);
                }}
                placeholder="mis. CASTER A & CASTER B"
                className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={() => sendCasterName(casterName)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs rounded-lg transition"
              >
                📡 Simpan
              </button>
            </div>
          </div>
        </div>

        {/* Notif Trigger Section */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">
            2. Trigger Notifikasi Game
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={triggerTurtle}
              disabled={turtleActive}
              className={`py-3 px-4 rounded-lg font-bold text-sm border transition flex items-center justify-center gap-2 ${
                turtleActive
                  ? "bg-emerald-900/60 border-emerald-500 text-emerald-200"
                  : "bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700"
              }`}
            >
              <span>🐢</span>
              <span>{turtleActive ? "Notif Turtle..." : "Trigger Turtle"}</span>
            </button>
            <button
              onClick={triggerLord}
              disabled={lordActive}
              className={`py-3 px-4 rounded-lg font-bold text-sm border transition flex items-center justify-center gap-2 ${
                lordActive
                  ? "bg-sky-900/60 border-sky-500 text-sky-200"
                  : "bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700"
              }`}
            >
              <span>👹</span>
              <span>{lordActive ? "Notif Lord..." : "Trigger Lord"}</span>
            </button>
          </div>
        </div>

        {/* Level Up Test Section (test only) */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">
            3. Uji Coba Notifikasi Level Up (Test Only)
          </h2>
          <p className="text-xs text-neutral-400">
            Tombol ini hanya untuk uji tampilan. Di live, notif muncul otomatis 3 detik saat pemain mencapai level 4 / 15, dengan waktu game saat level didapat.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs text-neutral-400 space-y-1">
              <span>Pemain (ipos)</span>
              <select
                value={testIpos}
                onChange={(e) => setTestIpos(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <optgroup label="Blue Team">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <option key={i} value={i}>Blue {i}</option>
                  ))}
                </optgroup>
                <optgroup label="Red Team">
                  {[6, 7, 8, 9, 10].map((i) => (
                    <option key={i} value={i}>Red {i}</option>
                  ))}
                </optgroup>
              </select>
            </label>
            <label className="text-xs text-neutral-400 space-y-1">
              <span>Level</span>
              <select
                value={testLevel}
                onChange={(e) => setTestLevel(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                {[4, 15].map((lv) => (
                  <option key={lv} value={lv}>Level {lv}</option>
                ))}
              </select>
            </label>
          </div>
          <button
            onClick={triggerLevelUpTest}
            className="w-full py-3 px-4 rounded-lg font-bold text-sm border transition flex items-center justify-center gap-2 bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700"
          >
            <span>⬆️</span>
            <span>Test Trigger Level Up (Blue kiri→kanan / Red kanan→kiri)</span>
          </button>
        </div>

        {/* Info Kill Test Section (simulasi .infokill) */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">
            4. Simulasi Info Kill (Test Only)
          </h2>
          <p className="text-xs text-neutral-400">
            Menampilkan overlay <code className="text-amber-300">.infokill</code> (nama-player + label kill + hero portrait) di tengah layar InMatch selama 3 detik. Nama & portrait otomatis diambil dari live data via ipos — isi Nama Custom hanya jika ingin override.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs text-neutral-400 space-y-1">
              <span>Pemain (ipos)</span>
              <select
                value={testKillIpos}
                onChange={(e) => setTestKillIpos(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <optgroup label="Blue Team">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <option key={i} value={i}>Blue {i}</option>
                  ))}
                </optgroup>
                <optgroup label="Red Team">
                  {[6, 7, 8, 9, 10].map((i) => (
                    <option key={i} value={i}>Red {i}</option>
                  ))}
                </optgroup>
              </select>
            </label>
            <label className="text-xs text-neutral-400 space-y-1">
              <span>Label Kill</span>
              <select
                value={testKillLabel}
                onChange={(e) => setTestKillLabel(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                {INFOKILL_LABELS.map((label) => (
                  <option key={label} value={label}>{label}</option>
                ))}
              </select>
            </label>
          </div>
          <label className="text-xs text-neutral-400 space-y-1 block">
            <span>Nama Custom (opsional)</span>
            <input
              value={testKillName}
              onChange={(e) => setTestKillName(e.target.value)}
              placeholder="Kosongkan = pakai nama dari live data"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-500"
            />
          </label>
          <button
            onClick={triggerInfoKillTest}
            className="w-full py-3 px-4 rounded-lg font-bold text-sm border transition flex items-center justify-center gap-2 bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700"
          >
            <span>⚔️</span>
            <span>Test Trigger Info Kill (3 detik)</span>
          </button>

          <div className="border-t border-neutral-800 pt-4 space-y-3">
            <p className="text-xs text-neutral-400">
              Atau kirim raw <code className="text-amber-300">mlbb_kill_event</code> asli (otomatis memicu overlay di tab <code className="text-amber-300">/inmatch</code> bila labelnya First Blood / Double / Triple / Maniac / Savage; single kill diskip):
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setRawKillInput(KILL_SAMPLE_SINGLE); handleSendKill(KILL_SAMPLE_SINGLE); }}
                className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg text-xs font-bold"
              >
                🔹 Single (skip)
              </button>
              <button
                onClick={() => { setRawKillInput(KILL_SAMPLE_FIRST_BLOOD); handleSendKill(KILL_SAMPLE_FIRST_BLOOD); }}
                className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg text-xs font-bold"
              >
                🩸 First Blood
              </button>
              <button
                onClick={() => { setRawKillInput(KILL_SAMPLE_DOUBLE); handleSendKill(KILL_SAMPLE_DOUBLE); }}
                className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg text-xs font-bold"
              >
                ⚔️ Double (t:474)
              </button>
              <button
                onClick={() => { setRawKillInput(KILL_SAMPLE_TRIPLE); handleSendKill(KILL_SAMPLE_TRIPLE); }}
                className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg text-xs font-bold"
              >
                🔥 Triple (t:483)
              </button>
            </div>
            <textarea
              value={rawKillInput}
              onChange={(e) => setRawKillInput(e.target.value)}
              rows={4}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500"
              placeholder="Paste raw mlbb_kill_event disini..."
            />
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => handleSendKill(rawKillInput)}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs rounded-lg transition"
              >
                🚀 Kirim Kill Event
              </button>
              {killLogs && (
                <span className="text-xs font-medium text-neutral-300 bg-neutral-950 px-3 py-1.5 rounded-lg border border-neutral-800">
                  {killLogs}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Map Draw Test Section (test only) */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">
            5. Uji Animasi Map Draw (Test Only)
          </h2>
          <p className="text-xs text-neutral-400">
            Memutar ulang animasi acak map (±5 detik) di tab <code className="text-amber-300">/mapdraw</code> — berhenti di <code className="text-amber-300">mapDraw</code> dari live data saat ini. Di live, animasi berjalan otomatis saat <code className="text-amber-300">gameState: 3</code> dan <code className="text-amber-300">mapDraw</code> sudah ditentukan.
          </p>
          <button
            onClick={triggerMapDrawTest}
            disabled={mapDrawActive}
            className={`w-full py-3 px-4 rounded-lg font-bold text-sm border transition flex items-center justify-center gap-2 ${
              mapDrawActive
                ? "bg-amber-900/60 border-amber-500 text-amber-200"
                : "bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700"
            }`}
          >
            <span>🎰</span>
            <span>{mapDrawActive ? "Mengacak map..." : "Test Ulang Animasi Map Draw (5 detik)"}</span>
          </button>
        </div>

        {/* Live Payload Tester Section */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">
            6. Simulasi Input Raw Payload MLBB Live Data
          </h2>
          <p className="text-xs text-neutral-400">
            Paste pesan string payload (format Python socket, raw JSON, mlbb_live_data, atau mlbb_kill_event) di bawah ini untuk menguji update UI overlay secara lokal:
          </p>

          <textarea
            value={rawPayloadInput}
            onChange={(e) => setRawPayloadInput(e.target.value)}
            rows={5}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500"
            placeholder="Paste raw string payload disini..."
          />

          <div className="flex items-center justify-between">
            <button
              onClick={handleSendLiveData}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs rounded-lg transition"
            >
              🚀 Kirim Live Data Lokal ke Overlay
            </button>

            {sendLogs && (
              <span className="text-xs font-medium text-neutral-300 bg-neutral-950 px-3 py-1.5 rounded-lg border border-neutral-800">
                {sendLogs}
              </span>
            )}
          </div>
        </div>

        {/* Scoreboard Photos Info (sumber: folder /public) */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">
            6. Foto Kotak Scoreboard (Folder)
          </h2>
          <p className="text-xs text-neutral-400">
            Foto dibaca otomatis dari folder <code className="text-amber-300">public/assets/scoreboard/</code> — tanpa upload & tanpa rebuild, cukup refresh browser source.
          </p>
          <ul className="text-xs text-neutral-400 list-disc list-inside space-y-1 font-mono">
            <li>Slot A (kotak emas): <span className="text-amber-300">a-1 … a-5.png/.jpg/.jpeg/.webp</span></li>
            <li>Slot B (kolom kanan): <span className="text-amber-300">b-1 … b-5.png/.jpg/.jpeg/.webp</span></li>
          </ul>
          <p className="text-xs text-neutral-500">
            1 file = tampil statis. Lebih dari 1 file = slideshow fade otomatis (±5 detik).
          </p>
        </div>

        {/* Player Stats Section */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">
            7. Player Stats Overlay
          </h2>
          <p className="text-xs text-neutral-400">
            Urutan pemain otomatis dari nilai terbesar. Bar oranye proporsional terhadap nilai tertinggi.
          </p>
          <div className="grid grid-cols-3 gap-2">
            {PLAYER_STATS_METRICS.map((m) => (
              <button
                key={m.id}
                onClick={() => sendPlayerStats(true, m.id)}
                className={`px-3 py-2.5 rounded-lg font-bold text-xs border transition ${
                  playerStatsVisible && playerStatsMetric === m.id
                    ? "bg-amber-950/80 border-amber-500 text-amber-300"
                    : "bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => sendPlayerStats(!playerStatsVisible, playerStatsMetric)}
            className={`w-full py-3 px-4 rounded-lg font-bold text-sm border transition flex items-center justify-center gap-2 ${
              playerStatsVisible
                ? "bg-red-950/80 border-red-500 text-red-300"
                : "bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700"
            }`}
          >
            <span>{playerStatsVisible ? "🚫" : "📊"}</span>
            <span>{playerStatsVisible ? "Sembunyikan Player Stats" : "Tampilkan Player Stats"}</span>
          </button>
          {overlayDb && (
            <p className="text-xs rounded-lg px-3 py-1.5 border text-neutral-300 bg-neutral-950 border-neutral-800">
              {overlayDb}
            </p>
          )}
        </div>

        {/* Quick Instructions */}
        <BracketControls />
        <SesaatLagiControls />
        <WinControls />

        {/* Quick Instructions */}
        <div className="bg-neutral-900/50 border border-neutral-800/80 rounded-xl p-4 text-xs text-neutral-400 space-y-2">
          <p className="font-semibold text-neutral-300">💡 Petunjuk Penggunaan Operator:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Buka halaman ini (<code className="text-amber-300">/control</code>) di layar kedua atau HP operator.</li>
            <li>Buka halaman stream (<code className="text-amber-300">/inmatch</code>) pada OBS Browser Source (1920x1080).</li>
            <li>Klik tombol kontrol di atas untuk beralih antara Emblem Build, Item Build, atau Sembunyi.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
