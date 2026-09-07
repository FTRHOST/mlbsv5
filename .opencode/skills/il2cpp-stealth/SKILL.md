---
name: il2cpp-stealth
description: Guidelines and workflows for developing Frida Il2Cpp hooks using low-overhead Native C-API exports instead of frida-il2cpp-bridge. Use when creating stealth telemetry agents, avoiding GC freeze/micro-stutter, or debugging native Il2Cpp memory offsets.
---

# Il2Cpp Stealth Telemetry Development Skill

Skill ini memberikan panduan teknis, arsitektur, dan konvensi tingkat lanjut untuk memodifikasi atau memperluas agent telemetry Frida Il2Cpp berbasis **Native C-API (Stealth Mode)** tanpa dependensi pada `frida-il2cpp-bridge`.

## 🛡️ Prinsip Utama Stealth Mode

1. **Bebas Garbage Collection (GC) Freeze**:
   `frida-il2cpp-bridge` membuat ribuan JS wrapper & instansi reflection yang sering memicu *micro-stutter* / *freeze* pada game Unity. Mode Stealth mengeksekusi C-Exports bawaan (`il2cpp_domain_get`, `il2cpp_class_get_field_from_name`, `il2cpp_field_get_offset`) langsung via `NativeFunction`.

2. **Dynamic Offset Resolution dengan Parent Hierarchy Scanning**:
   Seluruh offset properti C# di-resolve secara dinamis via nama field (`getOffset(klass, fieldName)`). Jika field diturunkan dari superclass (misal properti `LogicPlayer` dari `ShowPlayer`), fungsi traversal hierarki induk (`il2cpp_class_get_parent`) wajib digunakan.

3. **Item Equip & Duplicate Item Handling**:
   - `Dictionary<int, int>` pada arm64 C# Il2Cpp memiliki header `0x20` dan ukuran entri `16` atau `24` byte (tergantung alignment).
   - Pasangan key/value mewakili `(slotIndex, itemID)` di mana slotIndex berkisar `1..6` atau `0..5`.
   - **Perhatian Penting**: Jangan gunakan filter uniqueness (`!equipsFixed.includes(item)`) untuk item slot terindeks, agar item duplikat (misal 2x atau 5x ID item yang sama) terbaca secara akurat pada slot masing-masing.
   - **Mencegah Overwrite Data**: Jangan izinkan sumber dictionary sekunder/fallback menimpa array `equipsFixed` yang sudah terisi item valid (`equipsFixed.some(x => x > 0)`).

---

## 🏗️ Arsitektur Proyek

Modul tersusun secara rapi di dalam `src/`:

```text
src/
├── index.ts                   # Entry point utama (Inisialisasi loader & hooks)
├── core/
│   ├── api.ts                 # Pemetaan C-API Il2Cpp, parent hierarchy scanner & helper memori
│   └── loader.ts              # Loader aman yang menunggu liblogic.so & il2cpp_init
├── hooks/
│   ├── draft.ts               # Hook UIRankHero (Draft phase, timer, Ban Blue vs Red, Lock Hero)
│   ├── match.ts               # Hook LogicFightData & LogicBattleEndCtrl (Statistik & Winner)
│   └── player.ts              # Hook SystemData / RoomData / LogicPlayer (Informasi Pemain & Equips)
├── types/                     # Interface TypeScript untuk payload telemetry & state
│   ├── draft.ts
│   ├── match.ts
│   ├── player.ts
│   └── telemetry.ts
└── utils/
    ├── logger.ts              # Format log & timestamp WIB
    └── scheduler.ts           # Periodic 1s broadcaster telemetry via Frida send()
```

---

## ⚠️ Konvensi & Best Practices

1. **Safe Null-Pointer Handling**:
   Sebelum memanggil `.readPointer()`, `.readCString()`, `.readUtf8String()`, atau `NativeFunction`, **selalu** lakukan pemeriksaan null:
   ```ts
   if (!ptr || ptr.isNull()) return;
   ```

2. **Penanganan Runtime (`il2cpp_init`)**:
   Jangan pernah memanggil API Il2Cpp sebelum `il2cpp_domain_get()` mengembalikan pointer non-NULL. Gunakan `Interceptor.attach(il2cpp_init, ...)` untuk menunggu runtime Unity siap sepenuhnya.

3. **Gunakan Ekstensi `.js` pada Import**:
   Dikarenakan konfigurasi TS `"module": "nodenext"`, seluruh impor internal relatif wajib menyertakan `.js`:
   ```ts
   import { getOffset } from "../core/api.js";
   ```

4. **Verifikasi Build**:
   Selalu jalankan `npm run build` setelah mengubah kode untuk mengonfirmasi kompilasi `dist/agent.js` sukses.
