import type { KillEvent } from "./kill.js";
import type { BattleData } from "./match.js";
import type { PlayerData } from "./player.js";

export interface TelemetryPayload {
  gameState: number;
  draftPhase: string;
  draftTimer: number;
  mapDraw: number;
  players: PlayerData[];
  Battle: BattleData;
}

export type TelemetryEvent =
  | { type: "mlbb_live_data"; payload: TelemetryPayload }
  | { type: "auto_match_result"; winnerCamp: number }
  | { type: "mlbb_kill_event"; event: KillEvent };
