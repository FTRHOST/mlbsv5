import { getCachedUtf8String, getOffset, il2cppApi } from "../core/api.js";
import type {
  KillEvent,
  KillParticipant,
  KillTrigger,
} from "../types/kill.js";
import { debugLog } from "../utils/logger.js";
import { getMatchTimeMs } from "./match.js";
import { describeFighter, lookupFighterByGuid } from "./player.js";

// Notifikasi kill via hook CompetitionData::ReportKillEvent.
// Stealth: satu Interceptor.attach pada implementasi method (pola yang sama
// seperti StartEndBattle). onEnter hanya baca argumen + memori via offset
// cache, tanpa invoke method game.
// Signature: ReportKillEvent(killer, deader, assitID, bFirstBoold,
//   eventType, multKill, contiKill) -> onEnter args[1..7].

let kLogicManagerRef: NativePointer | null = null;
let fieldManagerInstance: NativePointer | null = null;
let offCampA = -1;
let offCampB = -1;
let offLogicGuid = -1;

const persistentMgrPtr = Memory.alloc(Process.pointerSize);

export function setupKillHook(
  kCompetitionData: NativePointer,
  kLogicManager?: NativePointer,
): void {
  if (kLogicManager && !kLogicManager.isNull()) {
    kLogicManagerRef = kLogicManager;
    try {
      if (il2cppApi.class_get_field_from_name) {
        const f: NativePointer = il2cppApi.class_get_field_from_name(
          kLogicManager,
          getCachedUtf8String("Instance"),
        );
        if (f && !f.isNull()) fieldManagerInstance = f;
      }
      if (offCampA <= 0) offCampA = getOffset(kLogicManager, "m_CampAPlayerList");
      if (offCampA <= 0) offCampA = 0xa0;
      if (offCampB <= 0) offCampB = getOffset(kLogicManager, "m_CampBPlayerList");
      if (offCampB <= 0) offCampB = 0xa8;
    } catch (e) {}
  }

  if (
    !kCompetitionData ||
    kCompetitionData.isNull() ||
    !il2cppApi.class_get_methods
  ) {
    return;
  }
  try {
    const iter = Memory.alloc(Process.pointerSize).writePointer(NULL);
    let methodPtr: NativePointer;
    while (
      !(methodPtr = il2cppApi.class_get_methods(kCompetitionData, iter)).isNull()
    ) {
      const namePtr: NativePointer = il2cppApi.method_get_name!(methodPtr);
      if (!namePtr || namePtr.isNull()) continue;
      if (namePtr.readUtf8String() !== "ReportKillEvent") continue;
      const impl = methodPtr.readPointer();
      if (!impl || impl.isNull()) return;
      Interceptor.attach(impl, { onEnter: onKillEvent });
      debugLog("Kill", "ReportKillEvent hooked (event-driven kill feed).");
      return;
    }
    debugLog("Kill", "ReportKillEvent method not found.");
  } catch (e) {}
}

function readGuidList(listPtr: NativePointer): number[] {
  const out: number[] = [];
  if (!listPtr || listPtr.isNull()) return out;
  try {
    const countOff = Process.pointerSize === 8 ? 0x18 : 0x0c;
    const itemsOff = Process.pointerSize === 8 ? 0x10 : 0x08;
    const count = listPtr.add(countOff).readInt();
    const itemsArray = listPtr.add(itemsOff).readPointer();
    if (!itemsArray || itemsArray.isNull() || count <= 0 || count > 10) return out;
    const header = Process.pointerSize === 8 ? 0x20 : 0x10;
    for (let i = 0; i < count; i++) {
      try {
        out.push(itemsArray.add(header + i * 4).readU32());
      } catch (e) {}
    }
  } catch (e) {}
  return out;
}

function readLogicPlayerList(listPtr: NativePointer): NativePointer[] {
  const result: NativePointer[] = [];
  if (!listPtr || listPtr.isNull()) return result;
  try {
    const count = listPtr.add(Process.pointerSize === 8 ? 0x18 : 0x0c).readInt();
    const itemsArray = listPtr.add(Process.pointerSize === 8 ? 0x10 : 0x08).readPointer();
    if (itemsArray && !itemsArray.isNull() && count > 0 && count <= 10) {
      const header = Process.pointerSize === 8 ? 0x20 : 0x10;
      for (let i = 0; i < count; i++) {
        try {
          const item = itemsArray
            .add(header + i * Process.pointerSize)
            .readPointer();
          if (item && !item.isNull()) result.push(item);
        } catch (e) {}
      }
    }
  } catch (e) {}
  return result;
}

function findPlayerByGuid(guid: number): NativePointer | null {
  if (!guid || !kLogicManagerRef || !fieldManagerInstance || !il2cppApi.field_static_get_value) {
    return null;
  }
  try {
    il2cppApi.field_static_get_value(fieldManagerInstance, persistentMgrPtr);
    const mgr = persistentMgrPtr.readPointer();
    if (!mgr || mgr.isNull() || offCampA <= 0 || offCampB <= 0) return null;
    const lists = [
      mgr.add(offCampA).readPointer(),
      mgr.add(offCampB).readPointer(),
    ];
    for (const listPtr of lists) {
      for (const lp of readLogicPlayerList(listPtr)) {
        try {
          if (offLogicGuid <= 0 && il2cppApi.object_get_class) {
            const k = il2cppApi.object_get_class(lp);
            if (k && !k.isNull()) offLogicGuid = getOffset(k, "m_uGuid");
            if (offLogicGuid <= 0) offLogicGuid = 0xb0;
          }
          if (offLogicGuid > 0 && lp.add(offLogicGuid).readU32() === guid) {
            return lp;
          }
        } catch (e) {}
      }
    }
  } catch (e) {}
  return null;
}

// Identitas via cache tick (nama + accId RoomData) diutamakan; baca memori
// langsung sebagai fallback bila hook terpanggil sebelum tick terisi.
function resolveParticipant(ptr: NativePointer): KillParticipant | null {
  try {
    const direct = describeFighter(ptr);
    if (!direct) return null;
    const cached = lookupFighterByGuid(direct.guid);
    if (!cached) return direct;
    return {
      guid: direct.guid,
      accId:
        cached.accId && cached.accId !== "0" ? cached.accId : direct.accId,
      name: cached.name || direct.name,
      heroid: cached.heroid || direct.heroid,
      ipos: cached.ipos || direct.ipos,
      team: cached.team || direct.team,
    };
  } catch (e) {
    return null;
  }
}

function onKillEvent(args: any): void {
  try {
    const toPtr = (a: any): NativePointer | null => {
      try {
        if (!a) return null;
        const p: NativePointer = a as NativePointer;
        if (p.isNull()) return null;
        return p;
      } catch (e) {
        return null;
      }
    };
    const toInt = (a: any): number => {
      try {
        return a ? (a as NativePointer).toInt32() : 0;
      } catch (e) {
        return 0;
      }
    };

    const deaderPtr = toPtr(args[2]);
    if (!deaderPtr) return;
    const deader = resolveParticipant(deaderPtr);
    if (!deader) return;

    const killerPtr = toPtr(args[1]);
    const killer: KillParticipant | null = killerPtr
      ? resolveParticipant(killerPtr)
      : null;

    const assistPtr = toPtr(args[3]);
    const assistGuids = assistPtr ? readGuidList(assistPtr) : [];
    const assists: KillParticipant[] = [];
    for (const g of assistGuids) {
      try {
        // Cache tick dulu (nama lengkap), baru baca memori langsung.
        const cached = lookupFighterByGuid(g);
        if (cached) {
          assists.push(cached);
          continue;
        }
        const lp = findPlayerByGuid(g);
        if (lp) {
          const d = describeFighter(lp);
          if (d) assists.push(d);
        }
      } catch (e) {}
    }

    const firstBlood = toInt(args[4]) !== 0;
    const eventType = toInt(args[5]);
    const multKill = toInt(args[6]);
    const contiKill = toInt(args[7]);

    let trigger: KillTrigger = "KILL";
    if (firstBlood) trigger = "FIRST_BLOOD";
    else if (multKill >= 5) trigger = "SAVAGE";
    else if (multKill === 4) trigger = "MANIAC";
    else if (multKill === 3) trigger = "TRIPLE_KILL";

    let t = 0;
    try {
      if (getMatchTimeMs) t = Math.floor(Number((getMatchTimeMs as any)()) / 1000);
    } catch (e) {}

    const event: KillEvent = {
      killer,
      deader,
      assists,
      assistGuids,
      trigger,
      firstBlood,
      multKill,
      contiKill,
      eventType,
      t,
    };
    send(JSON.stringify({ type: "mlbb_kill_event", event }));
  } catch (e) {}
}
