import { useState, useEffect } from "react";
import { Link } from "react-router";
import { sendLocalLiveData } from "../../hooks/useLocalLiveData";
import { parseMlbbLiveData } from "../../hooks/useRoomData";

type SideMediaSlot = "a" | "b";
type SideMediaData = { bg: string; photos: string[] };

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

const SIDE_MEDIA_KEYS: Record<SideMediaSlot, string> = {
  a: "mlbs_side_media_a",
  b: "mlbs_side_media_b",
};

const SIDE_MEDIA_DEFAULTS: Record<SideMediaSlot, SideMediaData> = {
  a: { bg: "#e8d367", photos: [] },
  b: { bg: "#d9d9d9", photos: [] },
};

const SIDE_MEDIA_MAX_PHOTOS = 10;

function readSideMedia(slot: SideMediaSlot): SideMediaData {
  try {
    const raw = localStorage.getItem(SIDE_MEDIA_KEYS[slot]);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<SideMediaData>;
      return {
        bg: typeof parsed.bg === "string" && parsed.bg ? parsed.bg : SIDE_MEDIA_DEFAULTS[slot].bg,
        photos: Array.isArray(parsed.photos) ? parsed.photos.filter((p) => typeof p === "string") : [],
      };
    }
  } catch {
    /* noop */
  }
  return { ...SIDE_MEDIA_DEFAULTS[slot], photos: [] };
}

function downscaleImage(file: File, maxWidth = 324): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const scale = Math.min(1, maxWidth / img.width);
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error("canvas tidak tersedia"));
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      } catch (e) {
        URL.revokeObjectURL(url);
        reject(e);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("gagal membaca gambar"));
    };
    img.src = url;
  });
}

export default function ControlPanel() {
  const [activeOverlay, setActiveOverlay] = useState<"none" | "emblem" | "item">("none");
  const [turtleActive, setTurtleActive] = useState(false);
  const [lordActive, setLordActive] = useState(false);

  const [channel, setChannel] = useState<BroadcastChannel | null>(null);
  const [testIpos, setTestIpos] = useState<number>(1);
  const [testLevel, setTestLevel] = useState<number>(4);
  const [showSideItem, setShowSideItem] = useState<boolean>(true);
  const [sideMedia, setSideMedia] = useState<Record<SideMediaSlot, SideMediaData>>({
    a: { ...SIDE_MEDIA_DEFAULTS.a, photos: [] },
    b: { ...SIDE_MEDIA_DEFAULTS.b, photos: [] },
  });
  const [sideMediaError, setSideMediaError] = useState<string>("");
  const [playerStatsVisible, setPlayerStatsVisible] = useState<boolean>(false);
  const [playerStatsMetric, setPlayerStatsMetric] = useState<PlayerStatsMetric>("gold");

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

    setSideMedia({ a: readSideMedia("a"), b: readSideMedia("b") });

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

    return () => {
      bc.close();
    };
  }, []);

  const sendControl = (mode: "none" | "emblem" | "item") => {
    setActiveOverlay(mode);
    localStorage.setItem("mlbs_active_overlay", mode);
    channel?.postMessage({ type: "SET_OVERLAY", mode });
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

  const toggleSideItem = () => {
    const next = !showSideItem;
    setShowSideItem(next);
    try {
      localStorage.setItem("mlbs_side_item_visible", String(next));
    } catch {
      /* noop */
    }
    channel?.postMessage({ type: "SET_SIDE_ITEM_VISIBLE", visible: next });
  };

  const sendSideMedia = (slot: SideMediaSlot, data: SideMediaData) => {
    setSideMedia((prev) => ({ ...prev, [slot]: data }));
    try {
      localStorage.setItem(SIDE_MEDIA_KEYS[slot], JSON.stringify(data));
    } catch {
      setSideMediaError("❌ Penyimpanan penuh — hapus sebagian foto lalu coba lagi.");
      return;
    }
    channel?.postMessage({ type: "SET_SIDE_MEDIA", slot, data });
  };

  const handleSideBg = (slot: SideMediaSlot, bg: string) => {
    setSideMediaError("");
    sendSideMedia(slot, { ...sideMedia[slot], bg });
  };

  const handleSideFiles = async (slot: SideMediaSlot, files: FileList | null) => {
    if (!files || files.length === 0) return;
    setSideMediaError("");
    const current = sideMedia[slot].photos;
    const room = SIDE_MEDIA_MAX_PHOTOS - current.length;
    if (room <= 0) {
      setSideMediaError(`❌ Maksimal ${SIDE_MEDIA_MAX_PHOTOS} foto per kotak.`);
      return;
    }
    try {
      const picked = Array.from(files).filter((f) => f.type.startsWith("image/")).slice(0, room);
      const downsized: string[] = [];
      for (const f of picked) {
        downsized.push(await downscaleImage(f));
      }
      sendSideMedia(slot, { ...sideMedia[slot], photos: [...current, ...downsized] });
    } catch {
      setSideMediaError("❌ Gagal memproses gambar. Coba file lain.");
    }
  };

  const removeSidePhoto = (slot: SideMediaSlot, idx: number) => {
    setSideMediaError("");
    sendSideMedia(slot, { ...sideMedia[slot], photos: sideMedia[slot].photos.filter((_, i) => i !== idx) });
  };

  const clearSidePhotos = (slot: SideMediaSlot) => {
    setSideMediaError("");
    sendSideMedia(slot, { ...sideMedia[slot], photos: [] });
  };

  const resetSideMedia = (slot: SideMediaSlot) => {
    setSideMediaError("");
    sendSideMedia(slot, { ...SIDE_MEDIA_DEFAULTS[slot], photos: [] });
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
  };

  const handleSendLiveData = () => {
    const parsed = parseMlbbLiveData(rawPayloadInput);
    if (parsed) {
      sendLocalLiveData(rawPayloadInput);
      setSendLogs(`✅ Berhasil diparse & dikirim! (${parsed.players?.length || 0} pemain)`);
    } else {
      setSendLogs("❌ Gagal mem-parse payload string. Periksa kembali format string.");
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

        {/* Live Payload Tester Section */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">
            4. Simulasi Input Raw Payload MLBB Live Data
          </h2>
          <p className="text-xs text-neutral-400">
            Paste pesan string payload (format Python socket, raw JSON, atau mlbb_live_data) di bawah ini untuk menguji update UI overlay secara lokal:
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

        {/* Side Media Section */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">
            5. Foto & Background Kotak Scoreboard
          </h2>
          <p className="text-xs text-neutral-400">
            1 foto = tampil statis. Lebih dari 1 foto = slideshow fade otomatis (±5 detik). Kedua kotak punya penyimpanan terpisah.
          </p>
          {sideMediaError && (
            <p className="text-xs font-medium text-red-300 bg-red-950/60 px-3 py-1.5 rounded-lg border border-red-800">
              {sideMediaError}
            </p>
          )}
          {(["a", "b"] as SideMediaSlot[]).map((slot) => (
            <div key={slot} className="bg-neutral-950 border border-neutral-800 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-neutral-200">
                  {slot === "a" ? "Slot A — Kotak emas (108×105)" : "Slot B — Blok abu kolom kanan (162×110)"}
                </p>
                <span className="text-[10px] text-neutral-500">
                  {sideMedia[slot].photos.length === 0
                    ? "Warna polos"
                    : sideMedia[slot].photos.length === 1
                      ? "1 foto (statis)"
                      : `${sideMedia[slot].photos.length} foto (fade)`}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-xs text-neutral-400">
                  <input
                    type="color"
                    value={sideMedia[slot].bg}
                    onChange={(e) => handleSideBg(slot, e.target.value)}
                    className="w-10 h-8 rounded cursor-pointer bg-transparent"
                  />
                  <span className="font-mono">{sideMedia[slot].bg}</span>
                </label>
                <label className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg text-xs font-bold cursor-pointer">
                  📷 Upload Foto
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      handleSideFiles(slot, e.target.files);
                      e.target.value = "";
                    }}
                  />
                </label>
                {sideMedia[slot].photos.length > 0 && (
                  <button
                    onClick={() => clearSidePhotos(slot)}
                    className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg text-xs text-neutral-300"
                  >
                    Hapus foto
                  </button>
                )}
                <button
                  onClick={() => resetSideMedia(slot)}
                  className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg text-xs text-neutral-300"
                >
                  Reset
                </button>
              </div>
              {sideMedia[slot].photos.length > 0 && (
                <div className="grid grid-cols-5 gap-2">
                  {sideMedia[slot].photos.map((src, i) => (
                    <div key={i} className="relative rounded overflow-hidden border border-neutral-700 aspect-square">
                      <img src={src} alt="" className="absolute inset-0 size-full object-cover" />
                      <button
                        onClick={() => removeSidePhoto(slot, i)}
                        className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/70 hover:bg-red-600 text-white text-[10px] leading-none flex items-center justify-center"
                        title="Hapus foto ini"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Player Stats Section */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">
            6. Player Stats Overlay
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
        </div>

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
