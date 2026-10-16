# Frida Il2Cpp Live Telemetry Agent (Stealth Mode)

Agent telemetry berkinerja tinggi dan stealth berbasis **Frida Native C-API** untuk menyadap data pertandingan (*drafting*, statistik match real-time, data pemain, dan hasil kemenangan) dari game Unity Il2Cpp (`liblogic.so`) tanpa menyebabkan *micro-stutter* / *freeze* pada game.

---

## ⚡ Mengapa Stealth Mode?

Beda dengan pendekatan standar berbasis `frida-il2cpp-bridge`:
- 🚫 **Tanpa Garbage Collection (GC) Freeze**: Tidak membuat ribuan objek wrapper JavaScript yang memicu pemblokiran thread utama Unity.
- 🎯 **Dynamic Offset Resolution**: Semua offset field C# dibaca secara dinamis berdasarkan nama field (`getOffset(klass, fieldName)`).
- 🛡️ **Anti-Cheat Safe & Low Overhead**: Membaca memori secara pasif via pointer instansi aktif tanpa pemindaian heap berat (`Il2Cpp.gc.choose`).
- ⏱️ **Safe `il2cpp_init` Synchronization**: Menunggu domain Il2Cpp diinisialisasi sepenuhnya sebelum mengeksekusi hook (mencegah crash *Access Violation 0x0*).

---

## 📁 Arsitektur Direktori (`src/`)

Struktur proyek dirancang modular untuk keterbacaan dan pemeliharaan kode:

```text
src/
├── index.ts                   # Entry point utama agent
├── core/                      # Logika C-API Native Il2Cpp & Loader Lifecycle
│   ├── api.ts                 # Pemetaan C-API exports (il2cpp_domain_get, getOffset, dll)
│   └── loader.ts              # Waiter aman untuk liblogic.so & il2cpp_init completion
├── hooks/                     # Modul Hook Game Native
│   ├── draft.ts               # Hook UIRankHero (Fase BP, Timer, Ban Biru vs Merah, Lock)
│   ├── match.ts               # Hook LogicFightData & LogicBattleEndCtrl (Statistik Match & Winner)
│   └── player.ts              # Hook SystemData / RoomData (Informasi Pemain)
├── types/                     # Type Definitions (TypeScript)
│   ├── draft.ts               # Type Draft state, Ban list, & Phase
│   ├── match.ts               # Type Match Data (Kills, Gold, Lord, Turtle, Turret)
│   ├── player.ts              # Type Player Data
│   └── telemetry.ts           # Type Payload Broadcast Frida send()
└── utils/                     # Utilitas pendukung
    ├── logger.ts              # Logging console & Timestamp WIB
    └── scheduler.ts           # Broadcaster telemetry real-time (setInterval 1s)
```

---

## 📡 Output Telemetry Live (Payload `send()`)

Agent secara periodik menyiarkan data JSON melalui `send()` Frida:

```json
{
  "type": "mlbb_live_data",
  "payload": {
    "gameState": 4,
    "draftPhase": "IN_GAME",
    "draftTimer": 0,
    "bans": {
      "teamA": [101, 102, 103],
      "teamB": [104, 105, 106]
    },
    "players": [
      {
        "uid": "12345678",
        "name": "Player 1",
        "camp": 1,
        "iPos": 1,
        "iRoad": 2,
        "heroId": 88,
        "summonSkillId": 2001,
        "isLocked": true
      }
    ],
    "matchData": {
      "timeString": "12:34",
      "timeMs": 754000,
      "teamA": { "kills": 15, "gold": 32000, "towers": 4, "turtles": 2, "lords": 1 },
      "teamB": { "kills": 10, "gold": 28000, "towers": 2, "turtles": 1, "lords": 0 }
    }
  }
}
```

Saat pertandingan selesai, event kemenangan dikirim secara terpisah:
```json
{
  "type": "auto_match_result",
  "winnerCamp": 1
}
```

---

## 🛠️ Kompilasi & Penggunaan

### 1. Build Agent
Kompilasi kode TypeScript di `src/index.ts` menjadi satu file bundle di `dist/agent.js`:
```bash
npm run build
```

### 2. Mode Watch
Otomatis mengompilasi ulang saat ada perubahan kode:
```bash
npm run watch
```

### 3. Hook ke Perangkat Android
Jalankan skrip penyadapan otomatis ke proses Unity di Android via Frida CLI:
```bash
npm run wait-and-hook
```

---

## 💾 History & Skor Otomatis (saat win)

Saat `[Match] [WinLog]` terpanggil (`auto_match_result`), `server.py` otomatis:
1. Menyimpan `public/historyMatch/[hh-mm_timA-timB].json` + `index.json` (dibaca Endmatch).
2. Insert 1 baris ke tabel Supabase `stats` (payload + `Battle.winCamp`) sehingga
   skor series di DraftPick/Win/Endmatch naik sendiri tanpa input dashboard.

## 🖧️ Mode Split-PC (telemetry & overlay beda komputer satu LAN)

```
[Android] --usb--> [PC Telemetry: adb + frida + server.py :8080 WS + :8081 HTTP]
                        |   (Supabase cloud dipakai bersama kedua PC)
                   LAN (WiFi/Kabel, sebaiknya satu subnet)
                        |
              [PC Overlay/OBS: npm run dev + OBS browser source]
```

Prinsip pembagian `.env` (bukan "OBS di telemetry, cukup WS-URL di overlay"):

| Kebutuhan | PC Telemetry (pengirim) | PC Overlay/OBS |
|---|---|---|
| `server.py` | `VITE_SUPABASE_URL/KEY` (+ `VITE_OPERATOR_ID`) untuk insert `stats` & nama tim history | tidak jalan di sini |
| Overlay web | tidak jalan di sini | `VITE_SUPABASE_URL/KEY` **tetap wajib** (frontend query Supabase langsung!) + `VITE_LOCAL_WS_URL=ws://<ip-telemetry>:8080` + `VITE_HISTORY_BASE_URL=http://<ip-telemetry>:8081/historyMatch` |
| `auto_scene_switch.py` | hanya bila script dijalankan di sini | `OBS_WS_HOST/PORT/PASSWORD` (OBS lokal) + `TELEMETRY_WS_URL=ws://<ip-telemetry>:8080` |

`server.py` tidak membaca `OBS_WS_*` sama sekali — variabel itu hanya dipakai
`auto_scene_switch.py`. Yang lewat WS telemetry hanya live payload (players,
battle, kill/boss event); nama tim, skor series, dan semua kontrol tetap
diambil frontend langsung dari Supabase.

### Langkah setup

**PC Telemetry** (cukup `.env` Supabase):
1. Colok Android via USB, pastikan `adb devices` terlihat.
2. `python3 server.py` (bind `0.0.0.0` otomatis).
3. Firewall: izinkan inbound TCP `8080` (WS) dan `8081` (HTTP history).
4. Catat IP LAN PC ini (`ipconfig` / `ip a`), mis. `192.168.1.10`.

**PC Overlay/OBS**:
1. Isi `.env`: kredensial Supabase + dua URL ke IP PC telemetry (lihat tabel).
2. `npm run dev` (tambah `-- --host` bila `/control` dibuka dari HP/perangkat lain).
3. OBS Browser Source ke `http://localhost:5173/inmatch` (atau route lain);
   halaman `/control` dibuka di browser PC ini.
4. Opsional: jalankan `python scripts/auto_scene_switch.py` di PC ini
   (`OBS_WS_HOST=localhost`, `TELEMETRY_WS_URL` ke PC telemetry). Aktifkan
   dulu WebSocket Server di OBS (Tools -> WebSocket Server Settings) dan
   samakan password dengan `.env`; nama scene harus persis seperti mapping
   (`mapdraw`, `draft-loading`, `match`, `victory`, `end-match`).

### Yang jalan lintas PC vs yang tidak

- ✅ Lintas PC: live data, kill/boss notif, history Endmatch, skor series,
  dan semua kontrol berbasis Supabase (overlay bawah, player stats, caster,
  bracket, sesaat-lagi, win, team mapping).
- ⚠️ Hanya dalam browser yang sama (BroadcastChannel): tombol test di
  `/control` (simulasi infokill/level-up/turtle/lord/mapdraw/live). Untuk
  pemakaian split, trigger test tidak dikirim ke PC lain — normal dan bukan bug.

### Troubleshooting

- Overlay `Connecting...` terus: cek IP telemetry, firewall 8080, dan
  `VITE_LOCAL_WS_URL` (restart `npm run dev` tiap ganti `.env`).
- Endmatch kosong/fallback live: cek `http://<ip-telemetry>:8081/index.json`
  dari browser PC overlay (pastikan `VITE_HISTORY_BASE_URL` benar).
- Scene OBS tidak pindah: `--dry-run` dulu untuk tes logika; cek nama scene
  (case-sensitive) dan password WS OBS.

---

## 🤖 AI Skill Context

Proyek ini dilengkapi dengan AI Skill di `.opencode/skills/il2cpp-stealth/SKILL.md`. AI assistant dapat memuat skill ini untuk membantu pengembangan fitur hook baru atau pemeliharaan arsitektur stealth secara otomatis.
