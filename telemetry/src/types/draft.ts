export interface DraftBans {
  teamA: number[]; // Team Blue (iPos 1-5)
  teamB: number[]; // Team Red (iPos 6-10)
}

export interface DraftState {
  currentDraftPhase: string;
  draftTimeLeft: number;
  bannedTeamA: number[];
  bannedTeamB: number[];
  lockedHeroesSet: Set<number>;
}
