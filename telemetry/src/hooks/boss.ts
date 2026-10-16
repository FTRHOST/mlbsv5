import { il2cppApi } from "../core/api.js";
import type { BossEvent, BossKind } from "../types/boss.js";
import type { KillParticipant } from "../types/kill.js";
import { debugLog, getIndonesianDateTime } from "../utils/logger.js";
import { debugSend } from "../utils/telemetry-debug.js";
import { getMatchTimeMs } from "./match.js";
import { describeFighter, lookupFighterByGuid } from "./player.js";

// Trace pemanggilan method (gaya Il2Cpp.trace(true)):
//   System.Void CompetitionData::ReportKillBossEvent(
//     Battle.LogicFighter killer, Battle.LogicFighter deader,
//     System.UInt32 eventType, System.Boolean steal)
// Stealth: satu Interceptor.attach pada implementasi method. onEnter hanya
// membaca argumen + memori via offset cache, tanpa invoke method game.
// Signature instance -> onEnter args[0]=this, args[1]=killer,
// args[2]=deader, args[3]=eventType(uint32), args[4]=steal(bool).
// Log console (frida CLI / log.txt) + kirim event mlbb_boss_event agar
// overlay Inmatch bisa menampilkan notifikasi seperti notifikasi kill.

const TARGET_METHOD = "ReportKillBossEvent";
const MAX_TRACE_FRAMES = 8;

// Ref class monster untuk identifikasi boss via perbandingan pointer klass
// (pola objective.ts). Diisi via setupBossHook().
let kTortoiseRef: NativePointer | null = null;
let kBossRef: NativePointer | null = null;

function getClassPtr(objPtr: NativePointer | null): NativePointer | null {
  try {
    if (!objPtr || objPtr.isNull() || !il2cppApi.object_get_class) return null;
    const k = il2cppApi.object_get_class(objPtr);
    if (!k || k.isNull()) return null;
    return k;
  } catch (e) {
    return null;
  }
}

function resolveBossKind(deaderPtr: NativePointer | null): BossKind {
  try {
    const k = getClassPtr(deaderPtr);
    if (k) {
      if (kTortoiseRef && !kTortoiseRef.isNull() && k.equals(kTortoiseRef)) {
        return "turtle";
      }
      if (kBossRef && !kBossRef.isNull() && k.equals(kBossRef)) {
        return "lord";
      }
    }
  } catch (e) {}
  // Fallback nama class bila ref/pointer-compare tak tersedia.
  try {
    const name = getClassName(deaderPtr).toLowerCase();
    if (name.indexOf("tortoise") !== -1 || name.indexOf("shengui") !== -1) {
      return "turtle";
    }
    if (name.indexOf("boss") !== -1 || name.indexOf("lingzhu") !== -1) {
      return "lord";
    }
  } catch (e) {}
  return "unknown";
}

function getClassName(objPtr: NativePointer | null): string {
  try {
    if (!objPtr || objPtr.isNull() || !il2cppApi.object_get_class) return "?";
    const k = il2cppApi.object_get_class(objPtr);
    if (!k || k.isNull() || !il2cppApi.class_get_name) return "?";
    const namePtr: NativePointer = il2cppApi.class_get_name(k);
    if (!namePtr || namePtr.isNull()) return "?";
    return namePtr.readCString() || "?";
  } catch (e) {
    return "?";
  }
}

function fmtPtr(p: NativePointer | null): string {
  try {
    if (!p || p.isNull()) return "null";
    return p.toString();
  } catch (e) {
    return "?";
  }
}

// Identitas fighter: cache tick dulu (kill.ts pattern), fallback baca memori.
function resolveFighter(ptr: NativePointer | null): KillParticipant | null {
  try {
    if (!ptr || ptr.isNull()) return null;
    const direct = describeFighter(ptr);
    if (!direct) return null;
    const cached = lookupFighterByGuid(direct.guid);
    return cached ?? direct;
  } catch (e) {
    return null;
  }
}

function fmtFighter(label: string, ptr: NativePointer | null): string {
  const info = ptr ? resolveFighter(ptr) : null;
  const cls = getClassName(ptr);
  if (!info) return `${label}(${cls})@${fmtPtr(ptr)} = <unresolved>`;
  return (
    `${label}(${cls})@${fmtPtr(ptr)} = ` +
    `{guid:${info.guid}, accId:${info.accId}, name:"${info.name}", ` +
    `heroid:${info.heroid}, ipos:${info.ipos}, team:${info.team}}`
  );
}

function fmtBacktrace(context: any): string {
  try {
    const frames = Thread.backtrace(context, Backtracer.ACCURATE);
    const lines: string[] = [];
    const n = Math.min(frames.length, MAX_TRACE_FRAMES);
    for (let i = 0; i < n; i++) {
      try {
        const addr: NativePointer | undefined = frames[i];
        if (!addr) continue;
        const m = Process.findModuleByAddress(addr);
        const off = m ? addr.sub(m.base) : addr;
        lines.push(`    #${i} ${m ? m.name : "?"}+${off}`);
      } catch (e) {}
    }
    return lines.length > 0 ? lines.join("\n") : "    <no frames>";
  } catch (e) {
    return "    <backtrace unavailable>";
  }
}

function onBossEvent(this: InvocationContext, args: any): void {
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
    const toU32 = (a: any): number => {
      try {
        return a ? (a as NativePointer).toInt32() >>> 0 : 0;
      } catch (e) {
        return 0;
      }
    };

    const thisPtr = toPtr(args[0]);
    const killerPtr = toPtr(args[1]);
    const deaderPtr = toPtr(args[2]);
    const eventType = toU32(args[3]);
    const steal = toU32(args[4]) !== 0;
    const bossKind = resolveBossKind(deaderPtr);
    const deaderClass = getClassName(deaderPtr);

    const ts = getIndonesianDateTime();
    const header =
      `[BossTrace] [${ts}] System.Void CompetitionData::${TARGET_METHOD} ` +
      `(LogicFighter killer, LogicFighter deader, UInt32 eventType, Boolean steal) called`;
    const body =
      `  this=${fmtPtr(thisPtr)}\n` +
      `  ${fmtFighter("killer", killerPtr)}\n` +
      `  ${fmtFighter("deader", deaderPtr)}\n` +
      `  eventType=${eventType} steal=${steal}\n` +
      `  backtrace:\n${fmtBacktrace(this.context)}`;
    debugLog("BossTrace", `${header}\n${body}`);

    // Event untuk notifikasi overlay (seperti mlbb_kill_event).
    let t = 0;
    try {
      if (getMatchTimeMs) t = Math.floor(Number((getMatchTimeMs as any)()) / 1000);
    } catch (e) {}
    const event: BossEvent = {
      killer: resolveFighter(killerPtr),
      deader: resolveFighter(deaderPtr),
      deaderClass,
      bossKind,
      eventType,
      steal,
      t,
    };
    debugSend(JSON.stringify({ type: "mlbb_boss_event", event }));
  } catch (e) {}
}

export function setupBossHook(
  kCompetitionData: NativePointer,
  kTortoise?: NativePointer,
  kBoss?: NativePointer,
): void {
  if (kTortoise && !kTortoise.isNull()) kTortoiseRef = kTortoise;
  if (kBoss && !kBoss.isNull()) kBossRef = kBoss;
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
    const hooked = new Set<string>();
    let found = 0;
    while (
      !(methodPtr = il2cppApi.class_get_methods(kCompetitionData, iter)).isNull()
    ) {
      const namePtr: NativePointer = il2cppApi.method_get_name!(methodPtr);
      if (!namePtr || namePtr.isNull()) continue;
      if (namePtr.readUtf8String() !== TARGET_METHOD) continue;
      const impl = methodPtr.readPointer();
      if (!impl || impl.isNull()) continue;
      const key = impl.toString();
      if (hooked.has(key)) continue;
      hooked.add(key);
      try {
        Interceptor.attach(impl, { onEnter: onBossEvent });
        found++;
      } catch (e) {}
    }
    if (found > 0) {
      debugLog(
        "BossTrace",
        `${TARGET_METHOD} hooked on CompetitionData (${found} overload(s)) — trace ala Il2Cpp.trace(true) aktif.`,
      );
    } else {
      debugLog("BossTrace", `${TARGET_METHOD} method not found.`);
    }
  } catch (e) {}
}
