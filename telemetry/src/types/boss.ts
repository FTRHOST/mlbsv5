import type { KillParticipant } from "./kill.js";

export type BossKind = "turtle" | "lord" | "unknown";

export interface BossEvent {
  killer: KillParticipant | null;
  deader: KillParticipant | null;
  /** Nama class C# deader (mis. LogicTortoise / LogicBoss). */
  deaderClass: string;
  bossKind: BossKind;
  eventType: number;
  steal: boolean;
  /** Waktu pertandingan (detik) saat event terjadi. */
  t: number;
}
