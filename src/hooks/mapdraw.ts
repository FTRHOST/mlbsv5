import { getMethodNative } from "../core/api.js";
import { debugLog } from "../utils/logger.js";

// Nilai feature-flag peta (mapDraw) dari LogicBattleManager.get_m_iNext2025Feature.
// Stealth: TANPA Interceptor. Getter sekeluarga terbukti hot-path (ratusan
// call, lihat log.txt), jadi cukup satu NativeFunction call per tick
// broadcaster — pola yang sama seperti GetBattleState/GetElapsedTimeSinceBattleStart.

let getMapDrawFunc: NativeFunction<number, []> | null = null;

export function setupMapDrawHook(kLogicManager: NativePointer): void {
  if (!kLogicManager || kLogicManager.isNull()) return;
  try {
    getMapDrawFunc = getMethodNative(
      kLogicManager,
      "get_m_iNext2025Feature",
      0,
      "uint32",
      ["pointer"],
    );
    if (getMapDrawFunc) {
      debugLog("MapDraw", "get_m_iNext2025Feature resolved (native call per tick).");
    } else {
      debugLog("MapDraw", "get_m_iNext2025Feature not found, mapDraw defaults to 0.");
    }
  } catch (e) {}
}

// mgrInstance = LogicBattleManager.Instance yang sudah dibaca scheduler.
export function getMapDraw(mgrInstance: NativePointer | null): number {
  if (!mgrInstance || mgrInstance.isNull() || !getMapDrawFunc) return 0;
  try {
    const v = Number((getMapDrawFunc as any)(mgrInstance));
    return Number.isFinite(v) && v >= 0 ? Math.floor(v) : 0;
  } catch (e) {
    return 0;
  }
}
