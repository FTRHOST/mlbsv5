import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useMatchRoomApi, PlayerData } from "@/hooks/useMatchRoomApi";
import { HERO_MAP, EQUIP_MAP } from "@/data/mlbbDict";

// Utility to format seconds into MM:SS
function formatGameTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// Reusable Hero Avatar with local /asset/heroes-icon/ fallback to .webp & remote CDN
function HeroAvatar({ heroId, playerName }: { heroId: number; playerName: string }) {
  const [srcIndex, setSrcIndex] = useState(0);

  const cdnUrl = HERO_MAP[heroId] || "https://akmweb.youngjoygame.com/web/gms/image/716fa6fcc7d4b4a73827db62e0c8fcf1.jpg";

  const sources = [
    `/asset/heroes-icon/${heroId}.png`,
    `/asset/heroes-icon/${heroId}.webp`,
    `/assets/heroes/${heroId}.webp`,
    cdnUrl
  ];

  const currentSrc = sources[srcIndex] || cdnUrl;

  const handleError = () => {
    if (srcIndex < sources.length - 1) {
      setSrcIndex((prev) => prev + 1);
    }
  };

  return (
    <img
      src={currentSrc}
      alt={playerName}
      onError={handleError}
      className="w-full h-full object-cover"
    />
  );
}

// Reusable Equip Icon with local /asset/equips/ fallback to .webp & remote CDN
function EquipItem({ equipId, equipName }: { equipId: number; equipName?: string }) {
  const [srcIndex, setSrcIndex] = useState(0);

  if (!equipId) {
    return <div className="w-full h-full bg-black/40" />;
  }

  const cdnUrl = EQUIP_MAP[equipId]?.icon || "";

  const sources = [
    `/asset/equips/${equipId}.png`,
    `/asset/equips/${equipId}.webp`,
    cdnUrl
  ].filter(Boolean);

  const currentSrc = sources[srcIndex] || "";

  const handleError = () => {
    if (srcIndex < sources.length - 1) {
      setSrcIndex((prev) => prev + 1);
    }
  };

  if (!currentSrc) {
    return <div className="w-full h-full bg-black/40" />;
  }

  return (
    <img
      src={currentSrc}
      alt={equipName || `equip_${equipId}`}
      onError={handleError}
      className="w-full h-full object-cover"
    />
  );
}

export default function RoomPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const matchId = searchParams.get("id") || "6a737ab4ac75df7a21fc4969";

  const { data, loading, error, heroDict, equipDict } = useMatchRoomApi(matchId);
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedKey("share");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (loading && !data) {
    return (
      <div className="w-full min-h-screen bg-[#181c27] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-400 text-sm">Loading match room details...</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="w-full min-h-screen bg-[#181c27] flex flex-col items-center justify-center text-white p-4">
        <p className="text-red-400 text-base mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded text-sm transition"
        >
          Retry
        </button>
      </div>
    );
  }

  const battleData = data?.battleData;
  const isBlueWin = battleData?.win_camp === 2; // win_camp 2 means Blue team wins
  const gameDurationStr = battleData ? formatGameTime(battleData.game_time) : "00:00";

  // Separate players into Blue Team and Red Team
  const players = battleData?.player_list || [];
  const bluePlayers = players.filter((p) => p.camp === 2 || (p.camp !== 1 && isBlueWin));
  const redPlayers = players.filter((p) => p.camp === 1 || (p.camp !== 2 && !isBlueWin));

  return (
    <div className="w-full min-h-screen bg-[#181c27] text-white font-sans flex flex-col items-center select-none overflow-x-hidden">
      {/* Toast Notification */}
      {copiedKey && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 bg-black/80 text-yellow-400 px-4 py-2 rounded-full text-xs font-semibold z-50 shadow-lg border border-yellow-500/30 animate-fade-in">
          {copiedKey === "share" ? "Link copied to clipboard!" : "Copied to clipboard!"}
        </div>
      )}

      {/* Navigation Header */}
      <header className="w-full max-w-[500px] h-[54px] px-4 flex items-center justify-between sticky top-0 bg-[#181c27]/90 backdrop-blur-md z-40 border-b border-white/5">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition active:scale-95"
          title="Back"
        >
          <img
            src="https://play.mobilelegends.com/match/assets/arrow-8f6ad251.svg"
            alt="Back"
            className="w-5 h-5"
          />
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition active:scale-95"
            title="Share"
          >
            <img
              src="https://play.mobilelegends.com/match/assets/share-ac31d4ee.svg"
              alt="Share"
              className="w-5 h-5"
            />
          </button>
          <div
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition cursor-pointer"
            title="Language"
          >
            <img
              src="https://play.mobilelegends.com/match/assets/language-7fd2aa08.svg"
              alt="Language"
              className="w-5 h-5"
            />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-[500px] px-3 pb-8 flex flex-col gap-4">
        {/* Match Header Info Card */}
        <div className="w-full bg-gradient-to-b from-[#253043] to-[#181c27] rounded-xl p-4 pt-5 shadow-xl border border-white/5 relative">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-xl font-bold tracking-wide text-white mb-1">
              {data?.name || "MLBB Match"}
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <img
                src="https://akmweb.youngjoygame.com/web/gms/image/f8303d98242a5be6db3e261df0e5bdf3.svg"
                alt="Time"
                className="w-3.5 h-3.5 opacity-80"
              />
              <span>{battleData?.end_time || ""}</span>
            </div>
          </div>

          {/* Scoreboard Banner */}
          <div className="w-full mt-4 bg-[#2f3d56] rounded-lg p-3 px-4 flex items-center justify-between shadow-inner">
            {/* Blue Team Status */}
            <div className="flex flex-col items-start min-w-[90px]">
              <span className="text-sm font-bold text-[#6ea3ff]">Blue Team</span>
              <span
                className={`text-xs font-semibold mt-0.5 ${
                  isBlueWin ? "text-[#f5d475]" : "text-gray-400"
                }`}
              >
                {isBlueWin ? "Victory" : "Defeat"}
              </span>
            </div>

            {/* Score & Duration */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-3 text-3xl font-extrabold text-white">
                <span>{battleData?.blue_camp_kill ?? 0}</span>
                <div className="flex flex-col items-center">
                  <span className="text-xs font-bold text-gray-400 tracking-wider">VS</span>
                  <div className="flex items-center gap-1 text-[11px] font-medium text-gray-300 mt-0.5">
                    <img
                      src="https://akmweb.youngjoygame.com/web/gms/image/5987609ce8755a7347bd672288735bd3.svg"
                      alt="Clock"
                      className="w-3 h-3"
                    />
                    <span>{gameDurationStr}</span>
                  </div>
                </div>
                <span>{battleData?.red_camp_kill ?? 0}</span>
              </div>
            </div>

            {/* Red Team Status */}
            <div className="flex flex-col items-end min-w-[90px]">
              <span className="text-sm font-bold text-[#ff5b5b]">Red Team</span>
              <span
                className={`text-xs font-semibold mt-0.5 ${
                  !isBlueWin ? "text-[#f5d475]" : "text-gray-400"
                }`}
              >
                {!isBlueWin ? "Victory" : "Defeat"}
              </span>
            </div>
          </div>

          {/* Collapsible BattleID & Room ID Details */}
          {detailsOpen && (
            <div className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between px-1">
                <span className="text-gray-400 font-medium">BattleID</span>
                <div className="flex items-center gap-1.5 font-mono text-gray-200">
                  <span>{battleData?.battleidStr || battleData?.battleid}</span>
                  <button
                    onClick={() =>
                      handleCopy(
                        String(battleData?.battleidStr || battleData?.battleid),
                        "battleid"
                      )
                    }
                    className="p-1 hover:bg-white/10 rounded transition active:scale-95"
                    title="Copy BattleID"
                  >
                    <svg
                      className="w-3.5 h-3.5 text-gray-400 hover:text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between px-1">
                <span className="text-gray-400 font-medium">ID</span>
                <div className="flex items-center gap-1.5 font-mono text-gray-200">
                  <span>{matchId}</span>
                  <button
                    onClick={() => handleCopy(matchId, "roomid")}
                    className="p-1 hover:bg-white/10 rounded transition active:scale-95"
                    title="Copy Room ID"
                  >
                    <svg
                      className="w-3.5 h-3.5 text-gray-400 hover:text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Toggle Details Arrow */}
          <div className="w-full flex justify-center mt-2">
            <button
              onClick={() => setDetailsOpen(!detailsOpen)}
              className="p-1 hover:bg-white/5 rounded-full transition"
            >
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                  detailsOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Blue Team Scoreboard Table */}
        <TeamTable
          teamName="Blue Team"
          isWin={isBlueWin}
          teamColor="#6ea3ff"
          players={bluePlayers}
          equipDict={equipDict}
        />

        {/* Red Team Scoreboard Table */}
        <TeamTable
          teamName="Red Team"
          isWin={!isBlueWin}
          teamColor="#ff5b5b"
          players={redPlayers}
          equipDict={equipDict}
        />

        {/* Footer */}
        <footer className="w-full text-center py-4 text-xs text-gray-500 font-light">
          © Moonton. All rights reserved.
        </footer>
      </main>
    </div>
  );
}

interface TeamTableProps {
  teamName: string;
  isWin: boolean;
  teamColor: string;
  players: PlayerData[];
  equipDict: Record<number, { icon: string; name: string }>;
}

function TeamTable({
  teamName,
  isWin,
  teamColor,
  players,
  equipDict,
}: TeamTableProps) {
  return (
    <div className="w-full bg-[#1e2536] rounded-xl overflow-hidden shadow-lg border border-white/5">
      {/* Table Header Bar */}
      <div className="w-full px-3 py-2.5 bg-[#252f44] flex items-center justify-between border-b border-white/5 text-xs font-semibold">
        <div className="flex items-center gap-2">
          <span style={{ color: teamColor }} className="text-sm font-bold">
            {teamName}
          </span>
          {isWin && (
            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 uppercase tracking-wider">
              Victory
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-gray-400 pr-2">
          <img
            src="https://akmweb.youngjoygame.com/web/gms/image/375dc68cb73ea1ef511cfc0042b7e903.svg"
            alt="Kills"
            className="w-3.5 h-3.5"
            title="Kills"
          />
          <img
            src="https://akmweb.youngjoygame.com/web/gms/image/2677751ec40067fd6d84d44be76f7761.svg"
            alt="Deaths"
            className="w-3.5 h-3.5"
            title="Deaths"
          />
          <img
            src="https://akmweb.youngjoygame.com/web/gms/image/783e2b9566be858c03836ea20b638f2b.svg"
            alt="Assists"
            className="w-3.5 h-3.5"
            title="Assists"
          />
          <span className="w-6 text-center text-[10px] font-bold tracking-wider">
            MVP
          </span>
        </div>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-white/5">
        {players.map((p, idx) => {
          // Up to 6 equipment items
          const equips = (p.equip_list || []).slice(0, 6);
          while (equips.length < 6) equips.push(0);

          return (
            <div
              key={idx}
              className="px-3 py-2.5 flex items-center justify-between hover:bg-white/[0.02] transition"
            >
              {/* Left: Hero Icon & Player Info */}
              <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                {/* Hero Avatar with Level */}
                <div className="relative flex-shrink-0 w-11 h-11 rounded-full overflow-hidden border border-white/20 bg-gray-800 shadow">
                  <HeroAvatar heroId={p.heroid} playerName={p.name} />
                  <span className="absolute bottom-0 right-0 bg-black/80 text-yellow-400 font-bold text-[9px] px-1 rounded-tl-sm leading-none py-0.5">
                    {p.max_level || 1}
                  </span>
                </div>

                {/* Player Name, Gold, Items */}
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white truncate max-w-[120px]">
                      {p.name}
                    </span>
                    <div className="flex items-center gap-0.5 text-[10px] text-yellow-400/90 font-medium">
                      <span>{p.gold_total}</span>
                      <img
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAXCAMAAADjjeWOAAAAjVBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8DizOFAAAAL3RSTlMAe4Lgue3RqJDJsIlo5th1bqDB85f8+GQqHhfnx3NKQSEFpI10XDMTDgfZslQ3CqbyNa0AAACrSURBVBjTTc3ZsoIwEEXRnYDCvQRxDiAIzrP//3mmg6Krq6tP9cvBM8ZYPjaPg3EOxwviZMdvtgUuZp919lmdQ6N+ZGfGWqzvurvoxDFgE1GTxI7aUMRih5oLVfC2nnRUUyKe8+gjtvJqt/+9KAdKHfZ2iLyOpp2QPyF1PlQMRQ6tDxUj57o9nfVI3KiCXxqTpunKTSobFDAZ9IIGRw1m3lCXeMdwKfhaCMQLjksPa4EKIHUAAAAASUVORK5CYII="
                        alt="Gold"
                        className="w-3 h-3 opacity-90"
                      />
                    </div>
                  </div>

                  {/* Items List Grid */}
                  <div className="flex items-center gap-1 mt-1">
                    {equips.map((eqId, eIdx) => {
                      const itemInfo = equipDict[eqId];
                      return (
                        <div
                          key={eIdx}
                          className="w-5 h-5 rounded bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden"
                          title={itemInfo?.name || ""}
                        >
                          <EquipItem equipId={eqId} equipName={itemInfo?.name} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right: K / D / A & MVP Badge */}
              <div className="flex items-center gap-3 text-xs font-semibold text-gray-200">
                <span className="w-4 text-center">{p.kill_num}</span>
                <span className="w-4 text-center text-red-400">{p.dead_num}</span>
                <span className="w-4 text-center">{p.assist_num}</span>
                <div className="w-6 flex justify-center">
                  {p.is_mvp && (
                    <img
                      src={
                        isWin
                          ? "https://akmweb.youngjoygame.com/web/gms/image/6dc50ddb05d11dccae9b1b1c0fb2ca1d.png"
                          : "https://akmweb.youngjoygame.com/web/gms/image/a80873f1f0b1fb79e0fd2545d579e0e2.png"
                      }
                      alt="MVP"
                      className="h-5 object-contain"
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
