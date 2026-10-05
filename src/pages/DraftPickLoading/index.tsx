import { appConfig } from "@/config";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import UserAvatar from "../../components/UserAvatar";
import svgPaths from "./svg-mn2ewdg9zg";

const DraftLoadingContext = createContext<any>({});
import imgBackgroundImage from "./9e72be5c6dd2ff24c0dbe0129186324d1805d951.png";
import imgLogo from "./71927f1dd2c7d1bd58a5899753e0d36780f6c033.png";
import imgHero from "./daa6cdd1ea3e8d0a9375579fc22226118f07c2a1.png";
import imgSpell from "./f55a6ca18fa3c7bc48c8b9595d25a31b725e37ad.png";

function BlueTeamContainer() {
  const data = useContext(DraftLoadingContext);
  const teamName = data?.blue_team_name || data?.blueTeamName || "BLUE TEAM";
  return (
    <motion.div
      className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0"
      data-name="Blue Team Container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.9, ease: "easeOut" }}
    >
      <div className="[word-break:break-word] col-1 flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[95px] justify-center ml-0 mt-0 not-italic relative row-1 text-[48px] text-center text-shadow-[0px_4px_16px_rgba(0,0,0,0.25)] text-white w-[554px]">
        <p className="leading-[0px]">{teamName}</p>
      </div>
    </motion.div>
  );
}

function LogoContainer() {
  return (
    <motion.div
      className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0"
      data-name="LOGO CONTAINER"
      initial={{ opacity: 0, y: -279 }}
      animate={{ opacity: 1, y: -15 }}
      transition={{
        opacity: { duration: 0.35, delay: 0.37, ease: "easeOut" },
        y: { duration: 0.71, delay: 0, ease: "linear" },
      }}
    >
      <div className="col-1 h-[79px] ml-0 mt-0 relative row-1 w-[226px]" data-name="Header">
        <div className="absolute inset-[-20.25%_-8.85%_-30.38%_-8.85%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 266 119">
            <g filter="url(#filter0_d_1_183)" id="Header">
              <path d={svgPaths.p2f46100} fill="url(#paint0_radial_1_183)" />
              <path d={svgPaths.p8170f00} stroke="var(--stroke-0, #E8D367)" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="119" id="filter0_d_1_183" width="266" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="10" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0.877423 0 0 0 0 0.765566 0 0 0 0 0.190305 0 0 0 1 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1_183" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_1_183" mode="normal" result="shape" />
              </filter>
              <radialGradient cx="0" cy="0" gradientTransform="translate(133 16) rotate(90) scale(79 226)" gradientUnits="userSpaceOnUse" id="paint0_radial_1_183" r="1">
                <stop stopColor="#6C4929" />
                <stop offset="1" stopColor="#D69345" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div className="col-1 ml-[73.5px] mt-[36px] relative row-1 size-[80px]" data-name="LOGO">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgLogo} />
      </div>
    </motion.div>
  );
}

function RedTeamContainer() {
  const data = useContext(DraftLoadingContext);
  const teamName = data?.red_team_name || data?.redTeamName || "RED TEAM";
  return (
    <motion.div
      className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0"
      data-name="Red Team Container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.9, ease: "easeOut" }}
    >
      <div className="[word-break:break-word] col-1 flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[95px] justify-center ml-0 mt-0 not-italic relative row-1 text-[48px] text-center text-shadow-[0px_4px_16px_rgba(0,0,0,0.25)] text-white w-[554px]">
        <p className="leading-[0px]">{teamName}</p>
      </div>
    </motion.div>
  );
}

function ScoreboardSection() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex gap-[52px] items-center justify-center leading-[0] left-[calc(50%+0.5px)] top-0 w-[1919px]" data-name="Scoreboard Section">
      <BlueTeamContainer />
      <LogoContainer />
      <RedTeamContainer />
    </div>
  );
}

function HeroImage() {
  const data = useContext(DraftLoadingContext);
  const player = data?.players?.find((p: any) => p.team === 1 && p.role === 1);
  const heroId = player?.SelHeroID;
  const imageSrc = heroId ? `/assets/heroes-sa/${heroId}.webp` : imgHero;
  const spellId = player?.battleSpell;
  const spellSrc = spellId && spellId > 0 ? `/assets/spells/${spellId}.webp` : imgSpell;

  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Hero Image">
      <div className="col-1 h-[178px] ml-0 mt-0 relative row-1 w-[438px]" data-name="hero">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[138.41%] left-[0.05%] max-w-none top-[-0.14%] w-full" src={imageSrc} />
        </div>
      </div>
      <div className="col-1 ml-[14px] mt-[100px] relative row-1 size-[64px]" data-name="spell">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="64" src={spellSrc} width="64" />
      </div>
    </div>
  );
}

function TextContainer() {
  const data = useContext(DraftLoadingContext);
  const player = data?.players?.find((p: any) => p.team === 1 && p.role === 1);
  const playerName = player?.name || "NAMA";
  const heroId = player?.SelHeroID;
  const heroName = (heroId && data?.heroesData && data.heroesData[heroId]) ? data.heroesData[heroId] : "HEROO NAME";

  return (
    <div className="[word-break:break-word] col-1 content-stretch flex flex-col gap-[40px] h-[178px] items-center justify-center ml-0 mt-0 not-italic relative row-1 text-white w-[438px] whitespace-nowrap" data-name="Text Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center relative shrink-0 text-[32px]">
        <p className="indent-[15px] leading-[0px]">{playerName}</p>
      </div>
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[24px]">
        <p className="indent-[15px] leading-[0px] mb-0">{heroName}</p>
        <p className="indent-[15px] leading-[0px]">​</p>
      </div>
    </div>
  );
}

function InfoContainer() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Info Container">
      <div className="bg-[#533920] col-1 h-[178px] ml-0 mt-0 relative row-1 w-[438px]" data-name="Background Shape" />
      <TextContainer />
    </div>
  );
}

function PlayerInfoBlue() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Player Info Blue">
      <HeroImage />
      <InfoContainer />
    </div>
  );
}

function Wraper() {
  const imageSrc = `/assets/lane/1.png`;

  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1" data-name="wraper">
      <div className="bg-[#292929] col-1 h-[178px] ml-0 mt-0 relative row-1 w-[167px]" data-name="bg" />
      <div className="col-1 ml-[43px] mt-[41px] relative row-1 size-[80px]" data-name="role">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imageSrc} />
      </div>
    </div>
  );
}

function RoleCotainer() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="role cotainer">
      <Wraper />
    </div>
  );
}

function TextContainer1() {
  const data = useContext(DraftLoadingContext);
  const player = data?.players?.find((p: any) => p.team === 2 && p.role === 1);
  const playerName = player?.name || "NAMA";
  const heroId = player?.SelHeroID;
  const heroName = (heroId && data?.heroesData && data.heroesData[heroId]) ? data.heroesData[heroId] : "HEROO NAME";

  return (
    <div className="[word-break:break-word] col-1 content-stretch flex flex-col gap-[40px] h-[178px] items-center justify-center ml-0 mt-0 not-italic relative row-1 text-white w-[438px] whitespace-nowrap" data-name="Text Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center relative shrink-0 text-[32px]">
        <p className="indent-[15px] leading-[0px]">{playerName}</p>
      </div>
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[24px]">
        <p className="indent-[15px] leading-[0px] mb-0">{heroName}</p>
        <p className="indent-[15px] leading-[0px]">​</p>
      </div>
    </div>
  );
}

function InfoContainer1() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Info Container">
      <div className="bg-[#533920] col-1 h-[178px] ml-0 mt-0 relative row-1 w-[438px]" data-name="Background Shape" />
      <TextContainer1 />
    </div>
  );
}

function AvatarContainer() {
  const data = useContext(DraftLoadingContext);
  const player = data?.players?.find((p: any) => p.team === 2 && p.role === 1);
  const heroId = player?.SelHeroID;
  const imageSrc = heroId ? `/assets/heroes-sa/${heroId}.webp` : imgHero;
  const spellId = player?.battleSpell;
  const spellSrc = spellId && spellId > 0 ? `/assets/spells/${spellId}.webp` : imgSpell;

  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Avatar Container">
      <div className="col-1 h-[178px] ml-0 mt-0 relative row-1 w-[438px]" data-name="Avatar Image">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[138.41%] left-[0.05%] max-w-none top-[-0.14%] w-full" src={imageSrc} />
        </div>
      </div>
      <div className="col-1 ml-[365px] mt-[100px] relative row-1 size-[64px]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="64" src={spellSrc} width="64" />
      </div>
    </div>
  );
}

function PlayerInfoRed() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Player Info Red">
      <InfoContainer1 />
      <AvatarContainer />
    </div>
  );
}

function MainFrame() {
  return (
    <div className="content-stretch flex items-center justify-center leading-[0] relative shrink-0" data-name="Main Frame">
      <PlayerInfoBlue />
      <RoleCotainer />
      <PlayerInfoRed />
    </div>
  );
}

function DraftPick() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-full" data-name="DraftPick">
      <MainFrame />
    </div>
  );
}

function HeroImage1() {
  const data = useContext(DraftLoadingContext);
  const player = data?.players?.find((p: any) => p.team === 1 && p.role === 2);
  const heroId = player?.SelHeroID;
  const imageSrc = heroId ? `/assets/heroes-sa/${heroId}.webp` : imgHero;
  const spellId = player?.battleSpell;
  const spellSrc = spellId && spellId > 0 ? `/assets/spells/${spellId}.webp` : imgSpell;

  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Hero Image">
      <div className="col-1 h-[178px] ml-0 mt-0 relative row-1 w-[438px]" data-name="hero">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[138.41%] left-[0.05%] max-w-none top-[-0.14%] w-full" src={imageSrc} />
        </div>
      </div>
      <div className="col-1 ml-[14px] mt-[100px] relative row-1 size-[64px]" data-name="spell">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="64" src={spellSrc} width="64" />
      </div>
    </div>
  );
}

function TextContainer2() {
  const data = useContext(DraftLoadingContext);
  const player = data?.players?.find((p: any) => p.team === 1 && p.role === 2);
  const playerName = player?.name || "NAMA";
  const heroId = player?.SelHeroID;
  const heroName = (heroId && data?.heroesData && data.heroesData[heroId]) ? data.heroesData[heroId] : "HEROO NAME";

  return (
    <div className="[word-break:break-word] col-1 content-stretch flex flex-col gap-[40px] h-[178px] items-center justify-center ml-0 mt-0 not-italic relative row-1 text-white w-[438px] whitespace-nowrap" data-name="Text Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center relative shrink-0 text-[32px]">
        <p className="indent-[15px] leading-[0px]">{playerName}</p>
      </div>
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[24px]">
        <p className="indent-[15px] leading-[0px] mb-0">{heroName}</p>
        <p className="indent-[15px] leading-[0px]">​</p>
      </div>
    </div>
  );
}

function InfoContainer2() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Info Container">
      <div className="bg-[#533920] col-1 h-[178px] ml-0 mt-0 relative row-1 w-[438px]" data-name="Background Shape" />
      <TextContainer2 />
    </div>
  );
}

function PlayerInfoBlue1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Player Info Blue">
      <HeroImage1 />
      <InfoContainer2 />
    </div>
  );
}

function Wraper1() {
  const imageSrc = `/assets/lane/2.png`;

  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1" data-name="wraper">
      <div className="bg-[#292929] col-1 h-[178px] ml-0 mt-0 relative row-1 w-[167px]" data-name="bg" />
      <div className="col-1 ml-[43px] mt-[41px] relative row-1 size-[80px]" data-name="role">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imageSrc} />
      </div>
    </div>
  );
}

function RoleCotainer1() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="role cotainer">
      <Wraper1 />
    </div>
  );
}

function TextContainer3() {
  const data = useContext(DraftLoadingContext);
  const player = data?.players?.find((p: any) => p.team === 2 && p.role === 2);
  const playerName = player?.name || "NAMA";
  const heroId = player?.SelHeroID;
  const heroName = (heroId && data?.heroesData && data.heroesData[heroId]) ? data.heroesData[heroId] : "HEROO NAME";

  return (
    <div className="[word-break:break-word] col-1 content-stretch flex flex-col gap-[40px] h-[178px] items-center justify-center ml-0 mt-0 not-italic relative row-1 text-white w-[438px] whitespace-nowrap" data-name="Text Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center relative shrink-0 text-[32px]">
        <p className="indent-[15px] leading-[0px]">{playerName}</p>
      </div>
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[24px]">
        <p className="indent-[15px] leading-[0px] mb-0">{heroName}</p>
        <p className="indent-[15px] leading-[0px]">​</p>
      </div>
    </div>
  );
}

function InfoContainer3() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Info Container">
      <div className="bg-[#533920] col-1 h-[178px] ml-0 mt-0 relative row-1 w-[438px]" data-name="Background Shape" />
      <TextContainer3 />
    </div>
  );
}

function AvatarContainer1() {
  const data = useContext(DraftLoadingContext);
  const player = data?.players?.find((p: any) => p.team === 2 && p.role === 2);
  const heroId = player?.SelHeroID;
  const imageSrc = heroId ? `/assets/heroes-sa/${heroId}.webp` : imgHero;
  const spellId = player?.battleSpell;
  const spellSrc = spellId && spellId > 0 ? `/assets/spells/${spellId}.webp` : imgSpell;

  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Avatar Container">
      <div className="col-1 h-[178px] ml-0 mt-0 relative row-1 w-[438px]" data-name="Avatar Image">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[138.41%] left-[0.05%] max-w-none top-[-0.14%] w-full" src={imageSrc} />
        </div>
      </div>
      <div className="col-1 ml-[365px] mt-[100px] relative row-1 size-[64px]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="64" src={spellSrc} width="64" />
      </div>
    </div>
  );
}

function PlayerInfoRed1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Player Info Red">
      <InfoContainer3 />
      <AvatarContainer1 />
    </div>
  );
}

function MainFrame1() {
  return (
    <div className="content-stretch flex items-center justify-center leading-[0] relative shrink-0 w-full" data-name="Main Frame">
      <PlayerInfoBlue1 />
      <RoleCotainer1 />
      <PlayerInfoRed1 />
    </div>
  );
}

function HeroImage2() {
  const data = useContext(DraftLoadingContext);
  const player = data?.players?.find((p: any) => p.team === 1 && p.role === 3);
  const heroId = player?.SelHeroID;
  const imageSrc = heroId ? `/assets/heroes-sa/${heroId}.webp` : imgHero;
  const spellId = player?.battleSpell;
  const spellSrc = spellId && spellId > 0 ? `/assets/spells/${spellId}.webp` : imgSpell;

  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Hero Image">
      <div className="col-1 h-[178px] ml-0 mt-0 relative row-1 w-[438px]" data-name="hero">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[138.41%] left-[0.05%] max-w-none top-[-0.14%] w-full" src={imageSrc} />
        </div>
      </div>
      <div className="col-1 ml-[14px] mt-[100px] relative row-1 size-[64px]" data-name="spell">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="64" src={spellSrc} width="64" />
      </div>
    </div>
  );
}

function TextContainer4() {
  const data = useContext(DraftLoadingContext);
  const player = data?.players?.find((p: any) => p.team === 1 && p.role === 3);
  const playerName = player?.name || "NAMA";
  const heroId = player?.SelHeroID;
  const heroName = (heroId && data?.heroesData && data.heroesData[heroId]) ? data.heroesData[heroId] : "HEROO NAME";

  return (
    <div className="[word-break:break-word] col-1 content-stretch flex flex-col gap-[40px] h-[178px] items-center justify-center ml-0 mt-0 not-italic relative row-1 text-white w-[438px] whitespace-nowrap" data-name="Text Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center relative shrink-0 text-[32px]">
        <p className="indent-[15px] leading-[0px]">{playerName}</p>
      </div>
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[24px]">
        <p className="indent-[15px] leading-[0px] mb-0">{heroName}</p>
        <p className="indent-[15px] leading-[0px]">​</p>
      </div>
    </div>
  );
}

function InfoContainer4() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Info Container">
      <div className="bg-[#533920] col-1 h-[178px] ml-0 mt-0 relative row-1 w-[438px]" data-name="Background Shape" />
      <TextContainer4 />
    </div>
  );
}

function PlayerInfoBlue2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Player Info Blue">
      <HeroImage2 />
      <InfoContainer4 />
    </div>
  );
}

function Wraper2() {
  const imageSrc = `/assets/lane/3.png`;

  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1" data-name="wraper">
      <div className="bg-[#292929] col-1 h-[178px] ml-0 mt-0 relative row-1 w-[167px]" data-name="bg" />
      <div className="col-1 ml-[43px] mt-[41px] relative row-1 size-[80px]" data-name="role">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imageSrc} />
      </div>
    </div>
  );
}

function RoleCotainer2() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="role cotainer">
      <Wraper2 />
    </div>
  );
}

function TextContainer5() {
  const data = useContext(DraftLoadingContext);
  const player = data?.players?.find((p: any) => p.team === 2 && p.role === 3);
  const playerName = player?.name || "NAMA";
  const heroId = player?.SelHeroID;
  const heroName = (heroId && data?.heroesData && data.heroesData[heroId]) ? data.heroesData[heroId] : "HEROO NAME";

  return (
    <div className="[word-break:break-word] col-1 content-stretch flex flex-col gap-[40px] h-[178px] items-center justify-center ml-0 mt-0 not-italic relative row-1 text-white w-[438px] whitespace-nowrap" data-name="Text Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center relative shrink-0 text-[32px]">
        <p className="indent-[15px] leading-[0px]">{playerName}</p>
      </div>
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[24px]">
        <p className="indent-[15px] leading-[0px] mb-0">{heroName}</p>
        <p className="indent-[15px] leading-[0px]">​</p>
      </div>
    </div>
  );
}

function InfoContainer5() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Info Container">
      <div className="bg-[#533920] col-1 h-[178px] ml-0 mt-0 relative row-1 w-[438px]" data-name="Background Shape" />
      <TextContainer5 />
    </div>
  );
}

function AvatarContainer2() {
  const data = useContext(DraftLoadingContext);
  const player = data?.players?.find((p: any) => p.team === 2 && p.role === 3);
  const heroId = player?.SelHeroID;
  const imageSrc = heroId ? `/assets/heroes-sa/${heroId}.webp` : imgHero;
  const spellId = player?.battleSpell;
  const spellSrc = spellId && spellId > 0 ? `/assets/spells/${spellId}.webp` : imgSpell;

  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Avatar Container">
      <div className="col-1 h-[178px] ml-0 mt-0 relative row-1 w-[438px]" data-name="Avatar Image">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[138.41%] left-[0.05%] max-w-none top-[-0.14%] w-full" src={imageSrc} />
        </div>
      </div>
      <div className="col-1 ml-[365px] mt-[100px] relative row-1 size-[64px]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="64" src={spellSrc} width="64" />
      </div>
    </div>
  );
}

function PlayerInfoRed2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Player Info Red">
      <InfoContainer5 />
      <AvatarContainer2 />
    </div>
  );
}

function MainFrame2() {
  return (
    <div className="content-stretch flex items-center justify-center leading-[0] relative shrink-0 w-full" data-name="Main Frame">
      <PlayerInfoBlue2 />
      <RoleCotainer2 />
      <PlayerInfoRed2 />
    </div>
  );
}

function HeroImage3() {
  const data = useContext(DraftLoadingContext);
  const player = data?.players?.find((p: any) => p.team === 1 && p.role === 4);
  const heroId = player?.SelHeroID;
  const imageSrc = heroId ? `/assets/heroes-sa/${heroId}.webp` : imgHero;
  const spellId = player?.battleSpell;
  const spellSrc = spellId && spellId > 0 ? `/assets/spells/${spellId}.webp` : imgSpell;

  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Hero Image">
      <div className="col-1 h-[178px] ml-0 mt-0 relative row-1 w-[438px]" data-name="hero">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[138.41%] left-[0.05%] max-w-none top-[-0.14%] w-full" src={imageSrc} />
        </div>
      </div>
      <div className="col-1 ml-[14px] mt-[100px] relative row-1 size-[64px]" data-name="spell">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="64" src={spellSrc} width="64" />
      </div>
    </div>
  );
}

function TextContainer6() {
  const data = useContext(DraftLoadingContext);
  const player = data?.players?.find((p: any) => p.team === 1 && p.role === 4);
  const playerName = player?.name || "NAMA";
  const heroId = player?.SelHeroID;
  const heroName = (heroId && data?.heroesData && data.heroesData[heroId]) ? data.heroesData[heroId] : "HEROO NAME";

  return (
    <div className="[word-break:break-word] col-1 content-stretch flex flex-col gap-[40px] h-[178px] items-center justify-center ml-0 mt-0 not-italic relative row-1 text-white w-[438px] whitespace-nowrap" data-name="Text Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center relative shrink-0 text-[32px]">
        <p className="indent-[15px] leading-[0px]">{playerName}</p>
      </div>
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[24px]">
        <p className="indent-[15px] leading-[0px] mb-0">{heroName}</p>
        <p className="indent-[15px] leading-[0px]">​</p>
      </div>
    </div>
  );
}

function InfoContainer6() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Info Container">
      <div className="bg-[#533920] col-1 h-[178px] ml-0 mt-0 relative row-1 w-[438px]" data-name="Background Shape" />
      <TextContainer6 />
    </div>
  );
}

function PlayerInfoBlue3() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Player Info Blue">
      <HeroImage3 />
      <InfoContainer6 />
    </div>
  );
}

function Wraper3() {
  const imageSrc = `/assets/lane/4.png`;

  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1" data-name="wraper">
      <div className="bg-[#292929] col-1 h-[178px] ml-0 mt-0 relative row-1 w-[167px]" data-name="bg" />
      <div className="col-1 ml-[43px] mt-[41px] relative row-1 size-[80px]" data-name="role">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imageSrc} />
      </div>
    </div>
  );
}

function RoleCotainer3() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="role cotainer">
      <Wraper3 />
    </div>
  );
}

function TextContainer7() {
  const data = useContext(DraftLoadingContext);
  const player = data?.players?.find((p: any) => p.team === 2 && p.role === 4);
  const playerName = player?.name || "NAMA";
  const heroId = player?.SelHeroID;
  const heroName = (heroId && data?.heroesData && data.heroesData[heroId]) ? data.heroesData[heroId] : "HEROO NAME";

  return (
    <div className="[word-break:break-word] col-1 content-stretch flex flex-col gap-[40px] h-[178px] items-center justify-center ml-0 mt-0 not-italic relative row-1 text-white w-[438px] whitespace-nowrap" data-name="Text Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center relative shrink-0 text-[32px]">
        <p className="indent-[15px] leading-[0px]">{playerName}</p>
      </div>
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[24px]">
        <p className="indent-[15px] leading-[0px] mb-0">{heroName}</p>
        <p className="indent-[15px] leading-[0px]">​</p>
      </div>
    </div>
  );
}

function InfoContainer7() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Info Container">
      <div className="bg-[#533920] col-1 h-[178px] ml-0 mt-0 relative row-1 w-[438px]" data-name="Background Shape" />
      <TextContainer7 />
    </div>
  );
}

function AvatarContainer3() {
  const data = useContext(DraftLoadingContext);
  const player = data?.players?.find((p: any) => p.team === 2 && p.role === 4);
  const heroId = player?.SelHeroID;
  const imageSrc = heroId ? `/assets/heroes-sa/${heroId}.webp` : imgHero;
  const spellId = player?.battleSpell;
  const spellSrc = spellId && spellId > 0 ? `/assets/spells/${spellId}.webp` : imgSpell;

  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Avatar Container">
      <div className="col-1 h-[178px] ml-0 mt-0 relative row-1 w-[438px]" data-name="Avatar Image">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[138.41%] left-[0.05%] max-w-none top-[-0.14%] w-full" src={imageSrc} />
        </div>
      </div>
      <div className="col-1 ml-[365px] mt-[100px] relative row-1 size-[64px]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="64" src={spellSrc} width="64" />
      </div>
    </div>
  );
}

function PlayerInfoRed3() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Player Info Red">
      <InfoContainer7 />
      <AvatarContainer3 />
    </div>
  );
}

function MainFrame3() {
  return (
    <div className="content-stretch flex items-center justify-center leading-[0] relative shrink-0 w-full" data-name="Main Frame">
      <PlayerInfoBlue3 />
      <RoleCotainer3 />
      <PlayerInfoRed3 />
    </div>
  );
}

function HeroImage4() {
  const data = useContext(DraftLoadingContext);
  const player = data?.players?.find((p: any) => p.team === 1 && p.role === 5);
  const heroId = player?.SelHeroID;
  const imageSrc = heroId ? `/assets/heroes-sa/${heroId}.webp` : imgHero;
  const spellId = player?.battleSpell;
  const spellSrc = spellId && spellId > 0 ? `/assets/spells/${spellId}.webp` : imgSpell;

  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Hero Image">
      <div className="col-1 h-[178px] ml-0 mt-0 relative row-1 w-[438px]" data-name="hero">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[138.41%] left-[0.05%] max-w-none top-[-0.14%] w-full" src={imageSrc} />
        </div>
      </div>
      <div className="col-1 ml-[14px] mt-[100px] relative row-1 size-[64px]" data-name="spell">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="64" src={spellSrc} width="64" />
      </div>
    </div>
  );
}

function TextContainer8() {
  const data = useContext(DraftLoadingContext);
  const player = data?.players?.find((p: any) => p.team === 1 && p.role === 5);
  const playerName = player?.name || "NAMA";
  const heroId = player?.SelHeroID;
  const heroName = (heroId && data?.heroesData && data.heroesData[heroId]) ? data.heroesData[heroId] : "HEROO NAME";

  return (
    <div className="[word-break:break-word] col-1 content-stretch flex flex-col gap-[40px] h-[178px] items-center justify-center ml-0 mt-0 not-italic relative row-1 text-white w-[438px] whitespace-nowrap" data-name="Text Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center relative shrink-0 text-[32px]">
        <p className="indent-[15px] leading-[0px]">{playerName}</p>
      </div>
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[24px]">
        <p className="indent-[15px] leading-[0px] mb-0">{heroName}</p>
        <p className="indent-[15px] leading-[0px]">​</p>
      </div>
    </div>
  );
}

function InfoContainer8() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Info Container">
      <div className="bg-[#533920] col-1 h-[178px] ml-0 mt-0 relative row-1 w-[438px]" data-name="Background Shape" />
      <TextContainer8 />
    </div>
  );
}

function PlayerInfoBlue4() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Player Info Blue">
      <HeroImage4 />
      <InfoContainer8 />
    </div>
  );
}

function Wraper4() {
  const imageSrc = `/assets/lane/5.png`;

  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1" data-name="wraper">
      <div className="bg-[#292929] col-1 h-[178px] ml-0 mt-0 relative row-1 w-[167px]" data-name="bg" />
      <div className="col-1 ml-[43px] mt-[41px] relative row-1 size-[80px]" data-name="role">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imageSrc} />
      </div>
    </div>
  );
}

function RoleCotainer4() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="role cotainer">
      <Wraper4 />
    </div>
  );
}

function TextContainer9() {
  const data = useContext(DraftLoadingContext);
  const player = data?.players?.find((p: any) => p.team === 2 && p.role === 5);
  const playerName = player?.name || "NAMA";
  const heroId = player?.SelHeroID;
  const heroName = (heroId && data?.heroesData && data.heroesData[heroId]) ? data.heroesData[heroId] : "HEROO NAME";

  return (
    <div className="[word-break:break-word] col-1 content-stretch flex flex-col gap-[40px] h-[178px] items-center justify-center ml-0 mt-0 not-italic relative row-1 text-white w-[438px] whitespace-nowrap" data-name="Text Container">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center relative shrink-0 text-[32px]">
        <p className="indent-[15px] leading-[0px]">{playerName}</p>
      </div>
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[24px]">
        <p className="indent-[15px] leading-[0px] mb-0">{heroName}</p>
        <p className="indent-[15px] leading-[0px]">​</p>
      </div>
    </div>
  );
}

function InfoContainer9() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Info Container">
      <div className="bg-[#533920] col-1 h-[178px] ml-0 mt-0 relative row-1 w-[438px]" data-name="Background Shape" />
      <TextContainer9 />
    </div>
  );
}

function AvatarContainer4() {
  const data = useContext(DraftLoadingContext);
  const player = data?.players?.find((p: any) => p.team === 2 && p.role === 5);
  const heroId = player?.SelHeroID;
  const imageSrc = heroId ? `/assets/heroes-sa/${heroId}.webp` : imgHero;
  const spellId = player?.battleSpell;
  const spellSrc = spellId && spellId > 0 ? `/assets/spells/${spellId}.webp` : imgSpell;

  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Avatar Container">
      <div className="col-1 h-[178px] ml-0 mt-0 relative row-1 w-[438px]" data-name="Avatar Image">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[138.41%] left-[0.05%] max-w-none top-[-0.14%] w-full" src={imageSrc} />
        </div>
      </div>
      <div className="col-1 ml-[365px] mt-[100px] relative row-1 size-[64px]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="64" src={spellSrc} width="64" />
      </div>
    </div>
  );
}

function PlayerInfoRed4() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Player Info Red">
      <InfoContainer9 />
      <AvatarContainer4 />
    </div>
  );
}

function MainFrame4() {
  return (
    <div className="content-stretch flex items-center justify-center leading-[0] relative shrink-0 w-full" data-name="Main Frame">
      <PlayerInfoBlue4 />
      <RoleCotainer4 />
      <PlayerInfoRed4 />
    </div>
  );
}

/* ─── Preview sequence: UserProfilePreview (1v1 role sama) → TeamPreviewProfile (looping + nama tim) ─── */
const VS_PER_ROLE_MS = 2200;
const TEAM_SWAP_MS = 3000;
const PREVIEW_ROLES = [1, 2, 3, 4, 5];

function getPlayerByTeamRole(players: any[], team: number, role: number) {
  if (!Array.isArray(players)) return null;
  const exact = players.find(
    (p: any) => Number(p?.team) === team && Number(p?.role) === role,
  );
  if (exact) return exact;
  const inTeam = players.filter((p: any) => Number(p?.team) === team);
  return inTeam[role - 1] || null;
}

function getPreviewUserId(player: any): string {
  const v =
    player?.id ?? player?.accId ?? player?.accIdString ?? player?.uid ?? player?.userId ?? "";
  return String(v ?? "").trim();
}

function usePreviewPhase(playerCount: number) {
  // stage "versus": putar role 1..5 (biru vs merah role sama).
  // stage "team": looping lineup 5 avatar + nama tim sampai game dimulai (route pindah).
  const [versusIdx, setVersusIdx] = useState(0);
  const [stage, setStage] = useState<"versus" | "team">("versus");
  const [teamSide, setTeamSide] = useState<1 | 2>(1);

  useEffect(() => {
    if (stage !== "versus") return;
    if (versusIdx >= PREVIEW_ROLES.length) {
      setStage("team");
      return;
    }
    const t = window.setTimeout(() => {
      if (versusIdx + 1 >= PREVIEW_ROLES.length) setStage("team");
      else setVersusIdx((i) => i + 1);
    }, VS_PER_ROLE_MS);
    return () => clearTimeout(t);
  }, [stage, versusIdx]);

  useEffect(() => {
    if (stage !== "team") return;
    const t = window.setInterval(() => {
      setTeamSide((s) => (s === 1 ? 2 : 1));
    }, TEAM_SWAP_MS);
    return () => clearInterval(t);
  }, [stage]);

  // Reset ringan bila daftar pemain berubah total (misal room baru).
  const countRef = useRef(playerCount);
  useEffect(() => {
    if (countRef.current === 0 && playerCount > 0) {
      countRef.current = playerCount;
      setVersusIdx(0);
      setStage("versus");
      setTeamSide(1);
    }
    countRef.current = playerCount;
  }, [playerCount]);

  return { stage, versusRole: PREVIEW_ROLES[Math.min(versusIdx, PREVIEW_ROLES.length - 1)], versusIdx, teamSide };
}

function VersusName({ name, heroName, align }: { name: string; heroName: string; align: "left" | "right" }) {
  return (
    <div
      className={`flex flex-col gap-[8px] w-[377px] text-white ${align === "left" ? "items-start text-left" : "items-end text-right"}`}
    >
      <div className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[32px] leading-none">{name}</div>
      <div className="font-['Inter:Medium',sans-serif] font-medium text-[24px] leading-none text-[#E8D367] uppercase">{heroName}</div>
    </div>
  );
}

function UserProfilePreview({ role }: { role: number }) {
  const data = useContext(DraftLoadingContext);
  const players = Array.isArray(data?.players) ? data.players : [];
  const blue = getPlayerByTeamRole(players, 1, role);
  const red = getPlayerByTeamRole(players, 2, role);
  const blueName = blue?.name || "NAMA";
  const redName = red?.name || "NAMA";
  const blueHero =
    blue?.SelHeroID && data?.heroesData?.[blue.SelHeroID] ? String(data.heroesData[blue.SelHeroID]) : "HERO NAME";
  const redHero =
    red?.SelHeroID && data?.heroesData?.[red.SelHeroID] ? String(data.heroesData[red.SelHeroID]) : "HERO NAME";

  return (
    <div
      className="flex flex-col items-center justify-start w-full"
      data-name="User Profile Preview"
    >
      <div className="flex flex-row items-end justify-center w-full" data-name="user-profile-preview">
        {/* Blue avatar — slide dari kiri */}
        <motion.div
          key={`blue_${role}_${getPreviewUserId(blue) || blueName}`}
          className="flex flex-col items-start gap-[12px]"
          initial={{ opacity: 0, x: -260, scale: 0.92 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -160, scale: 0.96 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <div className="h-[591px] w-[377px] overflow-hidden relative">
            <UserAvatar
              userId={getPreviewUserId(blue)}
              fallback={imgHero}
              className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
            />
            <div className="absolute inset-y-0 right-0 w-[60px] bg-gradient-to-l from-black/40 to-transparent pointer-events-none" />
          </div>
          <VersusName name={blueName} heroName={blueHero} align="left" />
        </motion.div>

        {/* Role badge tengah */}
        <motion.div
          key={`role_${role}`}
          className="flex flex-col items-center justify-center mx-[-10px] mb-[120px] z-10"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.4, delay: 0.15, ease: "backOut" }}
        >
          <div className="bg-[#292929] border-2 border-[#E8D367] rounded-full size-[110px] flex items-center justify-center overflow-hidden">
            <img
              alt={`role ${role}`}
              className="object-cover pointer-events-none size-[80px]"
              src={`/assets/lane/${role}.png`}
            />
          </div>
          <div className="font-['Inter:Bold',sans-serif] font-bold text-[40px] text-[#E8D367] leading-none mt-[12px] text-shadow-[0px_4px_16px_rgba(0,0,0,0.5)]">
            VS
          </div>
        </motion.div>

        {/* Red avatar — slide dari kanan */}
        <motion.div
          key={`red_${role}_${getPreviewUserId(red) || redName}`}
          className="flex flex-col items-end gap-[12px]"
          initial={{ opacity: 0, x: 260, scale: 0.92 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 160, scale: 0.96 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <div className="h-[591px] w-[377px] overflow-hidden relative">
            <UserAvatar
              userId={getPreviewUserId(red)}
              fallback={imgHero}
              className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
            />
            <div className="absolute inset-y-0 left-0 w-[60px] bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />
          </div>
          <VersusName name={redName} heroName={redHero} align="right" />
        </motion.div>
      </div>
    </div>
  );
}

function TeamPreviewProfile({ side }: { side: 1 | 2 }) {
  const data = useContext(DraftLoadingContext);
  const players = Array.isArray(data?.players) ? data.players : [];
  const teamName =
    side === 1
      ? data?.blue_team_name || data?.blueTeamName || "BLUE TEAM"
      : data?.red_team_name || data?.redTeamName || "RED TEAM";
  const members = PREVIEW_ROLES.map((role) => getPlayerByTeamRole(players, side, role));
  const isBlue = side === 1;

  return (
    <div className="flex flex-col items-center justify-start w-full" data-name="Team Preview Profile">
      {/* Lineup 5 avatar — overlap -20px mengikuti CSS team-preview-profile */}
      <div
        className="flex flex-row items-end justify-center h-[600px] relative"
        data-name="team-preview-profile"
      >
        <AnimatePresence mode="popLayout">
          {members.map((player, i) => {
            const name = player?.name || "NAMA";
            return (
              <motion.div
                key={`${side}_${i}_${getPreviewUserId(player) || name}`}
                className="relative shrink-0 h-[591px] w-[377px] overflow-hidden first:ml-0"
                style={{ marginLeft: i === 0 ? 0 : -20, zIndex: i }}
                initial={{ opacity: 0, y: 120, scale: 0.94 }}
                animate={{ opacity: 1, y: [0, -12, 0], scale: 1 }}
                exit={{ opacity: 0, y: 80, scale: 0.96 }}
                transition={{
                  opacity: { duration: 0.45, delay: i * 0.12, ease: "easeOut" },
                  y:
                    i === 0
                      ? { duration: 0.45, delay: i * 0.12, ease: "easeOut" }
                      : undefined,
                }}
              >
                {/* Bobbing loop halus per avatar (offset delay) */}
                <motion.div
                  className="absolute inset-0"
                  animate={{ y: [0, -12, 0] }}
                  transition={{ repeat: Infinity, duration: 2.4, delay: i * 0.25, ease: "easeInOut" }}
                >
                  <UserAvatar
                    userId={getPreviewUserId(player)}
                    fallback={imgHero}
                    className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                  />
                </motion.div>
                <div
                  className={`absolute inset-x-0 bottom-0 h-[90px] flex items-end justify-center pb-[10px] font-['Inter:Bold',sans-serif] font-bold text-[20px] text-white ${
                    isBlue ? "bg-gradient-to-t from-blue-900/80 to-transparent" : "bg-gradient-to-t from-red-900/80 to-transparent"
                  }`}
                >
                  {name}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Objek nama tim — hanya tampil saat TeamPreviewProfile */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`teamname_${side}_${teamName}`}
          className="mt-[16px] flex flex-col items-center"
          data-name="NAMA TEAM"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <motion.div
            className={`font-['Inter:Bold',sans-serif] font-bold text-[56px] leading-none text-center text-shadow-[0px_4px_16px_rgba(0,0,0,0.5)] ${
              isBlue ? "text-[#9DC8FF]" : "text-[#FF9D9D]"
            }`}
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            {teamName}
          </motion.div>
          <div className={`mt-[8px] h-[4px] w-[320px] ${isBlue ? "bg-[#9DC8FF]" : "bg-[#FF9D9D]"}`} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function PreviewSequence() {
  const data = useContext(DraftLoadingContext);
  const players = Array.isArray(data?.players) ? data.players : [];
  const { stage, versusRole, versusIdx, teamSide } = usePreviewPhase(players.length);

  return (
    <div className="w-full flex flex-col items-center">
      <AnimatePresence mode="wait">
        {stage === "versus" ? (
          <motion.div
            key={`versus_${versusRole}_${versusIdx}`}
            className="w-full flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <UserProfilePreview role={versusRole} />
          </motion.div>
        ) : (
          <motion.div
            key={`team_${teamSide}`}
            className="w-full flex justify-center"
            initial={{ opacity: 0, x: teamSide === 1 ? -180 : 180 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: teamSide === 1 ? 180 : -180 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <TeamPreviewProfile side={teamSide} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indikator progres kecil */}
      <div className="mt-[10px] flex flex-row items-center gap-[8px]">
        {stage === "versus" ? (
          PREVIEW_ROLES.map((r, i) => (
            <div
              key={r}
              className={`h-[8px] rounded-full transition-all duration-300 ${
                i === versusIdx ? "w-[48px] bg-[#E8D367]" : i < versusIdx ? "w-[24px] bg-[#E8D367]/60" : "w-[24px] bg-white/30"
              }`}
            />
          ))
        ) : (
          <div className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[16px] text-white/70 tracking-[0.2em]">
            {teamSide === 1 ? "● ○ BLUE TEAM" : "○ ● RED TEAM"} — LOOPING SAMPAI GAME DIMULAI
          </div>
        )}
      </div>
    </div>
  );
}

function PlayerLists() {
  return (
    <motion.div
      className="absolute content-stretch flex flex-col gap-[7px] items-center justify-start left-px top-[159px] w-[1919px]"
      data-name="Player Lists"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 1.33, ease: "easeOut" }}
    >
      <PreviewSequence />
    </motion.div>
  );
}

import { useRoomData } from "../../hooks/useRoomData";
import { useDisplayTeamNames } from "../../hooks/useTeamNames";

export default function DraftPickLoading() {
  const [heroesData, setHeroesData] = useState<any>({});

  const roomData = useRoomData();
  const teamNames = useDisplayTeamNames();

  useEffect(() => {
    fetch('/assets/heroes.json')
      .then(res => res.json())
      .then(data => setHeroesData(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <DraftLoadingContext.Provider
      value={{
        ...roomData,
        blue_team_name: teamNames.blue || roomData?.blue_team_name,
        red_team_name: teamNames.red || roomData?.red_team_name,
        heroesData,
      }}
    >
      <div className="bg-[#e63030] relative size-full" data-name="DraftPick - loading">
        <div className="-translate-x-1/2 absolute h-[1080px] left-1/2 top-0 w-[1920px]" data-name="Background Image">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgBackgroundImage} />
        </div>
        <ScoreboardSection />
        <PlayerLists />
      </div>
    </DraftLoadingContext.Provider>
  );
}