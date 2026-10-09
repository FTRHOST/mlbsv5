import { motion } from "motion/react";
import { useWinnerOverride } from "../../hooks/useBracketControl";
import { useDisplayTeamNames } from "../../hooks/useTeamNames";
import { useMatchScore } from "../../hooks/useMatchScore";
import { useRoomData } from "../../hooks/useRoomData";

export default function Win() {
  const roomData = useRoomData();
  const teamNames = useDisplayTeamNames();
  const matchScore = useMatchScore(
    teamNames.blue ?? undefined,
    teamNames.red ?? undefined,
  );

  const battle = roomData?.battle ?? roomData?.Battle ?? {};
  const winCamp = Number(battle.winCamp);
  const autoWinner =
    matchScore.blueScore !== matchScore.redScore
      ? matchScore.blueScore > matchScore.redScore
        ? teamNames.blue || ""
        : teamNames.red || ""
      : winCamp === 1
        ? teamNames.blue || ""
        : winCamp === 2
          ? teamNames.red || ""
          : "";

  const { winner } = useWinnerOverride(autoWinner || "NAMA TEAM");

  return (
    <div className="relative w-[1920px] h-[1080px] overflow-hidden bg-white">
      <img
        alt=""
        src="/assets/win/bg-blur.png"
        className="absolute w-[1922px] h-[1080px] object-cover pointer-events-none"
        style={{ left: 0, top: 0, filter: "blur(16.5px)" }}
      />

      {/* Slot kosong untuk overlay game via scrcpy */}
      <div
        className="absolute w-[1095px] h-[616px] bg-white border-[11px] border-[#e8d367] overflow-hidden"
        style={{ left: "50%", transform: "translateX(-50%)", top: 100 }}
      />

      <img
        alt=""
        src="/assets/win/logo.png"
        className="absolute w-[213px] h-[213px] object-cover"
        style={{ left: 77, top: 100 }}
      />

      <div
        className="absolute w-[1213px] h-[271px]"
        style={{
          left: -18,
          top: 809,
          background:
            "linear-gradient(85.28deg, rgba(74,22,22,0.62) 14.7%, rgba(151,45,45,0.62) 63.3%, rgba(176,52,52,0) 100%)",
        }}
      />

      <motion.p
        className="absolute m-0 text-left"
        style={{
          left: 77,
          top: 862,
          color: "#fce98a",
          fontFamily: "Koulen, 'Inter', sans-serif",
          fontSize: 160,
          lineHeight: 1,
        }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        VICTORY MOMENT
      </motion.p>

      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <img
          alt=""
          src="/assets/win/ribbon.svg"
          className="absolute w-[356px] h-[53px]"
          style={{ left: 413, top: 738 }}
        />
        <p
          className="absolute text-white font-normal text-[36px] m-0 truncate max-w-[320px]"
          style={{
            left: 431,
            top: 738,
            fontFamily: "'Lilita One', 'Inter', sans-serif",
          }}
        >
          {winner}
        </p>
      </motion.div>
    </div>
  );
}
