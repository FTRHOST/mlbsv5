---
name: il2cpp-telemetry
description: Domain knowledge and guidelines for developing Frida Il2Cpp hooks and telemetry in this project. Use when modifying hooks, adding game memory telemetry, or debugging Il2Cpp methods.
---

# Il2Cpp Telemetry Development Skill

Skill ini memberikan panduan domain knowledge dan teknik pengembangan untuk memodifikasi atau menambah fitur pada proyek Frida Il2Cpp Telemetry MLBB.

## 🏗️ Struktur Payload Telemetry

Telemetry yang dipublikasikan secara real-time setiap 1 detik mengusung struktur berikut:

1. **`gameState`**: State fase pertandingan (0 = Offline, 6 = IN_GAME, dll).
2. **`draftPhase` & `draftTimer`**: Fase Draft Pick (`BAN_PHASE`, `PICK_PHASE`, `FINISHED`, `IDLE`) dan timer tersisa.
3. **`players`**: Array 10 pemain yang memuat:
   - `id`, `name`, `role`, `team`, `heroid`, `uiHeroIDChoose`, `battleSpell`, `emblem`, `emblemSkills`
   - `hp`, `maxHp`, `level`, `deathTime`, `kill`, `dead`, `assist`, `ultActive`, `totalGold`, `damageDealt`, `damageTaken`
   - `equips`: Array 6 slot item presisi (misal `[2303, 3007, 3009, 1001, 0, 0]` atau duplikat `[2304, 2106, 3108, 3108, 0, 0]`).
4. **`Battle`**: Flat object statistik pertandingan (`waktuPertandingan`, `blueTeamGold`, `redTeamGold`, `blueTeamKill`, `redTeamKill`, `winCamp`, `battleState`).

---

## 🔍 Domain Knowledge Memori MLBB

1. **Struktur Equips (Item Pemain)**:
   - Item utama disimpan dalam `m_EquipDict` (tipe `Dictionary<int, int>`) pada `ShowEquipComp` / `LogicEquipComp` atau array 6-slot inline pada `LogicPlayer` (offset `0xc00`).
   - Kunci dictionary memetakan slot `1..6` atau `0..5` ke ID Item (misal `2304`, `2106`, `3108`).
   - Untuk mendukung item duplikat (misal 2x `3108`), pemetaan harus menargetkan indeks slot `k - 1` tanpa memfilter unik ID.
   - Apabila sumber utama sudah menghasilkan item terisi, cegah sumber dictionary fallback/kosong dari menimpa array (`equipsFixed.some(x => x > 0)`).

2. **Emblem Skills Filtering**:
   - Hanya ambil slot emblem aktif (`slot > 0 && id > 0`). Abaikan slot bernilai `-1` atau `0` agar array `emblemSkills` bersih.

3. **Status Pemenang (Winner Detection)**:
   - `LogicBattleEndCtrl.m_winCamp` menyimpan tim pemenang (1 = Blue, 2 = Red).

---

## ⚠️ Konvensi & Best Practices

- **Type Safety**: Gunakan interface dari `src/types/`.
- **Error Handling pada Loop Memory**: Selalu bungkus pembacaan objek memori dengan `try-catch` agar saat player despawn/destroy tidak terjadi crash.
- **Relatif Import `.js`**: Selalu sertakan ekstensi `.js` pada import TypeScript internal.
- **Verifikasi Build**: Selalu jalankan `npm run build` setelah perubahan kode.
