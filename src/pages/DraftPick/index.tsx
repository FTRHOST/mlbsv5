import { appConfig } from "@/config";
import { motion, AnimatePresence } from "motion/react";
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useRoomData } from "../../hooks/useRoomData";
import { useMatchScore } from "../../hooks/useMatchScore";
import { useDisplayTeamNames } from "../../hooks/useTeamNames";
import UserAvatar from "../../components/UserAvatar";
import { useHeroStats } from "../../hooks/useHeroStats";

const DraftContext = createContext<any>({});

function findPlayer(players: any[], ipos: number) {
  if (!Array.isArray(players) || players.length === 0) return null;
  const exact = players.find(
    (p: any) => Number(p?.ipos) === ipos && Number(p?.ipos) > 0,
  );
  if (exact) return exact;

  const bluePlayers = players.filter((p: any) => Number(p?.team) === 1);
  const redPlayers = players.filter((p: any) => Number(p?.team) === 2);

  if (ipos <= 5 && bluePlayers.length > 0) {
    return bluePlayers[ipos - 1] || null;
  }
  if (ipos > 5 && redPlayers.length > 0) {
    return redPlayers[ipos - 6] || null;
  }

  return players[ipos - 1] || players[ipos] || null;
}

function usePlayerName(ipos: number) {
  const data = useContext(DraftContext);
  const players = Array.isArray(data?.players) ? data.players : [];
  const player = findPlayer(players, ipos);
  return player ? player.name : "NAMA";
}

function useBanHero(ipos: number) {
  const data = useContext(DraftContext);
  const players = Array.isArray(data?.players) ? data.players : [];
  const player = findPlayer(players, ipos);
  return player?.banHero || 0;
}

function usePlayerRole(ipos: number) {
  const data = useContext(DraftContext);
  const players = Array.isArray(data?.players) ? data.players : [];
  const player = findPlayer(players, ipos);
  return player?.role || 0;
}

function RoleImage({ ipos }: { ipos: number }) {
  const role = usePlayerRole(ipos);
  const src = role > 0 ? `/assets/lane/${role}.png` : img21;
  return (
    <div
      className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[80px] top-1/2"
      data-name="2 1"
    >
      <img
        alt=""
        className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
        src={src}
      />
    </div>
  );
}
import svgPaths from "./svg-l16smdwosq";
import imgBackgroundImage from "./9e72be5c6dd2ff24c0dbe0129186324d1805d951.png";
import imgBanBlue01 from "./3de34b4671e23cdd7cc6746069cabc97606109cc.png";
import imgBanBlue02 from "./b216ba322991141569ea859df27f40068d107865.png";
import img21 from "./71927f1dd2c7d1bd58a5899753e0d36780f6c033.png";
import imgCenterImage from "./848b204f9decb24d5f58e930a3a150d13e1b2fd2.png";
import imgCenterImage1 from "./38c1faaf3162709378f424e1c042906c553c8938.png";
import imgUserAvatar from "./f259c856a17bf9515576235ee603d83439a100bc.png";
import imgPlayerCard from "./aa840430ac65772baad581dbd06569706dadb39a.png";

function CoachInfo() {
  return (
    <div
      className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0"
      data-name="Coach Info"
    >
      <div className="col-1 h-[65px] ml-0 mt-0 relative row-1 w-[308px]">
        <svg
          className="absolute block inset-0 size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 308 65"
        >
          <path
            d="M0 0H233.5L308 65H0V0Z"
            fill="var(--fill-0, white)"
            id="Rectangle 11"
          />
        </svg>
      </div>
      <div className="[word-break:break-word] col-1 flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[65px] justify-center ml-[9px] mt-[0.88px] not-italic relative row-1 text-[#533920] text-[24px] w-[223px]">
        <p className="leading-[0px]">NAMA</p>
      </div>
    </div>
  );
}

function BanSlot({
  ipos,
  defaultImg,
  index,
}: {
  ipos: number;
  defaultImg: string;
  index: number;
}) {
  const banHero = useBanHero(ipos);
  return (
    <div
      className="relative shrink-0 size-[76px]"
      data-name={`ban-blue-0${index + 1}`}
    >
      <div
        className={`absolute inset-0 overflow-hidden pointer-events-none ${banHero === 0 ? "bg-[#808080]" : ""}`}
      >
        {banHero > 0 && (
          <img
            alt=""
            className="absolute h-[163.15%] left-[-0.4%] max-w-none top-[-11.53%] w-[100.4%] grayscale"
            src={`/assets/heroes/${banHero}.png`}
          />
        )}
      </div>
    </div>
  );
}

function BanBlue() {
  return (
    <div
      className="content-stretch flex gap-[6px] items-start relative shrink-0"
      data-name="ban-blue"
    >
      <BanSlot ipos={1} defaultImg={imgBanBlue01} index={0} />
      <BanSlot ipos={2} defaultImg={imgBanBlue02} index={1} />
      <BanSlot ipos={3} defaultImg={imgBanBlue02} index={2} />
      <BanSlot ipos={4} defaultImg={imgBanBlue02} index={3} />
      <BanSlot ipos={5} defaultImg={imgBanBlue02} index={4} />
    </div>
  );
}

function HorizontalLayout() {
  return (
    <div
      className="content-stretch flex gap-[14px] items-center relative shrink-0 w-full"
      data-name="Horizontal Layout"
    >
      <div
        className="bg-white h-[71px] relative shrink-0 w-[82px]"
        data-name="Profile Picture"
      >
        <div
          aria-hidden
          className="absolute border-3 border-[#533920] border-solid inset-0 pointer-events-none"
        />
      </div>
      <CoachInfo />
      <BanBlue />
    </div>
  );
}

function WinRateSection({ winRate }: { winRate: string }) {
  return (
    <div
      className="col-1 content-stretch flex flex-col gap-[19px] items-center justify-center justify-self-stretch relative row-3 self-stretch shrink-0"
      data-name="Win Rate Section"
    >
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[17px] justify-center relative shrink-0 text-[16px] w-full">
        <p className="leading-[0px]">WIN RATE</p>
      </div>
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[17px] justify-center relative shrink-0 text-[30px] w-full">
        <p className="leading-[0px]">{winRate}</p>
      </div>
    </div>
  );
}

function HeaderPickBan() {
  return (
    <div
      className="content-stretch flex items-center justify-center relative shrink-0 w-full"
      data-name="Header Pick - Ban"
    >
      <div className="flex flex-col h-[17px] justify-center relative shrink-0 w-[64px]">
        <p className="leading-[0px]">PICK</p>
      </div>
      <div className="flex flex-col h-[17px] justify-center relative shrink-0 w-[64px]">
        <p className="leading-[0px]">BAN</p>
      </div>
    </div>
  );
}

function ValuePickBan({ pick, ban }: { pick: number; ban: number }) {
  return (
    <div
      className="content-stretch flex items-center justify-center relative shrink-0 w-full"
      data-name="Value Pick Ban"
    >
      <div className="flex flex-col h-[17px] justify-center relative shrink-0 w-[64px]">
        <p className="leading-[0px]">{pick}</p>
      </div>
      <div className="flex flex-col h-[17px] justify-center relative shrink-0 w-[64px]">
        <p className="leading-[0px]">{ban}</p>
      </div>
    </div>
  );
}

function PickBanRate({ pick, ban }: { pick: number; ban: number }) {
  return (
    <div
      className="col-1 content-stretch flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold gap-[10px] h-[45px] items-start justify-self-stretch relative row-2 self-start shrink-0 text-[16px]"
      data-name="Pick Ban Rate"
    >
      <HeaderPickBan />
      <ValuePickBan pick={pick} ban={ban} />
    </div>
  );
}

function StatisticInfoPick({
  winRate,
  pick,
  ban,
  heroName,
}: {
  winRate: string;
  pick: number;
  ban: number;
  heroName: string;
}) {
  return (
    <div
      className="[word-break:break-word] absolute gap-y-[9px] grid grid-cols-[repeat(1,minmax(0,1fr))] grid-rows-[___minmax(0,1fr)_minmax(0,1fr)_122px] h-[213px] leading-[0] left-[-0.5px] not-italic text-[#533920] text-center top-0 w-[160px]"
      data-name="Statistic Info Pick"
    >
      <WinRateSection winRate={winRate} />
      <PickBanRate pick={pick} ban={ban} />
      <div className="col-1 flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[32px] justify-center justify-self-stretch relative row-1 shrink-0 text-[16px]">
        <p className="leading-[0px] uppercase">{heroName}</p>
      </div>
    </div>
  );
}

function usePlayer(ipos: number) {
  const data = useContext(DraftContext);
  const players = Array.isArray(data?.players) ? data.players : [];
  return findPlayer(players, ipos);
}

function PlayerCardContent({ ipos }: { ipos: number }) {
  const player = usePlayer(ipos);
  const playerName = player?.name || "NAMA";
  const selHeroID = player?.SelHeroID || 0;
  const pickPhase = player?.pickPhase || false;

  const [showStats, setShowStats] = useState(false);
  const prevHeroID = useRef(0);
  const stats = useHeroStats(selHeroID);

  useEffect(() => {
    if (selHeroID > 0 && selHeroID !== prevHeroID.current) {
      prevHeroID.current = selHeroID;
      const t1 = setTimeout(() => {
        setShowStats(true);
        const t2 = setTimeout(() => {
          setShowStats(false);
        }, 3000);
        return () => clearTimeout(t2);
      }, 1000);
      return () => clearTimeout(t1);
    }
  }, [selHeroID]);

  const defaultBg =
    ipos <= 5 ? "var(--fill-0, #533920)" : "var(--fill-0, #1E1E1E)";

  return (
    <div className="h-[242px] overflow-hidden relative shrink-0 w-[159px]">
      {/* Active Pick Turn Pulsing Aura */}
      {pickPhase && selHeroID === 0 && (
        <motion.div
          animate={{ opacity: [0.3, 0.9, 0.3], scale: [0.98, 1.02, 0.98] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 border-3 border-[#E8D367] shadow-[0_0_18px_#E8D367] z-20 pointer-events-none rounded"
        />
      )}

      {/* Hero Lock-in Flash Beam Effect */}
      <AnimatePresence>
        {selHeroID > 0 && (
          <motion.div
            key={`flash_${selHeroID}`}
            initial={{ opacity: 0.9, x: "-100%" }}
            animate={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFF4BD] to-transparent z-30 pointer-events-none skew-x-12"
          />
        )}
      </AnimatePresence>

      <div
        className="-translate-x-1/2 absolute h-[242px] left-1/2 top-0 w-[159px]"
        data-name="playerCard"
      >
        {selHeroID > 0 && !showStats ? (
          <motion.img
            key={`hero_${selHeroID}`}
            initial={{ scale: 1.35, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            alt=""
            className="absolute block inset-0 max-w-none size-full object-cover"
            height="242"
            src={`/assets/heroes/${selHeroID}.png`}
            width="159"
          />
        ) : (
          <svg
            className="absolute block inset-0 size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 159 242"
          >
            <path
              d="M0 0H159V242H0V0Z"
              fill={showStats ? "var(--fill-0, #EEDFC3)" : defaultBg}
              id="playerCard"
            />
          </svg>
        )}
      </div>

      {pickPhase && selHeroID === 0 && (
        <div
          className="absolute h-[216px] left-[0.5px] top-0 w-[155px]"
          data-name="User Avatar"
        >
          <UserAvatar
            userId={player?.id}
            fallback={imgUserAvatar}
            className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
          />
        </div>
      )}

      {selHeroID === 0 && !pickPhase && <RoleImage ipos={ipos} />}

      <div
        className="absolute bg-[#e8d367] border-3 border-[#1e1e1e] border-solid h-[29px] left-0 top-[213px] w-[159px] z-10"
        data-name="Player Card Background"
      />
      <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[22px] justify-center leading-[0] left-[calc(50%-0.5px)] not-italic text-[#533920] text-[16px] text-center top-[227px] w-[152px] z-10">
        <p className="leading-[0px]">{playerName}</p>
      </div>

      <AnimatePresence>
        {showStats && (
          <motion.div
            key={`stats_${selHeroID}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 pointer-events-none z-20"
          >
            <StatisticInfoPick
              winRate={stats.winRate}
              pick={stats.pick}
              ban={stats.ban}
              heroName={stats.heroName}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PlayerCardsBlue() {
  return (
    <div
      className="content-stretch flex gap-[7px] items-center relative shrink-0 w-full"
      data-name="Player Cards Blue"
    >
      {[1, 2, 3, 4, 5].map((ipos) => (
        <PlayerCardContent key={ipos} ipos={ipos} />
      ))}
    </div>
  );
}

function VerticalLayout() {
  return (
    <div
      className="col-1 content-stretch flex flex-col gap-[5px] items-start ml-[5px] mt-[4px] relative row-1 w-[823px]"
      data-name="Vertical Layout"
    >
      <HorizontalLayout />
      <PlayerCardsBlue />
    </div>
  );
}

function BlueTeam() {
  return (
    <div
      className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0"
      data-name="Blue Team"
    >
      <div
        className="bg-[#e8d367] col-1 h-[331px] ml-0 mt-0 relative row-1 w-[833px]"
        data-name="Background"
      />
      <VerticalLayout />
    </div>
  );
}

function useDraftTimer() {
  const data = useContext(DraftContext);
  const rawTimer =
    Number(
      data?.draftTimer !== undefined ? data.draftTimer : data?.draftTime,
    ) || 30;
  const draftTime = rawTimer > 1000 ? Math.floor(rawTimer / 1000) : rawTimer;
  const agentTimestamp = data?.agentTimestamp;
  const [timeLeft, setTimeLeft] = useState(draftTime);

  useEffect(() => {
    if (!agentTimestamp) {
      setTimeLeft(draftTime);
      return;
    }

    const startMs = new Date(agentTimestamp).getTime();
    if (isNaN(startMs)) {
      setTimeLeft(draftTime);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startMs) / 1000);
      const remaining = Math.max(0, draftTime - elapsed);
      setTimeLeft(isNaN(remaining) ? 0 : remaining);
    }, 250);

    return () => clearInterval(interval);
  }, [draftTime, agentTimestamp]);

  return timeLeft;
}

function MidSection() {
  const timeLeft = useDraftTimer();
  const data = useContext(DraftContext);
  const mapDraw = data?.mapDraw || 2;
  const draftPhase = data?.draftPhase || 1;

  let mapText = "DANGEREOUS GRASS";
  if (mapDraw === 1) mapText = "BROKEN WALLS";
  if (mapDraw === 2) mapText = "DANGEREOUS GRASS";
  if (mapDraw === 3) mapText = "FLYING CLOUD";
  if (mapDraw === 4) mapText = "EXPANDING RIVER";
  if (mapDraw === 5) mapText = "EXPANDING RIVER dua";

  let phaseText = "BANNING";
  if (draftPhase >= 1 && draftPhase <= 3) phaseText = "BANNING";
  else if (draftPhase >= 4 && draftPhase <= 6) phaseText = "PICKING";
  else if (draftPhase === 7) phaseText = "PREPARATION";

  return (
    <div
      className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0"
      data-name="Mid Section"
    >
      <div
        className="bg-[#e8d367] col-1 h-[331px] ml-0 mt-0 relative row-1 w-[253px]"
        data-name="Timer Background"
      />
      <div
        className="col-1 h-[161px] ml-[79px] mt-[137px] relative row-1 w-[95px] flex items-center justify-center"
        data-name="Center Image"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
          src={imgCenterImage}
        />
        <p className="z-10 [word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic text-[64px] text-white whitespace-nowrap">
          {timeLeft}
        </p>
      </div>
      <div
        className="col-1 h-[47px] ml-0 mt-[85px] relative row-1 w-[253px]"
        data-name="Center Image"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
          src={`/assets/map-draw/${mapDraw}.png`}
        />
      </div>
      <div
        className="bg-white col-1 h-[85px] ml-0 mt-0 relative row-1 w-[253px]"
        data-name="Center Image"
      />
      <div
        className="bg-white col-1 h-[25px] ml-0 mt-[301px] relative row-1 w-[253px]"
        data-name="Center Image"
      />
      <div
        className="bg-white col-1 h-[161px] ml-0 mt-[137px] relative row-1 w-[75px]"
        data-name="Center Image"
      />
      <div
        className="bg-white col-1 h-[161px] ml-[178px] mt-[137px] relative row-1 w-[75px]"
        data-name="Center Image"
      />
      <div className="[word-break:break-word] col-1 flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[22px] justify-center ml-[51px] mt-[302px] not-italic relative row-1 text-[#533920] text-[16px] text-center w-[152px]">
        <p className="leading-[0px]">{phaseText}</p>
      </div>
      <div className="[word-break:break-word] col-1 flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center ml-[46px] mt-[109px] not-italic relative row-1 text-[#e8d367] text-[16px] text-center text-shadow-[0px_4px_16px_rgba(0,0,0,0.25)] whitespace-nowrap">
        <p className="leading-[0px] mb-0">{mapText}</p>
        <p className="leading-[0px]">​</p>
      </div>
    </div>
  );
}

function BanBlue1() {
  return (
    <div
      className="content-stretch flex gap-[6px] items-start relative shrink-0"
      data-name="ban-blue"
    >
      <BanSlot ipos={10} defaultImg={imgBanBlue01} index={0} />
      <BanSlot ipos={9} defaultImg={imgBanBlue02} index={1} />
      <BanSlot ipos={8} defaultImg={imgBanBlue02} index={2} />
      <BanSlot ipos={7} defaultImg={imgBanBlue02} index={3} />
      <BanSlot ipos={6} defaultImg={imgBanBlue02} index={4} />
    </div>
  );
}

function CoachInfo1() {
  return (
    <div
      className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0"
      data-name="Coach Info"
    >
      <div className="col-1 flex h-[65px] items-center justify-center ml-0 mt-[0.53px] relative row-1 w-[308px]">
        <div className="-scale-y-100 flex-none rotate-180">
          <div className="h-[65px] relative w-[308px]">
            <svg
              className="absolute block inset-0 size-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 308 65"
            >
              <path
                d="M0 0H233.5L308 65H0V0Z"
                fill="var(--fill-0, white)"
                id="Rectangle 11"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="[word-break:break-word] col-1 flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[65px] justify-center ml-[77px] mt-0 not-italic relative row-1 text-[#533920] text-[24px] text-right w-[223px]">
        <p className="leading-[0px]">NAMA</p>
      </div>
    </div>
  );
}

function HorizontalLayout1() {
  return (
    <div
      className="content-stretch flex gap-[14px] items-center relative shrink-0 w-full"
      data-name="Horizontal Layout"
    >
      <BanBlue1 />
      <CoachInfo1 />
      <div
        className="bg-white h-[71px] relative shrink-0 w-[82px]"
        data-name="Profile Picture"
      >
        <div
          aria-hidden
          className="absolute border-3 border-[#533920] border-solid inset-0 pointer-events-none"
        />
      </div>
    </div>
  );
}

function PlayerCardsBlue1() {
  return (
    <div
      className="content-stretch flex gap-[7px] items-center relative shrink-0 w-full"
      data-name="Player Cards Blue"
    >
      {[10, 9, 8, 7, 6].map((ipos) => (
        <PlayerCardContent key={ipos} ipos={ipos} />
      ))}
    </div>
  );
}

function VerticalLayout1() {
  return (
    <div
      className="col-1 content-stretch flex flex-col gap-[5px] items-start ml-[5px] mt-[4px] relative row-1 w-[823px]"
      data-name="Vertical Layout"
    >
      <HorizontalLayout1 />
      <PlayerCardsBlue1 />
    </div>
  );
}

function RedTeam() {
  return (
    <div
      className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0"
      data-name="Red Team"
    >
      <div
        className="bg-[#e8d367] col-1 h-[331px] ml-0 mt-0 relative row-1 w-[833px]"
        data-name="Background"
      />
      <VerticalLayout1 />
    </div>
  );
}

function DraftpickSection() {
  return (
    <motion.div
      className="absolute content-stretch flex items-center justify-center leading-[0] left-0 top-[748px] w-[1920px]"
      data-name="Draftpick Section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 1.18, ease: "linear" }}
    >
      <BlueTeam />
      <MidSection />
      <RedTeam />
    </motion.div>
  );
}

function BlueTeamContainer() {
  const data = useContext(DraftContext);
  const teamName = data?.blue_team_name || data?.blueTeamName || "BLUE TEAM";
  const draftPhase = data?.draftPhase || 0;
  const isBlueTurn = [1, 3, 4, 6, 7].includes(draftPhase);

  return (
    <motion.div
      className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0"
      data-name="Blue Team Container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.9, ease: "easeOut" }}
    >
      <div className="col-1 flex h-[66px] items-center justify-center ml-[102px] mt-[16px] relative row-1 w-[332px]">
        <motion.div
          className="-scale-y-100 flex-none rotate-180"
          animate={{ opacity: isBlueTurn ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className="bg-gradient-to-r from-[#d69345] h-[66px] relative to-[rgba(115,115,115,0)] w-[332px]"
            data-name="Blue Team Border"
          />
        </motion.div>
      </div>
      <div className="[word-break:break-word] col-1 flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[95px] justify-center ml-0 mt-0 not-italic relative row-1 text-[48px] text-center text-shadow-[0px_4px_16px_rgba(0,0,0,0.25)] text-white w-[554px]">
        <p className="leading-[0px]">{teamName}</p>
      </div>
      <motion.div
        className="col-1 flex items-center justify-center ml-[465px] mt-[28px] relative row-1 size-[40px]"
        animate={{
          opacity: isBlueTurn ? 1 : 0,
          x: isBlueTurn ? [0, -10, 0] : 0,
        }}
        transition={{
          opacity: { duration: 0.3 },
          x: { repeat: Infinity, duration: 1, ease: "easeInOut" },
        }}
      >
        <div className="-rotate-90 flex-none">
          <div className="relative size-[40px]">
            <div className="absolute inset-[-40%_-43.3%_-35%_-43.3%]">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 74.641 70"
              >
                <g filter="url(#filter0_d_1_185)" id="Polygon 1">
                  <path d={svgPaths.p39a6bef0} fill="var(--fill-0, #D9D9D9)" />
                  <path
                    d={svgPaths.p169b3f00}
                    stroke="var(--stroke-0, #D69345)"
                  />
                </g>
                <defs>
                  <filter
                    colorInterpolationFilters="sRGB"
                    filterUnits="userSpaceOnUse"
                    height="70"
                    id="filter0_d_1_185"
                    width="74.641"
                    x="0"
                    y="0"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      result="hardAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    />
                    <feOffset dy="4" />
                    <feGaussianBlur stdDeviation="10" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0.839216 0 0 0 0 0.576471 0 0 0 0 0.270588 0 0 0 1 0"
                    />
                    <feBlend
                      in2="BackgroundImageFix"
                      mode="normal"
                      result="effect1_dropShadow_1_185"
                    />
                    <feBlend
                      in="SourceGraphic"
                      in2="effect1_dropShadow_1_185"
                      mode="normal"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function BlueTeamScore() {
  const data = useContext(DraftContext);
  const maxScore = data?.bestOf || 3;
  const score = data?.blueScore || 0;

  // Calculate box spacing dynamically so BO1, BO3, BO5, BO7 fit without overlapping LogoContainer
  const step = maxScore <= 1 ? 0 : Math.min(61, 95 / (maxScore - 1));

  const boxes = [];
  for (let i = 0; i < maxScore; i++) {
    const isFilled = i < score;
    const shift = i * step;
    const pathD = `M${66.4326 + shift} 17 L${111.238 + shift} 92 H${67.5615 + shift} L${21.7822 + shift} 17 Z`;

    boxes.push(
      <g filter={`url(#blue_filter_${i})`} key={i}>
        {isFilled && <path d={pathD} fill="var(--fill-0, #EEDFC3)" />}
        <path
          d={pathD}
          stroke="var(--stroke-0, #E8D367)"
          strokeWidth="2"
          shapeRendering="crispEdges"
        />
      </g>,
    );
  }

  const viewBoxWidth = Math.max(215, 115 + (maxScore - 1) * step);

  return (
    <motion.div
      className="absolute h-[77px] left-0 top-[5px] w-[180px]"
      data-name="Blue Team Score"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.24, delay: 0.65, ease: "easeOut" }}
    >
      <div className="absolute inset-[-20.78%_-9.3%_-31.17%_-9.3%]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox={`0 0 ${viewBoxWidth} 117`}
        >
          <g>{boxes}</g>
          <defs>
            {[...Array(maxScore)].map((_, i) => (
              <filter
                key={i}
                colorInterpolationFilters="sRGB"
                filterUnits="userSpaceOnUse"
                height="117"
                id={`blue_filter_${i}`}
                width="133"
                x={i * step}
                y="0"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  result="hardAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="10" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.909804 0 0 0 0 0.827451 0 0 0 0 0.403922 0 0 0 1 0"
                />
                <feBlend
                  in2="BackgroundImageFix"
                  mode="normal"
                  result="effect1_dropShadow"
                />
                <feBlend
                  in="SourceGraphic"
                  in2="effect1_dropShadow"
                  mode="normal"
                  result="shape"
                />
              </filter>
            ))}
          </defs>
        </svg>
      </div>
    </motion.div>
  );
}

function LogoContainer() {
  return (
    <motion.div
      className="absolute contents left-1/2 top-[-35px]"
      data-name="LOGO CONTAINER"
      initial={{ opacity: 0, y: -279 }}
      animate={{ opacity: 1, y: -15 }}
      transition={{
        opacity: { duration: 0.35, delay: 0.37, ease: "easeOut" },
        y: { duration: 0.71, delay: 0, ease: "linear" },
      }}
    >
      <div
        className="-translate-x-1/2 absolute h-[79px] left-1/2 top-[-5px] w-[226px]"
        data-name="Header"
      >
        <div className="absolute inset-[-20.25%_-8.85%_-30.38%_-8.85%]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 266 119"
          >
            <g filter="url(#filter0_d_1_183)" id="Header">
              <path d={svgPaths.p2f46100} fill="url(#paint0_radial_1_183)" />
              <path d={svgPaths.p8170f00} stroke="var(--stroke-0, #E8D367)" />
            </g>
            <defs>
              <filter
                colorInterpolationFilters="sRGB"
                filterUnits="userSpaceOnUse"
                height="119"
                id="filter0_d_1_183"
                width="266"
                x="0"
                y="0"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  result="hardAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="10" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.877423 0 0 0 0 0.765566 0 0 0 0 0.190305 0 0 0 1 0"
                />
                <feBlend
                  in2="BackgroundImageFix"
                  mode="normal"
                  result="effect1_dropShadow_1_183"
                />
                <feBlend
                  in="SourceGraphic"
                  in2="effect1_dropShadow_1_183"
                  mode="normal"
                  result="shape"
                />
              </filter>
              <radialGradient
                cx="0"
                cy="0"
                gradientTransform="translate(133 16) rotate(90) scale(79 226)"
                gradientUnits="userSpaceOnUse"
                id="paint0_radial_1_183"
                r="1"
              >
                <stop stopColor="#6C4929" />
                <stop offset="1" stopColor="#D69345" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div
        className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[80px] top-[calc(50%-34.5px)]"
        data-name="LOGO"
      >
        <motion.div
          className="absolute inset-0"
          initial={{ y: -110, opacity: 0, scale: 1.4 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <img
            alt=""
            className="max-w-none object-cover pointer-events-none size-full"
            src={img21}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

function RedTeamScore() {
  const data = useContext(DraftContext);
  const maxScore = data?.bestOf || 3;
  const score = data?.redScore || 0;

  // Calculate box spacing dynamically so BO1, BO3, BO5, BO7 fit without overlapping LogoContainer
  const step = maxScore <= 1 ? 0 : Math.min(61, 95 / (maxScore - 1));

  const boxes = [];
  for (let i = 0; i < maxScore; i++) {
    const isFilled = i < score;
    const shift = i * step;
    const pathD = `M${66.4326 + shift} 17 L${111.238 + shift} 92 H${67.5615 + shift} L${21.7822 + shift} 17 Z`;

    boxes.push(
      <g filter={`url(#red_filter_${i})`} key={i}>
        {isFilled && <path d={pathD} fill="var(--fill-0, #EEDFC3)" />}
        <path
          d={pathD}
          stroke="var(--stroke-0, #E8D367)"
          strokeWidth="2"
          shapeRendering="crispEdges"
        />
      </g>,
    );
  }

  const viewBoxWidth = Math.max(215, 115 + (maxScore - 1) * step);

  return (
    <div className="absolute flex h-[77px] items-center justify-center right-0 top-[5px] w-[180px]">
      <div className="-scale-y-100 flex-none rotate-180">
        <motion.div
          className="h-[77px] relative w-[180px]"
          data-name="Red Team Score"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.24, delay: 0.65, ease: "easeOut" }}
        >
          <div className="absolute inset-[-20.78%_-9.3%_-31.17%_-9.3%]">
            <svg
              className="block size-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox={`0 0 ${viewBoxWidth} 117`}
            >
              <g>{boxes}</g>
              <defs>
                {[...Array(maxScore)].map((_, i) => (
                  <filter
                    key={i}
                    colorInterpolationFilters="sRGB"
                    filterUnits="userSpaceOnUse"
                    height="117"
                    id={`red_filter_${i}`}
                    width="133"
                    x={i * step}
                    y="0"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      result="hardAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    />
                    <feOffset dy="4" />
                    <feGaussianBlur stdDeviation="10" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0.909804 0 0 0 0 0.827451 0 0 0 0 0.403922 0 0 0 1 0"
                    />
                    <feBlend
                      in2="BackgroundImageFix"
                      mode="normal"
                      result="effect1_dropShadow"
                    />
                    <feBlend
                      in="SourceGraphic"
                      in2="effect1_dropShadow"
                      mode="normal"
                      result="shape"
                    />
                  </filter>
                ))}
              </defs>
            </svg>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Menu() {
  return (
    <div className="h-[79px] relative shrink-0 w-[590px]" data-name="Menu">
      <BlueTeamScore />
      <LogoContainer />
      <RedTeamScore />
    </div>
  );
}

function RedTeamContainer() {
  const data = useContext(DraftContext);
  const teamName = data?.red_team_name || data?.redTeamName || "RED TEAM";
  const draftPhase = data?.draftPhase || 0;
  const isRedTurn = [2, 3, 5, 6, 7].includes(draftPhase);

  return (
    <motion.div
      className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0"
      data-name="Red Team Container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.9, ease: "easeOut" }}
    >
      <motion.div
        className="bg-gradient-to-r col-1 from-[#d69345] h-[66px] ml-[142px] mt-[16px] relative row-1 to-[rgba(115,115,115,0)] w-[332px]"
        data-name="Red Team Border"
        animate={{ opacity: isRedTurn ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      <div className="[word-break:break-word] col-1 flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[95px] justify-center ml-0 mt-0 not-italic relative row-1 text-[48px] text-center text-shadow-[0px_4px_16px_rgba(0,0,0,0.25)] text-white w-[554px]">
        <p className="leading-[0px]">{teamName}</p>
      </div>
      <motion.div
        className="col-1 flex items-center justify-center ml-[77px] mt-[28px] relative row-1 size-[40px]"
        animate={{ opacity: isRedTurn ? 1 : 0, x: isRedTurn ? [0, 10, 0] : 0 }}
        transition={{
          opacity: { duration: 0.3 },
          x: { repeat: Infinity, duration: 1, ease: "easeInOut" },
        }}
      >
        <div className="flex-none rotate-90">
          <div className="relative size-[40px]">
            <div className="absolute inset-[-40%_-43.3%_-35%_-43.3%]">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 74.641 70"
              >
                <g filter="url(#filter0_d_1_170)" id="Polygon 2">
                  <path d={svgPaths.p39a6bef0} fill="var(--fill-0, #D9D9D9)" />
                  <path
                    d={svgPaths.p169b3f00}
                    stroke="var(--stroke-0, #D69345)"
                  />
                </g>
                <defs>
                  <filter
                    colorInterpolationFilters="sRGB"
                    filterUnits="userSpaceOnUse"
                    height="70"
                    id="filter0_d_1_170"
                    width="74.641"
                    x="0"
                    y="0"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      result="hardAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    />
                    <feOffset dy="4" />
                    <feGaussianBlur stdDeviation="10" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0.839216 0 0 0 0 0.576471 0 0 0 0 0.270588 0 0 0 1 0"
                    />
                    <feBlend
                      in2="BackgroundImageFix"
                      mode="normal"
                      result="effect1_dropShadow_1_170"
                    />
                    <feBlend
                      in="SourceGraphic"
                      in2="effect1_dropShadow_1_170"
                      mode="normal"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── VS Preview helpers (sama desain & peletakan dengan kode Figma user) ───
 * .user-profile-preview : 2 avatar besar (biru vs merah, role sama) dengan gap 90px,
 *   muncul + beranimasi slide dari sisi masing-masing.
 * .team-preview-profile : 5 avatar satu tim, flex-row items-end justify-center h-758px,
 *   avatar pertama 377x591, sisanya 380x595 overlap ml -20px. Statis (tanpa ombak);
 *   pindah tim A→B hanya crossfade + geser sederhana, looping sampai game dimulai.
 * .blue-team3 (NAMA TEAM) : label nama tim, tampil saat TeamPreviewProfile.
 */
function useRolePair(role: number) {
  const data = useContext(DraftContext);
  const players = Array.isArray(data?.players) ? data.players : [];
  const bySlot = (team: number) =>
    players
      .filter((p: any) => Number(p?.team) === team)
      .sort((a: any, b: any) => (Number(a?.ipos) || 0) - (Number(b?.ipos) || 0));
  const blueSorted = bySlot(1);
  const redSorted = bySlot(2);
  // Utama: pasangan se-role; fallback: pasangan se-urutan slot (role belum ada di live data).
  const blue =
    players.find(
      (p: any) => Number(p?.team) === 1 && Number(p?.role) === role,
    ) ||
    blueSorted[role - 1] ||
    null;
  const red =
    players.find(
      (p: any) => Number(p?.team) === 2 && Number(p?.role) === role,
    ) ||
    redSorted[role - 1] ||
    null;
  return { blue, red };
}

function useTeamPlayers(team: number) {
  const data = useContext(DraftContext);
  const players = Array.isArray(data?.players) ? data.players : [];
  const teamPlayers = players.filter((p: any) => Number(p?.team) === team);
  const sorted = [...teamPlayers].sort(
    (a: any, b: any) =>
      (Number(a?.role) || 99) - (Number(b?.role) || 99) ||
      (Number(a?.ipos) || 0) - (Number(b?.ipos) || 0),
  );
  while (sorted.length < 5) sorted.push(null);
  return sorted.slice(0, 5);
}

function UserProfilePreview({ role }: { role: number }) {
  const { blue, red } = useRolePair(role);
  return (
    <motion.div
      className="absolute left-0 top-3 flex h-[758px] w-[1920px] flex-row items-end justify-center gap-[770px] pointer-events-none"
      data-name="User Profile Preview"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        key={`blue_${blue?.id ?? "fallback"}_${role}`}
        initial={{ x: -340, opacity: 0, scale: 1.25 }}
        animate={{ x: 0, opacity: 1, scale: 1 }}
        exit={{ x: -160, opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
        data-name="user-avatar-blue-team"
      >
        <UserAvatar
          userId={blue?.id}
          fallback={imgUserAvatar}
          className="h-[700px] w-[447px] object-cover pointer-events-none"
        />
      </motion.div>
      <motion.div
        key={`red_${red?.id ?? "fallback"}_${role}`}
        initial={{ x: 340, opacity: 0, scale: 1.25 }}
        animate={{ x: 0, opacity: 1, scale: 1 }}
        exit={{ x: 160, opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.65, ease: "easeOut", delay: 0.12 }}
        data-name="user-avatar-red-team"
      >
        <UserAvatar
          userId={red?.id}
          fallback={imgUserAvatar}
          className="h-[704px] w-[450px] object-cover pointer-events-none"
        />
      </motion.div>
    </motion.div>
  );
}

function TeamPreviewProfile({ team }: { team: 1 | 2 }) {
  const teamPlayers = useTeamPlayers(team);
  return (
    <motion.div
      className="absolute left-0 top-5 flex h-[758px] w-[1920px] flex-row items-end justify-center pointer-events-none"
      data-name="Team Preview Profile"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {teamPlayers.map((p: any, i: number) => (
        <motion.div
          key={`${team}_${p?.id ?? i}_${i}`}
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.08 }}
          className={i === 0 ? "" : "ml-[-20px]"}
          data-name={`user-avatar-${team === 1 ? "blue" : "red"}-team-${i + 1}`}
        >
          <UserAvatar
            userId={p?.id}
            fallback={imgUserAvatar}
            className={
              i === 0
                ? "h-[591px] w-[377px] object-cover pointer-events-none"
                : "h-[595px] w-[380px] object-cover pointer-events-none"
            }
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

function TeamNameLabel({ team }: { team: 1 | 2 }) {
  const data = useContext(DraftContext);
  const teamName =
    team === 1
      ? data?.blue_team_name || data?.blueTeamName || "NAMA TEAM"
      : data?.red_team_name || data?.redTeamName || "NAMA TEAM";
  return (
    <motion.div
      className="absolute left-1/2 top-[90px] z-40 w-[1200px] -translate-x-1/2 pointer-events-none"
      data-name="NAMA TEAM"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <p className="text-center font-['Inter:Bold',sans-serif] font-bold text-[72px] leading-[1] text-white text-shadow-[0px_4px_16px_rgba(0,0,0,0.45)]">
        {teamName}
      </p>
    </motion.div>
  );
}

/* Sequence: VS per-role (2.6s tiap role) → TeamPreview looping + NAMA TEAM sampai game dimulai.
 * Pemicu: SEMUA fase draft (BANNING, PICKING, PREPARATION, numerik 1-7) — tampil sejak draftpick
 * dimulai begitu overlay menerima data player. Mati saat game dimulai (IN_GAME / gameState >= 4).
 * Untuk cek desain via MCP tanpa live data: tambah ?preview=vs atau ?preview=team di URL.
 */
function PreviewSequence() {
  const data = useContext(DraftContext);
  const draftPhase = data?.draftPhase;
  const gameState = Number(data?.gameState ?? 0);
  const forcePreview =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("preview")
      : null;

  const phaseStr = String(draftPhase ?? "").toUpperCase();
  const phaseNum = Number(draftPhase);
  const isDraftPhase =
    (Number.isFinite(phaseNum) && phaseNum >= 1 && phaseNum <= 7) ||
    phaseStr.includes("BAN") ||
    phaseStr.includes("PICK") ||
    phaseStr === "PREPARATION";
  const gameStarted = gameState >= 4 || phaseStr === "IN_GAME";
  const showPreview =
    forcePreview === "vs" || forcePreview === "team"
      ? true
      : isDraftPhase && !gameStarted;
  const [vsIndex, setVsIndex] = useState(0);
  const [showTeam, setShowTeam] = useState(forcePreview === "team");
  const [teamSide, setTeamSide] = useState<1 | 2>(1);

  useEffect(() => {
    if (!showPreview) return;
    if (forcePreview === "team") {
      setShowTeam(true);
      return;
    }
    if (forcePreview === "vs") {
      setShowTeam(false);
      const t = setInterval(() => setVsIndex((i) => (i + 1) % 5), 2600);
      return () => clearInterval(t);
    }
    setVsIndex(0);
    setShowTeam(false);
    const t = setInterval(() => {
      setVsIndex((i) => {
        if (i >= 4) {
          clearInterval(t);
          setTimeout(() => setShowTeam(true), 700);
          return i;
        }
        return i + 1;
      });
    }, 2600);
    return () => clearInterval(t);
  }, [showPreview, forcePreview, isDraftPhase]);

  useEffect(() => {
    if (!showTeam || !showPreview) return;
    const t = setInterval(() => setTeamSide((s) => (s === 1 ? 2 : 1)), 4000);
    return () => clearInterval(t);
  }, [showTeam, showPreview]);

  if (!showPreview) return null;
  const role = vsIndex + 1;

  return (
    <>
      <AnimatePresence>
        {!showTeam && <UserProfilePreview key={`vs_${role}`} role={role} />}
      </AnimatePresence>
      <AnimatePresence>
        {showTeam && (
          <motion.div
            key={`teamwrap_${teamSide}`}
            initial={{ opacity: 0, x: teamSide === 1 ? 80 : -80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: teamSide === 1 ? -80 : 80 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <TeamPreviewProfile team={teamSide} />
            <TeamNameLabel team={teamSide} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ScoreboardSection() {
  return (
    <div
      className="-translate-x-1/2 absolute content-stretch flex gap-[52px] items-center justify-center left-[calc(50%+0.5px)] top-[645px] w-[1919px]"
      data-name="Scoreboard Section"
    >
      <BlueTeamContainer />
      <Menu />
      <RedTeamContainer />
    </div>
  );
}

export default function DraftPick() {
  const roomData = useRoomData();
  // Nama tim otomatis dari team_mappings bila rooms masih placeholder.
  const teamNames = useDisplayTeamNames();
  const resolvedBlue = teamNames.blue || roomData?.blue_team_name;
  const resolvedRed = teamNames.red || roomData?.red_team_name;
  const matchScore = useMatchScore(resolvedBlue, resolvedRed);

  const mergedData = {
    ...roomData,
    blue_team_name: resolvedBlue,
    red_team_name: resolvedRed,
    blueScore: matchScore.blueScore,
    redScore: matchScore.redScore,
    bestOf: matchScore.bestOf,
  };

  return (
    <DraftContext.Provider value={mergedData || {}}>
      <div className="bg-[#e63030] relative size-full" data-name="DraftPick">
        <div
          className="-translate-x-1/2 absolute h-[1080px] left-1/2 top-0 w-[1920px]"
          data-name="Background Image"
        >
          <img
            alt=""
            className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
            src={imgBackgroundImage}
          />
        </div>
        <PreviewSequence />
        <DraftpickSection />
        <ScoreboardSection />
      </div>
    </DraftContext.Provider>
  );
}
