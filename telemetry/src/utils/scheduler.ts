import { getCachedUtf8String, getMethodNative, getOffset, il2cppApi } from "../core/api.js";
import type { MappedClasses } from "../core/loader.js";
import { draftState, resetDraftState } from "../hooks/draft.js";
import { getMapDraw } from "../hooks/mapdraw.js";
import { extractMatchData, resetMatchDataState } from "../hooks/match.js";
import { resetPickState } from "../hooks/pick.js";
import { extractPlayerData } from "../hooks/player.js";
import type { TelemetryPayload } from "../types/telemetry.js";
import { debugLog } from "./logger.js";

let lastGameState = 0;
const persistentInstPtr = Memory.alloc(Process.pointerSize);
let offBattleState = -1;

export function startTelemetryBroadcaster(classes: MappedClasses): void {
  let getBattleStateFunc: NativeFunction<number, []> | null = null;

  if (classes.kLogicManager && !classes.kLogicManager.isNull()) {
    offBattleState = getOffset(classes.kLogicManager, "_m_eState");
    if (offBattleState <= 0) offBattleState = getOffset(classes.kLogicManager, "m_eState");

    if (offBattleState <= 0) {
      getBattleStateFunc = getMethodNative(
        classes.kLogicManager,
        "GetBattleState",
        0,
        "int",
        ["pointer"],
      );
    }
  }

  const instanceStrPtr = getCachedUtf8String("Instance");
  const logicInstanceField =
    classes.kLogicManager && !classes.kLogicManager.isNull() && il2cppApi.class_get_field_from_name
      ? il2cppApi.class_get_field_from_name(
          classes.kLogicManager,
          instanceStrPtr,
        )
      : null;

  debugLog("Scheduler", "Broadcaster telemetry real-time telah diaktifkan (Mode Pasif Memori).");

  const tick = () => {
    try {
      let state = 0;
      let mgrInst: NativePointer | null = null;
      if (logicInstanceField && !logicInstanceField.isNull() && il2cppApi.field_static_get_value) {
        il2cppApi.field_static_get_value(logicInstanceField, persistentInstPtr);
        const inst = persistentInstPtr.readPointer();
        if (inst && !inst.isNull()) {
          mgrInst = inst;
          if (offBattleState > 0) {
            state = inst.add(offBattleState).readInt();
          } else if (getBattleStateFunc) {
            state = Number((getBattleStateFunc as any)(inst));
          }
        }
      }

      // Auto-reset pada match baru (State 8)
      if (state === 8 && lastGameState !== 8) {
        debugLog("Scheduler", "Resetting telemetry state for new match...");
        resetDraftState();
        resetPickState();
        resetMatchDataState();
      }

      if (state >= 4) {
        draftState.currentDraftPhase = "IN_GAME";
      }
      lastGameState = state;

      const players = extractPlayerData(classes.kLogicManager, state, draftState);
      const battleData = extractMatchData(
        classes.kShowFightData,
        classes.kLogicFightData,
        state,
        classes.kLogicManager,
      );

      const payload: TelemetryPayload = {
        gameState: state,
        draftPhase: draftState.currentDraftPhase,
        draftTimer: draftState.draftTimeLeft,
        mapDraw: getMapDraw(mgrInst),
        players: players,
        Battle: battleData,
      };

      send(JSON.stringify({ type: "mlbb_live_data", payload: payload }));
    } catch (e) {}

    // Interval jitter: 1000ms ± 50ms (950ms - 1050ms) to bypass fixed-interval polling detection
    const jitter = Math.floor(Math.random() * 100) - 50;
    setTimeout(tick, 1000 + jitter);
  };

  setTimeout(tick, 1000);
}
