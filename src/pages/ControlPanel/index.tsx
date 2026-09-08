import { useState, useEffect } from "react";
import { Link } from "react-router";
import { sendLocalLiveData } from "../../hooks/useLocalLiveData";
import { parseMlbbLiveData } from "../../hooks/useRoomData";

export default function ControlPanel() {
  const [activeOverlay, setActiveOverlay] = useState<"none" | "emblem" | "item">("none");
  const [turtleActive, setTurtleActive] = useState(false);
  const [channel, setChannel] = useState<BroadcastChannel | null>(null);

  const [rawPayloadInput, setRawPayloadInput] = useState<string>(
    `message: {'type': 'send', 'payload': '{"type":"mlbb_live_data","payload":{"gameState":0,"draftPhase":"PREPARATION","draftTimer":0,"players":[{"ipos":0,"id":"2178663653","name":"petwir-kepo","role":5,"team":2,"heroid":18,"uiHeroIDChoose":0,"battleSpell":20050,"emblem":0,"emblemSkills":[],"pickPhase":false,"banPhase":false,"SelHeroID":18,"banHero":0,"hp":3070,"maxHp":3070,"level":6,"deathTime":0,"kill":2,"dead":2,"assist":0,"ultActive":false,"equips":[2305,1001,2003,1004,0,0],"totalGold":2284,"damageDealt":16442,"damageTaken":7412},{"ipos":0,"id":"2231735373","name":"Tony Mark*66","role":3,"team":1,"heroid":10,"uiHeroIDChoose":0,"battleSpell":20050,"emblem":0,"emblemSkills":[],"pickPhase":false,"banPhase":false,"SelHeroID":10,"banHero":0,"hp":3440,"maxHp":3440,"level":4,"deathTime":0,"kill":1,"dead":2,"assist":0,"ultActive":false,"equips":[3562,1202,1203,0,0,0],"totalGold":1492,"damageDealt":7046,"damageTaken":9248}],"Battle":{"battleState":0,"winCamp":0,"waktuPertandingan":269,"blueTeamKill":1,"redTeamKill":2,"blueTeamGold":1492,"redTeamGold":2284,"blueTeamKillLord":0,"redTeamKillLord":0,"blueTeamDestroyTuret":0,"redTeamDestroyTuret":0}}}'} data: None`
  );
  const [sendLogs, setSendLogs] = useState<string>("");

  useEffect(() => {
    const bc = new BroadcastChannel("mlbs_overlay_control");
    setChannel(bc);

    const stored = localStorage.getItem("mlbs_active_overlay") as "none" | "emblem" | "item";
    if (stored) setActiveOverlay(stored);

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
        </div>

        {/* Notif Trigger Section */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">
            2. Trigger Notifikasi Game
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={triggerTurtle}
              disabled={turtleActive}
              className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm border transition flex items-center justify-center gap-2 ${
                turtleActive
                  ? "bg-emerald-900/60 border-emerald-500 text-emerald-200"
                  : "bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700"
              }`}
            >
              <span>🐢</span>
              <span>{turtleActive ? "Notifikasi Turtle Aktif..." : "Trigger Notifikasi Turtle"}</span>
            </button>
          </div>
        </div>

        {/* Live Payload Tester Section */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">
            3. Simulasi Input Raw Payload MLBB Live Data
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
