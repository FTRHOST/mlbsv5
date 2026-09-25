import { getCachedUtf8String, getOffset, il2cppApi } from "../core/api.js";
import { debugLog } from "../utils/logger.js";

// Status hidup Turtle (LogicTortoise/ShenGui) & Lord (LogicBoss/LingZhu).
// Stealth: tanpa invoke method. Rantai:
//   LogicBattleManager.Instance -> m_dicMonsterLogic (Dictionary<guid, LogicFighter>)
//   -> bandingkan pointer klass objek dengan klass LogicTortoise/LogicBoss
//      yang di-resolve sekali di loader -> baca m_Hp (hp > 0 = hidup).
// Kalibrasi live: turtle hidup hp 12005/12005; lord mati hp 0 + m_uDeadTime terisi.

let kLogicManagerRef: NativePointer | null = null;
let kTortoiseRef: NativePointer | null = null;
let kBossRef: NativePointer | null = null;
let fieldInstance: NativePointer | null = null;

let offDicMonster = -1;
let offHp = -1;
let isObjectiveOffsetsResolved = false;

let turtleAliveState = false;
let lordAliveState = false;

const persistentObjPtr = Memory.alloc(Process.pointerSize);

export function setupObjectiveHook(
  kLogicManager: NativePointer,
  kTortoise: NativePointer,
  kBoss: NativePointer,
): void {
  if (kLogicManager && !kLogicManager.isNull()) {
    kLogicManagerRef = kLogicManager;
    try {
      if (il2cppApi.class_get_field_from_name) {
        const f: NativePointer = il2cppApi.class_get_field_from_name(
          kLogicManager,
          getCachedUtf8String("Instance"),
        );
        if (f && !f.isNull()) fieldInstance = f;
      }
      if (offDicMonster <= 0) {
        offDicMonster = getOffset(kLogicManager, "m_dicMonsterLogic");
      }
    } catch (e) {}
  }
  if (kTortoise && !kTortoise.isNull()) kTortoiseRef = kTortoise;
  if (kBoss && !kBoss.isNull()) kBossRef = kBoss;
  if (kTortoiseRef || kBossRef) {
    debugLog("Objective", "Turtle/Lord alive reader ready (stealth class-compare).");
  }
}

function isFighterAlive(fighterPtr: NativePointer): boolean {
  try {
    if (!fighterPtr || fighterPtr.isNull()) return false;
    if (!isObjectiveOffsetsResolved && il2cppApi.object_get_class) {
      const k = il2cppApi.object_get_class(fighterPtr);
      if (k && !k.isNull()) {
        if (offHp <= 0) offHp = getOffset(k, "m_Hp");
        if (offHp > 0) isObjectiveOffsetsResolved = true;
      }
    }
    if (offHp <= 0) return false;
    return fighterPtr.add(offHp).readInt() > 0;
  } catch (e) {
    return false;
  }
}

// Dipanggil sekali per tick broadcaster sebelum payload Battle disusun.
export function refreshObjectives(): void {
  turtleAliveState = false;
  lordAliveState = false;
  try {
    if (!kLogicManagerRef || !fieldInstance || !il2cppApi.field_static_get_value) return;
    if ((!kTortoiseRef || kTortoiseRef.isNull()) && (!kBossRef || kBossRef.isNull())) return;
    il2cppApi.field_static_get_value(fieldInstance, persistentObjPtr);
    const mgr = persistentObjPtr.readPointer();
    if (!mgr || mgr.isNull()) return;
    if (offDicMonster <= 0) return;

    let dictPtr: NativePointer | null = null;
    try {
      dictPtr = mgr.add(offDicMonster).readPointer();
    } catch (e) {
      return;
    }
    if (!dictPtr || dictPtr.isNull()) return;

    let entriesPtr: NativePointer | null = null;
    let count = 0;
    try {
      entriesPtr = dictPtr.add(Process.pointerSize === 8 ? 0x18 : 0x0c).readPointer();
      count = dictPtr.add(Process.pointerSize === 8 ? 0x20 : 0x10).readInt();
    } catch (e) {
      return;
    }
    if (!entriesPtr || entriesPtr.isNull() || count <= 0 || count > 256) return;

    const header = Process.pointerSize === 8 ? 0x20 : 0x10;
    const n = Math.min(count, 128);
    for (let i = 0; i < n; i++) {
      try {
        const entry = entriesPtr.add(header + i * 24);
        const v = entry.add(16).readPointer();
        if (!v || v.isNull()) continue;
        if (!il2cppApi.object_get_class) continue;
        const k = il2cppApi.object_get_class(v);
        if (!k || k.isNull()) continue;
        if (kTortoiseRef && !kTortoiseRef.isNull() && k.equals(kTortoiseRef)) {
          if (isFighterAlive(v)) turtleAliveState = true;
        } else if (kBossRef && !kBossRef.isNull() && k.equals(kBossRef)) {
          if (isFighterAlive(v)) lordAliveState = true;
        }
        if (turtleAliveState && lordAliveState) break;
      } catch (e) {}
    }
  } catch (e) {}
}

export function isTurtleAlive(): boolean {
  return turtleAliveState;
}

export function isLordAlive(): boolean {
  return lordAliveState;
}
