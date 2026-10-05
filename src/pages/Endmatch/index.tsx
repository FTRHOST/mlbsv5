import { useState } from "react";
import { motion } from "motion/react";
import { useRoomData } from "../../hooks/useRoomData";
import { useMatchScore } from "../../hooks/useMatchScore";
import { useDisplayTeamNames } from "../../hooks/useTeamNames";
import UserAvatar from "../../components/UserAvatar";
import imgBackground from "./match-report.png";
import imgAvatar from "./user-avatar0.png";
import iconGold from "./gold0.svg";
import iconTurret from "./turret0.svg";
import iconLord from "./lord0.svg";
import iconTurtle from "./turtle0.svg";

// ─── Helpers data (mengikuti pola Inmatch: ipos 1-5 biru, 6-10 merah) ───

function findPlayer(players: any[], ipos: number) {
  if (!Array.isArray(players) || players.length === 0) return null;
  const exact = players.find(
    (p: any) => Number(p?.ipos) === ipos && Number(p?.ipos) > 0,
  );
  if (exact) return exact;
  const bluePlayers = players.filter((p: any) => Number(p?.team) === 1);
  const redPlayers = players.filter((p: any) => Number(p?.team) === 2);
  if (ipos <= 5 && bluePlayers.length > 0) return bluePlayers[ipos - 1] || null;
  if (ipos > 5 && redPlayers.length > 0) return redPlayers[ipos - 6] || null;
  return players[ipos - 1] || null;
}

function getBattleSeconds(roomData: any): number {
  const battle = roomData?.battle ?? roomData?.Battle;
  const raw = battle?.waktuPertandingan;
  if (typeof raw !== "number" || Number.isNaN(raw)) return 0;
  return raw < 100000
    ? Math.max(0, Math.floor(raw))
    : Math.max(0, Math.floor(raw / 1000));
}

function formatGameTime(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds || 0));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}.${String(s % 60).padStart(2, "0")}`;
}

function formatGoldK(value: number): string {
  const v = Math.max(0, Math.round(Number(value) || 0));
  if (v < 1000) return String(v);
  return `${(v / 1000).toFixed(1)}K`;
}

function padScore(v: number): string {
  return String(Math.max(0, Math.floor(Number(v) || 0))).padStart(2, "0");
}

// ─── Ikon dinamis dengan fallback ───

function HeroIcon({ heroId }: { heroId: number }) {
  const [srcIdx, setSrcIdx] = useState(0);
  const sources = [
    `/asset/heroes-icon/${heroId}.png`,
    `/asset/heroes-icon/${heroId}.webp`,
    `/assets/heroes-icon/${heroId}.png`,
    `/assets/heroes-icon/${heroId}.webp`,
    `/assets/heroes/${heroId}.png`,
    `/assets/heroes/${heroId}.webp`,
  ];
  if (!heroId || heroId <= 0 || srcIdx >= sources.length) {
    return <div className="absolute inset-0 bg-[#d9d9d9]" />;
  }
  return (
    <img
      alt=""
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[101.25px] h-[101.25px] object-cover pointer-events-none"
      src={sources[srcIdx]}
      onError={() => setSrcIdx((i) => i + 1)}
    />
  );
}

function RoleIcon({ role }: { role: number }) {
  const [failed, setFailed] = useState(false);
  if (!role || role <= 0 || failed) {
    return (
      <div
        className="shrink-0 w-[49.5px] h-[49.5px] bg-[#533920]"
        data-name="role"
      />
    );
  }
  return (
    <div
      className="shrink-0 w-[49.5px] h-[49.5px] bg-[#533920] relative overflow-hidden"
      data-name="role"
    >
      <img
        alt=""
        className="absolute inset-0 size-full object-cover pointer-events-none"
        src={`/assets/lane/${role}.png`}
        onError={() => setFailed(true)}
      />
    </div>
  );
}

function ItemSlot({ itemId }: { itemId: number }) {
  const [srcIdx, setSrcIdx] = useState(0);
  const sources = [
    `/asset/equips/${itemId}.png`,
    `/asset/equips/${itemId}.webp`,
    `/assets/equips/${itemId}.png`,
    `/assets/equips/${itemId}.webp`,
    `/assets/items/${itemId}.png`,
    `/assets/items/${itemId}.webp`,
  ];
  const box =
    "shrink-0 w-[30.75px] h-[30.75px] bg-[#d9d9d9] relative overflow-hidden border-[2.25px] border-solid border-[#533920]";
  if (!itemId || itemId <= 0 || srcIdx >= sources.length) {
    return <div className={box} data-name="item" />;
  }
  return (
    <div className={box} data-name="item">
      <img
        alt=""
        className="absolute inset-0 size-full object-cover pointer-events-none"
        src={sources[srcIdx]}
        onError={() => setSrcIdx((i) => i + 1)}
      />
    </div>
  );
}

// ─── Baris pemain ───

type RowData = {
  name: string;
  userId: string;
  heroId: number;
  role: number;
  level: number;
  kill: number;
  dead: number;
  assist: number;
  gold: number;
  equips: number[];
};

function usePlayerRow(ipos: number): RowData {
  const roomData = useRoomData();
  const players = Array.isArray(roomData?.players) ? roomData.players : [];
  const p = findPlayer(players, ipos);
  const rawEquips: number[] = Array.isArray(p?.equips)
    ? p.equips.map(Number)
    : [];
  const equips = [0, 1, 2, 3, 4, 5].map((i) => rawEquips[i] || 0);
  return {
    name: p?.name || `Player ${ipos}`,
    userId: String(p?.id ?? ""),
    heroId: Number(p?.heroid || p?.SelHeroID) || 0,
    role: Number(p?.role) || 0,
    level: p?.level !== undefined ? Number(p.level) || 0 : 0,
    kill: Number(p?.kill) || 0,
    dead: Number(p?.dead) || 0,
    assist: Number(p?.assist) || 0,
    gold: Number(p?.totalGold ?? p?.gold_total ?? p?.gold) || 0,
    equips,
  };
}

function BluePlayerRow({ ipos, index }: { ipos: number; index: number }) {
  const row = usePlayerRow(ipos);
  return (
    <motion.div
      className="flex flex-row items-center justify-start self-stretch shrink-0 h-[101.25px]"
      data-name="blue-hero-stats"
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay: 0.5 + index * 0.1, ease: "easeOut" }}
    >
      <div
        className="shrink-0 w-[101.25px] h-[101.25px] relative"
        data-name="hero-icon"
      >
        <HeroIcon heroId={row.heroId} />
      </div>
      <div
        className="bg-[#d69345] shrink-0 w-[102px] h-[101.25px] relative overflow-hidden"
        data-name="user-avatar-component"
      >
        <UserAvatar
          userId={row.userId}
          fallback={imgAvatar}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[35%] w-[62.25px] h-[101.25px] object-cover pointer-events-none scale-[1.45]"
        />
      </div>
      <div
        className="bg-[#e8d367] shrink-0 w-[480.75px] h-[101.25px] relative overflow-hidden"
        data-name="statistik"
      >
        <div
          className="flex flex-col items-start justify-start w-[480.75px] absolute left-0 top-0"
          data-name="container"
        >
          <div
            className="flex flex-row gap-[12.75px] items-center justify-start self-stretch shrink-0 relative"
            data-name="header-info-player"
          >
            <RoleIcon role={row.role} />
            <div
              className="text-black text-left font-['Inter:Medium',sans-serif] font-medium text-[24px] relative w-[305.25px] h-[49.5px] flex items-center justify-start"
              data-name="username"
            >
              <p className="leading-none m-0 truncate">{row.name}</p>
            </div>
            <div
              className="bg-[#e0c331] shrink-0 w-[100.5px] h-[49.5px] relative overflow-hidden"
              data-name="level-container"
            >
              <div
                className="text-black text-center font-['Inter:Medium',sans-serif] font-medium text-[24px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[100.5px] h-[49.5px] flex items-center justify-center"
                data-name="level"
              >
                <p className="leading-none m-0">Lvl. {row.level}</p>
              </div>
            </div>
          </div>
          <div
            className="px-[16.5px] flex flex-row gap-[56.25px] items-center justify-start self-stretch shrink-0 h-[51.75px] relative"
            data-name="statistic-container"
          >
            <div
              className="flex flex-col gap-[6px] items-center justify-start shrink-0 w-[55.5px] relative"
              data-name="kda"
            >
              <div
                className="text-black text-center font-['Inter:Medium',sans-serif] font-medium text-[12px] relative self-stretch h-[15.75px] flex items-center justify-center"
                data-name="label"
              >
                <p className="leading-none m-0">KDA</p>
              </div>
              <div
                className="text-black text-center font-['Inter:Medium',sans-serif] font-medium text-[18px] tracking-[0.08em] relative self-stretch h-[9.75px] flex items-center justify-center"
                data-name="statistics"
              >
                <p className="leading-none m-0 whitespace-nowrap">
                  {row.kill}/{row.dead}/{row.assist}
                </p>
              </div>
            </div>
            <div
              className="flex flex-col gap-[6px] items-center justify-start shrink-0 w-[69.75px] relative"
              data-name="gold-earn"
            >
              <div
                className="text-black text-center font-['Inter:Medium',sans-serif] font-medium text-[12px] relative self-stretch h-[15.75px] flex items-center justify-center"
                data-name="label"
              >
                <p className="leading-none m-0">GOLD</p>
              </div>
              <div
                className="text-black text-center font-['Inter:Medium',sans-serif] font-medium text-[18px] tracking-[0.08em] relative self-stretch h-[9.75px] flex items-center justify-center"
                data-name="statistics"
              >
                <p className="leading-none m-0 whitespace-nowrap">{row.gold}</p>
              </div>
            </div>
            <div
              className="flex flex-row gap-[2.25px] items-center justify-start shrink-0 w-[320.25px] h-[51.75px] relative"
              data-name="item-container"
            >
              {row.equips.map((id, i) => (
                <ItemSlot key={i} itemId={id} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function RedPlayerRow({ ipos, index }: { ipos: number; index: number }) {
  const row = usePlayerRow(ipos);
  return (
    <motion.div
      className="flex flex-row items-center justify-start self-stretch shrink-0 h-[101.25px]"
      data-name="red-hero-stats"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay: 0.5 + index * 0.1, ease: "easeOut" }}
    >
      <div
        className="bg-[#e8d367] shrink-0 w-[480.75px] h-[101.25px] relative overflow-hidden"
        data-name="statistik"
      >
        <div
          className="flex flex-col items-start justify-start w-[480.75px] absolute left-0 top-0"
          data-name="container"
        >
          <div
            className="flex flex-row gap-[12.75px] items-center justify-start self-stretch shrink-0 relative"
            data-name="header-info-player"
          >
            <div
              className="bg-[#e0c331] shrink-0 w-[100.5px] h-[49.5px] relative overflow-hidden"
              data-name="level-container"
            >
              <div
                className="text-black text-center font-['Inter:Medium',sans-serif] font-medium text-[24px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[100.5px] h-[49.5px] flex items-center justify-center"
                data-name="level"
              >
                <p className="leading-none m-0">Lvl. {row.level}</p>
              </div>
            </div>
            <div
              className="text-black text-right font-['Inter:Medium',sans-serif] font-medium text-[24px] relative w-[305.25px] h-[49.5px] flex items-center justify-end"
              data-name="username"
            >
              <p className="leading-none m-0 truncate">{row.name}</p>
            </div>
            <RoleIcon role={row.role} />
          </div>
          <div
            className="px-[16.5px] flex flex-row gap-[56.25px] items-center justify-end self-stretch shrink-0 h-[51.75px] relative"
            data-name="statistic-container"
          >
            <div
              className="flex flex-row gap-[2.25px] items-center justify-end shrink-0 w-[320.25px] h-[51.75px] relative"
              data-name="item-container"
            >
              {row.equips.map((id, i) => (
                <ItemSlot key={i} itemId={id} />
              ))}
            </div>
            <div
              className="flex flex-col gap-[6px] items-center justify-start shrink-0 w-[69.75px] relative"
              data-name="gold-earn"
            >
              <div
                className="text-black text-center font-['Inter:Medium',sans-serif] font-medium text-[12px] relative self-stretch h-[15.75px] flex items-center justify-center"
                data-name="label"
              >
                <p className="leading-none m-0">GOLD</p>
              </div>
              <div
                className="text-black text-center font-['Inter:Medium',sans-serif] font-medium text-[18px] tracking-[0.08em] relative self-stretch h-[9.75px] flex items-center justify-center"
                data-name="statistics"
              >
                <p className="leading-none m-0 whitespace-nowrap">{row.gold}</p>
              </div>
            </div>
            <div
              className="flex flex-col gap-[6px] items-center justify-start shrink-0 w-[55.5px] relative"
              data-name="kda"
            >
              <div
                className="text-black text-center font-['Inter:Medium',sans-serif] font-medium text-[12px] relative self-stretch h-[15.75px] flex items-center justify-center"
                data-name="label"
              >
                <p className="leading-none m-0">KDA</p>
              </div>
              <div
                className="text-black text-center font-['Inter:Medium',sans-serif] font-medium text-[18px] tracking-[0.08em] relative self-stretch h-[9.75px] flex items-center justify-center"
                data-name="statistics"
              >
                <p className="leading-none m-0 whitespace-nowrap">
                  {row.kill}/{row.dead}/{row.assist}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="bg-[#d69345] shrink-0 w-[102px] h-[101.25px] relative overflow-hidden"
        data-name="user-avatar-component"
      >
        <UserAvatar
          userId={row.userId}
          fallback={imgAvatar}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[35%] w-[62.25px] h-[101.25px] object-cover pointer-events-none scale-[1.45]"
        />
      </div>
      <div
        className="shrink-0 w-[101.25px] h-[101.25px] relative"
        data-name="hero-icon"
      >
        <HeroIcon heroId={row.heroId} />
      </div>
    </motion.div>
  );
}

// ─── Kolom tengah: game time + selisih gold/turret/lord/turtle ───

function DiffRow({
  blue,
  icon,
  red,
  alt,
}: {
  blue: string;
  icon: string;
  red: string;
  alt: string;
}) {
  const cell =
    "text-white text-center font-['Inter:Bold',sans-serif] font-bold text-[28.8px] relative w-[205.2px] h-[65.4px] flex items-center justify-center";
  return (
    <div
      className="flex flex-row gap-[21px] items-center justify-center shrink-0 relative"
      data-name="diff-row"
    >
      <div className={cell} data-name="blue-team">
        <p className="leading-none m-0 whitespace-nowrap">{blue}</p>
      </div>
      <img
        alt={alt}
        className="shrink-0 w-[60px] object-contain pointer-events-none"
        src={icon}
      />
      <div className={cell} data-name="red-team">
        <p className="leading-none m-0 whitespace-nowrap">{red}</p>
      </div>
    </div>
  );
}

function StatsDiffEnd() {
  const roomData = useRoomData();
  const battle = roomData?.battle ?? roomData?.Battle ?? {};
  const num = (v: unknown) =>
    typeof v === "number" && !Number.isNaN(v) ? v : 0;

  return (
    <motion.div
      className="flex flex-col gap-[52.8px] items-center justify-start shrink-0 w-[479.4px] relative"
      data-name="stats-diff-end"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
    >
      <div
        className="flex flex-col gap-[7.8px] items-center justify-center shrink-0 w-[208.2px] relative"
        data-name="game-time-block"
      >
        <div
          className="text-white text-center font-['Inter:Bold',sans-serif] font-bold text-[24px] relative self-stretch h-[37.2px] flex items-center justify-center"
          data-name="game-time-tittle"
        >
          <p className="leading-none m-0">GAME TIME</p>
        </div>
        <div
          className="text-white text-center font-['Inter:Bold',sans-serif] font-bold text-[57.6px] relative self-stretch h-[37.2px] flex items-center justify-center"
          data-name="game-time"
        >
          <p className="leading-none m-0 whitespace-nowrap">
            {formatGameTime(getBattleSeconds(roomData))}
          </p>
        </div>
      </div>
      <div
        className="flex flex-row gap-[21px] items-center justify-center shrink-0 relative"
        data-name="gold-container-diff"
      >
        <div
          className="text-white text-center font-['Inter:Bold',sans-serif] font-bold text-[28.8px] relative w-[205.2px] h-[65.4px] flex items-center justify-center"
          data-name="blue-team"
        >
          <p className="leading-none m-0 whitespace-nowrap">
            {formatGoldK(battle.blueTeamGold)}
          </p>
        </div>
        <img
          alt="gold"
          className="shrink-0 w-[60px] object-contain pointer-events-none"
          src={iconGold}
        />
        <div
          className="text-white text-center font-['Inter:Bold',sans-serif] font-bold text-[28.8px] relative w-[205.2px] h-[65.4px] flex items-center justify-center"
          data-name="red-team"
        >
          <p className="leading-none m-0 whitespace-nowrap">
            {formatGoldK(battle.redTeamGold)}
          </p>
        </div>
      </div>
      <DiffRow
        blue={String(num(battle.blueTeamDestroyTuret))}
        icon={iconTurret}
        red={String(num(battle.redTeamDestroyTuret))}
        alt="turret"
      />
      <DiffRow
        blue={String(num(battle.blueTeamKillLord))}
        icon={iconLord}
        red={String(num(battle.redTeamKillLord))}
        alt="lord"
      />
      <DiffRow
        blue={String(num(battle.blueTeamKillTurtle))}
        icon={iconTurtle}
        red={String(num(battle.redTeamKillTurtle))}
        alt="turtle"
      />
    </motion.div>
  );
}

// ─── Halaman utama ───

export default function Endmatch() {
  const roomData = useRoomData();
  const teamNames = useDisplayTeamNames();
  const blueName = teamNames.blue || roomData?.blue_team_name || "BLUE TEAM";
  const redName = teamNames.red || roomData?.red_team_name || "RED TEAM";
  const matchScore = useMatchScore(
    teamNames.blue || roomData?.blue_team_name,
    teamNames.red || roomData?.red_team_name,
  );

  const battle = roomData?.battle ?? roomData?.Battle ?? {};
  const winCamp = Number(battle.winCamp);
  const blueWin =
    matchScore.blueScore > matchScore.redScore ||
    (matchScore.blueScore === matchScore.redScore && winCamp === 1);
  const redWin =
    matchScore.redScore > matchScore.blueScore ||
    (matchScore.blueScore === matchScore.redScore && winCamp === 2);
  const decided =
    matchScore.blueScore !== matchScore.redScore ||
    winCamp === 1 ||
    winCamp === 2;

  return (
    <div
      className="relative size-full overflow-hidden"
      data-name="match-report"
    >
      <img
        alt=""
        className="absolute inset-0 size-full object-cover pointer-events-none"
        src={imgBackground}
      />
      <div
        className="relative flex flex-col gap-[119px] items-center justify-start h-full"
        data-name="match-report-content"
      >
        {/* Header */}
        <motion.div
          className="flex flex-row gap-2 items-center justify-center self-stretch shrink-0 h-[220px] relative"
          data-name="header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div
            className="shrink-0 w-[74px] h-[74px] relative"
            data-name="bg-team-logo"
          >
            <div
              className="bg-[#d9d9d9] w-full h-full absolute inset-0"
              data-name="bg-team-logo-fill"
            />
          </div>
          <div
            className="flex flex-col items-center justify-start shrink-0 w-[379px] relative"
            data-name="team-name-container"
          >
            <div
              className="text-white text-center font-['Inter:Bold',sans-serif] font-bold text-[40px] relative self-stretch flex items-center justify-center"
              data-name="team-name"
            >
              <p className="leading-tight m-0 truncate w-full">{blueName}</p>
            </div>
            <div
              className="text-white text-center font-['Inter:Bold',sans-serif] font-bold text-[24px] relative self-stretch flex items-center justify-center"
              data-name="win-or-defeat"
            >
              <p className="leading-tight m-0">
                {decided ? (blueWin ? "Victory" : "Defeat") : ""}
              </p>
            </div>
          </div>
          <div
            className="bg-[#d69345] flex flex-col gap-[10px] items-center justify-center shrink-0 w-[99px] h-[99px] relative"
            data-name="blue-team-score"
          >
            <div
              className="text-white text-center font-['Inter:Bold',sans-serif] font-bold text-[64px] relative flex items-center justify-center"
              data-name="map-draw-name"
            >
              <p className="leading-none m-0">
                {padScore(matchScore.blueScore)}
              </p>
            </div>
          </div>
          <div
            className="shrink-0 w-[482px] h-[77px] relative"
            data-name="intech-fest-title"
          >
            <div
              className="text-white text-center font-['Inter:Bold',sans-serif] font-bold text-[40px] absolute inset-0 flex items-center justify-center"
              data-name="intech-fest-title-text"
            >
              <p className="leading-none m-0">INTECHFEST</p>
            </div>
          </div>
          <div
            className="bg-[#533920] flex flex-col gap-[10px] items-center justify-center shrink-0 w-[99px] h-[99px] relative"
            data-name="red-team-score"
          >
            <div
              className="text-white text-center font-['Inter:Bold',sans-serif] font-bold text-[64px] relative flex items-center justify-center"
              data-name="map-draw-name"
            >
              <p className="leading-none m-0">
                {padScore(matchScore.redScore)}
              </p>
            </div>
          </div>
          <div
            className="flex flex-col items-center justify-start shrink-0 w-[379px] relative"
            data-name="team-name-container"
          >
            <div
              className="text-white text-center font-['Inter:Bold',sans-serif] font-bold text-[40px] relative self-stretch flex items-center justify-center"
              data-name="team-name"
            >
              <p className="leading-tight m-0 truncate w-full">{redName}</p>
            </div>
            <div
              className="text-white text-center font-['Inter:Bold',sans-serif] font-bold text-[24px] relative self-stretch flex items-center justify-center"
              data-name="win-or-defeat"
            >
              <p className="leading-tight m-0">
                {decided ? (redWin ? "Victory" : "Defeat") : ""}
              </p>
            </div>
          </div>
          <div
            className="shrink-0 w-[74px] h-[74px] relative"
            data-name="bg-team-logo"
          >
            <div
              className="bg-[#d9d9d9] w-full h-full absolute inset-0"
              data-name="bg-team-logo-fill"
            />
          </div>
        </motion.div>

        {/* Body */}
        <div
          className="flex flex-row items-center justify-center self-stretch shrink-0 relative"
          data-name="body"
        >
          <div
            className="flex flex-col gap-[29px] items-start justify-center shrink-0 w-[684px] relative"
            data-name="blue-team-stats"
          >
            {[1, 2, 3, 4, 5].map((ipos, i) => (
              <BluePlayerRow key={ipos} ipos={ipos} index={i} />
            ))}
          </div>
          <StatsDiffEnd />
          <div
            className="flex flex-col gap-[29px] items-end justify-center shrink-0 w-[684px] relative"
            data-name="red-tim-stats"
          >
            {[6, 7, 8, 9, 10].map((ipos, i) => (
              <RedPlayerRow key={ipos} ipos={ipos} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
