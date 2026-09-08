import { getCachedUtf8String, getOffset, il2cppApi } from "../core/api.js";
import type { BattleData } from "../types/match.js";
import { debugLog } from "../utils/logger.js";
import { isTurtleAlive, isLordAlive, refreshObjectives } from "./objective.js";
import { getVersionInGame } from "./version.js";

export let globalFightDataPtr: NativePointer | null = null;
export let getMatchTimeMs: NativeFunction<number, []> | null = null;
export let currentWinCamp = 0;

let fightDataOffsets: Record<string, number> = {};
let isFightOffsetsCached = false;
const persistentInstPtr = Memory.alloc(Process.pointerSize);

export function resetMatchDataState(): void {
  globalFightDataPtr = null;
  currentWinCamp = 0;
}

export function setupMatchHooks(
  kEndCtrl: NativePointer,
  kTimerBase: NativePointer,
  kLogicFightData?: NativePointer,
  kLogicManager?: NativePointer,
): void {
  // 1. Hook LogicBattleEndCtrl.StartEndBattle
  if (kEndCtrl && !kEndCtrl.isNull() && il2cppApi.class_get_methods) {
    try {
      let iter = Memory.alloc(Process.pointerSize).writePointer(NULL);
      let methodPtr: NativePointer;
      while (!(methodPtr = il2cppApi.class_get_methods(kEndCtrl, iter)).isNull()) {
        const namePtr: NativePointer = il2cppApi.method_get_name!(methodPtr);
        if (!namePtr || namePtr.isNull()) continue;
        const name = namePtr.readUtf8String();
        if (name === "StartEndBattle") {
          const impl = methodPtr.readPointer();
          if (impl && !impl.isNull()) {
            Interceptor.attach(impl, {
              onEnter: function (args: any) {
                const a1 = args[1] ? args[1].toInt32() : 0;
                const a2 = args[2] ? args[2].toInt32() : 0;
                let failCamp = a1 === 1 || a1 === 2 ? a1 : a2;
                if (failCamp === 1 || failCamp === 2) {
                  let winner = failCamp === 1 ? 2 : 1;
                  currentWinCamp = winner;
                  debugLog("Match", `[WinLog] Team yang menang: ${winner} (1:Blue, 2:Red)`);
                  send(
                    JSON.stringify({
                      type: "auto_match_result",
                      winnerCamp: winner,
                    }),
                  );
                }
              },
            });
          }
        }
      }
    } catch (e) {}
  }

  // 3. Obtain GetElapsedTimeSinceBattleStart offset or function safely
  if (kTimerBase && !kTimerBase.isNull() && il2cppApi.class_get_methods) {
    try {
      let iter = Memory.alloc(Process.pointerSize).writePointer(NULL);
      let methodPtr: NativePointer;
      while (!(methodPtr = il2cppApi.class_get_methods(kTimerBase, iter)).isNull()) {
        const namePtr: NativePointer = il2cppApi.method_get_name!(methodPtr);
        if (!namePtr || namePtr.isNull()) continue;
        const mName = namePtr.readUtf8String();
        if (mName === "GetElapsedTimeSinceBattleStart") {
          const impl = methodPtr.readPointer();
          if (impl && !impl.isNull()) {
            getMatchTimeMs = new NativeFunction(impl, "uint32", []);
          }
        }
      }
    } catch (e) {}
  }
}

export function tryFetchFightDataPtr(
  kShowFightData?: NativePointer,
  kLogicManager?: NativePointer,
): NativePointer | null {
  if (globalFightDataPtr && !globalFightDataPtr.isNull()) {
    return globalFightDataPtr;
  }

  // 1. Try ShowFightData.Instance
  if (kShowFightData && !kShowFightData.isNull() && il2cppApi.field_static_get_value) {
    try {
      const fieldInst = il2cppApi.class_get_field_from_name!(
        kShowFightData,
        getCachedUtf8String("Instance"),
      );
      if (fieldInst && !fieldInst.isNull()) {
        il2cppApi.field_static_get_value(fieldInst, persistentInstPtr);
        const showFightInstance = persistentInstPtr.readPointer();
        if (showFightInstance && !showFightInstance.isNull()) {
          globalFightDataPtr = showFightInstance;
          debugLog("Match", "[+] Pointer ShowFightData.Instance ditemukan pasif!");
          return globalFightDataPtr;
        }
      }
    } catch (e) {}
  }

  // 2. Fallback to LogicBattleManager.Instance
  if (kLogicManager && !kLogicManager.isNull() && il2cppApi.field_static_get_value) {
    try {
      const fieldInst = il2cppApi.class_get_field_from_name!(
        kLogicManager,
        getCachedUtf8String("Instance"),
      );
      if (fieldInst && !fieldInst.isNull()) {
        il2cppApi.field_static_get_value(fieldInst, persistentInstPtr);
        const mgrInstance = persistentInstPtr.readPointer();

        if (mgrInstance && !mgrInstance.isNull()) {
          const possibleFields = ["m_FightData", "m_LogicFightData", "m_fightData", "fightData"];
          for (const fname of possibleFields) {
            const off = getOffset(kLogicManager, fname);
            if (off > 0) {
              const ptrVal = mgrInstance.add(off).readPointer();
              if (ptrVal && !ptrVal.isNull()) {
                globalFightDataPtr = ptrVal;
                debugLog("Match", `[+] Pointer LogicFightData ditemukan via LogicBattleManager.${fname}`);
                return globalFightDataPtr;
              }
            }
          }
        }
      }
    } catch (e) {}
  }

  return null;
}

export function extractMatchData(
  kShowFightData: NativePointer,
  kLogicFightData: NativePointer,
  state: number,
  kLogicManager?: NativePointer,
): BattleData {
  const defaultBattle: BattleData = {
    battleState: state,
    versionInGame: getVersionInGame(),
    winCamp: currentWinCamp,
    waktuPertandingan: 0,
    blueTeamKill: 0,
    redTeamKill: 0,
    blueTeamGold: 0,
    redTeamGold: 0,
    blueTeamKillLord: 0,
    redTeamKillLord: 0,
    blueTeamKillTurtle: 0,
    redTeamKillTurtle: 0,
    turtleAlive: false,
    lordAlive: false,
    blueTeamDestroyTuret: 0,
    redTeamDestroyTuret: 0,
  };

  if (!globalFightDataPtr || globalFightDataPtr.isNull()) {
    tryFetchFightDataPtr(kShowFightData, kLogicManager);
  }

  // Refresh status Turtle/Lord tiap tick.
  try { refreshObjectives(); } catch (e) {}

  if (!globalFightDataPtr || globalFightDataPtr.isNull()) {
    return defaultBattle;
  }

  try {
    const targetKlass = kShowFightData && !kShowFightData.isNull() ? kShowFightData : kLogicFightData;

    if (!isFightOffsetsCached && targetKlass && !targetKlass.isNull()) {
      fightDataOffsets = {
        m_CampAKill: getOffset(targetKlass, "m_iCampAKill"),
        m_CampBKill: getOffset(targetKlass, "m_iCampBKill"),
        m_CampAGold: getOffset(targetKlass, "m_CampAGold"),
        m_CampBGold: getOffset(targetKlass, "m_CampBGold"),
        m_CampAKillTower: getOffset(targetKlass, "m_CampAKillTower"),
        m_CampBKillTower: getOffset(targetKlass, "m_CampBKillTower"),
        m_CampAKillTurtle: getOffset(targetKlass, "m_CampAKillShenGui"),
        m_CampBKillTurtle: getOffset(targetKlass, "m_CampBKillShenGui"),
        m_CampAKillLord: getOffset(targetKlass, "m_CampAKillLingZhu"),
        m_CampBKillLord: getOffset(targetKlass, "m_CampBKillLingZhu"),
      };

      if (fightDataOffsets.m_CampAKill! <= 0) fightDataOffsets.m_CampAKill = getOffset(targetKlass, "m_CampAKill");
      if (fightDataOffsets.m_CampAKill! <= 0) fightDataOffsets.m_CampAKill = getOffset(targetKlass, "<m_CampAKill>k__BackingField");

      if (fightDataOffsets.m_CampBKill! <= 0) fightDataOffsets.m_CampBKill = getOffset(targetKlass, "m_CampBKill");
      if (fightDataOffsets.m_CampBKill! <= 0) fightDataOffsets.m_CampBKill = getOffset(targetKlass, "<m_CampBKill>k__BackingField");

      if (fightDataOffsets.m_CampAGold! <= 0) fightDataOffsets.m_CampAGold = getOffset(targetKlass, "<m_CampAGold>k__BackingField");
      if (fightDataOffsets.m_CampBGold! <= 0) fightDataOffsets.m_CampBGold = getOffset(targetKlass, "<m_CampBGold>k__BackingField");

      if (fightDataOffsets.m_CampAKillTower! <= 0) fightDataOffsets.m_CampAKillTower = getOffset(targetKlass, "<m_CampAKillTower>k__BackingField");
      if (fightDataOffsets.m_CampBKillTower! <= 0) fightDataOffsets.m_CampBKillTower = getOffset(targetKlass, "<m_CampBKillTower>k__BackingField");

      if (fightDataOffsets.m_CampAKillTurtle! <= 0) fightDataOffsets.m_CampAKillTurtle = getOffset(targetKlass, "<m_CampAKillShenGui>k__BackingField");
      if (fightDataOffsets.m_CampBKillTurtle! <= 0) fightDataOffsets.m_CampBKillTurtle = getOffset(targetKlass, "<m_CampBKillShenGui>k__BackingField");

      if (fightDataOffsets.m_CampAKillLord! <= 0) fightDataOffsets.m_CampAKillLord = getOffset(targetKlass, "<m_CampAKillLingZhu>k__BackingField");
      if (fightDataOffsets.m_CampBKillLord! <= 0) fightDataOffsets.m_CampBKillLord = getOffset(targetKlass, "<m_CampBKillLingZhu>k__BackingField");

      if (fightDataOffsets.m_CampAGold! <= 0 && kLogicFightData && !kLogicFightData.isNull()) {
        fightDataOffsets.m_CampAKill = getOffset(kLogicFightData, "<m_CampAKill>k__BackingField");
        fightDataOffsets.m_CampBKill = getOffset(kLogicFightData, "<m_CampBKill>k__BackingField");
        fightDataOffsets.m_CampAGold = getOffset(kLogicFightData, "<m_CampAGold>k__BackingField");
        fightDataOffsets.m_CampBGold = getOffset(kLogicFightData, "<m_CampBGold>k__BackingField");
        fightDataOffsets.m_CampAKillTower = getOffset(kLogicFightData, "<m_CampAKillTower>k__BackingField");
        fightDataOffsets.m_CampBKillTower = getOffset(kLogicFightData, "<m_CampBKillTower>k__BackingField");
        fightDataOffsets.m_CampAKillTurtle = getOffset(kLogicFightData, "<m_CampAKillShenGui>k__BackingField");
        fightDataOffsets.m_CampBKillTurtle = getOffset(kLogicFightData, "<m_CampBKillShenGui>k__BackingField");
        fightDataOffsets.m_CampAKillLord = getOffset(kLogicFightData, "<m_CampAKillLingZhu>k__BackingField");
        fightDataOffsets.m_CampBKillLord = getOffset(kLogicFightData, "<m_CampBKillLingZhu>k__BackingField");
      }

      isFightOffsetsCached = true;
    }

    let timeMs = 0;
    if (state >= 4 && getMatchTimeMs) {
      try {
        timeMs = getMatchTimeMs();
      } catch (eTime) {}
    }

    const readVal = (offKey: string, isU32: boolean = true): number => {
      const off = fightDataOffsets[offKey];
      if (off !== undefined && off > 0) {
        return isU32
          ? globalFightDataPtr!.add(off).readU32()
          : globalFightDataPtr!.add(off).readInt();
      }
      return 0;
    };

    return {
      battleState: state,
      versionInGame: getVersionInGame(),
      winCamp: currentWinCamp,
      waktuPertandingan: Math.floor(timeMs / 1000),
      blueTeamKill: readVal("m_CampAKill", false),
      redTeamKill: readVal("m_CampBKill", false),
      blueTeamGold: readVal("m_CampAGold", true),
      redTeamGold: readVal("m_CampBGold", true),
      blueTeamKillLord: readVal("m_CampAKillLord", true),
      redTeamKillLord: readVal("m_CampBKillLord", true),
      blueTeamKillTurtle: readVal("m_CampAKillTurtle", true),
      redTeamKillTurtle: readVal("m_CampBKillTurtle", true),
      turtleAlive: isTurtleAlive(),
      lordAlive: isLordAlive(),
      blueTeamDestroyTuret: readVal("m_CampAKillTower", true),
      redTeamDestroyTuret: readVal("m_CampBKillTower", true),
    };
  } catch (e) {
    return defaultBattle;
  }
}
