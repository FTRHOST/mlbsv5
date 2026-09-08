import {
  getCachedUtf8String,
  getMethodNative,
  getMethodNativeHierarchy,
  getOffset,
  il2cppApi,
  readCsharpString,
} from "../core/api.js";
import { getDeathSpanMs, refreshDeathSpans } from "./death.js";
import { playerBanMap } from "./draft.js";
import { getMatchTimeMs } from "./match.js";
import type { EmblemSkill, PlayerData } from "../types/player.js";

let roomDataOffsets: Record<string, number> = {};
let isRoomOffsetsCached = false;

let logicPlayerOffsets: Record<string, number> = {};
let isLogicPlayerOffsetsCached = false;

let getInfoFunc: NativeFunction<any, any> | null = null;
let getEquipListFunc: NativeFunction<any, any> | null = null;

const persistentInstPtr = Memory.alloc(Process.pointerSize);

// Cache offset rantai ultimate (learned + cooldown) agar resolve sekali saja.
let ultOffsets: Record<string, number> = {
  m_OwnSkillComp: -1,
  m_SkillComp: -1,
  m_BigSkillID: -1,
  m_BigSkillIDs: -1,
  m_BigSkillData: -1,
  m_bLearned: -1,
  m_CoolDownComp: -1,
  m_DicCoolInfo: -1,
  m_isCoolDown: -1,
  uiStartTime: -1,
  uiCoolTime: -1,
};
let isUltSubOffsetsResolved = false;

function readIntList(listPtr: NativePointer, maxItems: number): number[] {
  const out: number[] = [];
  if (!listPtr || listPtr.isNull()) return out;
  try {
    const count = listPtr
      .add(Process.pointerSize === 8 ? 0x18 : 0x0c)
      .readInt();
    const itemsArray = listPtr
      .add(Process.pointerSize === 8 ? 0x10 : 0x08)
      .readPointer();
    if (!itemsArray || itemsArray.isNull() || count <= 0 || count > 64)
      return out;
    const header = Process.pointerSize === 8 ? 0x20 : 0x10;
    const n = Math.min(count, maxItems);
    for (let i = 0; i < n; i++) {
      try {
        out.push(itemsArray.add(header + i * 4).readInt());
      } catch (e) {}
    }
  } catch (e) {}
  return out;
}

function resolveUltSubOffsets(
  ownSkillCompPtr: NativePointer | null,
  skillCompPtr: NativePointer | null,
  cdCompPtr: NativePointer | null,
  cdDataSample: NativePointer | null,
): void {
  if (isUltSubOffsetsResolved || !il2cppApi.object_get_class) return;
  try {
    if (ownSkillCompPtr && !ownSkillCompPtr.isNull()) {
      const kOwn = il2cppApi.object_get_class(ownSkillCompPtr);
      if (kOwn && !kOwn.isNull()) {
        if (ultOffsets.m_BigSkillID! <= 0)
          ultOffsets.m_BigSkillID = getOffset(kOwn, "m_BigSkillID");
        if (ultOffsets.m_BigSkillIDs! <= 0)
          ultOffsets.m_BigSkillIDs = getOffset(kOwn, "m_BigSkillIDs");
        if (ultOffsets.m_BigSkillData! <= 0)
          ultOffsets.m_BigSkillData = getOffset(kOwn, "m_BigSkillData");
        if (ultOffsets.m_BigSkillData! > 0) {
          try {
            const bigData = ownSkillCompPtr
              .add(ultOffsets.m_BigSkillData!)
              .readPointer();
            if (bigData && !bigData.isNull()) {
              const kBigData = il2cppApi.object_get_class(bigData);
              if (
                kBigData &&
                !kBigData.isNull() &&
                ultOffsets.m_bLearned! <= 0
              ) {
                ultOffsets.m_bLearned = getOffset(kBigData, "m_bLearned");
              }
            }
          } catch (e) {}
        }
      }
    }
    if (skillCompPtr && !skillCompPtr.isNull()) {
      const kSkill = il2cppApi.object_get_class(skillCompPtr);
      if (kSkill && !kSkill.isNull() && ultOffsets.m_CoolDownComp! <= 0) {
        ultOffsets.m_CoolDownComp = getOffset(kSkill, "m_CoolDownComp");
      }
    }
    if (cdCompPtr && !cdCompPtr.isNull()) {
      const kCd = il2cppApi.object_get_class(cdCompPtr);
      if (kCd && !kCd.isNull() && ultOffsets.m_DicCoolInfo! <= 0) {
        ultOffsets.m_DicCoolInfo = getOffset(kCd, "m_DicCoolInfo");
      }
    }
    if (cdDataSample && !cdDataSample.isNull()) {
      const kData = il2cppApi.object_get_class(cdDataSample);
      if (kData && !kData.isNull()) {
        if (ultOffsets.m_isCoolDown! <= 0)
          ultOffsets.m_isCoolDown = getOffset(kData, "m_isCoolDown");
        if (ultOffsets.uiStartTime! <= 0)
          ultOffsets.uiStartTime = getOffset(kData, "uiStartTime");
        if (ultOffsets.uiCoolTime! <= 0)
          ultOffsets.uiCoolTime = getOffset(kData, "uiCoolTime");
      }
    }
    if (
      ultOffsets.m_BigSkillID! > 0 &&
      ultOffsets.m_CoolDownComp! > 0 &&
      ultOffsets.m_DicCoolInfo! > 0 &&
      ultOffsets.m_isCoolDown! > 0
    ) {
      isUltSubOffsetsResolved = true;
    }
  } catch (e) {}
}

// true = ulti sudah dipelajari DAN off-cooldown (aturan ANY-ready untuk multi-ulti).
// Sumber learned utama: OwnSkillData.m_bLearned. greenLightCanUse hanya fallback
// bila info learned tak tersedia (green terbukti bisa 0 walau sudah learned).
function isUltReady(logicPlayerPtr: NativePointer): boolean {
  try {
    if (!logicPlayerPtr || logicPlayerPtr.isNull()) return false;

    const offOwn = ultOffsets.m_OwnSkillComp ?? -1;
    const offSkill = ultOffsets.m_SkillComp ?? -1;
    if (offOwn <= 0 || offSkill <= 0) return false;

    let ownPtr: NativePointer | null = null;
    let skillPtr: NativePointer | null = null;
    try {
      ownPtr = logicPlayerPtr.add(offOwn).readPointer();
      skillPtr = logicPlayerPtr.add(offSkill).readPointer();
    } catch (e) {
      return false;
    }
    if (!ownPtr || ownPtr.isNull() || !skillPtr || skillPtr.isNull())
      return false;

    // Resolve sub-offset (m_BigSkillID, m_CoolDownComp, dst.) segera setelah pointer
    // comp tersedia. Tanpa ini kandidat selalu kosong dan hasil selalu false.
    if (!isUltSubOffsetsResolved) {
      resolveUltSubOffsets(ownPtr, skillPtr, null, null);
    }

    // Kumpulkan kandidat big skill ID (utama + varian). ANY-ready.
    const candidates = new Set<number>();
    try {
      const offBig = ultOffsets.m_BigSkillID ?? -1;
      if (offBig > 0) {
        const bigId = ownPtr.add(offBig).readInt();
        if (bigId > 0) candidates.add(bigId);
      }
    } catch (e) {}
    try {
      const offBigs = ultOffsets.m_BigSkillIDs ?? -1;
      if (offBigs > 0) {
        const listPtr = ownPtr.add(offBigs).readPointer();
        for (const id of readIntList(listPtr, 8)) {
          if (id > 0) candidates.add(id);
        }
      }
    } catch (e) {}
    if (candidates.size === 0) return false;

    // Gate learned: m_bLearned pada m_BigSkillData. Tidak learned -> false.
    // greenLightCanUse hanya dipakai bila m_bLearned tak bisa dibaca.
    let learnedInfo = false;
    try {
      const offBigData = ultOffsets.m_BigSkillData ?? -1;
      const offLearned = ultOffsets.m_bLearned ?? -1;
      if (offBigData > 0 && offLearned > 0) {
        const bigData = ownPtr.add(offBigData).readPointer();
        if (bigData && !bigData.isNull()) {
          learnedInfo = true;
          if (bigData.add(offLearned).readU8() === 0) return false;
        }
      }
    } catch (e) {}
    if (!learnedInfo) {
      const offGreen = logicPlayerOffsets.greenLightCanUse ?? -1;
      if (offGreen > 0) {
        try {
          learnedInfo = true;
          if (logicPlayerPtr.add(offGreen).readU8() === 0) return false;
        } catch (e) {}
      }
    }
    if (!learnedInfo) return false;

    // Ambil CoolDownComp + dictionary cooldown.
    let cdPtr: NativePointer | null = null;
    try {
      let offCd = ultOffsets.m_CoolDownComp ?? -1;
      if (offCd <= 0) {
        resolveUltSubOffsets(ownPtr, skillPtr, null, null);
        offCd = ultOffsets.m_CoolDownComp ?? -1;
        if (offCd <= 0) return false;
      }
      cdPtr = skillPtr.add(offCd).readPointer();
    } catch (e) {
      return false;
    }
    if (!cdPtr || cdPtr.isNull()) return false;

    let dictPtr: NativePointer | null = null;
    try {
      let offDict = ultOffsets.m_DicCoolInfo ?? -1;
      if (offDict <= 0) {
        resolveUltSubOffsets(ownPtr, skillPtr, cdPtr, null);
        offDict = ultOffsets.m_DicCoolInfo ?? -1;
        if (offDict <= 0) return false;
      }
      dictPtr = cdPtr.add(offDict).readPointer();
    } catch (e) {
      return false;
    }
    // Tidak ada dictionary = tidak ada cooldown tercatat = ready.
    if (!dictPtr || dictPtr.isNull()) return true;

    // Scan Dictionary<int, CoolDownData>: entry 24-byte, key int +8, value ptr +16.
    try {
      const entriesPtr = dictPtr
        .add(Process.pointerSize === 8 ? 0x18 : 0x0c)
        .readPointer();
      let count = dictPtr
        .add(Process.pointerSize === 8 ? 0x20 : 0x10)
        .readInt();
      if (!entriesPtr || entriesPtr.isNull()) return true;
      if (count < 0 || count > 128) return true;
      if (count === 0) return true;
      const header = Process.pointerSize === 8 ? 0x20 : 0x10;
      const offCdFlag = ultOffsets.m_isCoolDown ?? -1;
      const scanCount = Math.min(count, 64);
      // Kumpulkan value sample untuk resolve offset bila belum ada.
      if (offCdFlag <= 0) {
        for (let i = 0; i < scanCount; i++) {
          try {
            const v = entriesPtr
              .add(header + i * 24)
              .add(16)
              .readPointer();
            if (v && !v.isNull()) {
              resolveUltSubOffsets(ownPtr, skillPtr, cdPtr, v);
              break;
            }
          } catch (e) {}
        }
      }
      const cachedFlagOff = ultOffsets.m_isCoolDown ?? -1;
      const flagOff = cachedFlagOff > 0 ? cachedFlagOff : 0x20;
      const cachedStartOff = ultOffsets.uiStartTime ?? -1;
      const startOff = cachedStartOff > 0 ? cachedStartOff : 0x1c;
      const cachedCoolOff = ultOffsets.uiCoolTime ?? -1;
      const coolOff = cachedCoolOff > 0 ? cachedCoolOff : 0x14;
      // Waktu pertandingan kini (ms). Flag m_isCoolDown terbukti tak selalu
      // ter-set saat cooldown berjalan, jadi hitung juga dari uiStartTime+uiCoolTime.
      const readNow = (): number => {
        try {
          if (getMatchTimeMs) return Number((getMatchTimeMs as any)());
        } catch (e) {}
        return -1;
      };
      const isEntryCooling = (vPtr: NativePointer): boolean => {
        try {
          if (!vPtr || vPtr.isNull()) return false;
          if (vPtr.add(flagOff > 0 ? flagOff : 0x20).readU8() !== 0)
            return true;
          const now = readNow();
          if (now < 0) return false;
          const start = vPtr.add(startOff > 0 ? startOff : 0x1c).readU32();
          const cool = vPtr.add(coolOff > 0 ? coolOff : 0x14).readU32();
          return cool > 0 && start + cool > (now as number);
        } catch (e) {
          return false;
        }
      };
      // Dictionary hidup dan bisa berubah saat game thread update; baca ulang
      // segar tiap attempt agar satu bacaan robek tak menghasilkan true sesaat.
      for (const spellId of candidates) {
        let confirmedReady = false;
        for (let attempt = 0; attempt < 2 && !confirmedReady; attempt++) {
          let vPtr: NativePointer | null = null;
          try {
            const ePtr = dictPtr
              .add(Process.pointerSize === 8 ? 0x18 : 0x0c)
              .readPointer();
            const cnt = dictPtr
              .add(Process.pointerSize === 8 ? 0x20 : 0x10)
              .readInt();
            if (ePtr && !ePtr.isNull() && cnt > 0 && cnt <= 128) {
              const n = Math.min(cnt, 64);
              for (let i = 0; i < n; i++) {
                try {
                  const entry = ePtr.add(header + i * 24);
                  if (entry.add(8).readInt() !== spellId) continue;
                  const v = entry.add(16).readPointer();
                  if (v && !v.isNull()) vPtr = v;
                  break;
                } catch (e) {}
              }
            }
          } catch (e) {}
          // Tanpa entry = tidak cooldown. Konfirmasi sekali lagi sebelum
          // menyatakan siap agar resize dictionary sesaat tak jadi false-negative.
          if (!vPtr || vPtr.isNull()) {
            if (attempt === 0) continue;
            return true;
          }
          // Entry ada tapi tak cooling: baca ulang sekali untuk konfirmasi.
          if (!isEntryCooling(vPtr)) {
            if (attempt === 0) continue;
            confirmedReady = true;
          } else {
            break;
          }
        }
        if (confirmedReady) return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  } catch (e) {
    return false;
  }
}

// Normalisasi iPos RoomData ke slot global 1..10.
// Mode vs-AI memakai penomoran per-camp 0..4 (0 = pemain pertama,
// biasanya self): blue 0..4 -> slot 1..5, red 0..4 -> slot 6..10.
// Normal match memakai 1..5 / 6..10 global (lolos apa adanya).
function normalizeRoomPos(
  rawPos: number,
  camp: number,
  used: Set<number>,
  blueGlobal: boolean,
): number {
  const lo = camp === 2 ? 6 : 1;
  const hi = camp === 2 ? 10 : 5;
  let slot = -1;
  if (camp === 2) {
    if (rawPos >= 0 && rawPos <= 4) slot = rawPos + 6;
    else if (rawPos >= 6 && rawPos <= 10) slot = rawPos;
  } else {
    if (blueGlobal) {
      if (rawPos >= 1 && rawPos <= 5) slot = rawPos;
    } else {
      if (rawPos >= 0 && rawPos <= 4) slot = rawPos + 1;
    }
  }
  if (slot >= lo && slot <= hi && !used.has(slot)) return slot;
  // Slot tabrakan / di luar range: cari slot bebas di range tim.
  for (let s = lo; s <= hi; s++) {
    if (!used.has(s)) return s;
  }
  return -1;
}

function readPointerList(listPtr: NativePointer): NativePointer[] {
  const result: NativePointer[] = [];
  if (!listPtr || listPtr.isNull()) return result;
  try {
    const countOff = Process.pointerSize === 8 ? 0x18 : 0x0c;
    const itemsOff = Process.pointerSize === 8 ? 0x10 : 0x08;
    const count = listPtr.add(countOff).readInt();
    const itemsArray = listPtr.add(itemsOff).readPointer();
    if (itemsArray && !itemsArray.isNull() && count > 0 && count <= 50) {
      const header = Process.pointerSize === 8 ? 0x20 : 0x10;
      for (let i = 0; i < count; i++) {
        const item = itemsArray
          .add(header + i * Process.pointerSize)
          .readPointer();
        if (item && !item.isNull()) {
          result.push(item);
        }
      }
    }
  } catch (e) {}
  return result;
}

export function setupPlayerHooks(classes: {
  kSystemData: NativePointer;
  kLogicManager: NativePointer;
}): void {
  if (classes.kSystemData && !classes.kSystemData.isNull()) {
    getInfoFunc = getMethodNative(
      classes.kSystemData,
      "GetBattlePlayerInfo",
      0,
      "pointer",
      ["pointer"],
    );
  }
}

export function extractPlayerData(
  kLogicManager: NativePointer,
  state: number,
  draftState: {
    bannedTeamA: number[];
    bannedTeamB: number[];
    lockedHeroesSet: Set<number>;
  },
): PlayerData[] {
  const playerMap = new Map<number, PlayerData>();
  const playerUidMap = new Map<string, PlayerData>();
  // Refresh peta guid -> durasi respawn Show-side sekali per tick.
  try {
    refreshDeathSpans();
  } catch (e) {}
  if (!getInfoFunc) return [];

  try {
    const listPtr = (getInfoFunc as any)(NULL) as NativePointer;
    if (listPtr && !listPtr.isNull()) {
      const roomDataList = readPointerList(listPtr);
      const usedSlots = new Set<number>();
      // Deteksi mode penomoran blue: global 1..5 vs per-camp 0..4 (mode AI).
      // Offset default 0x30 (iCamp) / 0x34 (iPos) sesuai dump.cs.
      let blueGlobal = false;
      try {
        for (const q of roomDataList) {
          if (!q || q.isNull()) continue;
          if (q.add(0x30).readInt() === 1) {
            const pp = q.add(0x34).readInt();
            if (pp >= 5 && pp <= 10) {
              blueGlobal = true;
              break;
            }
          }
        }
      } catch (eMode) {}
      for (let i = 0; i < roomDataList.length; i++) {
        const p = roomDataList[i];
        if (!p || p.isNull()) continue;
        try {
          if (!isRoomOffsetsCached && il2cppApi.object_get_class) {
            const kRoomData = il2cppApi.object_get_class(p);
            if (kRoomData && !kRoomData.isNull()) {
              let offUid = getOffset(kRoomData, "lUid");
              if (offUid <= 0) offUid = 0x20;

              let offCamp = getOffset(kRoomData, "iCamp");
              if (offCamp <= 0) offCamp = 0x30;

              let offPos = getOffset(kRoomData, "iPos");
              if (offPos <= 0) offPos = 0x34;

              let offName = getOffset(kRoomData, "_sName");
              if (offName <= 0) offName = getOffset(kRoomData, "m_sName");
              if (offName <= 0) offName = getOffset(kRoomData, "sName");
              if (offName <= 0) offName = 0x40;

              let offHero = getOffset(kRoomData, "heroid");
              if (offHero <= 0) offHero = getOffset(kRoomData, "m_heroid");
              if (offHero <= 0) offHero = getOffset(kRoomData, "heroId");
              if (offHero <= 0) offHero = 0x4c;

              let offUiHeroChoose = getOffset(kRoomData, "uiHeroIDChoose");
              if (offUiHeroChoose <= 0) offUiHeroChoose = 0x1f8;

              let offRoad = getOffset(kRoomData, "iRoad");
              if (offRoad <= 0) offRoad = 0x138;

              let offSummon = getOffset(kRoomData, "summonSkillId");
              if (offSummon <= 0) offSummon = 0x64;

              let offRune = getOffset(kRoomData, "runeId");
              if (offRune <= 0) offRune = 0x68;

              let offRuneSkill = getOffset(kRoomData, "mRuneSkill2023");
              if (offRuneSkill <= 0) offRuneSkill = 0x78;

              roomDataOffsets = {
                lUid: offUid,
                sName: offName,
                iCamp: offCamp,
                iRoad: offRoad,
                iPos: offPos,
                heroid: offHero,
                uiHeroIDChoose: offUiHeroChoose,
                summonSkillId: offSummon,
                runeId: offRune,
                mRuneSkill2023: offRuneSkill,
              };
              isRoomOffsetsCached = true;
            }
          }

          const offHero = roomDataOffsets.heroid ?? -1;
          const offUiHeroChoose = roomDataOffsets.uiHeroIDChoose ?? -1;
          const offUid = roomDataOffsets.lUid ?? -1;
          const offName = roomDataOffsets.sName ?? -1;
          const offCamp = roomDataOffsets.iCamp ?? -1;
          const offPos = roomDataOffsets.iPos ?? -1;
          const offRoad = roomDataOffsets.iRoad ?? -1;
          const offSummon = roomDataOffsets.summonSkillId ?? -1;
          const offRune = roomDataOffsets.runeId ?? -1;

          const heroId = offHero > 0 ? p.add(offHero).readInt() : 0;
          const uiChoose =
            offUiHeroChoose > 0 ? p.add(offUiHeroChoose).readInt() : 0;
          const iPos = offPos > 0 ? p.add(offPos).readInt() : i + 1;
          const rawCamp = offCamp > 0 ? p.add(offCamp).readInt() : 0;
          // Wasit/spectator (mis. camp 5) dan sisa match lama bukan pemain:
          // jangan biarkan mengklaim slot 1..10.
          if (rawCamp !== 1 && rawCamp !== 2) continue;
          const verifiedTeam =
            iPos >= 1 && iPos <= 5 ? 1 : iPos >= 6 && iPos <= 10 ? 2 : rawCamp;

          const uidStr = offUid > 0 ? p.add(offUid).readU64().toString() : "0";
          const banHeroId = playerBanMap.get(iPos) || 0;

          // Parse Emblem Skills (if mRuneSkill2023 dictionary exists)
          const emblemSkills: EmblemSkill[] = [];
          const offRuneSkill = roomDataOffsets.mRuneSkill2023 ?? -1;
          if (offRuneSkill > 0) {
            try {
              const dictPtr = p.add(offRuneSkill).readPointer();
              if (dictPtr && !dictPtr.isNull()) {
                const entriesOff = Process.pointerSize === 8 ? 0x18 : 0x0c;
                const countOff = Process.pointerSize === 8 ? 0x20 : 0x10;

                const entriesPtr = dictPtr.add(entriesOff).readPointer();
                let count = dictPtr.add(countOff).readInt();

                if (entriesPtr && !entriesPtr.isNull()) {
                  if (count <= 0 || count > 20) count = 10;
                  const entryHeaderSize =
                    Process.pointerSize === 8 ? 0x20 : 0x10;
                  const entrySizes =
                    Process.pointerSize === 8 ? [16, 24] : [16, 12];

                  for (const entrySize of entrySizes) {
                    let found = 0;
                    for (let eIdx = 0; eIdx < count && eIdx < 10; eIdx++) {
                      const entryAddr = entriesPtr.add(
                        entryHeaderSize + eIdx * entrySize,
                      );
                      const key = entryAddr.add(8).readInt();
                      const val = entryAddr.add(12).readInt();
                      if (key > 0 && val > 0 && key <= 10 && val < 50000) {
                        emblemSkills.push({ slot: key, id: val });
                        found++;
                      } else if (
                        val > 0 &&
                        key > 0 &&
                        val <= 10 &&
                        key < 50000
                      ) {
                        emblemSkills.push({ slot: val, id: key });
                        found++;
                      }
                    }
                    if (found > 0) break;
                  }
                }
              }
            } catch (eRune) {}
          }

          const rawCampForSlot = rawCamp === 2 ? 2 : 1;
          const slot = normalizeRoomPos(
            iPos,
            rawCampForSlot,
            usedSlots,
            blueGlobal,
          );
          if (slot >= 1 && slot <= 10) {
            usedSlots.add(slot);
            const playerObj: PlayerData = {
              ipos: slot,
              id: uidStr,
              name: readCsharpString(
                offName > 0 ? p.add(offName).readPointer() : ptr(0),
              ),
              role: offRoad > 0 ? p.add(offRoad).readInt() : 0,
              team: verifiedTeam,
              heroid: heroId,
              uiHeroIDChoose: uiChoose,
              battleSpell: offSummon > 0 ? p.add(offSummon).readInt() : 0,
              emblem: offRune > 0 ? p.add(offRune).readInt() : 0,
              emblemSkills: emblemSkills,
              pickPhase: false,
              banPhase: false,
              SelHeroID: heroId > 0 ? heroId : uiChoose,
              banHero: playerBanMap.get(slot) ?? banHeroId,
              hp: 0,
              maxHp: 0,
              level: 0,
              deathTime: 0,
              kill: 0,
              dead: 0,
              assist: 0,
              ultActive: false,
              equips: [0, 0, 0, 0, 0, 0],
              totalGold: 0,
              damageDealt: 0,
              damageTaken: 0,
            };
            // verifiedTeam dihitung dari iPos mentah; selaraskan ke slot
            // ternormalisasi agar team selalu konsisten (1..5 blue, 6..10 red).
            playerObj.team = slot <= 5 ? 1 : 2;
            playerMap.set(slot, playerObj);
            if (uidStr && uidStr !== "0") {
              playerUidMap.set(uidStr, playerObj);
            }
          }
        } catch (eRoom) {}
      }
    }
  } catch (e) {}

  // Extract live player stats if LogicBattleManager.Instance is active
  if (
    kLogicManager &&
    !kLogicManager.isNull() &&
    il2cppApi.field_static_get_value
  ) {
    try {
      const instanceStrPtr = getCachedUtf8String("Instance");
      const fieldInst = il2cppApi.class_get_field_from_name!(
        kLogicManager,
        instanceStrPtr,
      );
      if (fieldInst && !fieldInst.isNull()) {
        il2cppApi.field_static_get_value(fieldInst, persistentInstPtr);
        const mgrInstance = persistentInstPtr.readPointer();

        if (mgrInstance && !mgrInstance.isNull()) {
          let logicPlayerEntries: {
            ptr: NativePointer;
            defaultPos: number;
            camp: number;
          }[] = [];
          const assignedSlots = new Set<number>();

          // 1. Try m_CampAPlayerList (0xa0) & m_CampBPlayerList (0xa8)
          let offCampA = getOffset(kLogicManager, "m_CampAPlayerList");
          if (offCampA <= 0) offCampA = 0xa0;
          let offCampB = getOffset(kLogicManager, "m_CampBPlayerList");
          if (offCampB <= 0) offCampB = 0xa8;

          if (offCampA > 0 && offCampB > 0) {
            const listAPtr = mgrInstance.add(offCampA).readPointer();
            const listBPtr = mgrInstance.add(offCampB).readPointer();
            const playersA = readPointerList(listAPtr);
            const playersB = readPointerList(listBPtr);
            for (let aIdx = 0; aIdx < playersA.length && aIdx < 5; aIdx++) {
              const p = playersA[aIdx];
              if (p && !p.isNull())
                logicPlayerEntries.push({
                  ptr: p,
                  defaultPos: aIdx + 1,
                  camp: 1,
                });
            }
            for (let bIdx = 0; bIdx < playersB.length && bIdx < 5; bIdx++) {
              const p = playersB[bIdx];
              if (p && !p.isNull())
                logicPlayerEntries.push({
                  ptr: p,
                  defaultPos: bIdx + 6,
                  camp: 2,
                });
            }
          }

          // 2. Fallback to m_dicPlayerLogic (0x48) if lists are empty
          if (logicPlayerEntries.length === 0) {
            const dicStrPtr = getCachedUtf8String("m_dicPlayerLogic");
            const fieldDic = il2cppApi.class_get_field_from_name!(
              kLogicManager,
              dicStrPtr,
            );
            let offDic =
              fieldDic && !fieldDic.isNull()
                ? Number(il2cppApi.field_get_offset!(fieldDic))
                : -1;
            if (offDic <= 0) offDic = 0x48;

            if (offDic > 0) {
              const dicPtr = mgrInstance.add(offDic).readPointer();

              if (dicPtr && !dicPtr.isNull()) {
                let entriesPtr = dicPtr
                  .add(Process.pointerSize === 8 ? 0x18 : 0x0c)
                  .readPointer();
                let count = dicPtr
                  .add(Process.pointerSize === 8 ? 0x20 : 0x10)
                  .readInt();
                if (
                  !entriesPtr ||
                  entriesPtr.isNull() ||
                  count <= 0 ||
                  count > 100
                ) {
                  entriesPtr = dicPtr
                    .add(Process.pointerSize === 8 ? 0x20 : 0x18)
                    .readPointer();
                  count = dicPtr
                    .add(Process.pointerSize === 8 ? 0x28 : 0x20)
                    .readInt();
                }

                const entryHeaderSize = Process.pointerSize === 8 ? 0x20 : 0x10;
                const entrySize = Process.pointerSize === 8 ? 24 : 16;

                for (let i = 0; i < count && i < 20; i++) {
                  const entryAddr = entriesPtr.add(
                    entryHeaderSize + i * entrySize,
                  );
                  const lpPtr = entryAddr
                    .add(Process.pointerSize * 2)
                    .readPointer();
                  if (lpPtr && !lpPtr.isNull()) {
                    logicPlayerEntries.push({
                      ptr: lpPtr,
                      defaultPos: i + 1,
                      camp: 0,
                    });
                  }
                }
              }
            }
          }

          for (let i = 0; i < logicPlayerEntries.length; i++) {
            const entry = logicPlayerEntries[i];
            if (!entry || !entry.ptr || entry.ptr.isNull()) continue;
            const { ptr: logicPlayerPtr, defaultPos } = entry;
            const entryCampRaw: number = (entry as any).camp ?? 0;
            try {
              if (!isLogicPlayerOffsetsCached && il2cppApi.object_get_class) {
                const kLogicPlayer = il2cppApi.object_get_class(logicPlayerPtr);
                if (kLogicPlayer && !kLogicPlayer.isNull()) {
                  let offLvl = getOffset(
                    kLogicPlayer,
                    "<m_Level>k__BackingField",
                  );
                  if (offLvl <= 0) offLvl = getOffset(kLogicPlayer, "_level");
                  if (offLvl <= 0) offLvl = getOffset(kLogicPlayer, "m_Level");

                  // deathTime: m_uDeadTime = timestamp kematian (battle ms).
                  // Kalibrasi live: pemain mati -> timestamp, hidup -> 0.
                  let offDead = getOffset(kLogicPlayer, "m_uDeadTime");
                  if (offDead <= 0)
                    offDead = getOffset(
                      kLogicPlayer,
                      "<m_uDeadSpanTime>k__BackingField",
                    );
                  if (offDead <= 0)
                    offDead = getOffset(kLogicPlayer, "m_deadTimeSpan");

                  let offGuid = getOffset(kLogicPlayer, "m_uGuid");
                  if (offGuid <= 0) offGuid = 0xb0;

                  getEquipListFunc = getMethodNativeHierarchy(
                    kLogicPlayer,
                    "get_m_EquipList",
                    0,
                    "pointer",
                    ["pointer"],
                  );

                  let offHeroName = getOffset(kLogicPlayer, "m_HeroName");
                  if (offHeroName <= 0) offHeroName = 0x8d8;

                  let offOriginHero = getOffset(
                    kLogicPlayer,
                    "m_iOriginHeroId",
                  );
                  if (offOriginHero <= 0) offOriginHero = 0x8b8;

                  let offIPos = getOffset(kLogicPlayer, "m_iPos");
                  if (offIPos <= 0) offIPos = 0x8e8;

                  let offSynFightData = getOffset(
                    kLogicPlayer,
                    "m_SynFightData",
                  );
                  if (offSynFightData <= 0) offSynFightData = 0xa50;

                  let offOwnSkill = getOffset(kLogicPlayer, "m_OwnSkillComp");
                  if (offOwnSkill <= 0) offOwnSkill = 0x510;
                  let offSkillComp = getOffset(kLogicPlayer, "m_SkillComp");
                  if (offSkillComp <= 0) offSkillComp = 0x4f0;
                  ultOffsets.m_OwnSkillComp = offOwnSkill;
                  ultOffsets.m_SkillComp = offSkillComp;

                    logicPlayerOffsets = {
                      m_Hp: getOffset(kLogicPlayer, "m_Hp"),
                      m_HpMax: getOffset(kLogicPlayer, "m_HpMax"),
                      m_Level: offLvl,
                      m_uDeadTime: offDead,
                      m_uGuid: offGuid,
                    greenLightCanUse: getOffset(
                      kLogicPlayer,
                      "greenLightCanUse",
                    ),
                    m_PlayerData: getOffset(kLogicPlayer, "m_PlayerData"),
                    m_ConfigData: getOffset(kLogicPlayer, "m_ConfigData"),
                    _totalGold: getOffset(kLogicPlayer, "_totalGold"),
                    m_HurtTotalValue: getOffset(
                      kLogicPlayer,
                      "m_HurtTotalValue",
                    ),
                    m_HurtHeroValue: getOffset(kLogicPlayer, "m_HurtHeroValue"),
                    m_InjuredTotal: getOffset(kLogicPlayer, "m_InjuredTotal"),
                    m_InjuredValue: getOffset(kLogicPlayer, "m_InjuredValue"),
                    m_EquipComp: getOffset(kLogicPlayer, "m_EquipComp"),
                    m_EquipDict: getOffset(kLogicPlayer, "m_EquipDict"),
                    m_ShopComp: getOffset(kLogicPlayer, "m_ShopComp"),
                    m_iPos: offIPos,
                    m_HeroName: offHeroName,
                    m_iOriginHeroId: offOriginHero,
                    m_SynFightData: offSynFightData,
                  };
                  isLogicPlayerOffsetsCached = true;
                }
              }

              if (!getEquipListFunc && il2cppApi.object_get_class) {
                const kLogicPlayer = il2cppApi.object_get_class(logicPlayerPtr);
                if (kLogicPlayer && !kLogicPlayer.isNull()) {
                  getEquipListFunc = getMethodNativeHierarchy(
                    kLogicPlayer,
                    "get_m_EquipList",
                    0,
                    "pointer",
                    ["pointer"],
                  );
                }
              }

              // Parse m_SynFightData (FightPlayerData)
              let synAccId = "";
              let synHeroId = 0;
              let synName = "";
              let synPos = 0;
              let synSummon = 0;
              let synRuneId = 0;
              const synEmblemSkills: EmblemSkill[] = [];

              const offSynFight = logicPlayerOffsets.m_SynFightData ?? -1;
              if (offSynFight > 0) {
                try {
                  const synPtr = logicPlayerPtr.add(offSynFight).readPointer();
                  if (synPtr && !synPtr.isNull()) {
                    synAccId = synPtr.add(0x10).readU64().toString();
                    synHeroId = synPtr.add(0x28).readInt();
                    const namePtr = synPtr.add(0x50).readPointer();
                    if (namePtr && !namePtr.isNull()) {
                      synName = readCsharpString(namePtr);
                    }
                    synPos = synPtr.add(0x5c).readInt();
                    synSummon = synPtr.add(0x78).readInt();
                    synRuneId = synPtr.add(0x84).readInt();

                    const dictPtr = synPtr.add(0x90).readPointer();
                    if (dictPtr && !dictPtr.isNull()) {
                      const entriesOff =
                        Process.pointerSize === 8 ? 0x18 : 0x0c;
                      const countOff = Process.pointerSize === 8 ? 0x20 : 0x10;
                      const entriesPtr = dictPtr.add(entriesOff).readPointer();
                      let count = dictPtr.add(countOff).readInt();
                      if (entriesPtr && !entriesPtr.isNull()) {
                        if (count <= 0 || count > 20) count = 10;
                        const entryHeaderSize =
                          Process.pointerSize === 8 ? 0x20 : 0x10;
                        const entrySizes =
                          Process.pointerSize === 8 ? [16, 24] : [16, 12];
                        for (const entrySize of entrySizes) {
                          let found = 0;
                          for (
                            let eIdx = 0;
                            eIdx < count && eIdx < 10;
                            eIdx++
                          ) {
                            const entryAddr = entriesPtr.add(
                              entryHeaderSize + eIdx * entrySize,
                            );
                            const k = entryAddr.add(8).readInt();
                            const v = entryAddr.add(12).readInt();
                            if (k > 0 && v > 0 && k <= 10 && v < 50000) {
                              synEmblemSkills.push({ slot: k, id: v });
                              found++;
                            } else if (v > 0 && k > 0 && v <= 10 && k < 50000) {
                              synEmblemSkills.push({ slot: v, id: k });
                              found++;
                            }
                          }
                          if (found > 0) break;
                        }
                      }
                    }
                  }
                } catch (eSyn) {}
              }

              let accIdStr = synAccId;
              let playerDataPtr: NativePointer | null = null;
              const offPlayerData = logicPlayerOffsets.m_PlayerData ?? -1;
              if (offPlayerData > 0) {
                try {
                  playerDataPtr = logicPlayerPtr
                    .add(offPlayerData)
                    .readPointer();
                  if (playerDataPtr && !playerDataPtr.isNull()) {
                    const kPlayerData =
                      il2cppApi.object_get_class!(playerDataPtr);
                    const offAccId = getOffset(kPlayerData, "m_AccountId");
                    if (offAccId > 0) {
                      const readAcc = playerDataPtr
                        .add(offAccId)
                        .readU64()
                        .toString();
                      if (readAcc && readAcc !== "0") accIdStr = readAcc;
                    }
                  }
                } catch (eAcc) {}
              }

              let heroIdLp = synHeroId;
              let heroNameLp = synName;
              const offConfigData = logicPlayerOffsets.m_ConfigData ?? -1;
              if (offConfigData > 0) {
                try {
                  const configDataPtr = logicPlayerPtr
                    .add(offConfigData)
                    .readPointer();
                  if (configDataPtr && !configDataPtr.isNull()) {
                    const kConfigData =
                      il2cppApi.object_get_class!(configDataPtr);
                    let offHeroId = getOffset(kConfigData, "m_ID");
                    if (offHeroId <= 0) offHeroId = 0x14;
                    const readHId = configDataPtr.add(offHeroId).readInt();
                    if (readHId > 0 && readHId <= 500) heroIdLp = readHId;

                    let offHeroMName = getOffset(kConfigData, "m_mName");
                    if (offHeroMName <= 0) offHeroMName = 0x18;
                    const namePtr = configDataPtr
                      .add(offHeroMName)
                      .readPointer();
                    if (namePtr && !namePtr.isNull()) {
                      const readMName = readCsharpString(namePtr);
                      if (readMName && !heroNameLp) heroNameLp = readMName;
                    }
                  }
                } catch (eCfg) {}
              }

              let posLp = synPos;
              const offIPosLp = logicPlayerOffsets.m_iPos ?? -1;
              if (offIPosLp > 0) {
                try {
                  const readP = logicPlayerPtr.add(offIPosLp).readInt();
                  if (readP >= 1 && readP <= 10) posLp = readP;
                } catch (ePos) {}
              }

              const targetPos =
                synPos >= 1 && synPos <= 10
                  ? synPos
                  : posLp >= 1 && posLp <= 10
                    ? posLp
                    : defaultPos;
              // Camp asal entry (CampA=1, CampB=2). Fallback dari defaultPos
              // bila dari jalur m_dicPlayerLogic (camp 0 = tak diketahui).
              const entryCamp =
                entryCampRaw === 1 || entryCampRaw === 2
                  ? entryCampRaw
                  : targetPos >= 1 && targetPos <= 5
                    ? 1
                    : 2;
              // Hero live untuk pencocokan (syn/cfg). Urutan list CampA/B
              // TIDAK sama dengan urutan slot, jadi hero+camp adalah kunci.
              const liveHero =
                synHeroId > 0 && synHeroId <= 500
                  ? synHeroId
                  : heroIdLp > 0 && heroIdLp <= 500
                    ? heroIdLp
                    : 0;

              let targetPlayer: PlayerData | undefined = undefined;
              let resolvedPos = -1;
              // 1. uid valid = identitas pasti.
              if (accIdStr && accIdStr !== "0") {
                const byUid = playerUidMap.get(accIdStr);
                if (byUid) {
                  targetPlayer = byUid;
                  resolvedPos = byUid.ipos;
                }
              }
              // 2. Samakan hero dalam camp yang sama, slot yang belum diklaim.
              if (!targetPlayer && liveHero > 0) {
                for (const cand of playerMap.values()) {
                  if (
                    cand.team === entryCamp &&
                    !assignedSlots.has(cand.ipos) &&
                    (cand.heroid === liveHero || cand.SelHeroID === liveHero)
                  ) {
                    targetPlayer = cand;
                    resolvedPos = cand.ipos;
                    break;
                  }
                }
              }
              // 3. Fallback urutan (defaultPos) bila slotnya masih bebas.
              if (
                !targetPlayer &&
                targetPos >= 1 &&
                targetPos <= 10 &&
                !assignedSlots.has(targetPos)
              ) {
                const cand = playerMap.get(targetPos);
                if (cand) {
                  targetPlayer = cand;
                  resolvedPos = targetPos;
                }
              }

              if (!targetPlayer) {
                let newSlot =
                  targetPos >= 1 && targetPos <= 10 && !playerMap.has(targetPos)
                    ? targetPos
                    : -1;
                if (newSlot < 0) {
                  const lo = entryCamp === 2 ? 6 : 1;
                  const hi = entryCamp === 2 ? 10 : 5;
                  for (let ss = lo; ss <= hi; ss++) {
                    if (!playerMap.has(ss)) {
                      newSlot = ss;
                      break;
                    }
                  }
                }
                if (newSlot < 1 || newSlot > 10) continue;
                const assignedTeam = newSlot >= 1 && newSlot <= 5 ? 1 : 2;
                const finalHeroId =
                  heroIdLp > 0 && heroIdLp <= 500 ? heroIdLp : 0;
                targetPlayer = {
                  ipos: newSlot,
                  id: accIdStr || "0",
                  name: heroNameLp || "",
                  role: 0,
                  team: assignedTeam,
                  heroid: finalHeroId,
                  uiHeroIDChoose: finalHeroId,
                  battleSpell: synSummon || 0,
                  emblem: synRuneId || 0,
                  emblemSkills: synEmblemSkills,
                  pickPhase: false,
                  banPhase: false,
                  SelHeroID: finalHeroId,
                  banHero: playerBanMap.get(newSlot) || 0,
                  hp: 0,
                  maxHp: 0,
                  level: 0,
                  deathTime: 0,
                  kill: 0,
                  dead: 0,
                  assist: 0,
                  ultActive: false,
                  equips: [0, 0, 0, 0, 0, 0],
                  totalGold: 0,
                  damageDealt: 0,
                  damageTaken: 0,
                };
                playerMap.set(newSlot, targetPlayer);
                if (accIdStr && accIdStr !== "0") {
                  playerUidMap.set(accIdStr, targetPlayer);
                }
                resolvedPos = newSlot;
              } else {
                assignedSlots.add(resolvedPos);
              }

              if (targetPlayer) {
                if (accIdStr && accIdStr !== "0") targetPlayer.id = accIdStr;

                // Snapshot identitas RoomData: nama player + hero pick tidak
                // boleh ditimpa nama hero dari LogicPlayer (synName/m_HeroName).
                const roomHero = targetPlayer.heroid;
                const roomName = targetPlayer.name;

                if (!roomName || roomName === "") {
                  if (synName && synName !== "") {
                    targetPlayer.name = synName;
                  } else if (heroNameLp) {
                    targetPlayer.name = heroNameLp;
                  } else {
                    const offHeroName = logicPlayerOffsets.m_HeroName ?? -1;
                    if (offHeroName > 0) {
                      try {
                        const hNamePtr = logicPlayerPtr
                          .add(offHeroName)
                          .readPointer();
                        const hNameStr = readCsharpString(hNamePtr);
                        if (hNameStr) targetPlayer.name = hNameStr;
                      } catch (eName) {}
                    }
                  }
                }

                if (synHeroId > 0 && synHeroId <= 500) {
                  targetPlayer.heroid = synHeroId;
                  targetPlayer.SelHeroID = synHeroId;
                } else if (
                  (targetPlayer.heroid <= 0 || targetPlayer.heroid > 500) &&
                  heroIdLp > 0 &&
                  heroIdLp <= 500
                ) {
                  targetPlayer.heroid = heroIdLp;
                  targetPlayer.SelHeroID = heroIdLp;
                } else if (
                  targetPlayer.heroid <= 0 ||
                  targetPlayer.heroid > 500
                ) {
                  const offOriginHero =
                    logicPlayerOffsets.m_iOriginHeroId ?? -1;
                  if (offOriginHero > 0) {
                    try {
                      const hId = logicPlayerPtr.add(offOriginHero).readInt();
                      if (hId > 0 && hId <= 500) {
                        targetPlayer.heroid = hId;
                        targetPlayer.SelHeroID = hId;
                      }
                    } catch (eHId) {}
                  }
                }

                // RoomData adalah sumber pick: hero valid dari RoomData
                // dipertahankan agar payload sesuai lobby/draft.
                if (roomHero > 0 && roomHero <= 500) {
                  targetPlayer.heroid = roomHero;
                  targetPlayer.SelHeroID = roomHero;
                }
                if (roomName && roomName !== "") {
                  targetPlayer.name = roomName;
                }

                if (synSummon > 0) targetPlayer.battleSpell = synSummon;
                if (synRuneId > 0) targetPlayer.emblem = synRuneId;
                if (synEmblemSkills.length > 0)
                  targetPlayer.emblemSkills = synEmblemSkills;
                const offHp = logicPlayerOffsets.m_Hp ?? -1;
                  const offHpMax = logicPlayerOffsets.m_HpMax ?? -1;
                  const offLvl = logicPlayerOffsets.m_Level ?? -1;
                  const offDead = logicPlayerOffsets.m_uDeadTime ?? -1;
                  const offGuid = logicPlayerOffsets.m_uGuid ?? -1;

                  if (offHp > 0)
                    targetPlayer.hp = logicPlayerPtr.add(offHp).readInt();
                  if (offHpMax > 0)
                    targetPlayer.maxHp = logicPlayerPtr.add(offHpMax).readInt();
                  if (offLvl > 0)
                    targetPlayer.level = logicPlayerPtr.add(offLvl).readInt();
                  // deathTime = sisa respawn (detik). Timestamp kematian +
                  // total durasi Show-side - jam match. Hidup / tak diketahui = 0.
                  targetPlayer.deathTime = 0;
                  try {
                    if (offDead > 0 && offGuid > 0) {
                      const deadStamp = logicPlayerPtr
                        .add(offDead)
                        .readU32();
                      if (deadStamp > 0) {
                        const guid = logicPlayerPtr
                          .add(offGuid)
                          .readU32();
                        const spanMs = getDeathSpanMs(guid);
                        if (spanMs > 0 && getMatchTimeMs) {
                          let nowMs = -1;
                          try {
                            nowMs = Number((getMatchTimeMs as any)());
                          } catch (e) {}
                          if (nowMs >= 0) {
                            const remainMs =
                              deadStamp + spanMs - (nowMs as number);
                            if (remainMs > 0) {
                              targetPlayer.deathTime = Math.floor(
                                remainMs / 1000,
                              );
                            }
                          }
                        }
                      }
                    }
                  } catch (e) {}
                // ultActive = ulti sudah dipelajari DAN off-cooldown (bukan sekadar greenLight).
                targetPlayer.ultActive = isUltReady(logicPlayerPtr);

                // Gold, Damage Dealt, Damage Taken
                const offTotalGold = logicPlayerOffsets._totalGold ?? -1;
                const offHurtTotal = logicPlayerOffsets.m_HurtTotalValue ?? -1;
                const offHurtHero = logicPlayerOffsets.m_HurtHeroValue ?? -1;
                const offInjuredTotal = logicPlayerOffsets.m_InjuredTotal ?? -1;
                const offInjuredVal = logicPlayerOffsets.m_InjuredValue ?? -1;

                let totalGoldVal = 0;
                if (offTotalGold > 0) {
                  totalGoldVal = logicPlayerPtr.add(offTotalGold).readInt();
                } else if (playerDataPtr && !playerDataPtr.isNull()) {
                  const kPd = il2cppApi.object_get_class!(playerDataPtr);
                  const offG = getOffset(kPd, "_gold");
                  if (offG > 0)
                    totalGoldVal = playerDataPtr.add(offG).readInt();
                }
                targetPlayer.totalGold = totalGoldVal > 0 ? totalGoldVal : 0;

                let dmgDealt = 0;
                if (offHurtTotal > 0) {
                  dmgDealt = Math.floor(
                    logicPlayerPtr.add(offHurtTotal).readDouble(),
                  );
                } else if (offHurtHero > 0) {
                  dmgDealt = Math.floor(
                    logicPlayerPtr.add(offHurtHero).readDouble(),
                  );
                } else if (playerDataPtr && !playerDataPtr.isNull()) {
                  const kPd = il2cppApi.object_get_class!(playerDataPtr);
                  const offTd = getOffset(kPd, "totalDamage");
                  if (offTd > 0) dmgDealt = playerDataPtr.add(offTd).readInt();
                }
                targetPlayer.damageDealt = dmgDealt > 0 ? dmgDealt : 0;

                let dmgTaken = 0;
                if (offInjuredTotal > 0) {
                  dmgTaken = logicPlayerPtr.add(offInjuredTotal).readInt();
                } else if (offInjuredVal > 0) {
                  dmgTaken = Math.floor(
                    logicPlayerPtr.add(offInjuredVal).readDouble(),
                  );
                }
                targetPlayer.damageTaken = dmgTaken > 0 ? dmgTaken : 0;

                // Equips (Exact 6 slots: [item1, item2, item3, item4, item5, item6])
                const equipsFixed: number[] = [0, 0, 0, 0, 0, 0];

                const parseDictToFixedSlots = (dictPtr: NativePointer) => {
                  if (!dictPtr || dictPtr.isNull()) return;
                  try {
                    const entriesOff = Process.pointerSize === 8 ? 0x18 : 0x0c;
                    const countOff = Process.pointerSize === 8 ? 0x20 : 0x10;

                    const entriesPtr = dictPtr.add(entriesOff).readPointer();
                    let count = dictPtr.add(countOff).readInt();

                    if (!entriesPtr || entriesPtr.isNull()) return;
                    if (count <= 0 || count > 100) {
                      const lenOff = Process.pointerSize === 8 ? 0x18 : 0x0c;
                      count = entriesPtr.add(lenOff).readInt();
                    }

                    if (count <= 0 || count > 100) count = 16;

                    const entryHeaderSize =
                      Process.pointerSize === 8 ? 0x20 : 0x10;
                    const entrySizes =
                      Process.pointerSize === 8 ? [16, 24] : [16, 12];

                    for (const entrySize of entrySizes) {
                      let found = 0;
                      for (let eIdx = 0; eIdx < count && eIdx < 16; eIdx++) {
                        const entryAddr = entriesPtr.add(
                          entryHeaderSize + eIdx * entrySize,
                        );
                        const k = entryAddr.add(8).readInt(); // Key at offset 8
                        const v = entryAddr.add(12).readInt(); // Value at offset 12

                        // 1-based key (slot 1..6)
                        if (k >= 1 && k <= 6 && v >= 100 && v < 50000) {
                          equipsFixed[k - 1] = v;
                          found++;
                        }
                        // 1-based value (slot 1..6)
                        else if (v >= 1 && v <= 6 && k >= 100 && k < 50000) {
                          equipsFixed[v - 1] = k;
                          found++;
                        }
                        // 0-based key (slot 0..5)
                        else if (k >= 0 && k <= 5 && v >= 100 && v < 50000) {
                          equipsFixed[k] = v;
                          found++;
                        }
                        // 0-based value (slot 0..5)
                        else if (v >= 0 && v <= 5 && k >= 100 && k < 50000) {
                          equipsFixed[v] = k;
                          found++;
                        }
                        // Fallback unindexed item insertion
                        else {
                          const item =
                            k >= 100 && k < 50000
                              ? k
                              : v >= 100 && v < 50000
                                ? v
                                : 0;
                          if (item >= 100 && item < 50000) {
                            const freeIdx = equipsFixed.indexOf(0);
                            if (freeIdx !== -1) {
                              equipsFixed[freeIdx] = item;
                              found++;
                            }
                          }
                        }
                      }
                      if (found > 0) break;
                    }
                  } catch (e) {}
                };

                // 1. Try candidate m_EquipComp offsets
                const compOffsets = [
                  logicPlayerOffsets.m_EquipComp ?? -1,
                  0xd8,
                  0x2c8,
                ].filter((off) => off > 0);

                for (const offComp of compOffsets) {
                  try {
                    const compPtr = logicPlayerPtr.add(offComp).readPointer();
                    if (compPtr && !compPtr.isNull()) {
                      const kComp = il2cppApi.object_get_class!(compPtr);
                      const getEquipListFn = getMethodNative(
                        kComp,
                        "get_m_EquipList",
                        0,
                        "pointer",
                        ["pointer"],
                      );
                      if (getEquipListFn) {
                        const dictPtr = (getEquipListFn as any)(
                          compPtr,
                        ) as NativePointer;
                        parseDictToFixedSlots(dictPtr);
                        if (equipsFixed.some((x) => x > 0)) break;
                      }
                      const dictDirect = compPtr.add(0x20).readPointer();
                      if (dictDirect && !dictDirect.isNull()) {
                        parseDictToFixedSlots(dictDirect);
                        if (equipsFixed.some((x) => x > 0)) break;
                      }
                    }
                  } catch (eComp) {}
                }

                // 2. Try get_m_EquipList() directly on logicPlayerPtr ONLY if equipsFixed is still empty
                if (!equipsFixed.some((x) => x > 0) && getEquipListFunc) {
                  try {
                    const dictPtr = (getEquipListFunc as any)(
                      logicPlayerPtr,
                    ) as NativePointer;
                    parseDictToFixedSlots(dictPtr);
                  } catch (eEq) {}
                }

                // 3. Try m_ShopComp (dictItemIndex2EquipId 0xb8 & m_Recommends 0x30) ONLY if equipsFixed is still empty
                if (!equipsFixed.some((x) => x > 0)) {
                  const rawOffShop = logicPlayerOffsets.m_ShopComp;
                  const offShopComp =
                    rawOffShop && rawOffShop > 0 ? rawOffShop : 0xaf0;
                  if (offShopComp > 0) {
                    try {
                      const shopCompPtr = logicPlayerPtr
                        .add(offShopComp)
                        .readPointer();
                      if (shopCompPtr && !shopCompPtr.isNull()) {
                        const kShopComp =
                          il2cppApi.object_get_class!(shopCompPtr);
                        let offDictItem = getOffset(
                          kShopComp,
                          "dictItemIndex2EquipId",
                        );
                        if (offDictItem <= 0) offDictItem = 0xb8;
                        if (offDictItem > 0) {
                          const dictPtr = shopCompPtr
                            .add(offDictItem)
                            .readPointer();
                          parseDictToFixedSlots(dictPtr);
                        }

                        if (!equipsFixed.some((x) => x > 0)) {
                          let offRecom = getOffset(kShopComp, "m_Recommends");
                          if (offRecom <= 0) offRecom = 0x30;
                          const listPtr = shopCompPtr
                            .add(offRecom)
                            .readPointer();
                          if (listPtr && !listPtr.isNull()) {
                            const itemsArray = listPtr
                              .add(Process.pointerSize * 2)
                              .readPointer();
                            const listSize = listPtr
                              .add(Process.pointerSize * 3)
                              .readInt();
                            if (
                              itemsArray &&
                              !itemsArray.isNull() &&
                              listSize > 0
                            ) {
                              const header =
                                Process.pointerSize === 8 ? 0x20 : 0x10;
                              for (
                                let idx = 0;
                                idx < listSize && idx < 6;
                                idx++
                              ) {
                                const itemId = itemsArray
                                  .add(header + idx * 4)
                                  .readInt();
                                if (itemId >= 100 && itemId < 50000) {
                                  equipsFixed[idx] = itemId;
                                }
                              }
                            }
                          }
                        }
                      }
                    } catch (eShop) {}
                  }
                }

                targetPlayer.equips = equipsFixed;

                if (
                  offPlayerData > 0 &&
                  playerDataPtr &&
                  !playerDataPtr.isNull()
                ) {
                  try {
                    const kPlayerData =
                      il2cppApi.object_get_class!(playerDataPtr);
                    const offKill = getOffset(kPlayerData, "_killNum");
                    const offDead = getOffset(kPlayerData, "_deadNum");
                    const offAssist = getOffset(kPlayerData, "_assistNum");

                    if (offKill > 0)
                      targetPlayer.kill = playerDataPtr.add(offKill).readInt();
                    if (offDead > 0)
                      targetPlayer.dead = playerDataPtr.add(offDead).readInt();
                    if (offAssist > 0)
                      targetPlayer.assist = playerDataPtr
                        .add(offAssist)
                        .readInt();
                  } catch (eKda) {}
                }
              }
            } catch (eEntry) {}
          }
        }
      }
    } catch (eLp) {}
  }

  return Array.from(playerMap.values()).sort((a, b) => a.ipos - b.ipos);
}
