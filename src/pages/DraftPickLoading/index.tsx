import { appConfig } from "@/config";
import React, { createContext, useContext, useEffect, useState } from "react";
import { motion } from "motion/react";
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

function PlayerLists() {
  return (
    <motion.div
      className="absolute content-stretch flex flex-col gap-[7px] items-center justify-center left-px top-[159px] w-[1919px]"
      data-name="Player Lists"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 1.33, ease: "easeOut" }}
    >
      <DraftPick />
      <MainFrame1 />
      <MainFrame2 />
      <MainFrame3 />
      <MainFrame4 />
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