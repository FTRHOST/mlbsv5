export interface BattleData {
  battleState: number | string;
  versionInGame: string;
  winCamp: number;
  waktuPertandingan: number;
  blueTeamKill: number;
  redTeamKill: number;
  blueTeamGold: number;
  redTeamGold: number;
  blueTeamKillLord: number;
  redTeamKillLord: number;
  blueTeamKillTurtle: number;
  redTeamKillTurtle: number;
  turtleAlive: boolean;
  lordAlive: boolean;
  blueTeamDestroyTuret: number;
  redTeamDestroyTuret: number;
}
