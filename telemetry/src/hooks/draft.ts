import { getFirstPosFromList, il2cppApi } from "../core/api.js";
import type { DraftState } from "../types/draft.js";
import { debugLog } from "../utils/logger.js";

export const draftState: DraftState = {
  currentDraftPhase: "IDLE",
  draftTimeLeft: 0,
  bannedTeamA: [],
  bannedTeamB: [],
  lockedHeroesSet: new Set<number>(),
};

export const playerBanMap = new Map<number, number>();

let draftTimerInterval: any = null;

export function startOrSyncTimer(seconds: number): void {
  if (!draftTimerInterval || Math.abs(draftState.draftTimeLeft - seconds) > 1) {
    if (draftTimerInterval) clearInterval(draftTimerInterval);
    draftState.draftTimeLeft = seconds;
    draftTimerInterval = setInterval(() => {
      if (draftState.draftTimeLeft > 0) draftState.draftTimeLeft--;
      else {
        clearInterval(draftTimerInterval);
        draftTimerInterval = null;
      }
    }, 1000);
  }
}

export function resetDraftState(): void {
  draftState.bannedTeamA = [];
  draftState.bannedTeamB = [];
  draftState.lockedHeroesSet.clear();
  draftState.currentDraftPhase = "WAITING / IDLE";
  draftState.draftTimeLeft = 0;
  playerBanMap.clear();
  if (draftTimerInterval) {
    clearInterval(draftTimerInterval);
    draftTimerInterval = null;
  }
}

const TARGET_DRAFT_METHODS = new Set<string>([
  "StartTogetherBan",
  "ShowBanning",
  "ReceStartSecondBanState",
  "ShowPicking",
  "ReceStartSecondPickState",
  "ShowChangeHero",
  "ReceStartChange",
  "ShowBanPickCtrlTime",
  "ShowBanned",
  "ConfirmHero",
]);

export function setupDraftHooks(kUIRankHero: NativePointer): void {
  if (!kUIRankHero || kUIRankHero.isNull() || !il2cppApi.class_get_methods) return;

  try {
    let iter = Memory.alloc(Process.pointerSize).writePointer(NULL);
    let methodPtr: NativePointer;

    while (!(methodPtr = il2cppApi.class_get_methods(kUIRankHero, iter)).isNull()) {
      const namePtr: NativePointer = il2cppApi.method_get_name!(methodPtr);
      if (!namePtr || namePtr.isNull()) continue;

      const name = namePtr.readUtf8String();
      if (!name || !TARGET_DRAFT_METHODS.has(name)) continue;

      const impl = methodPtr.readPointer();
      if (!impl || impl.isNull()) continue;

      try {
        Interceptor.attach(impl, {
          onEnter: function (args: any) {
            if (name === "StartTogetherBan") {
              draftState.currentDraftPhase = "BANNING";
              startOrSyncTimer(35);
            } else if (
              name === "ShowBanning" ||
              name === "ReceStartSecondBanState"
            ) {
              let iPos = args[2] ? getFirstPosFromList(args[2]) : -1;
              if (iPos >= 1 && iPos <= 5) draftState.currentDraftPhase = "BLUE BANNING";
              else if (iPos >= 6 && iPos <= 10) draftState.currentDraftPhase = "RED BANNING";
              else draftState.currentDraftPhase = "BANNING";

              let duration = args[1] ? args[1].toInt32() : 0;
              if (duration > 1000) duration = Math.floor(duration / 1000);
              startOrSyncTimer(duration > 0 && duration <= 100 ? duration : 30);
            } else if (
              name === "ShowPicking" ||
              name === "ReceStartSecondPickState"
            ) {
              let iPos = args[2] ? getFirstPosFromList(args[2]) : -1;
              if (iPos >= 1 && iPos <= 5) draftState.currentDraftPhase = "BLUE PICKING";
              else if (iPos >= 6 && iPos <= 10) draftState.currentDraftPhase = "RED PICKING";
              else draftState.currentDraftPhase = "PICKING";

              let duration = args[1] ? args[1].toInt32() : 0;
              if (duration > 1000) duration = Math.floor(duration / 1000);
              startOrSyncTimer(duration > 0 && duration <= 100 ? duration : 30);
            } else if (name === "ShowChangeHero" || name === "ReceStartChange") {
              draftState.currentDraftPhase = "PREPARATION";
              let duration = args[1] ? args[1].toInt32() : 0;
              if (duration > 1000) duration = Math.floor(duration / 1000);
              startOrSyncTimer(duration > 0 && duration <= 100 ? duration : 30);
            } else if (name === "ShowBanPickCtrlTime") {
              let remainTime = args[2] ? args[2].toInt32() : 0;
              if (remainTime > 1000) remainTime = Math.floor(remainTime / 1000);
              if (remainTime > 0 && remainTime <= 100) startOrSyncTimer(remainTime);
            } else if (name === "ShowBanned") {
              let heroId = args[1] ? args[1].toInt32() : 0;
              let iPos = args[2] ? args[2].toInt32() : 0;
              if (heroId > 0 && heroId <= 500) {
                playerBanMap.set(iPos, heroId);
                if (iPos >= 1 && iPos <= 5 && !draftState.bannedTeamA.includes(heroId)) {
                  draftState.bannedTeamA.push(heroId);
                  debugLog("Draft", `🔵 [ BAN BLUE ] -> Tim Biru (iPos ${iPos}) mem-ban ID ${heroId}`);
                } else if (
                  iPos >= 6 &&
                  iPos <= 10 &&
                  !draftState.bannedTeamB.includes(heroId)
                ) {
                  draftState.bannedTeamB.push(heroId);
                  debugLog("Draft", `🔴 [ BAN RED ]  -> Tim Merah (iPos ${iPos}) mem-ban ID ${heroId}`);
                }
              }
            } else if (name === "ConfirmHero") {
              let heroId = args[1] ? args[1].toInt32() : 0;
              if (heroId > 0 && heroId <= 500 && !draftState.lockedHeroesSet.has(heroId)) {
                draftState.lockedHeroesSet.add(heroId);
                debugLog("Draft", `✅ [ LOCK HERO ] -> Hero ID ${heroId} ter-lock`);
              }
            }
          },
        });
      } catch (e) {}
    }
  } catch (e) {}
}
