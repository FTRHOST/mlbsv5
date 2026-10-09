import { motion } from "motion/react";
import { useSesaatLagi } from "../../hooks/useBracketControl";
import { useDisplayTeamNames } from "../../hooks/useTeamNames";
import { useMatchScore } from "../../hooks/useMatchScore";

function formatTimer(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds || 0));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export default function SesaatLagi() {
  const { data, remaining } = useSesaatLagi();
  const teamNames = useDisplayTeamNames();
  const matchScore = useMatchScore(
    teamNames.blue ?? undefined,
    teamNames.red ?? undefined,
  );

  // Live data jadi fallback bila operator belum mengisi manual.
  const blue =
    data.blue && data.blue !== "TEAM NAME"
      ? data.blue
      : teamNames.blue || data.blue;
  const red =
    data.red && data.red !== "TEAM NAME" ? data.red : teamNames.red || data.red;
  const autoGame =
    matchScore.bestOf > 0
      ? `GAME KE ${matchScore.blueScore + matchScore.redScore + 1}`
      : "";
  const game =
    data.game && data.game !== "GAME KE 1" ? data.game : autoGame || data.game;

  return (
    <div className="relative w-[1920px] h-[1080px] overflow-hidden bg-white">
      <img
        alt=""
        src="/assets/sesaatlagi/bg-blur.png"
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
        src="/assets/sesaatlagi/logo.png"
        className="absolute w-[213px] h-[213px] object-cover"
        style={{ left: 74, top: 100 }}
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

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <img
          alt=""
          src="/assets/sesaatlagi/ribbon-left.svg"
          className="absolute w-[356px] h-[53px]"
          style={{ left: 3, top: 748 }}
        />
        <p
          className="absolute text-white font-normal text-[36px] m-0"
          style={{
            left: 21,
            top: 748,
            fontFamily: "'Lilita One', 'Inter', sans-serif",
          }}
        >
          SESAAT LAGI
        </p>
      </motion.div>

      <img
        alt=""
        src="/assets/sesaatlagi/ribbon-right.svg"
        className="absolute w-[356px] h-[53px]"
        style={{ left: 1566, top: 748 }}
      />
      <p
        className="absolute text-white font-normal text-[36px] m-0"
        style={{
          left: 1653,
          top: 748,
          fontFamily: "'Lilita One', 'Inter', sans-serif",
        }}
      >
        {data.stage}
      </p>

      <p
        className="absolute m-0 text-left"
        style={{
          left: 77,
          top: 833,
          color: "#fce98a",
          fontFamily: "Koulen, 'Inter', sans-serif",
          fontSize: 64,
        }}
      >
        {game}
      </p>
      <p
        className="absolute m-0 text-left truncate max-w-[1450px]"
        style={{
          left: 77,
          top: 921,
          color: "#fce98a",
          fontFamily: "Koulen, 'Inter', sans-serif",
          fontSize: 96,
          lineHeight: 1,
        }}
      >
        {blue} VS {red}
      </p>

      <p
        className="absolute text-white font-normal text-[36px] m-0"
        style={{
          left: 1604,
          top: 844,
          fontFamily: "'Lilita One', 'Inter', sans-serif",
        }}
      >
        AKAN DIMULAI
      </p>
      <p
        className="absolute text-white font-normal text-[96px] m-0 tabular-nums"
        style={{
          left: 1592,
          top: 901,
          fontFamily: "'Lilita One', 'Inter', sans-serif",
        }}
      >
        {formatTimer(remaining)}
      </p>
    </div>
  );
}
