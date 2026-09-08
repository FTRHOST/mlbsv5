import { startStealthBootstrap, type MappedClasses } from "./core/loader.js";
import { setupDeathHook } from "./hooks/death.js";
import { setupDraftHooks } from "./hooks/draft.js";
import { setupMatchHooks } from "./hooks/match.js";
import { setupObjectiveHook } from "./hooks/objective.js";
import { setupPlayerHooks } from "./hooks/player.js";
import { setupVersionHook } from "./hooks/version.js";
import { debugLog } from "./utils/logger.js";
import { startTelemetryBroadcaster } from "./utils/scheduler.js";

debugLog("Bootstrap", "Memulai Frida Il2Cpp Stealth Agent...");

startStealthBootstrap((classes: MappedClasses) => {
  setupDraftHooks(classes.kUIRankHero);
  setupVersionHook(classes.kGameMain);
  setupDeathHook(classes.kBattleManager);
  setupObjectiveHook(classes.kLogicManager, classes.kTortoise, classes.kBoss);
  setupMatchHooks(classes.kEndCtrl, classes.kTimerBase, classes.kLogicFightData, classes.kLogicManager);
  setupPlayerHooks({
    kSystemData: classes.kSystemData,
    kLogicManager: classes.kLogicManager,
  });
  startTelemetryBroadcaster(classes);
});
