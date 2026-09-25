import { getCachedUtf8String, getOffset, il2cppApi } from "../core/api.js";
import { debugLog } from "../utils/logger.js";

// Pembaca sisa respawn Show-side (stealth, tanpa invoke method).
// Rantai: BattleManager.Instance -> m_ShowPlayers (List<ShowEntity>)
//   -> per entity: m_uGuid (kunci) + m_uDeadSpanTime (durasi respawn ms).
// Kalibrasi live: Show span bernilai bulat (mis. 10000) baik saat mati maupun
//   hidup -> diperlakukan sebagai TOTAL durasi; sisa dihitung:
//   sisa = logicDeadTimestamp + spanTotal - now.
// Jika uji live menunjukkan span justru menghitung turun sendiri, ganti
// pemakaian di player.ts menjadi span langsung (satu baris).

let kBattleManagerRef: NativePointer | null = null;
let fieldInstance: NativePointer | null = null;
let offShowPlayers = -1;
let offShowGuid = -1;
let offShowSpan = -1;
let isDeathOffsetsResolved = false;

const persistentDeathPtr = Memory.alloc(Process.pointerSize);
const spanByGuid = new Map<number, number>();

export function setupDeathHook(kBattleManager: NativePointer): void {
  if (!kBattleManager || kBattleManager.isNull()) return;
  kBattleManagerRef = kBattleManager;
  try {
    if (!il2cppApi.class_get_field_from_name) return;
    const f: NativePointer = il2cppApi.class_get_field_from_name(
      kBattleManager,
      getCachedUtf8String("Instance"),
    );
    if (f && !f.isNull()) {
      fieldInstance = f;
      debugLog("Death", "BattleManager death-span reader ready (stealth static read).");
    }
  } catch (e) {}
}

function readShowList(listPtr: NativePointer): NativePointer[] {
  const result: NativePointer[] = [];
  if (!listPtr || listPtr.isNull()) return result;
  try {
    const countOff = Process.pointerSize === 8 ? 0x18 : 0x0c;
    const itemsOff = Process.pointerSize === 8 ? 0x10 : 0x08;
    const count = listPtr.add(countOff).readInt();
    const itemsArray = listPtr.add(itemsOff).readPointer();
    if (itemsArray && !itemsArray.isNull() && count > 0 && count <= 50) {
      const header = Process.pointerSize === 8 ? 0x20 : 0x10;
      for (let i = 0; i < count; i++) {
        try {
          const item = itemsArray.add(header + i * Process.pointerSize).readPointer();
          if (item && !item.isNull()) result.push(item);
        } catch (e) {}
      }
    }
  } catch (e) {}
  return result;
}

// Dipanggil sekali per tick broadcaster; membangun ulang peta guid -> span ms.
export function refreshDeathSpans(): void {
  spanByGuid.clear();
  try {
    if (!kBattleManagerRef || !fieldInstance || !il2cppApi.field_static_get_value) return;
    il2cppApi.field_static_get_value(fieldInstance, persistentDeathPtr);
    const mgr = persistentDeathPtr.readPointer();
    if (!mgr || mgr.isNull()) return;

    if (offShowPlayers <= 0 && il2cppApi.object_get_class) {
      try {
        const kMgr = il2cppApi.object_get_class(mgr);
        if (kMgr && !kMgr.isNull()) offShowPlayers = getOffset(kMgr, "m_ShowPlayers");
      } catch (e) {}
    }
    if (offShowPlayers <= 0) return;

    let listPtr: NativePointer | null = null;
    try {
      listPtr = mgr.add(offShowPlayers).readPointer();
    } catch (e) {
      return;
    }
    for (const se of readShowList(listPtr!)) {
      try {
        if (!isDeathOffsetsResolved && il2cppApi.object_get_class) {
          const kSe = il2cppApi.object_get_class(se);
          if (kSe && !kSe.isNull()) {
            if (offShowGuid <= 0) offShowGuid = getOffset(kSe, "m_uGuid");
            if (offShowSpan <= 0) offShowSpan = getOffset(kSe, "m_uDeadSpanTime");
            // Nama field tak ada di metadata build live (terbukti di
            // ShowSelfPlayer/ShowPlayer) tapi nilai di offset dump 0x23c
            // terkalibrasi benar (timestamp 0x238 cocok sisi logic).
            if (offShowSpan <= 0) offShowSpan = 0x23c;
            if (offShowGuid > 0 && offShowSpan > 0) isDeathOffsetsResolved = true;
          }
        }
        if (offShowGuid <= 0 || offShowSpan <= 0) continue;
        const guid = se.add(offShowGuid).readU32();
        const span = se.add(offShowSpan).readU32();
        if (guid > 0) spanByGuid.set(guid, span);
      } catch (e) {}
    }
  } catch (e) {}
}

// Total durasi respawn (ms) untuk guid logic; 0 bila tak diketahui.
export function getDeathSpanMs(logicGuid: number): number {
  if (logicGuid <= 0) return 0;
  return spanByGuid.get(logicGuid) ?? 0;
}
