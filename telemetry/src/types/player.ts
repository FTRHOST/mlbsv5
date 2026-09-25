export interface EmblemSkill {
  slot: number;
  id: number;
}

export interface PlayerData {
  ipos: number;
  id: string;
  name: string;
  role: number;
  team: number;
  heroid: number;
  uiHeroIDChoose: number;
  battleSpell: number;
  emblem: number;
  emblemSkills: EmblemSkill[];
  pickPhase: boolean;
  banPhase: boolean;
  SelHeroID: number;
  banHero: number;
  hp: number;
  maxHp: number;
  level: number;
  deathTime: number;
  kill: number;
  dead: number;
  assist: number;
  ultActive: boolean;
  equips: number[];
  totalGold: number;
  damageDealt: number;
  damageTaken: number;
}
