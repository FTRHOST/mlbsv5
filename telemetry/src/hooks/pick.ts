import { getOffset, il2cppApi } from "../core/api.js";
import { debugLog } from "../utils/logger.js";
import { startOrSyncTimer } from "./draft.js";

// Stealth pick-tracking via CompetitionData:
// - ReportPickHeroStart(playerData: RoomData, pickTimeSpan) -> pickPhase = true
//   untuk player dengan lUid yang cocok.
// - ReportPickHero(playerData: RoomData, pickHeroID) -> SelHeroID terkunci = pickHeroID.
// Signature instance: args[0]=this(CompetitionData), args[1]=playerData(RoomData),
// args[2]=uint32. Robust: coba baca UID dari args[1] lalu fallback args[0]
// (menangani varian tracer yang melabel this sebagai RoomData).

// UID (lUid string) yang sudah masuk fase pick.
export const pickPhaseMap = new Set<string>();
// UID -> heroID terkunci dari ReportPickHero.
export const lockedPickMap = new Map<string, number>();

let offLUid = -1;

function resolveLUidOffset(samplePtr: NativePointer): number {
  if (offLUid > 0) return offLUid;
  try {
    if (samplePtr && !samplePtr.isNull() && il2cppApi.object_get_class) {
      const kRoom = il2cppApi.object_get_class(samplePtr);
      if (kRoom && !kRoom.isNull()) {
        const off = getOffset(kRoom, "lUid");
        if (off > 0) {
          offLUid = off;
          return offLUid;
        }
      }
    }
  } catch (e) {}
  // dump.cs RoomData.lUid = 0x20
  offLUid = 0x20;
  return offLUid;
}

function readUidFromRoomData(p: NativePointer | null): string {
  if (!p || p.isNull()) return "0";
  try {
    const off = resolveLUidOffset(p);
    if (off <= 0) return "0";
    const uid = p.add(off).readU64().toString();
    if (uid && uid !== "0") return uid;
  } catch (e) {}
  return "0";
}

function readUidFromArgs(args: any): string {
  try {
    const toPtr = (a: any): NativePointer | null => {
      try {
        if (!a) return null;
        const p = a as NativePointer;
        if (p.isNull()) return null;
        return p;
      } catch (e) {
        return null;
      }
    };
    // Prioritas args[1] = playerData (RoomData).
    const p1 = toPtr(args[1]);
    const uid1 = readUidFromRoomData(p1);
    if (uid1 && uid1 !== "0") return uid1;
    // Fallback args[0] bila this yang membawa RoomData.
    const p0 = toPtr(args[0]);
    const uid0 = readUidFromRoomData(p0);
    if (uid0 && uid0 !== "0") return uid0;
  } catch (e) {}
  return "0";
}

function readU32Arg(a: any): number {
  try {
    if (!a) return 0;
    return (a as NativePointer).toInt32() >>> 0;
  } catch (e) {
    return 0;
  }
}

export function resetPickState(): void {
  pickPhaseMap.clear();
  lockedPickMap.clear();
}

const TARGET_PICK_METHODS = new Set<string>([
  "ReportPickHeroStart",
  "ReportPickHero",
]);

export function setupPickHooks(kCompetitionData: NativePointer): void {
  if (!kCompetitionData || kCompetitionData.isNull() || !il2cppApi.class_get_methods) {
    return;
  }
  try {
    const iter = Memory.alloc(Process.pointerSize).writePointer(NULL);
    let methodPtr: NativePointer;
    while (!(methodPtr = il2cppApi.class_get_methods(kCompetitionData, iter)).isNull()) {
      const namePtr: NativePointer = il2cppApi.method_get_name!(methodPtr);
      if (!namePtr || namePtr.isNull()) continue;
      const name = namePtr.readUtf8String();
      if (!name || !TARGET_PICK_METHODS.has(name)) continue;
      const impl = methodPtr.readPointer();
      if (!impl || impl.isNull()) continue;
      try {
        if (name === "ReportPickHeroStart") {
          Interceptor.attach(impl, {
            onEnter(args: any) {
              try {
                const uid = readUidFromArgs(args);
                if (uid && uid !== "0") {
                  pickPhaseMap.add(uid);
                  debugLog("Pick", `🟢 [ PICK START ] -> UID ${uid} pickPhase=true`);
                }
                // Sinkron timer draft dari pickTimeSpan (detik; normalisasi ms).
                // Fase tidak disentuh agar tak menimpa BLUE/RED PICKING dari UIRankHero.
                try {
                  let span = readU32Arg(args[2]);
                  if (span > 1000) span = Math.floor(span / 1000);
                  if (span > 0 && span <= 100) startOrSyncTimer(span);
                } catch (e) {}
              } catch (e) {}
            },
          });
        } else if (name === "ReportPickHero") {
          Interceptor.attach(impl, {
            onEnter(args: any) {
              try {
                const uid = readUidFromArgs(args);
                const heroId = readU32Arg(args[2]);
                if (uid && uid !== "0" && heroId > 0 && heroId <= 500) {
                  lockedPickMap.set(uid, heroId);
                  // Pastikan pickPhase tetap true walau Start terlewat.
                  pickPhaseMap.add(uid);
                  debugLog("Pick", `🔒 [ LOCK HERO ] -> UID ${uid} SelHeroID=${heroId}`);
                }
              } catch (e) {}
            },
          });
        }
        debugLog("Pick", `${name} hooked.`);
      } catch (e) {}
    }
  } catch (e) {}
}
