export interface KillParticipant {
  guid: number;
  accId: string;
  name: string;
  heroid: number;
  ipos: number;
  team: number;
}

export type KillTrigger =
  | "FIRST_BLOOD"
  | "SAVAGE"
  | "MANIAC"
  | "TRIPLE_KILL"
  | "KILL";

export interface KillEvent {
  killer: KillParticipant | null;
  deader: KillParticipant;
  assists: KillParticipant[];
  assistGuids: number[];
  trigger: KillTrigger;
  firstBlood: boolean;
  multKill: number;
  contiKill: number;
  eventType: number;
  t: number;
}
