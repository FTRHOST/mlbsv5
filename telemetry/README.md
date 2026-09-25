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

## 🤖 AI Skill Context

Proyek ini dilengkapi dengan AI Skill di `.opencode/skills/il2cpp-stealth/SKILL.md`. AI assistant dapat memuat skill ini untuk membantu pengembangan fitur hook baru atau pemeliharaan arsitektur stealth secara otomatis.
