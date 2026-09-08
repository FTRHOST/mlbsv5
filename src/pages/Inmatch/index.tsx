import { appConfig } from "@/config";
import { useState, useEffect, useRef } from "react";
import { useRoomData } from "../../hooks/useRoomData";
import { useMatchScore } from "../../hooks/useMatchScore";
import { motion, AnimatePresence } from "motion/react";
import svgPaths from "./svg-oceaimow7b";
import imgEllipse3 from "./b7391c4e75d2d34b9c3df0dcbcaf28f0ac62388f.png";
import imgEllipse5 from "./1c3110e7f1da4587c90c840384e6262af9c3f9fd.png";
import imgEllipse6 from "./4b0d62aa71bd9368c2dddee7f562bfbba5bd01e1.png";
import imgUserAvatar from "./f259c856a17bf9515576235ee603d83439a100bc.png";
import imgLogo from "./573b49137148f2caf798d037581f0199d4a1353a.png";
import imgLogo1 from "./82a8b4c4a2c5d82dbc99b5191b5bc30859366453.png";
import imgLogo2 from "./90c02477026b030c69544b71e2fcaebd44e2e852.png";
import imgLogo3 from "./55c0b668eb617f8a2a58cb3270291f68da01b2e8.png";
import imgLogo4 from "./71927f1dd2c7d1bd58a5899753e0d36780f6c033.png";
import imgImageHero from "./055ee8e26741aa3861d041bf95cb9d5db0defaaa.png";
import imgStandarTalent1 from "./a9e070647a9d0d06160cd5454c9b3f081a0da0ab.png";
import imgStandarTalent2 from "./06d737d2c805471942ea7a79c5e75bd478f98a4d.png";
import imgCoreTalent from "./fe562fe25dff16e4aa5d63ec2d04415406d00021.png";
import imgEmblem from "./59d46961759939fc1bea0b23cbb194a4b09bbcc4.png";
import imgImageTurtle from "./2f9693547869a15a4eabaf9f1e311238f5494886.png";
import imgLogo5 from "./a24eed50adb610341c6db1253a563b8615827a2e.png";


function UserInfoBackground() {
  return (
    <div className="col-1 h-[67px] ml-0 mt-[21px] relative row-1 w-full" data-name="User Info Background">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 170 67">
        <g id="User Info Background">
          <rect fill="var(--fill-0, #D69345)" height="67" id="Background" width="170" />
          <path d={svgPaths.p2772d080} fill="var(--fill-0, #6C4929)" id="Rectangle 16" />
        </g>
      </svg>
    </div>
  );
}

function UserHeader() {
  return (
    <div className="bg-[#e8d367] col-1 h-[21px] ml-0 mt-0 relative row-1 w-full" data-name="User Header">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[21px] justify-center leading-[0] left-0 not-italic text-[16px] text-black top-[10.5px] w-[170px]">
        <p className="indent-[7px] leading-[0px]">MUTHH</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Container">
      <div className="col-1 ml-0 mt-0 relative row-1 size-[52px]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="52" src={imgEllipse3} width="52" />
      </div>
      <div className="col-1 ml-0 mt-[4px] relative row-1 size-[11px]">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
          <circle cx="5.5" cy="5.5" fill="var(--fill-0, #8BA93A)" id="Ellipse 4" r="5" stroke="var(--stroke-0, white)" />
        </svg>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Container">
      <div className="bg-black col-1 h-[6px] ml-0 mt-0 relative row-1 w-[51px]" data-name="Health Bar" />
      <div className="bg-[#8ba93a] col-1 h-[4px] ml-[1.5px] mt-px relative row-1 w-[48px]" data-name="Health Bar Background" />
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center leading-[0] relative shrink-0 w-[52px]" data-name="Container">
      <Container3 />
      <Container4 />
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col gap-[3px] items-start relative shrink-0 w-[24px]" data-name="Container">
      <div className="h-[24px] relative shrink-0 w-full">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="24" src={imgEllipse5} width="24" />
      </div>
      <div className="h-[24px] relative shrink-0 w-full">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="24" src={imgEllipse6} width="24" />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="col-1 content-stretch flex gap-[11px] items-center ml-[45.88%] mt-[24px] relative row-1 w-[51.18%]" data-name="Container">
      <Container2 />
      <Container5 />
    </div>
  );
}

function UserInfo() {
  return (
    <div className="col-1 grid-rows-[max-content] inline-grid ml-0 mt-[21px] place-items-start relative row-1 w-[44.12%]" data-name="User Info">
      <div className="col-1 h-[67px] ml-0 mt-0 relative row-1 w-[74.67%]" data-name="User Avatar">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgUserAvatar} />
      </div>
      <div className="col-1 h-[13px] ml-0 mt-[54px] relative row-1 w-full">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 74.9998 13">
          <path d="M0 0H68.4998L74.9998 13H0V0Z" fill="url(#paint0_linear_1_1083)" id="Rectangle 17" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_1083" x1="0" x2="74.9998" y1="6.5" y2="6.5">
              <stop offset="0.317308" stopColor="white" />
              <stop offset="1" stopColor="#999999" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="[word-break:break-word] col-1 flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[13px] justify-center ml-0 mt-[54px] not-italic relative row-1 text-[12px] text-black w-[92%]">
        <p className="indent-[7px] leading-[0px]">0/0/0</p>
      </div>
      <div className="[word-break:break-word] col-1 flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center ml-[66.62%] mt-[9px] not-italic relative row-1 text-[12px] text-right text-white w-[28%] whitespace-nowrap">
        <p className="indent-[7px] leading-[0px]">15</p>
      </div>
    </div>
  );
}

function ContainerUserInfoBlue1() {
  return (
    <div className="flex-[1_0_0] grid-rows-[max-content] inline-grid leading-[0] min-w-px place-items-start relative" data-name="Container User Info - blue">
      <UserInfoBackground />
      <UserHeader />
      <Container1 />
      <UserInfo />
    </div>
  );
}

function ContainerUserInfoBlue() {
  return (
    <div className="content-stretch flex gap-[29px] items-center justify-center relative shrink-0 w-[246px]" data-name="Container User Info - blue">
      <ContainerUserInfoBlue1 />
      <div className="bg-[#d9d9d9] relative shrink-0 size-[47px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
    </div>
  );
}

function UserInfoBackground1() {
  return (
    <div className="col-1 h-[67px] ml-0 mt-[21px] relative row-1 w-full" data-name="User Info Background">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 170 67">
        <g id="User Info Background">
          <rect fill="var(--fill-0, #D69345)" height="67" id="Background" width="170" />
          <path d={svgPaths.p2772d080} fill="var(--fill-0, #6C4929)" id="Rectangle 16" />
        </g>
      </svg>
    </div>
  );
}

function UserHeader1() {
  return (
    <div className="bg-[#e8d367] col-1 h-[21px] ml-0 mt-0 relative row-1 w-full" data-name="User Header">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[21px] justify-center leading-[0] left-0 not-italic text-[16px] text-black top-[10.5px] w-[170px]">
        <p className="indent-[7px] leading-[0px]">MUTHH</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Container">
      <div className="col-1 ml-0 mt-0 relative row-1 size-[52px]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="52" src={imgEllipse3} width="52" />
      </div>
      <div className="col-1 ml-0 mt-[4px] relative row-1 size-[11px]">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
          <circle cx="5.5" cy="5.5" fill="var(--fill-0, #8BA93A)" id="Ellipse 4" r="5" stroke="var(--stroke-0, white)" />
        </svg>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Container">
      <div className="bg-black col-1 h-[6px] ml-0 mt-0 relative row-1 w-[51px]" data-name="Health Bar" />
      <div className="bg-[#8ba93a] col-1 h-[4px] ml-[1.5px] mt-px relative row-1 w-[48px]" data-name="Health Bar Background" />
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center leading-[0] relative shrink-0 w-[52px]" data-name="Container">
      <Container8 />
      <Container9 />
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col gap-[3px] items-start relative shrink-0 w-[24px]" data-name="Container">
      <div className="h-[24px] relative shrink-0 w-full">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="24" src={imgEllipse5} width="24" />
      </div>
      <div className="h-[24px] relative shrink-0 w-full">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="24" src={imgEllipse6} width="24" />
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="col-1 content-stretch flex gap-[11px] items-center ml-[45.88%] mt-[24px] relative row-1 w-[51.18%]" data-name="Container">
      <Container7 />
      <Container10 />
    </div>
  );
}

function UserInfo1() {
  return (
    <div className="col-1 grid-rows-[max-content] inline-grid ml-0 mt-[21px] place-items-start relative row-1 w-[44.12%]" data-name="User Info">
      <div className="col-1 h-[67px] ml-0 mt-0 relative row-1 w-[74.67%]" data-name="User Avatar">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgUserAvatar} />
      </div>
      <div className="col-1 h-[13px] ml-0 mt-[54px] relative row-1 w-full">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 74.9998 13">
          <path d="M0 0H68.4998L74.9998 13H0V0Z" fill="url(#paint0_linear_1_1083)" id="Rectangle 17" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_1083" x1="0" x2="74.9998" y1="6.5" y2="6.5">
              <stop offset="0.317308" stopColor="white" />
              <stop offset="1" stopColor="#999999" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="[word-break:break-word] col-1 flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[13px] justify-center ml-0 mt-[54px] not-italic relative row-1 text-[12px] text-black w-[92%]">
        <p className="indent-[7px] leading-[0px]">0/0/0</p>
      </div>
      <div className="[word-break:break-word] col-1 flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center ml-[66.62%] mt-[9px] not-italic relative row-1 text-[12px] text-right text-white w-[28%] whitespace-nowrap">
        <p className="indent-[7px] leading-[0px]">15</p>
      </div>
    </div>
  );
}

function ContainerUserInfoBlue3() {
  return (
    <div className="flex-[1_0_0] grid-rows-[max-content] inline-grid leading-[0] min-w-px place-items-start relative" data-name="Container User Info - blue">
      <UserInfoBackground1 />
      <UserHeader1 />
      <Container6 />
      <UserInfo1 />
    </div>
  );
}

function ContainerUserInfoBlue2() {
  return (
    <div className="content-stretch flex gap-[29px] items-center justify-center relative shrink-0 w-[246px]" data-name="Container User Info - blue">
      <ContainerUserInfoBlue3 />
      <div className="bg-[#d9d9d9] relative shrink-0 size-[47px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
    </div>
  );
}

function UserInfoBackground2() {
  return (
    <div className="col-1 h-[67px] ml-0 mt-[21px] relative row-1 w-full" data-name="User Info Background">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 170 67">
        <g id="User Info Background">
          <rect fill="var(--fill-0, #D69345)" height="67" id="Background" width="170" />
          <path d={svgPaths.p2772d080} fill="var(--fill-0, #6C4929)" id="Rectangle 16" />
        </g>
      </svg>
    </div>
  );
}

function UserHeader2() {
  return (
    <div className="bg-[#e8d367] col-1 h-[21px] ml-0 mt-0 relative row-1 w-full" data-name="User Header">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[21px] justify-center leading-[0] left-0 not-italic text-[16px] text-black top-[10.5px] w-[170px]">
        <p className="indent-[7px] leading-[0px]">MUTHH</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Container">
      <div className="col-1 ml-0 mt-0 relative row-1 size-[52px]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="52" src={imgEllipse3} width="52" />
      </div>
      <div className="col-1 ml-0 mt-[4px] relative row-1 size-[11px]">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
          <circle cx="5.5" cy="5.5" fill="var(--fill-0, #8BA93A)" id="Ellipse 4" r="5" stroke="var(--stroke-0, white)" />
        </svg>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Container">
      <div className="bg-black col-1 h-[6px] ml-0 mt-0 relative row-1 w-[51px]" data-name="Health Bar" />
      <div className="bg-[#8ba93a] col-1 h-[4px] ml-[1.5px] mt-px relative row-1 w-[48px]" data-name="Health Bar Background" />
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center leading-[0] relative shrink-0 w-[52px]" data-name="Container">
      <Container13 />
      <Container14 />
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-col gap-[3px] items-start relative shrink-0 w-[24px]" data-name="Container">
      <div className="h-[24px] relative shrink-0 w-full">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="24" src={imgEllipse5} width="24" />
      </div>
      <div className="h-[24px] relative shrink-0 w-full">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="24" src={imgEllipse6} width="24" />
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="col-1 content-stretch flex gap-[11px] items-center ml-[45.88%] mt-[24px] relative row-1 w-[51.18%]" data-name="Container">
      <Container12 />
      <Container15 />
    </div>
  );
}

function UserInfo2() {
  return (
    <div className="col-1 grid-rows-[max-content] inline-grid ml-0 mt-[21px] place-items-start relative row-1 w-[44.12%]" data-name="User Info">
      <div className="col-1 h-[67px] ml-0 mt-0 relative row-1 w-[74.67%]" data-name="User Avatar">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgUserAvatar} />
      </div>
      <div className="col-1 h-[13px] ml-0 mt-[54px] relative row-1 w-full">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 74.9998 13">
          <path d="M0 0H68.4998L74.9998 13H0V0Z" fill="url(#paint0_linear_1_1083)" id="Rectangle 17" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_1083" x1="0" x2="74.9998" y1="6.5" y2="6.5">
              <stop offset="0.317308" stopColor="white" />
              <stop offset="1" stopColor="#999999" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="[word-break:break-word] col-1 flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[13px] justify-center ml-0 mt-[54px] not-italic relative row-1 text-[12px] text-black w-[92%]">
        <p className="indent-[7px] leading-[0px]">0/0/0</p>
      </div>
      <div className="[word-break:break-word] col-1 flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center ml-[66.62%] mt-[9px] not-italic relative row-1 text-[12px] text-right text-white w-[28%] whitespace-nowrap">
        <p className="indent-[7px] leading-[0px]">15</p>
      </div>
    </div>
  );
}

function ContainerUserInfoBlue5() {
  return (
    <div className="flex-[1_0_0] grid-rows-[max-content] inline-grid leading-[0] min-w-px place-items-start relative" data-name="Container User Info - blue">
      <UserInfoBackground2 />
      <UserHeader2 />
      <Container11 />
      <UserInfo2 />
    </div>
  );
}

function ContainerUserInfoBlue4() {
  return (
    <div className="content-stretch flex gap-[29px] items-center justify-center relative shrink-0 w-[246px]" data-name="Container User Info - blue">
      <ContainerUserInfoBlue5 />
      <div className="bg-[#d9d9d9] relative shrink-0 size-[47px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
    </div>
  );
}

function UserInfoBackground3() {
  return (
    <div className="col-1 h-[67px] ml-0 mt-[21px] relative row-1 w-full" data-name="User Info Background">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 170 67">
        <g id="User Info Background">
          <rect fill="var(--fill-0, #D69345)" height="67" id="Background" width="170" />
          <path d={svgPaths.p2772d080} fill="var(--fill-0, #6C4929)" id="Rectangle 16" />
        </g>
      </svg>
    </div>
  );
}

function UserHeader3() {
  return (
    <div className="bg-[#e8d367] col-1 h-[21px] ml-0 mt-0 relative row-1 w-full" data-name="User Header">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[21px] justify-center leading-[0] left-0 not-italic text-[16px] text-black top-[10.5px] w-[170px]">
        <p className="indent-[7px] leading-[0px]">MUTHH</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Container">
      <div className="col-1 ml-0 mt-0 relative row-1 size-[52px]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="52" src={imgEllipse3} width="52" />
      </div>
      <div className="col-1 ml-0 mt-[4px] relative row-1 size-[11px]">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
          <circle cx="5.5" cy="5.5" fill="var(--fill-0, #8BA93A)" id="Ellipse 4" r="5" stroke="var(--stroke-0, white)" />
        </svg>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Container">
      <div className="bg-black col-1 h-[6px] ml-0 mt-0 relative row-1 w-[51px]" data-name="Health Bar" />
      <div className="bg-[#8ba93a] col-1 h-[4px] ml-[1.5px] mt-px relative row-1 w-[48px]" data-name="Health Bar Background" />
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center leading-[0] relative shrink-0 w-[52px]" data-name="Container">
      <Container18 />
      <Container19 />
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex flex-col gap-[3px] items-start relative shrink-0 w-[24px]" data-name="Container">
      <div className="h-[24px] relative shrink-0 w-full">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="24" src={imgEllipse5} width="24" />
      </div>
      <div className="h-[24px] relative shrink-0 w-full">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="24" src={imgEllipse6} width="24" />
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="col-1 content-stretch flex gap-[11px] items-center ml-[45.88%] mt-[24px] relative row-1 w-[51.18%]" data-name="Container">
      <Container17 />
      <Container20 />
    </div>
  );
}

function UserInfo3() {
  return (
    <div className="col-1 grid-rows-[max-content] inline-grid ml-0 mt-[21px] place-items-start relative row-1 w-[44.12%]" data-name="User Info">
      <div className="col-1 h-[67px] ml-0 mt-0 relative row-1 w-[74.67%]" data-name="User Avatar">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgUserAvatar} />
      </div>
      <div className="col-1 h-[13px] ml-0 mt-[54px] relative row-1 w-full">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 74.9998 13">
          <path d="M0 0H68.4998L74.9998 13H0V0Z" fill="url(#paint0_linear_1_1083)" id="Rectangle 17" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_1083" x1="0" x2="74.9998" y1="6.5" y2="6.5">
              <stop offset="0.317308" stopColor="white" />
              <stop offset="1" stopColor="#999999" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="[word-break:break-word] col-1 flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[13px] justify-center ml-0 mt-[54px] not-italic relative row-1 text-[12px] text-black w-[92%]">
        <p className="indent-[7px] leading-[0px]">0/0/0</p>
      </div>
      <div className="[word-break:break-word] col-1 flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center ml-[66.62%] mt-[9px] not-italic relative row-1 text-[12px] text-right text-white w-[28%] whitespace-nowrap">
        <p className="indent-[7px] leading-[0px]">15</p>
      </div>
    </div>
  );
}

function ContainerUserInfoBlue7() {
  return (
    <div className="flex-[1_0_0] grid-rows-[max-content] inline-grid leading-[0] min-w-px place-items-start relative" data-name="Container User Info - blue">
      <UserInfoBackground3 />
      <UserHeader3 />
      <Container16 />
      <UserInfo3 />
    </div>
  );
}

function ContainerUserInfoBlue6() {
  return (
    <div className="content-stretch flex gap-[29px] items-center justify-center relative shrink-0 w-[246px]" data-name="Container User Info - blue">
      <ContainerUserInfoBlue7 />
      <div className="bg-[#d9d9d9] relative shrink-0 size-[47px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
    </div>
  );
}

function UserInfoBackground4() {
  return (
    <div className="col-1 h-[67px] ml-0 mt-[21px] relative row-1 w-full" data-name="User Info Background">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 170 67">
        <g id="User Info Background">
          <rect fill="var(--fill-0, #D69345)" height="67" id="Background" width="170" />
          <path d={svgPaths.p2772d080} fill="var(--fill-0, #6C4929)" id="Rectangle 16" />
        </g>
      </svg>
    </div>
  );
}

function UserHeader4() {
  return (
    <div className="bg-[#e8d367] col-1 h-[21px] ml-0 mt-0 relative row-1 w-full" data-name="User Header">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[21px] justify-center leading-[0] left-0 not-italic text-[16px] text-black top-[10.5px] w-[170px]">
        <p className="indent-[7px] leading-[0px]">MUTHH</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Container">
      <div className="col-1 ml-0 mt-0 relative row-1 size-[52px]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="52" src={imgEllipse3} width="52" />
      </div>
      <div className="col-1 ml-0 mt-[4px] relative row-1 size-[11px]">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
          <circle cx="5.5" cy="5.5" fill="var(--fill-0, #8BA93A)" id="Ellipse 4" r="5" stroke="var(--stroke-0, white)" />
        </svg>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Container">
      <div className="bg-black col-1 h-[6px] ml-0 mt-0 relative row-1 w-[51px]" data-name="Health Bar" />
      <div className="bg-[#8ba93a] col-1 h-[4px] ml-[1.5px] mt-px relative row-1 w-[48px]" data-name="Health Bar Background" />
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center leading-[0] relative shrink-0 w-[52px]" data-name="Container">
      <Container23 />
      <Container24 />
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex flex-col gap-[3px] items-start relative shrink-0 w-[24px]" data-name="Container">
      <div className="h-[24px] relative shrink-0 w-full">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="24" src={imgEllipse5} width="24" />
      </div>
      <div className="h-[24px] relative shrink-0 w-full">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="24" src={imgEllipse6} width="24" />
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="col-1 content-stretch flex gap-[11px] items-center ml-[45.88%] mt-[24px] relative row-1 w-[51.18%]" data-name="Container">
      <Container22 />
      <Container25 />
    </div>
  );
}

function UserInfo4() {
  return (
    <div className="col-1 grid-rows-[max-content] inline-grid ml-0 mt-[21px] place-items-start relative row-1 w-[44.12%]" data-name="User Info">
      <div className="col-1 h-[67px] ml-0 mt-0 relative row-1 w-[74.67%]" data-name="User Avatar">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgUserAvatar} />
      </div>
      <div className="col-1 h-[13px] ml-0 mt-[54px] relative row-1 w-full">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 74.9998 13">
          <path d="M0 0H68.4998L74.9998 13H0V0Z" fill="url(#paint0_linear_1_1083)" id="Rectangle 17" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_1083" x1="0" x2="74.9998" y1="6.5" y2="6.5">
              <stop offset="0.317308" stopColor="white" />
              <stop offset="1" stopColor="#999999" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="[word-break:break-word] col-1 flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[13px] justify-center ml-0 mt-[54px] not-italic relative row-1 text-[12px] text-black w-[92%]">
        <p className="indent-[7px] leading-[0px]">0/0/0</p>
      </div>
      <div className="[word-break:break-word] col-1 flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center ml-[66.62%] mt-[9px] not-italic relative row-1 text-[12px] text-right text-white w-[28%] whitespace-nowrap">
        <p className="indent-[7px] leading-[0px]">15</p>
      </div>
    </div>
  );
}

function ContainerUserInfoBlue9() {
  return (
    <div className="flex-[1_0_0] grid-rows-[max-content] inline-grid leading-[0] min-w-px place-items-start relative" data-name="Container User Info - blue">
      <UserInfoBackground4 />
      <UserHeader4 />
      <Container21 />
      <UserInfo4 />
    </div>
  );
}

function ContainerUserInfoBlue8() {
  return (
    <div className="content-stretch flex gap-[29px] items-center justify-center relative shrink-0 w-[246px]" data-name="Container User Info - blue">
      <ContainerUserInfoBlue9 />
      <div className="bg-[#d9d9d9] relative shrink-0 size-[47px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
    </div>
  );
}

function getEmblemTalentId(player: any, slotNum: number, fallbackKey?: string): number {
  if (!player) return 0;
  if (fallbackKey && player[fallbackKey]) return Number(player[fallbackKey]) || 0;
  
  if (Array.isArray(player.emblemSkills)) {
    const slotItem = player.emblemSkills.find((item: any) => item && (Number(item.slot) === slotNum || Number(item.Slot) === slotNum));
    if (slotItem) {
      if (typeof slotItem === "object" && slotItem.id !== undefined) return Number(slotItem.id) || 0;
      if (typeof slotItem === "number") return slotItem;
    }
    const idxItem = player.emblemSkills[slotNum - 1];
    if (idxItem) {
      if (typeof idxItem === "object" && idxItem?.id !== undefined) return Number(idxItem.id) || 0;
      if (typeof idxItem === "number") return idxItem;
    }
  }

  return 0;
}

function findPlayer(players: any[], ipos: number) {
  if (!Array.isArray(players) || players.length === 0) return null;

  const exact = players.find((p: any) => Number(p?.ipos) === ipos && Number(p?.ipos) > 0);
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

function EquipIcon({ itemId, size = 41 }: { itemId: number; size?: number }) {
  const [srcIdx, setSrcIdx] = useState(0);
  if (!itemId || Number(itemId) <= 0) return null;

  const sources = [
    `/asset/equips/${itemId}.png`,
    `/asset/equips/${itemId}.webp`,
    `/assets/equips/${itemId}.png`,
    `/assets/equips/${itemId}.webp`,
    `/assets/items/${itemId}.png`,
    `/assets/items/${itemId}.webp`,
  ];

  const currentSrc = sources[srcIdx] || sources[0];

  return (
    <img
      alt=""
      className="absolute block inset-0 max-w-none size-full object-cover rounded"
      height={size}
      width={size}
      src={currentSrc}
      onError={() => {
        if (srcIdx < sources.length - 1) {
          setSrcIdx((prev) => prev + 1);
        }
      }}
    />
  );
}

function HeroIcon({ heroId, fallback = imgEllipse3, size = 52 }: { heroId: number; fallback?: string; size?: number }) {
  const [srcIdx, setSrcIdx] = useState(0);
  if (!heroId || Number(heroId) <= 0) {
    return <img alt="" className="absolute block inset-0 max-w-none size-full object-cover" height={size} src={fallback} width={size} />;
  }

  const sources = [
    `/asset/heroes-icon/${heroId}.png`,
    `/asset/heroes-icon/${heroId}.webp`,
    `/assets/heroes-icon/${heroId}.png`,
    `/assets/heroes-icon/${heroId}.webp`,
    `/assets/heroes/${heroId}.png`,
    `/assets/heroes/${heroId}.webp`,
    fallback,
  ];

  const currentSrc = sources[srcIdx] || fallback;

  return (
    <img
      alt=""
      className="absolute block inset-0 max-w-none size-full object-cover"
      height={size}
      width={size}
      src={currentSrc}
      onError={() => {
        if (srcIdx < sources.length - 1) {
          setSrcIdx((prev) => prev + 1);
        }
      }}
    />
  );
}

function FlexibleIcon({ id, type, fallback, size = 24 }: { id: number; type: string; fallback: string; size?: number }) {
  const [srcIdx, setSrcIdx] = useState(0);
  if (!id || Number(id) <= 0) {
    return <img alt="" className="absolute block inset-0 max-w-none size-full object-cover" height={size} src={fallback} width={size} />;
  }

  const sources = [
    `/assets/${type}/${id}.png`,
    `/assets/${type}/${id}.webp`,
    fallback,
  ];

  const currentSrc = sources[srcIdx] || fallback;

  return (
    <img
      alt=""
      className="absolute block inset-0 max-w-none size-full object-cover"
      height={size}
      width={size}
      src={currentSrc}
      onError={() => {
        if (srcIdx < sources.length - 1) {
          setSrcIdx((prev) => prev + 1);
        }
      }}
    />
  );
}

function DynamicHealthBar({ hp, maxHp }: { hp: number; maxHp: number }) {
  const hpVal = Math.max(0, Number(hp) || 0);
  const maxHpVal = Math.max(1, Number(maxHp) || 1);
  const percent = Math.min(100, Math.max(0, (hpVal / maxHpVal) * 100));

  let barColor = "#8ba93a"; // Green (> 50%)
  if (percent <= 20) {
    barColor = "#ef4444"; // Red (<= 20%)
  } else if (percent <= 50) {
    barColor = "#e8d367"; // Yellow (20% - 50%)
  }

  const widthPx = (percent / 100) * 48;

  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Container">
      <div className="bg-black col-1 h-[6px] ml-0 mt-0 relative row-1 w-[51px]" data-name="Health Bar" />
      <div
        className="col-1 h-[4px] ml-[1.5px] mt-px relative row-1 transition-all duration-300"
        style={{
          width: `${widthPx}px`,
          backgroundColor: barColor,
        }}
        data-name="Health Bar Background"
      />
    </div>
  );
}

function DynamicBlueUserInfo({ kill, dead, assist, level }: { kill: number; dead: number; assist: number; level: number }) {
  return (
    <div className="col-1 grid-rows-[max-content] inline-grid ml-0 mt-[21px] place-items-start relative row-1 w-[44.12%]" data-name="User Info">
      <div className="col-1 h-[67px] ml-0 mt-0 relative row-1 w-[74.67%]" data-name="User Avatar">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgUserAvatar} />
      </div>
      <div className="col-1 h-[13px] ml-0 mt-[54px] relative row-1 w-full">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 74.9998 13">
          <path d="M0 0H68.4998L74.9998 13H0V0Z" fill="url(#paint0_linear_1_1083)" id="Rectangle 17" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_1083" x1="0" x2="74.9998" y1="6.5" y2="6.5">
              <stop offset="0.317308" stopColor="white" />
              <stop offset="1" stopColor="#999999" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="[word-break:break-word] col-1 flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[13px] justify-center ml-0 mt-[54px] not-italic relative row-1 text-[12px] text-black w-[92%]">
        <p className="indent-[7px] leading-[0px]">{kill}/{dead}/{assist}</p>
      </div>
      <div className="[word-break:break-word] col-1 flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center ml-[66.62%] mt-[9px] not-italic relative row-1 text-[12px] text-right text-white whitespace-nowrap">
        <p className="indent-[7px] leading-[0px]">{level}</p>
      </div>
    </div>
  );
}

function DynamicRedUserInfo({ kill, dead, assist, level }: { kill: number; dead: number; assist: number; level: number }) {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[91.96px] mt-[20px] place-items-start relative row-1" data-name="User Info">
      <div className="col-1 h-[67px] ml-[28.04px] mt-0 relative row-1 w-[56px]" data-name="User Avatar">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgUserAvatar} />
      </div>
      <div className="col-1 flex h-[13px] items-center justify-center ml-[16.04px] mt-[55px] relative row-1 w-[69px]">
        <div className="-scale-y-100 flex-none rotate-180">
          <div className="h-[13px] relative w-[69px]">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 69 13">
              <path d="M0 0H63.02L69 13H0V0Z" fill="url(#paint0_linear_1_1076)" id="Rectangle 17" />
              <defs>
                <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_1076" x1="0" x2="69" y1="6.5" y2="6.5">
                  <stop offset="0.317308" stopColor="white" />
                  <stop offset="1" stopColor="#999999" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
      <div className="[word-break:break-word] col-1 flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[13px] justify-center ml-[14.04px] mt-[55px] not-italic relative row-1 text-[12px] text-black text-right w-[66.909px]">
        <p className="indent-[7px] leading-[0px]">{kill}/{dead}/{assist}</p>
      </div>
      <div className="[word-break:break-word] col-1 flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center ml-0 mt-[13px] not-italic relative row-1 text-[12px] text-right text-white whitespace-nowrap">
        <p className="indent-[7px] leading-[0px]">{level}</p>
      </div>
    </div>
  );
}

function getBattleTimeSeconds(roomData: any): number {
  const battle = roomData?.battle ?? roomData?.Battle;
  const raw = battle?.waktuPertandingan;
  if (typeof raw !== "number" || Number.isNaN(raw)) return 0;
  // Handle both seconds (e.g. 269) and milliseconds (e.g. 269000)
  return raw < 100000 ? Math.max(0, Math.floor(raw)) : Math.max(0, Math.floor(raw / 1000));
}

function formatGameTime(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds || 0));
  const mm = Math.floor(s / 60).toString().padStart(2, "0");
  const ss = (s % 60).toString().padStart(2, "0");
  return `${mm}:${ss}`;
}

function LevelUpOverlay({
  playerName,
  level,
  role,
  timeLabel,
  team,
}: {
  playerName: string;
  level: number;
  role: number;
  timeLabel: string;
  team: "blue" | "red";
}) {
  const roleSrc = role > 0 ? `/assets/lane/${role}.png` : imgLogo4;
  const isBlue = team === "blue";
  return (
    <motion.div
      className="absolute inset-0 z-20 flex overflow-hidden"
      data-name="Level Up Notif"
      initial={{ opacity: 0, x: isBlue ? -24 : 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: isBlue ? -24 : 24 }}
      transition={{ duration: 0.45, ease: "easeInOut" }}
    >
      {/* Role strip mirrored: blue right, red left */}
      {!isBlue && (
        <div className="bg-[#533920] w-[48px] shrink-0 h-full flex items-center justify-center relative" data-name="container-role">
          <img alt="" className="size-[28px] object-cover" src={roleSrc} />
        </div>
      )}
      <div className="flex-1 bg-[#d69345] relative flex flex-col min-w-0" data-name="notif-up-level">
        <div className="flex-1 flex flex-col items-center justify-center px-2 min-h-0">
          <p className="font-['Koulen:Regular',sans-serif] text-white text-[30px] leading-[30px] tracking-wide text-center truncate w-full m-0">
            LEVEL {level}
          </p>
          <p className="font-['Inter:Extra_Bold',sans-serif] font-extrabold text-white text-[14px] leading-none text-center truncate w-full m-0 mt-[2px]">
            {playerName}
          </p>
        </div>
        <div className="bg-[#e8d367] h-[17px] shrink-0 flex items-center justify-center" data-name="record-waktu">
          <p className="font-['Inter:Bold',sans-serif] font-bold text-black text-[13px] leading-none text-center m-0">
            Pada {timeLabel}
          </p>
        </div>
      </div>
      {isBlue && (
        <div className="bg-[#533920] w-[48px] shrink-0 h-full flex items-center justify-center relative" data-name="container-role">
          <img alt="" className="size-[28px] object-cover" src={roleSrc} />
        </div>
      )}
    </motion.div>
  );
}

function useLevelUpNotif({
  ipos,
  level,
  roomData,
}: {
  ipos: number;
  level: number;
  roomData: any;
}) {
  const [notif, setNotif] = useState<{ level: number; timeLabel: string } | null>(null);
  const prevLevelRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showFor3s = (lv: number, timeLabel: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setNotif({ level: lv, timeLabel });
    timeoutRef.current = setTimeout(() => setNotif(null), 3000);
  };

  // Auto: only on reaching level 4 or 15 (transition-based, not on first load)
  useEffect(() => {
    const prev = prevLevelRef.current;
    if (prev === null) {
      prevLevelRef.current = level;
      return;
    }
    if (level !== prev) {
      prevLevelRef.current = level;
      if (level === 4 || level === 15) {
        const secs = getBattleTimeSeconds(roomData);
        showFor3s(level, formatGameTime(secs));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  // Manual test trigger from Control Panel (test only)
  useEffect(() => {
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel("mlbs_overlay_control");
      bc.onmessage = (event) => {
        if (event.data?.type === "TRIGGER_LEVELUP" && Number(event.data?.ipos) === Number(ipos)) {
          const lv = Number(event.data?.level) || level || 4;
          const label =
            typeof event.data?.timeLabel === "string" && event.data.timeLabel
              ? event.data.timeLabel
              : formatGameTime(getBattleTimeSeconds(roomData));
          showFor3s(lv, label);
        }
      };
    } catch {
      bc = null;
    }
    return () => {
      try {
        bc?.close();
      } catch {
        /* noop */
      }
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ipos]);

  return notif;
}

function formatGoldDiff(diffVal: number): string {
  const v = Math.round(diffVal);
  // Below 1000 (e.g. 999): show as-is, don't abbreviate to K
  if (Math.abs(v) < 1000) return "+" + String(v);
  return "+" + (v / 1000).toFixed(1).replace(".0", "") + "K";
}

const SIDE_ITEM_VISIBLE_KEY = "mlbs_side_item_visible";

let globalSideItemVisible = true;
const sideItemListeners = new Set<(v: boolean) => void>();

function setGlobalSideItemVisible(v: boolean) {
  globalSideItemVisible = v;
  sideItemListeners.forEach((fn) => fn(v));
}

function useSideItemVisible(): boolean {
  const [visible, setVisible] = useState(globalSideItemVisible);
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SIDE_ITEM_VISIBLE_KEY);
      if (stored !== null) {
        const v = stored !== "false";
        if (v !== globalSideItemVisible) setGlobalSideItemVisible(v);
        else setVisible(v);
      }
    } catch {
      /* noop */
    }
    const listener = (v: boolean) => setVisible(v);
    sideItemListeners.add(listener);
    return () => {
      sideItemListeners.delete(listener);
    };
  }, []);
  return visible;
}

type SideMediaSlot = "a" | "b";
type SideMediaData = { bg: string; photos: string[] };

const SIDE_MEDIA_KEYS: Record<SideMediaSlot, string> = {
  a: "mlbs_side_media_a",
  b: "mlbs_side_media_b",
};

const SIDE_MEDIA_DEFAULTS: Record<SideMediaSlot, SideMediaData> = {
  a: { bg: "#e8d367", photos: [] },
  b: { bg: "#d9d9d9", photos: [] },
};

const globalSideMedia: Record<SideMediaSlot, SideMediaData> = {
  a: { ...SIDE_MEDIA_DEFAULTS.a, photos: [] },
  b: { ...SIDE_MEDIA_DEFAULTS.b, photos: [] },
};
const sideMediaListeners = new Set<(slot: SideMediaSlot, data: SideMediaData) => void>();

function readSideMedia(slot: SideMediaSlot): SideMediaData {
  try {
    const raw = localStorage.getItem(SIDE_MEDIA_KEYS[slot]);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<SideMediaData>;
      return {
        bg: typeof parsed.bg === "string" && parsed.bg ? parsed.bg : SIDE_MEDIA_DEFAULTS[slot].bg,
        photos: Array.isArray(parsed.photos) ? parsed.photos.filter((p) => typeof p === "string") : [],
      };
    }
  } catch {
    /* noop */
  }
  return { ...SIDE_MEDIA_DEFAULTS[slot], photos: [] };
}

function setGlobalSideMedia(slot: SideMediaSlot, data: SideMediaData) {
  globalSideMedia[slot] = data;
  sideMediaListeners.forEach((fn) => fn(slot, data));
}

function useSideMedia(slot: SideMediaSlot): SideMediaData {
  const [data, setData] = useState<SideMediaData>(globalSideMedia[slot]);
  useEffect(() => {
    const stored = readSideMedia(slot);
    const cur = globalSideMedia[slot];
    if (stored.bg !== cur.bg || JSON.stringify(stored.photos) !== JSON.stringify(cur.photos)) {
      setGlobalSideMedia(slot, stored);
    } else {
      setData(stored);
    }
    const listener = (s: SideMediaSlot, d: SideMediaData) => {
      if (s === slot) setData(d);
    };
    sideMediaListeners.add(listener);
    return () => {
      sideMediaListeners.delete(listener);
    };
  }, [slot]);
  return data;
}

const SIDE_MEDIA_SLIDE_MS = 5000;

function SideMedia({ slot, className }: { slot: SideMediaSlot; className: string }) {
  const { bg, photos } = useSideMedia(slot);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [photos.length]);

  useEffect(() => {
    if (photos.length <= 1) return;
    const t = setInterval(() => {
      setIndex((prev) => (prev + 1) % photos.length);
    }, SIDE_MEDIA_SLIDE_MS);
    return () => clearInterval(t);
  }, [photos.length]);

  const current = photos.length > 0 ? photos[index % photos.length] : null;

  return (
    <div className={`${className} relative shrink-0 overflow-hidden`} data-name="Rounded Rectangle" style={{ background: bg }}>
      {current && photos.length <= 1 && (
        <img alt="" className="absolute inset-0 size-full object-cover" src={current} />
      )}
      <AnimatePresence>
        {current && photos.length > 1 && (
          <motion.img
            key={`${slot}-${index % photos.length}`}
            alt=""
            className="absolute inset-0 size-full object-cover"
            src={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function SingleBluePlayerSideCard({ ipos }: { ipos: number }) {
  const roomData = useRoomData();
  const players = Array.isArray(roomData?.players) ? roomData.players : [];
  const player = findPlayer(players, ipos);

  const playerName = player?.name || `Player ${ipos}`;
  const heroId = Number(player?.heroid || player?.SelHeroID) || 0;
  const spellId = Number(player?.battleSpell || player?.spellId) || 0;
  const coreTalentId = getEmblemTalentId(player, 3, "coreTalent");

  const hp = Number(player?.hp) || 0;
  const maxHp = Number(player?.maxHp) || 1;
  const ultActive = Boolean(player?.ultActive);
  const kill = player?.kill ?? 0;
  const dead = player?.dead ?? 0;
  const assist = player?.assist ?? 0;
  const level = player?.level !== undefined ? player.level : 1;
  const role = Number(player?.role) || 0;
  const levelUp = useLevelUpNotif({ ipos, level, roomData });
  const showSideItem = useSideItemVisible();

  const validEquips = Array.isArray(player?.equips)
    ? player.equips.map(Number).filter((id: number) => id > 0)
    : [];
  const lastEquipId = validEquips.length > 0 ? validEquips[validEquips.length - 1] : 0;

  const spellSrc = spellId > 0 ? `/assets/spells/${spellId}.webp` : imgEllipse6;
  const coreTalentSrc = coreTalentId > 0 ? `/assets/emblem/talents/${coreTalentId}.webp` : imgEllipse5;

  return (
    <div className="content-stretch flex gap-[29px] items-center justify-center relative shrink-0 w-[246px]" data-name="Container User Info - blue">
      <AnimatePresence>
        {levelUp && (
          <LevelUpOverlay
            playerName={playerName}
            level={levelUp.level}
            role={role}
            timeLabel={levelUp.timeLabel}
            team="blue"
          />
        )}
      </AnimatePresence>
      <div className="flex-[1_0_0] grid-rows-[max-content] inline-grid leading-[0] min-w-px place-items-start relative" data-name="Container User Info - blue">
        <UserInfoBackground />
        
        {/* User Header (Player Name) */}
        <div className="bg-[#e8d367] col-1 h-[21px] ml-0 mt-0 relative row-1 w-full flex items-center" data-name="User Header">
          <div className="[word-break:break-word] flex font-['Inter:Bold',sans-serif] font-bold h-[21px] justify-start items-center text-[14px] text-black w-[170px]">
            <p className="indent-[7px] leading-none truncate px-1 m-0">{playerName}</p>
          </div>
        </div>

        {/* Hero Icon, Health Bar, Battle Spell, Core Talent */}
        <div className="col-1 content-stretch flex gap-[11px] items-center ml-[45.88%] mt-[24px] relative row-1 w-[51.18%]" data-name="Container">
          {/* Hero Icon & Health Bar */}
          <div className="content-stretch flex flex-col gap-[4px] items-center leading-[0] relative shrink-0 w-[52px]" data-name="Container">
            <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Container">
              <div className="col-1 ml-0 mt-0 relative row-1 size-[52px] rounded-full overflow-hidden">
                <HeroIcon heroId={heroId} fallback={imgEllipse3} size={52} />
              </div>
              <div className="col-1 ml-0 mt-[4px] relative row-1 size-[11px]">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
                  <circle cx="5.5" cy="5.5" fill={ultActive ? "#8BA93A" : "#888888"} id="Ellipse 4" r="5" stroke="var(--stroke-0, white)" />
                </svg>
              </div>
            </div>
            <DynamicHealthBar hp={hp} maxHp={maxHp} />
          </div>

          {/* Core Talent (Slot 3) & Battle Spell */}
          <div className="content-stretch flex flex-col gap-[3px] items-start relative shrink-0 w-[24px]" data-name="Container">
            <div className="h-[24px] relative shrink-0 w-full rounded-full overflow-hidden">
              <FlexibleIcon id={coreTalentId} type="emblem/talents" fallback={imgEllipse5} size={24} />
            </div>
            <div className="h-[24px] relative shrink-0 w-full rounded-full overflow-hidden">
              <FlexibleIcon id={spellId} type="spells" fallback={imgEllipse6} size={24} />
            </div>
          </div>
        </div>

        {/* User Info (Avatar / KDA / Level) */}
        <DynamicBlueUserInfo kill={kill} dead={dead} assist={assist} level={level} />
      </div>

      <div className={`bg-[#d9d9d9] relative shrink-0 size-[47px] overflow-hidden rounded${showSideItem ? "" : " invisible"}`} data-name="Item">
        {lastEquipId > 0 && <EquipIcon itemId={lastEquipId} size={47} />}
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none z-10" />
      </div>
    </div>
  );
}

function UserCards() {
  return (
    <div className="content-stretch flex flex-col gap-[3px] items-start justify-center relative shrink-0 w-[170px]" data-name="User Cards">
      {[1, 2, 3, 4, 5].map((ipos) => (
        <SingleBluePlayerSideCard key={ipos} ipos={ipos} />
      ))}
    </div>
  );
}

function UserInfoBackground5() {
  return (
    <div className="col-1 h-[67px] ml-0 mt-[21px] relative row-1 w-[176px]" data-name="User Info Background">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 176 67">
        <g id="User Info Background">
          <rect fill="var(--fill-0, #D69345)" height="67" id="Background" transform="matrix(-1 0 0 1 176 0)" width="176" />
          <path d={svgPaths.p1b3b4f80} fill="var(--fill-0, #6C4929)" id="Rectangle 16" />
        </g>
      </svg>
    </div>
  );
}

function UserHeader5() {
  return (
    <div className="bg-[#e8d367] col-1 h-[21px] ml-0 mt-0 relative row-1 w-[176px]" data-name="User Header">
      <div className="-translate-x-full -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[21px] justify-center leading-[0] left-[165px] not-italic text-[16px] text-black text-right top-[10.5px] w-[165px]">
        <p className="indent-[7px] leading-[0px]">MUTHH</p>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex flex-col gap-[3px] items-start relative shrink-0 w-[24px]" data-name="Container">
      <div className="h-[24px] relative shrink-0 w-full">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="24" src={imgEllipse5} width="24" />
      </div>
      <div className="h-[24px] relative shrink-0 w-full">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="24" src={imgEllipse6} width="24" />
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Container">
      <div className="col-1 ml-0 mt-0 relative row-1 size-[52px]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="52" src={imgEllipse3} width="52" />
      </div>
      <div className="col-1 ml-0 mt-[4px] relative row-1 size-[11px]">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
          <circle cx="5.5" cy="5.5" fill="var(--fill-0, #8BA93A)" id="Ellipse 4" r="5" stroke="var(--stroke-0, white)" />
        </svg>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Container">
      <div className="bg-black col-1 h-[6px] ml-0 mt-0 relative row-1 w-[51px]" data-name="Health Bar" />
      <div className="bg-[#8ba93a] col-1 h-[4px] ml-[1.5px] mt-px relative row-1 w-[48px]" data-name="Health Bar Background" />
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center leading-[0] relative shrink-0 w-[52px]" data-name="Container">
      <Container29 />
      <Container30 />
    </div>
  );
}

function Container26() {
  return (
    <div className="col-1 content-stretch flex gap-[11px] items-center ml-[6px] mt-[24px] relative row-1" data-name="Container">
      <Container27 />
      <Container28 />
    </div>
  );
}

function UserInfo5() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[91.96px] mt-[20px] place-items-start relative row-1" data-name="User Info">
      <div className="col-1 h-[67px] ml-[28.04px] mt-0 relative row-1 w-[56px]" data-name="User Avatar">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgUserAvatar} />
      </div>
      <div className="col-1 flex h-[13px] items-center justify-center ml-[16.04px] mt-[55px] relative row-1 w-[69px]">
        <div className="-scale-y-100 flex-none rotate-180">
          <div className="h-[13px] relative w-[69px]">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 69 13">
              <path d="M0 0H63.02L69 13H0V0Z" fill="url(#paint0_linear_1_1076)" id="Rectangle 17" />
              <defs>
                <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_1076" x1="0" x2="69" y1="6.5" y2="6.5">
                  <stop offset="0.317308" stopColor="white" />
                  <stop offset="1" stopColor="#999999" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
      <div className="[word-break:break-word] col-1 flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[13px] justify-center ml-[14.04px] mt-[55px] not-italic relative row-1 text-[12px] text-black text-right w-[66.909px]">
        <p className="indent-[7px] leading-[0px]">0/0/0</p>
      </div>
      <div className="[word-break:break-word] col-1 flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center ml-0 mt-[13px] not-italic relative row-1 text-[12px] text-right text-white whitespace-nowrap">
        <p className="indent-[7px] leading-[0px]">15</p>
      </div>
    </div>
  );
}

function ContainerUserInfoBlue10() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Container User Info - blue">
      <UserInfoBackground5 />
      <UserHeader5 />
      <Container26 />
      <UserInfo5 />
    </div>
  );
}

function ContainerUserInfoRed() {
  return (
    <div className="content-stretch flex gap-[29px] items-center relative shrink-0 w-[251px]" data-name="Container User Info - red">
      <div className="bg-[#d9d9d9] relative shrink-0 size-[47px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <ContainerUserInfoBlue10 />
    </div>
  );
}

function UserInfoBackground6() {
  return (
    <div className="col-1 h-[67px] ml-0 mt-[21px] relative row-1 w-[176px]" data-name="User Info Background">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 176 67">
        <g id="User Info Background">
          <rect fill="var(--fill-0, #D69345)" height="67" id="Background" transform="matrix(-1 0 0 1 176 0)" width="176" />
          <path d={svgPaths.p1b3b4f80} fill="var(--fill-0, #6C4929)" id="Rectangle 16" />
        </g>
      </svg>
    </div>
  );
}

function UserHeader6() {
  return (
    <div className="bg-[#e8d367] col-1 h-[21px] ml-0 mt-0 relative row-1 w-[176px]" data-name="User Header">
      <div className="-translate-x-full -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[21px] justify-center leading-[0] left-[165px] not-italic text-[16px] text-black text-right top-[10.5px] w-[165px]">
        <p className="indent-[7px] leading-[0px]">MUTHH</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex flex-col gap-[3px] items-start relative shrink-0 w-[24px]" data-name="Container">
      <div className="h-[24px] relative shrink-0 w-full">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="24" src={imgEllipse5} width="24" />
      </div>
      <div className="h-[24px] relative shrink-0 w-full">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="24" src={imgEllipse6} width="24" />
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Container">
      <div className="col-1 ml-0 mt-0 relative row-1 size-[52px]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="52" src={imgEllipse3} width="52" />
      </div>
      <div className="col-1 ml-0 mt-[4px] relative row-1 size-[11px]">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
          <circle cx="5.5" cy="5.5" fill="var(--fill-0, #8BA93A)" id="Ellipse 4" r="5" stroke="var(--stroke-0, white)" />
        </svg>
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Container">
      <div className="bg-black col-1 h-[6px] ml-0 mt-0 relative row-1 w-[51px]" data-name="Health Bar" />
      <div className="bg-[#8ba93a] col-1 h-[4px] ml-[1.5px] mt-px relative row-1 w-[48px]" data-name="Health Bar Background" />
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center leading-[0] relative shrink-0 w-[52px]" data-name="Container">
      <Container34 />
      <Container35 />
    </div>
  );
}

function Container31() {
  return (
    <div className="col-1 content-stretch flex gap-[11px] items-center ml-[6px] mt-[24px] relative row-1" data-name="Container">
      <Container32 />
      <Container33 />
    </div>
  );
}

function UserInfo6() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[91.96px] mt-[20px] place-items-start relative row-1" data-name="User Info">
      <div className="col-1 h-[67px] ml-[28.04px] mt-0 relative row-1 w-[56px]" data-name="User Avatar">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgUserAvatar} />
      </div>
      <div className="col-1 flex h-[13px] items-center justify-center ml-[16.04px] mt-[55px] relative row-1 w-[69px]">
        <div className="-scale-y-100 flex-none rotate-180">
          <div className="h-[13px] relative w-[69px]">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 69 13">
              <path d="M0 0H63.02L69 13H0V0Z" fill="url(#paint0_linear_1_1076)" id="Rectangle 17" />
              <defs>
                <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_1076" x1="0" x2="69" y1="6.5" y2="6.5">
                  <stop offset="0.317308" stopColor="white" />
                  <stop offset="1" stopColor="#999999" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
      <div className="[word-break:break-word] col-1 flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[13px] justify-center ml-[14.04px] mt-[55px] not-italic relative row-1 text-[12px] text-black text-right w-[66.909px]">
        <p className="indent-[7px] leading-[0px]">0/0/0</p>
      </div>
      <div className="[word-break:break-word] col-1 flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center ml-0 mt-[13px] not-italic relative row-1 text-[12px] text-right text-white whitespace-nowrap">
        <p className="indent-[7px] leading-[0px]">15</p>
      </div>
    </div>
  );
}

function ContainerUserInfoBlue11() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Container User Info - blue">
      <UserInfoBackground6 />
      <UserHeader6 />
      <Container31 />
      <UserInfo6 />
    </div>
  );
}

function ContainerUserInfoRed1() {
  return (
    <div className="content-stretch flex gap-[29px] items-center relative shrink-0 w-[251px]" data-name="Container User Info - red">
      <div className="bg-[#d9d9d9] relative shrink-0 size-[47px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <ContainerUserInfoBlue11 />
    </div>
  );
}

function UserInfoBackground7() {
  return (
    <div className="col-1 h-[67px] ml-0 mt-[21px] relative row-1 w-[176px]" data-name="User Info Background">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 176 67">
        <g id="User Info Background">
          <rect fill="var(--fill-0, #D69345)" height="67" id="Background" transform="matrix(-1 0 0 1 176 0)" width="176" />
          <path d={svgPaths.p1b3b4f80} fill="var(--fill-0, #6C4929)" id="Rectangle 16" />
        </g>
      </svg>
    </div>
  );
}

function UserHeader7() {
  return (
    <div className="bg-[#e8d367] col-1 h-[21px] ml-0 mt-0 relative row-1 w-[176px]" data-name="User Header">
      <div className="-translate-x-full -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[21px] justify-center leading-[0] left-[165px] not-italic text-[16px] text-black text-right top-[10.5px] w-[165px]">
        <p className="indent-[7px] leading-[0px]">MUTHH</p>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="content-stretch flex flex-col gap-[3px] items-start relative shrink-0 w-[24px]" data-name="Container">
      <div className="h-[24px] relative shrink-0 w-full">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="24" src={imgEllipse5} width="24" />
      </div>
      <div className="h-[24px] relative shrink-0 w-full">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="24" src={imgEllipse6} width="24" />
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Container">
      <div className="col-1 ml-0 mt-0 relative row-1 size-[52px]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="52" src={imgEllipse3} width="52" />
      </div>
      <div className="col-1 ml-0 mt-[4px] relative row-1 size-[11px]">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
          <circle cx="5.5" cy="5.5" fill="var(--fill-0, #8BA93A)" id="Ellipse 4" r="5" stroke="var(--stroke-0, white)" />
        </svg>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Container">
      <div className="bg-black col-1 h-[6px] ml-0 mt-0 relative row-1 w-[51px]" data-name="Health Bar" />
      <div className="bg-[#8ba93a] col-1 h-[4px] ml-[1.5px] mt-px relative row-1 w-[48px]" data-name="Health Bar Background" />
    </div>
  );
}

function Container38() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center leading-[0] relative shrink-0 w-[52px]" data-name="Container">
      <Container39 />
      <Container40 />
    </div>
  );
}

function Container36() {
  return (
    <div className="col-1 content-stretch flex gap-[11px] items-center ml-[6px] mt-[24px] relative row-1" data-name="Container">
      <Container37 />
      <Container38 />
    </div>
  );
}

function UserInfo7() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[91.96px] mt-[20px] place-items-start relative row-1" data-name="User Info">
      <div className="col-1 h-[67px] ml-[28.04px] mt-0 relative row-1 w-[56px]" data-name="User Avatar">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgUserAvatar} />
      </div>
      <div className="col-1 flex h-[13px] items-center justify-center ml-[16.04px] mt-[55px] relative row-1 w-[69px]">
        <div className="-scale-y-100 flex-none rotate-180">
          <div className="h-[13px] relative w-[69px]">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 69 13">
              <path d="M0 0H63.02L69 13H0V0Z" fill="url(#paint0_linear_1_1076)" id="Rectangle 17" />
              <defs>
                <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_1076" x1="0" x2="69" y1="6.5" y2="6.5">
                  <stop offset="0.317308" stopColor="white" />
                  <stop offset="1" stopColor="#999999" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
      <div className="[word-break:break-word] col-1 flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[13px] justify-center ml-[14.04px] mt-[55px] not-italic relative row-1 text-[12px] text-black text-right w-[66.909px]">
        <p className="indent-[7px] leading-[0px]">0/0/0</p>
      </div>
      <div className="[word-break:break-word] col-1 flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center ml-0 mt-[13px] not-italic relative row-1 text-[12px] text-right text-white whitespace-nowrap">
        <p className="indent-[7px] leading-[0px]">15</p>
      </div>
    </div>
  );
}

function ContainerUserInfoBlue12() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Container User Info - blue">
      <UserInfoBackground7 />
      <UserHeader7 />
      <Container36 />
      <UserInfo7 />
    </div>
  );
}

function ContainerUserInfoRed2() {
  return (
    <div className="content-stretch flex gap-[29px] items-center relative shrink-0 w-[251px]" data-name="Container User Info - red">
      <div className="bg-[#d9d9d9] relative shrink-0 size-[47px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <ContainerUserInfoBlue12 />
    </div>
  );
}

function UserInfoBackground8() {
  return (
    <div className="col-1 h-[67px] ml-0 mt-[21px] relative row-1 w-[176px]" data-name="User Info Background">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 176 67">
        <g id="User Info Background">
          <rect fill="var(--fill-0, #D69345)" height="67" id="Background" transform="matrix(-1 0 0 1 176 0)" width="176" />
          <path d={svgPaths.p1b3b4f80} fill="var(--fill-0, #6C4929)" id="Rectangle 16" />
        </g>
      </svg>
    </div>
  );
}

function UserHeader8() {
  return (
    <div className="bg-[#e8d367] col-1 h-[21px] ml-0 mt-0 relative row-1 w-[176px]" data-name="User Header">
      <div className="-translate-x-full -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[21px] justify-center leading-[0] left-[165px] not-italic text-[16px] text-black text-right top-[10.5px] w-[165px]">
        <p className="indent-[7px] leading-[0px]">MUTHH</p>
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="content-stretch flex flex-col gap-[3px] items-start relative shrink-0 w-[24px]" data-name="Container">
      <div className="h-[24px] relative shrink-0 w-full">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="24" src={imgEllipse5} width="24" />
      </div>
      <div className="h-[24px] relative shrink-0 w-full">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="24" src={imgEllipse6} width="24" />
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Container">
      <div className="col-1 ml-0 mt-0 relative row-1 size-[52px]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="52" src={imgEllipse3} width="52" />
      </div>
      <div className="col-1 ml-0 mt-[4px] relative row-1 size-[11px]">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
          <circle cx="5.5" cy="5.5" fill="var(--fill-0, #8BA93A)" id="Ellipse 4" r="5" stroke="var(--stroke-0, white)" />
        </svg>
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Container">
      <div className="bg-black col-1 h-[6px] ml-0 mt-0 relative row-1 w-[51px]" data-name="Health Bar" />
      <div className="bg-[#8ba93a] col-1 h-[4px] ml-[1.5px] mt-px relative row-1 w-[48px]" data-name="Health Bar Background" />
    </div>
  );
}

function Container43() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center leading-[0] relative shrink-0 w-[52px]" data-name="Container">
      <Container44 />
      <Container45 />
    </div>
  );
}

function Container41() {
  return (
    <div className="col-1 content-stretch flex gap-[11px] items-center ml-[6px] mt-[24px] relative row-1" data-name="Container">
      <Container42 />
      <Container43 />
    </div>
  );
}

function UserInfo8() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[91.96px] mt-[20px] place-items-start relative row-1" data-name="User Info">
      <div className="col-1 h-[67px] ml-[28.04px] mt-0 relative row-1 w-[56px]" data-name="User Avatar">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgUserAvatar} />
      </div>
      <div className="col-1 flex h-[13px] items-center justify-center ml-[16.04px] mt-[55px] relative row-1 w-[69px]">
        <div className="-scale-y-100 flex-none rotate-180">
          <div className="h-[13px] relative w-[69px]">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 69 13">
              <path d="M0 0H63.02L69 13H0V0Z" fill="url(#paint0_linear_1_1076)" id="Rectangle 17" />
              <defs>
                <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_1076" x1="0" x2="69" y1="6.5" y2="6.5">
                  <stop offset="0.317308" stopColor="white" />
                  <stop offset="1" stopColor="#999999" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
      <div className="[word-break:break-word] col-1 flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[13px] justify-center ml-[14.04px] mt-[55px] not-italic relative row-1 text-[12px] text-black text-right w-[66.909px]">
        <p className="indent-[7px] leading-[0px]">0/0/0</p>
      </div>
      <div className="[word-break:break-word] col-1 flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center ml-0 mt-[13px] not-italic relative row-1 text-[12px] text-right text-white whitespace-nowrap">
        <p className="indent-[7px] leading-[0px]">15</p>
      </div>
    </div>
  );
}

function ContainerUserInfoBlue13() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Container User Info - blue">
      <UserInfoBackground8 />
      <UserHeader8 />
      <Container41 />
      <UserInfo8 />
    </div>
  );
}

function ContainerUserInfoRed3() {
  return (
    <div className="content-stretch flex gap-[29px] items-center relative shrink-0 w-[251px]" data-name="Container User Info - red">
      <div className="bg-[#d9d9d9] relative shrink-0 size-[47px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <ContainerUserInfoBlue13 />
    </div>
  );
}

function UserInfoBackground9() {
  return (
    <div className="col-1 h-[67px] ml-0 mt-[21px] relative row-1 w-[176px]" data-name="User Info Background">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 176 67">
        <g id="User Info Background">
          <rect fill="var(--fill-0, #D69345)" height="67" id="Background" transform="matrix(-1 0 0 1 176 0)" width="176" />
          <path d={svgPaths.p1b3b4f80} fill="var(--fill-0, #6C4929)" id="Rectangle 16" />
        </g>
      </svg>
    </div>
  );
}

function UserHeader9() {
  return (
    <div className="bg-[#e8d367] col-1 h-[21px] ml-0 mt-0 relative row-1 w-[176px]" data-name="User Header">
      <div className="-translate-x-full -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[21px] justify-center leading-[0] left-[165px] not-italic text-[16px] text-black text-right top-[10.5px] w-[165px]">
        <p className="indent-[7px] leading-[0px]">MUTHH</p>
      </div>
    </div>
  );
}

function Container47() {
  return (
    <div className="content-stretch flex flex-col gap-[3px] items-start relative shrink-0 w-[24px]" data-name="Container">
      <div className="h-[24px] relative shrink-0 w-full">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="24" src={imgEllipse5} width="24" />
      </div>
      <div className="h-[24px] relative shrink-0 w-full">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="24" src={imgEllipse6} width="24" />
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Container">
      <div className="col-1 ml-0 mt-0 relative row-1 size-[52px]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="52" src={imgEllipse3} width="52" />
      </div>
      <div className="col-1 ml-0 mt-[4px] relative row-1 size-[11px]">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
          <circle cx="5.5" cy="5.5" fill="var(--fill-0, #8BA93A)" id="Ellipse 4" r="5" stroke="var(--stroke-0, white)" />
        </svg>
      </div>
    </div>
  );
}

function Container50() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Container">
      <div className="bg-black col-1 h-[6px] ml-0 mt-0 relative row-1 w-[51px]" data-name="Health Bar" />
      <div className="bg-[#8ba93a] col-1 h-[4px] ml-[1.5px] mt-px relative row-1 w-[48px]" data-name="Health Bar Background" />
    </div>
  );
}

function Container48() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center leading-[0] relative shrink-0 w-[52px]" data-name="Container">
      <Container49 />
      <Container50 />
    </div>
  );
}

function Container46() {
  return (
    <div className="col-1 content-stretch flex gap-[11px] items-center ml-[6px] mt-[24px] relative row-1" data-name="Container">
      <Container47 />
      <Container48 />
    </div>
  );
}

function UserInfo9() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-[91.96px] mt-[20px] place-items-start relative row-1" data-name="User Info">
      <div className="col-1 h-[67px] ml-[28.04px] mt-0 relative row-1 w-[56px]" data-name="User Avatar">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgUserAvatar} />
      </div>
      <div className="col-1 flex h-[13px] items-center justify-center ml-[16.04px] mt-[55px] relative row-1 w-[69px]">
        <div className="-scale-y-100 flex-none rotate-180">
          <div className="h-[13px] relative w-[69px]">
            <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 69 13">
              <path d="M0 0H63.02L69 13H0V0Z" fill="url(#paint0_linear_1_1076)" id="Rectangle 17" />
              <defs>
                <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_1076" x1="0" x2="69" y1="6.5" y2="6.5">
                  <stop offset="0.317308" stopColor="white" />
                  <stop offset="1" stopColor="#999999" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
      <div className="[word-break:break-word] col-1 flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[13px] justify-center ml-[14.04px] mt-[55px] not-italic relative row-1 text-[12px] text-black text-right w-[66.909px]">
        <p className="indent-[7px] leading-[0px]">0/0/0</p>
      </div>
      <div className="[word-break:break-word] col-1 flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center ml-0 mt-[13px] not-italic relative row-1 text-[12px] text-right text-white whitespace-nowrap">
        <p className="indent-[7px] leading-[0px]">15</p>
      </div>
    </div>
  );
}

function ContainerUserInfoBlue14() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Container User Info - blue">
      <UserInfoBackground9 />
      <UserHeader9 />
      <Container46 />
      <UserInfo9 />
    </div>
  );
}

function ContainerUserInfoRed4() {
  return (
    <div className="content-stretch flex gap-[29px] items-center relative shrink-0 w-[251px]" data-name="Container User Info - red">
      <div className="bg-[#d9d9d9] relative shrink-0 size-[47px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <ContainerUserInfoBlue14 />
    </div>
  );
}

function SingleRedPlayerSideCard({ ipos }: { ipos: number }) {
  const roomData = useRoomData();
  const players = Array.isArray(roomData?.players) ? roomData.players : [];
  const player = findPlayer(players, ipos);

  const playerName = player?.name || `Player ${ipos}`;
  const heroId = Number(player?.heroid || player?.SelHeroID) || 0;
  const spellId = Number(player?.battleSpell || player?.spellId) || 0;

  const coreTalentId = getEmblemTalentId(player, 3, "coreTalent");

  const hp = Number(player?.hp) || 0;
  const maxHp = Number(player?.maxHp) || 1;
  const ultActive = Boolean(player?.ultActive);
  const kill = player?.kill ?? 0;
  const dead = player?.dead ?? 0;
  const assist = player?.assist ?? 0;
  const level = player?.level !== undefined ? player.level : 1;
  const role = Number(player?.role) || 0;
  const levelUp = useLevelUpNotif({ ipos, level, roomData });
  const showSideItem = useSideItemVisible();

  const validEquips = Array.isArray(player?.equips)
    ? player.equips.map(Number).filter((id: number) => id > 0)
    : [];
  const lastEquipId = validEquips.length > 0 ? validEquips[validEquips.length - 1] : 0;
  const spellSrc = spellId > 0 ? `/assets/spells/${spellId}.webp` : imgEllipse6;
  const coreTalentSrc = coreTalentId > 0 ? `/assets/emblem/talents/${coreTalentId}.webp` : imgEllipse5;

  return (
    <div className="content-stretch flex gap-[29px] items-center relative shrink-0 w-[251px]" data-name="Container User Info - red">
      <AnimatePresence>
        {levelUp && (
          <LevelUpOverlay
            playerName={playerName}
            level={levelUp.level}
            role={role}
            timeLabel={levelUp.timeLabel}
            team="red"
          />
        )}
      </AnimatePresence>
      <div className={`bg-[#d9d9d9] relative shrink-0 size-[47px] overflow-hidden rounded${showSideItem ? "" : " invisible"}`} data-name="Item">
        {lastEquipId > 0 && <EquipIcon itemId={lastEquipId} size={47} />}
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none z-10" />
      </div>

      <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Container User Info - blue">
        <UserInfoBackground5 />

        {/* User Header (Player Name) */}
        <div className="bg-[#e8d367] col-1 h-[21px] ml-0 mt-0 relative row-1 w-[176px] flex items-center justify-end" data-name="User Header">
          <div className="[word-break:break-word] flex font-['Inter:Bold',sans-serif] font-bold h-[21px] justify-end items-center text-[14px] text-black text-right w-[165px]">
            <p className="indent-[7px] leading-none truncate px-1 m-0">{playerName}</p>
          </div>
        </div>

        {/* Core Talent, Battle Spell, Hero Icon, Health Bar */}
        <div className="col-1 content-stretch flex gap-[11px] items-center ml-[6px] mt-[24px] relative row-1" data-name="Container">
          {/* Core Talent (Slot 3) & Battle Spell */}
          <div className="content-stretch flex flex-col gap-[3px] items-start relative shrink-0 w-[24px]" data-name="Container">
            <div className="h-[24px] relative shrink-0 w-full rounded-full overflow-hidden">
              <FlexibleIcon id={coreTalentId} type="emblem/talents" fallback={imgEllipse5} size={24} />
            </div>
            <div className="h-[24px] relative shrink-0 w-full rounded-full overflow-hidden">
              <FlexibleIcon id={spellId} type="spells" fallback={imgEllipse6} size={24} />
            </div>
          </div>

          {/* Hero Icon & Health Bar */}
          <div className="content-stretch flex flex-col gap-[4px] items-center leading-[0] relative shrink-0 w-[52px]" data-name="Container">
            <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="Container">
              <div className="col-1 ml-0 mt-0 relative row-1 size-[52px] rounded-full overflow-hidden">
                <HeroIcon heroId={heroId} fallback={imgEllipse3} size={52} />
              </div>
              <div className="col-1 ml-0 mt-[4px] relative row-1 size-[11px]">
                <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
                  <circle cx="5.5" cy="5.5" fill={ultActive ? "#8BA93A" : "#888888"} id="Ellipse 4" r="5" stroke="var(--stroke-0, white)" />
                </svg>
              </div>
            </div>
            <DynamicHealthBar hp={hp} maxHp={maxHp} />
          </div>
        </div>

        {/* User Info (Avatar / KDA / Level) */}
        <DynamicRedUserInfo kill={kill} dead={dead} assist={assist} level={level} />
      </div>
    </div>
  );
}

function UserCard() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-end justify-center relative shrink-0 w-[177px]" data-name="User Card">
      {[6, 7, 8, 9, 10].map((ipos) => (
        <SingleRedPlayerSideCard key={ipos} ipos={ipos} />
      ))}
    </div>
  );
}

function Container() {
  return (
    <motion.div className="absolute content-stretch flex items-center justify-between left-0 top-[345px] w-[1921px]" data-name="Container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 1.0, ease: "easeOut" }}>
      <UserCards />
      <UserCard />
    </motion.div>
  );
}

function Container54() {
  const [turtle, setTurtle] = useState(0);
  const roomData = useRoomData();
  useEffect(() => {
    const json = roomData;
    const value = json?.battle?.blueTeamKillTurtle;
    if (typeof value === "number") {
      setTurtle(value);
    }
  }, [roomData]);

  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0" data-name="Container">
      <div className="relative shrink-0 size-[32px]" data-name="logo">
        <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgLogo} />
      </div>
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[20px] text-white whitespace-nowrap">{turtle}</p>
    </div>
  );
}

function TurtleContainer() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[78px]" data-name="turtle container">
      <Container54 />
    </div>
  );
}

function Container55() {
  const [lord, setLord] = useState(0);
  const roomData = useRoomData();
  useEffect(() => {
    const json = roomData;
    const value = json?.battle?.blueTeamKillLord;
    if (typeof value === "number") {
      setLord(value);
    }
  }, [roomData]);

  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0" data-name="Container">
      <div className="relative shrink-0 size-[32px]" data-name="logo">
        <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgLogo1} />
      </div>
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[20px] text-white whitespace-nowrap">{lord}</p>
    </div>
  );
}

function LordContainer() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[78px]" data-name="lord container">
      <Container55 />
    </div>
  );
}

function Container56() {
  const [turet, setTuret] = useState(0);
  const roomData = useRoomData();
  useEffect(() => {
    const json = roomData;
    const value = json?.battle?.blueTeamDestroyTuret;
    if (typeof value === "number") {
      setTuret(value);
    }
  }, [roomData]);

  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0" data-name="Container">
      <div className="relative shrink-0 size-[32px]" data-name="logo">
        <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgLogo2} />
      </div>
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[20px] text-white whitespace-nowrap">{turet}</p>
    </div>
  );
}

function TuretContaier() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[78px]" data-name="turet contaier">
      <Container56 />
    </div>
  );
}

function Container57() {
  const [gold, setGold] = useState("10K");
  const roomData = useRoomData();
  useEffect(() => {
    const json = roomData;
    const value = json?.battle?.blueTeamGold;
    if (typeof value === "number") {
          setGold((value / 1000).toFixed(1).replace('.0', '') + 'K');
        }
  }, [roomData]);

  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0" data-name="Container">
      <div className="relative shrink-0 size-[32px]" data-name="logo">
        <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgLogo3} />
      </div>
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[20px] text-white whitespace-nowrap">{gold}</p>
    </div>
  );
}

function GoldContainer() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[74px]" data-name="gold container">
      <Container57 />
    </div>
  );
}

function StatsContainer() {
  return (
    <div className="col-1 content-stretch flex gap-[7px] items-center justify-center ml-0 mt-[13px] relative row-1 w-[404px]" data-name="stats container">
      <TurtleContainer />
      <LordContainer />
      <TuretContaier />
      <GoldContainer />
    </div>
  );
}

function Container53() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Container">
      <div className="bg-[#6c4929] col-1 h-[57px] ml-0 mt-0 relative row-1 w-[404px]" data-name="Rounded Rectangle" />
      <StatsContainer />
    </div>
  );
}

function Container59() {
  const [diff, setDiff] = useState<string | null>(null);
  const roomData = useRoomData();
  useEffect(() => {
    const json = roomData;
        const blueGold = json?.battle?.blueTeamGold;
        const redGold = json?.battle?.redTeamGold;
        if (typeof blueGold === "number" && typeof redGold === "number") {
          if (blueGold > redGold) {
            setDiff(formatGoldDiff(blueGold - redGold));
          } else {
            setDiff(null);
          }
        }
  }, [roomData]);

  if (!diff) return null;

  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0" data-name="Container">
      <div className="relative shrink-0 size-[32px]" data-name="logo">
        <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgLogo3} />
      </div>
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[20px] text-white whitespace-nowrap">{diff}</p>
    </div>
  );
}

function GoldDiff() {
  return (
    <div className="absolute content-stretch flex items-center left-[292.5px] top-[32px] w-[74px]" data-name="gold diff">
      <Container59 />
    </div>
  );
}

function Container58() {
  const [teamName, setTeamName] = useState("blue team");
  const roomData = useRoomData();
  useEffect(() => {
    const json = roomData;
        const value = json?.blue_team_name;
        if (typeof value === "string") {
      setTeamName(value);
    }
  }, [roomData]);

  return (
    <div className="h-[30px] relative shrink-0 w-full" data-name="Container">
      <div className="absolute bg-gradient-to-r from-[#020202] h-[30px] left-0 right-0 to-[rgba(115,115,115,0)] top-0" data-name="Rounded Rectangle" />
      <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Koulen:Regular',sans-serif] h-[30px] justify-center leading-[0] left-[149.5px] not-italic text-[20px] text-center text-white top-[15px] tracking-[0.4px] w-[299px]">
        <p className="leading-[61px]">{teamName}</p>
      </div>
      <GoldDiff />
    </div>
  );
}

function Container52() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[404px]" data-name="Container">
      <Container53 />
      <Container58 />
    </div>
  );
}

function BlueTeamScore() {
  const [scoreData, setScoreData] = useState({ score: 0, requiredWins: 3 });
  const roomData = useRoomData();
  const matchScore = useMatchScore(roomData?.blue_team_name, roomData?.red_team_name);

  useEffect(() => {
    const score = matchScore.blueScore;
    const bestOf = matchScore.bestOf;
    setScoreData({ score, requiredWins: bestOf || 3 });
  }, [roomData, matchScore]);

  const step = scoreData.requiredWins <= 1 ? 0 : Math.min(47, 90 / (scoreData.requiredWins - 1));

  const getBoxPath = (i: number) => {
    const shift = i * -step;
    return `M${132.18 + shift} 14L${160.64 + shift} 25H${132.55 + shift}L${103.471 + shift} 14H${132.18 + shift}Z`;
  };

  return (
    <div className="h-[39px] relative shrink-0 w-[126.298px]" data-name="Blue Team Score">
      <div className="absolute inset-[0_-31.44%_0_-3.17%]">
        <svg className="block size-full overflow-visible" fill="none" preserveAspectRatio="none" viewBox="0 0 170 39">
          <g filter="url(#filter0_d_1_1059)" id="Blue Team Score">
            {Array.from({ length: scoreData.requiredWins }).map((_, i) => (
              <path key={i} d={getBoxPath(i)} id={`Rectangle ${8 - i}`} stroke="var(--stroke-0, #E8D367)" strokeWidth="2" fill={i < scoreData.score ? "var(--fill-0, #EEDFC3)" : undefined} />
            ))}
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="47" id="filter0_d_1_1059" width="500" x="-200" y="-10">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1_1059" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_1_1059" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function BlueTeamScore1() {
  const [scoreData, setScoreData] = useState({ score: 0, requiredWins: 3 });
  const roomData = useRoomData();
  const matchScore = useMatchScore(roomData?.blue_team_name, roomData?.red_team_name);

  useEffect(() => {
    const score = matchScore.redScore;
    const bestOf = matchScore.bestOf;
    setScoreData({ score, requiredWins: bestOf || 3 });
  }, [roomData, matchScore]);

  const step = scoreData.requiredWins <= 1 ? 0 : Math.min(47, 90 / (scoreData.requiredWins - 1));

  const getBoxPath = (i: number) => {
    const shift = i * -step;
    return `M${132.18 + shift} 14L${160.64 + shift} 25H${132.55 + shift}L${103.471 + shift} 14H${132.18 + shift}Z`;
  };

  return (
    <div className="flex items-center justify-center relative shrink-0">
      <div className="-scale-y-100 flex-none rotate-180">
        <div className="h-[39px] relative w-[126.298px]" data-name="Blue Team Score">
          <div className="absolute inset-[0_-31.44%_0_-3.17%]">
            <svg className="block size-full overflow-visible" fill="none" preserveAspectRatio="none" viewBox="0 0 170 39">
              <g filter="url(#filter0_d_1_1078)" id="Blue Team Score">
                {Array.from({ length: scoreData.requiredWins }).map((_, i) => (
                  <path key={i} d={getBoxPath(i)} id={`Rectangle ${8 - i}`} stroke="var(--stroke-0, #E8D367)" strokeWidth="2" fill={i < scoreData.score ? "var(--fill-0, #EEDFC3)" : undefined} />
                ))}
              </g>
              <defs>
                <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="47" id="filter0_d_1_1078" width="500" x="-200" y="-10">
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                  <feOffset dy="4" />
                  <feGaussianBlur stdDeviation="2" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                  <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1_1078" />
                  <feBlend in="SourceGraphic" in2="effect1_dropShadow_1_1078" mode="normal" result="shape" />
                </filter>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container60() {
  return (
    <div className="-translate-x-1/2 absolute content-stretch flex gap-[128px] items-center justify-center left-[calc(50%-0.2px)] top-[58px]" data-name="Container">
      <BlueTeamScore />
      <BlueTeamScore1 />
    </div>
  );
}

function Menu() {
  const roomData = useRoomData();
  const [matchTime, setMatchTime] = useState("00:00");
  const [blueTeamKill, setBlueTeamKill] = useState(0);
  const [redTeamKill, setRedTeamKill] = useState(0);

  const [localTimeMs, setLocalTimeMs] = useState(0);
  const lastUpdateTimeRef = useRef(Date.now());
  const lastWaktuRef = useRef(-1);

  // Sync all data purely from Supabase realtime
  useEffect(() => {
    const battle = roomData?.battle;
    if (battle) {
      if (typeof battle.blueTeamKill === "number") {
        setBlueTeamKill(battle.blueTeamKill);
      }
      if (typeof battle.redTeamKill === "number") {
        setRedTeamKill(battle.redTeamKill);
      }
      if (typeof battle.waktuPertandingan === "number") {
        // Handle both seconds (e.g. 269) and milliseconds (e.g. 269000)
        const timeInMs = battle.waktuPertandingan < 100000 
          ? battle.waktuPertandingan * 1000 
          : battle.waktuPertandingan;

        setLocalTimeMs(timeInMs);
        
        // Update tracking refs to detect if game is paused
        if (battle.waktuPertandingan !== lastWaktuRef.current) {
          lastUpdateTimeRef.current = Date.now();
          lastWaktuRef.current = battle.waktuPertandingan;
        }
      }
    }
  }, [roomData]);

  useEffect(() => {
    const totalSeconds = Math.floor(localTimeMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    setMatchTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);

    // Tick the clock locally every second for smooth UI
    const interval = setInterval(() => {
      // If time hasn't advanced in Supabase for 5 seconds, assume game is paused/stopped
      if (Date.now() - lastUpdateTimeRef.current > 5000) {
        return;
      }
      setLocalTimeMs((prev) => prev + 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, [localTimeMs]);

  return (
    <div className="h-[79px] relative shrink-0 w-[313px]" data-name="Menu">
      <Container60 />
      <div className="absolute bg-[#6c4929] h-[57px] left-0 top-0 w-[313px]" data-name="Rounded Rectangle" />
      <div className="-translate-x-1/2 absolute h-[57px] left-1/2 top-0 w-[313px]">
        <svg className="absolute block inset-0 size-full" fill="none" stroke="none" preserveAspectRatio="none" viewBox="0 0 313 57">
          <path d={svgPaths.pa5c2f00} fill="var(--fill-0, #FBC95B)" stroke="none" id="Rectangle 19" />
        </svg>
      </div>
      <div className="-translate-x-1/2 absolute h-[115px] left-[calc(50%+1px)] top-[-31px] w-[226px]" data-name="Header">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 226 115">
          <path d={svgPaths.pdfdcd80} fill="url(#paint0_radial_1_1049)" id="Header" stroke="var(--stroke-0, #E8D367)" />
          <defs>
            <radialGradient cx="0" cy="0" gradientTransform="translate(113) rotate(90) scale(79 226)" gradientUnits="userSpaceOnUse" id="paint0_radial_1_1049" r="1">
              <stop stopColor="#6C4929" />
              <stop offset="1" stopColor="#D69345" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-2px)] size-[35px] top-[calc(50%+17px)]" data-name="LOGO">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgLogo4} />
      </div>
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] left-[calc(50%-28.5px)] not-italic text-[20px] text-white top-[18px] w-[58px]">
        <p className="leading-[normal]">{matchTime}</p>
      </div>
      <div className="-translate-x-1/2 absolute flex h-[57px] items-center justify-center left-[272px] top-0 w-[60px] overflow-hidden" data-name="Red Kill Frame">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-none text-[36px] text-center text-white tabular-nums tracking-normal w-full select-none m-0 p-0">{redTeamKill}</p>
      </div>
      <div className="-translate-x-1/2 absolute flex h-[57px] items-center justify-center left-[38px] top-0 w-[60px] overflow-hidden" data-name="Blue Kill Frame">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-none text-[36px] text-center text-white tabular-nums tracking-normal w-full select-none m-0 p-0">{blueTeamKill}</p>
      </div>
    </div>
  );
}

function Container63() {
  const [gold, setGold] = useState("10K");
  const roomData = useRoomData();
  useEffect(() => {
    const json = roomData;
    const value = json?.battle?.redTeamGold;
    if (typeof value === "number") {
          setGold((value / 1000).toFixed(1).replace('.0', '') + 'K');
        }
  }, [roomData]);

  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0" data-name="Container">
      <div className="relative shrink-0 size-[32px]" data-name="logo">
        <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgLogo3} />
      </div>
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[20px] text-white whitespace-nowrap">{gold}</p>
    </div>
  );
}

function GoldContainer1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[78px]" data-name="gold container">
      <Container63 />
    </div>
  );
}

function Container64() {
  const [turet, setTuret] = useState(0);
  const roomData = useRoomData();
  useEffect(() => {
    const json = roomData;
        const value = json?.battle?.redTeamDestroyTuret;
        if (typeof value === "number") {
      setTuret(value);
    }
  }, [roomData]);

  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0" data-name="Container">
      <div className="relative shrink-0 size-[32px]" data-name="logo">
        <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgLogo2} />
      </div>
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[20px] text-white whitespace-nowrap">{turet}</p>
    </div>
  );
}

function TuretContaier1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[78px]" data-name="turet contaier">
      <Container64 />
    </div>
  );
}

function Container65() {
  const [lord, setLord] = useState(0);
  const roomData = useRoomData();
  useEffect(() => {
    const json = roomData;
    const value = json?.battle?.redTeamKillLord;
    if (typeof value === "number") {
      setLord(value);
    }
  }, [roomData]);

  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0" data-name="Container">
      <div className="relative shrink-0 size-[32px]" data-name="logo">
        <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgLogo1} />
      </div>
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[20px] text-white whitespace-nowrap">{lord}</p>
    </div>
  );
}

function LordContainer1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[78px]" data-name="lord container">
      <Container65 />
    </div>
  );
}

function Container66() {
  const [turtle, setTurtle] = useState(0);
  const roomData = useRoomData();
  useEffect(() => {
    const json = roomData;
    const value = json?.battle?.redTeamKillTurtle;
    if (typeof value === "number") {
      setTurtle(value);
    }
  }, [roomData]);

  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0" data-name="Container">
      <div className="relative shrink-0 size-[32px]" data-name="logo">
        <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgLogo} />
      </div>
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[20px] text-white whitespace-nowrap">{turtle}</p>
    </div>
  );
}

function TurtleContainer1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[78px]" data-name="turtle container">
      <Container66 />
    </div>
  );
}

function StatsContainer1() {
  return (
    <div className="col-1 content-stretch flex gap-[7px] items-center justify-center ml-0 mt-[13px] relative row-1 w-[404px]" data-name="stats container">
      <GoldContainer1 />
      <TuretContaier1 />
      <LordContainer1 />
      <TurtleContainer1 />
    </div>
  );
}

function Container62() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Container">
      <div className="bg-[#6c4929] col-1 h-[57px] ml-0 mt-0 relative row-1 w-[404px]" data-name="Rounded Rectangle" />
      <StatsContainer1 />
    </div>
  );
}

function Container68() {
  const [diff, setDiff] = useState<string | null>(null);
  const roomData = useRoomData();
  useEffect(() => {
    const json = roomData;
        const blueGold = json?.battle?.blueTeamGold;
        const redGold = json?.battle?.redTeamGold;
        if (typeof blueGold === "number" && typeof redGold === "number") {
          if (redGold > blueGold) {
            setDiff(formatGoldDiff(redGold - blueGold));
          } else {
            setDiff(null);
          }
        }
  }, [roomData]);

  if (!diff) return null;

  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0" data-name="Container">
      <div className="relative shrink-0 size-[32px]" data-name="logo">
        <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgLogo3} />
      </div>
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[20px] text-white whitespace-nowrap">{diff}</p>
    </div>
  );
}

function GoldDiff1() {
  return (
    <div className="absolute content-stretch flex items-center left-[37.5px] top-[32px] w-[74px]" data-name="gold diff">
      <Container68 />
    </div>
  );
}

function Container67() {
  const [teamName, setTeamName] = useState("red teeam");
  const roomData = useRoomData();
  useEffect(() => {
    const json = roomData;
    const value = json?.red_team_name;
    if (typeof value === "string") {
      setTeamName(value);
    }
  }, [roomData]);

  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Container">
      <div className="absolute bg-gradient-to-r from-[rgba(115,115,115,0)] h-[30px] left-0 right-0 to-[#020202] top-0" data-name="Rounded Rectangle" />
      <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Koulen:Regular',sans-serif] h-[30px] justify-center leading-[0] left-[254.5px] not-italic text-[20px] text-center text-white top-[15px] tracking-[0.4px] w-[299px]">
        <p className="leading-[61px]">{teamName}</p>
      </div>
      <GoldDiff1 />
    </div>
  );
}

function Container61() {
  return (
    <div className="content-stretch flex flex-col h-[102px] items-end relative shrink-0 w-[404px]" data-name="Container">
      <Container62 />
      <Container67 />
    </div>
  );
}

type PlayerStatsMetric = "gold" | "dealt" | "taken";

const PLAYER_STATS_KEY = "mlbs_player_stats";

const PLAYER_STATS_TITLES: Record<PlayerStatsMetric, string> = {
  gold: "GOLD RANK",
  dealt: "TOTAL DAMAGE",
  taken: "DAMAGE TAKEN",
};

function parsePlayerStatsMetric(v: unknown): PlayerStatsMetric {
  return v === "dealt" || v === "taken" ? v : "gold";
}

type PlayerStatRow = {
  key: string;
  name: string;
  heroId: number;
  gold: number;
  dealt: number;
  taken: number;
};

function getPlayerStatRows(players: any[]): PlayerStatRow[] {
  return players.slice(0, 10).map((p: any, idx: number) => ({
    key: String(p?.id ?? p?.ipos ?? idx),
    name: p?.name || `Player ${idx + 1}`,
    heroId: Number(p?.heroid || p?.SelHeroID) || 0,
    gold: Number(p?.totalGold ?? p?.gold_total ?? p?.gold) || 0,
    dealt: Number(p?.damageDealt ?? p?.damage ?? p?.hero_hurt) || 0,
    taken: Number(p?.damageTaken ?? p?.hurted) || 0,
  }));
}

function PlayerStatsOverlay({ metric }: { metric: PlayerStatsMetric }) {
  const roomData = useRoomData();
  const players = Array.isArray(roomData?.players) ? roomData.players : [];
  const rows = getPlayerStatRows(players)
    .map((r) => ({ ...r, value: metric === "gold" ? r.gold : metric === "dealt" ? r.dealt : r.taken }))
    .sort((a, b) => b.value - a.value);
  const max = rows.length > 0 ? Math.max(1, rows[0].value) : 1;

  return (
    <motion.div
      className="absolute right-0 top-[178px] w-[367px] z-50 flex flex-col bg-white overflow-hidden"
      data-name="Player Stats"
      initial={{ clipPath: "inset(0% 100% 0% 0%)", opacity: 1 }}
      animate={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
      exit={{ clipPath: "inset(0% 100% 0% 0%)", opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex items-center justify-center py-[7px]" data-name="Stats Title">
        <p className="font-['Koulen:Regular',sans-serif] text-black text-[36px] leading-[42px] tracking-[0.07em] text-center m-0">
          {PLAYER_STATS_TITLES[metric]}
        </p>
      </div>
      <div className="flex flex-col items-center px-[7px] pb-[12px]" data-name="Player Stats List">
        {rows.length === 0 && (
          <p className="font-['Inter:Medium',sans-serif] text-black/60 text-[14px] py-6 m-0">
            Menunggu live data…
          </p>
        )}
        {rows.map((row) => (
          <div key={row.key} className="flex items-center w-full h-[52px] shrink-0" data-name="Player Stat Row">
            <p className="font-['Koulen:Regular',sans-serif] text-black text-[12px] tracking-[0.1em] text-center w-[56px] shrink-0 m-0 truncate">
              {String(row.value)}
            </p>
            <div className="flex-1 flex flex-col justify-center min-w-0 mr-[8px]" data-name="Name and Bar">
              <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-black text-[12px] leading-[14px] text-right truncate m-0">
                {row.name}
              </p>
              <div className="flex justify-end w-full mt-[3px]" data-name="Bar Track">
                <div
                  className="bg-[#d69345] h-[7px]"
                  data-name="Value Bar"
                  style={{ width: `${Math.max(2, (row.value / max) * 100)}%` }}
                />
              </div>
            </div>
            <div className="relative size-[52px] shrink-0 rounded-full overflow-hidden border border-white bg-[#d9d9d9]" data-name="Hero Icon">
              <HeroIcon heroId={row.heroId} fallback={imgEllipse3} size={52} />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function formatGameVersion(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const parts = raw.split(".").filter((p) => p !== "" && /^\d+$/.test(p));
  if (parts.length < 3) return null;
  return parts.slice(0, 3).join(".");
}

function Container69() {
  const roomData = useRoomData();
  const battle = roomData?.battle ?? roomData?.Battle;
  const version = formatGameVersion(battle?.versionInGame);

  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[162px]" data-name="Container">
      <SideMedia slot="b" className="h-[110px] w-full" />
      <div className="bg-[#d69345] h-[24px] relative shrink-0 w-full" data-name="Rounded Rectangle" />
      <div className="bg-gradient-to-r from-[rgba(115,115,115,0)] h-[18px] relative shrink-0 to-white w-full" data-name="Rounded Rectangle" />
      {version && (
        <div className="bg-[#e8d367] h-[16px] relative shrink-0 w-full flex items-center justify-center" data-name="Game Version">
          <p className="font-['Inter:Bold',sans-serif] font-bold text-black text-[11px] leading-none text-center m-0">
            ver. {version}
          </p>
        </div>
      )}
    </div>
  );
}

function Container51() {
  return (
    <motion.div className="absolute content-stretch flex items-start justify-center left-[336px] top-0 w-[1583px]" data-name="Container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 1.0, ease: "easeOut" }}>
      <div className="bg-[#d9d9d9] h-[95px] relative shrink-0 w-[96px]" data-name="Rounded Rectangle" />
      <Container52 />
      <Menu />
      <Container61 />
      <div className="bg-[#d9d9d9] h-[95px] relative shrink-0 w-[96px]" data-name="Rounded Rectangle" />
      <SideMedia slot="a" className="h-[105px] w-[108px]" />
      <Container69 />
    </motion.div>
  );
}

function Container70() {
  return (
    <div className="h-[17px] relative shrink-0 w-[21px]" data-name="Container">
      <div className="absolute bg-[#533920] h-[17px] left-0 right-0 top-0" data-name="bg role" />
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[12px] top-[calc(50%-0.5px)]" data-name="role">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgLogo4} />
      </div>
    </div>
  );
}

function PlayerName() {
  return (
    <div className="bg-[#d69345] content-stretch flex h-[17px] items-center justify-center relative shrink-0 w-[143px]" data-name="player name">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-white w-[142px]">
        <p className="leading-[normal]">nama</p>
      </div>
    </div>
  );
}

function HeaderInfo() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Header info">
      <Container70 />
      <PlayerName />
    </div>
  );
}

function Container71() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[38px] items-center justify-center left-0 top-0 w-[164px]" data-name="Container">
      <div className="relative shrink-0 size-[23px]" data-name="standar talent 1">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="23" src={imgStandarTalent1} width="23" />
      </div>
      <div className="relative shrink-0 size-[23px]" data-name="standar talent 2">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="23" src={imgStandarTalent2} width="23" />
      </div>
      <div className="relative shrink-0 size-[23px]" data-name="Core Talent">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="23" src={imgCoreTalent} width="23" />
      </div>
      <div className="relative shrink-0 size-[30px]" data-name="Emblem">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="30" src={imgEmblem} width="30" />
      </div>
    </div>
  );
}

function ContainerEmblemInfo() {
  return (
    <div className="h-[38px] relative shrink-0 w-full" data-name="Container Emblem Info">
      <div className="absolute bg-[#533920] h-[38px] left-0 right-0 top-0" data-name="Rounded Rectangle" />
      <Container71 />
    </div>
  );
}

function EmblemBuildPerPlayer() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-[164px]" data-name="Emblem Build per player">
      <HeaderInfo />
      <div className="h-[87px] relative shrink-0 w-[164px]" data-name="Image Hero">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageHero} />
      </div>
      <ContainerEmblemInfo />
    </div>
  );
}

function Container72() {
  return (
    <div className="h-[17px] relative shrink-0 w-[21px]" data-name="Container">
      <div className="absolute bg-[#533920] h-[17px] left-0 right-0 top-0" data-name="bg role" />
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[12px] top-[calc(50%-0.5px)]" data-name="role">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgLogo4} />
      </div>
    </div>
  );
}

function PlayerName1() {
  return (
    <div className="bg-[#d69345] content-stretch flex h-[17px] items-center justify-center relative shrink-0 w-[143px]" data-name="player name">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-white w-[142px]">
        <p className="leading-[normal]">nama</p>
      </div>
    </div>
  );
}

function HeaderInfo1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Header info">
      <Container72 />
      <PlayerName1 />
    </div>
  );
}

function Container73() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[38px] items-center justify-center left-0 top-0 w-[164px]" data-name="Container">
      <div className="relative shrink-0 size-[23px]" data-name="standar talent 1">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="23" src={imgStandarTalent1} width="23" />
      </div>
      <div className="relative shrink-0 size-[23px]" data-name="standar talent 2">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="23" src={imgStandarTalent2} width="23" />
      </div>
      <div className="relative shrink-0 size-[23px]" data-name="Core Talent">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="23" src={imgCoreTalent} width="23" />
      </div>
      <div className="relative shrink-0 size-[30px]" data-name="Emblem">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="30" src={imgEmblem} width="30" />
      </div>
    </div>
  );
}

function ContainerEmblemInfo1() {
  return (
    <div className="h-[38px] relative shrink-0 w-full" data-name="Container Emblem Info">
      <div className="absolute bg-[#533920] h-[38px] left-0 right-0 top-0" data-name="Rounded Rectangle" />
      <Container73 />
    </div>
  );
}

function EmblemBuildPerPlayer1() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-[164px]" data-name="Emblem Build per player">
      <HeaderInfo1 />
      <div className="h-[87px] relative shrink-0 w-[164px]" data-name="Image Hero">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageHero} />
      </div>
      <ContainerEmblemInfo1 />
    </div>
  );
}

function Container74() {
  return (
    <div className="h-[17px] relative shrink-0 w-[21px]" data-name="Container">
      <div className="absolute bg-[#533920] h-[17px] left-0 right-0 top-0" data-name="bg role" />
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[12px] top-[calc(50%-0.5px)]" data-name="role">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgLogo4} />
      </div>
    </div>
  );
}

function PlayerName2() {
  return (
    <div className="bg-[#d69345] content-stretch flex h-[17px] items-center justify-center relative shrink-0 w-[143px]" data-name="player name">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-white w-[142px]">
        <p className="leading-[normal]">nama</p>
      </div>
    </div>
  );
}

function HeaderInfo2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Header info">
      <Container74 />
      <PlayerName2 />
    </div>
  );
}

function Container75() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[38px] items-center justify-center left-0 top-0 w-[164px]" data-name="Container">
      <div className="relative shrink-0 size-[23px]" data-name="standar talent 1">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="23" src={imgStandarTalent1} width="23" />
      </div>
      <div className="relative shrink-0 size-[23px]" data-name="standar talent 2">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="23" src={imgStandarTalent2} width="23" />
      </div>
      <div className="relative shrink-0 size-[23px]" data-name="Core Talent">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="23" src={imgCoreTalent} width="23" />
      </div>
      <div className="relative shrink-0 size-[30px]" data-name="Emblem">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="30" src={imgEmblem} width="30" />
      </div>
    </div>
  );
}

function ContainerEmblemInfo2() {
  return (
    <div className="h-[38px] relative shrink-0 w-full" data-name="Container Emblem Info">
      <div className="absolute bg-[#533920] h-[38px] left-0 right-0 top-0" data-name="Rounded Rectangle" />
      <Container75 />
    </div>
  );
}

function EmblemBuildPerPlayer2() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-[164px]" data-name="Emblem Build per player">
      <HeaderInfo2 />
      <div className="h-[87px] relative shrink-0 w-[164px]" data-name="Image Hero">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageHero} />
      </div>
      <ContainerEmblemInfo2 />
    </div>
  );
}

function Container76() {
  return (
    <div className="h-[17px] relative shrink-0 w-[21px]" data-name="Container">
      <div className="absolute bg-[#533920] h-[17px] left-0 right-0 top-0" data-name="bg role" />
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[12px] top-[calc(50%-0.5px)]" data-name="role">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgLogo4} />
      </div>
    </div>
  );
}

function PlayerName3() {
  return (
    <div className="bg-[#d69345] content-stretch flex h-[17px] items-center justify-center relative shrink-0 w-[143px]" data-name="player name">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-white w-[142px]">
        <p className="leading-[normal]">nama</p>
      </div>
    </div>
  );
}

function HeaderInfo3() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Header info">
      <Container76 />
      <PlayerName3 />
    </div>
  );
}

function Container77() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[38px] items-center justify-center left-0 top-0 w-[164px]" data-name="Container">
      <div className="relative shrink-0 size-[23px]" data-name="standar talent 1">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="23" src={imgStandarTalent1} width="23" />
      </div>
      <div className="relative shrink-0 size-[23px]" data-name="standar talent 2">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="23" src={imgStandarTalent2} width="23" />
      </div>
      <div className="relative shrink-0 size-[23px]" data-name="Core Talent">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="23" src={imgCoreTalent} width="23" />
      </div>
      <div className="relative shrink-0 size-[30px]" data-name="Emblem">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="30" src={imgEmblem} width="30" />
      </div>
    </div>
  );
}

function ContainerEmblemInfo3() {
  return (
    <div className="h-[38px] relative shrink-0 w-full" data-name="Container Emblem Info">
      <div className="absolute bg-[#533920] h-[38px] left-0 right-0 top-0" data-name="Rounded Rectangle" />
      <Container77 />
    </div>
  );
}

function EmblemBuildPerPlayer3() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-[164px]" data-name="Emblem Build per player">
      <HeaderInfo3 />
      <div className="h-[87px] relative shrink-0 w-[164px]" data-name="Image Hero">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageHero} />
      </div>
      <ContainerEmblemInfo3 />
    </div>
  );
}

function Container78() {
  return (
    <div className="h-[17px] relative shrink-0 w-[21px]" data-name="Container">
      <div className="absolute bg-[#533920] h-[17px] left-0 right-0 top-0" data-name="bg role" />
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[12px] top-[calc(50%-0.5px)]" data-name="role">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgLogo4} />
      </div>
    </div>
  );
}

function PlayerName4() {
  return (
    <div className="bg-[#d69345] content-stretch flex h-[17px] items-center justify-center relative shrink-0 w-[143px]" data-name="player name">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-white w-[142px]">
        <p className="leading-[normal]">nama</p>
      </div>
    </div>
  );
}

function HeaderInfo4() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Header info">
      <Container78 />
      <PlayerName4 />
    </div>
  );
}

function Container79() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[38px] items-center justify-center left-0 top-0 w-[164px]" data-name="Container">
      <div className="relative shrink-0 size-[23px]" data-name="standar talent 1">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="23" src={imgStandarTalent1} width="23" />
      </div>
      <div className="relative shrink-0 size-[23px]" data-name="standar talent 2">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="23" src={imgStandarTalent2} width="23" />
      </div>
      <div className="relative shrink-0 size-[23px]" data-name="Core Talent">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="23" src={imgCoreTalent} width="23" />
      </div>
      <div className="relative shrink-0 size-[30px]" data-name="Emblem">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="30" src={imgEmblem} width="30" />
      </div>
    </div>
  );
}

function ContainerEmblemInfo4() {
  return (
    <div className="h-[38px] relative shrink-0 w-full" data-name="Container Emblem Info">
      <div className="absolute bg-[#533920] h-[38px] left-0 right-0 top-0" data-name="Rounded Rectangle" />
      <Container79 />
    </div>
  );
}

function EmblemBuildPerPlayer4() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-[164px]" data-name="Emblem Build per player">
      <HeaderInfo4 />
      <div className="h-[87px] relative shrink-0 w-[164px]" data-name="Image Hero">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageHero} />
      </div>
      <ContainerEmblemInfo4 />
    </div>
  );
}

function SinglePlayerEmblemCard({ ipos }: { ipos: number }) {
  const roomData = useRoomData();
  const players = Array.isArray(roomData?.players) ? roomData.players : [];
  const player = findPlayer(players, ipos);

  const playerName = player?.name || "NAMA";
  const selHeroID = Number(player?.heroid || player?.SelHeroID) || 0;
  const role = Number(player?.role) || 0;

  const roleSrc = role > 0 ? `/assets/lane/${role}.png` : imgLogo4;
  const heroSrc = selHeroID > 0 ? `/assets/heroes-sa/${selHeroID}.webp` : imgImageHero;

  const talent1Id = getEmblemTalentId(player, 1, "talent1");
  const talent2Id = getEmblemTalentId(player, 2, "talent2");
  const coreTalentId = getEmblemTalentId(player, 3, "coreTalent");

  const talent1Src = talent1Id > 0 ? `/assets/emblem/talents/${talent1Id}.webp` : imgStandarTalent1;
  const talent2Src = talent2Id > 0 ? `/assets/emblem/talents/${talent2Id}.webp` : imgStandarTalent2;
  const coreTalentSrc = coreTalentId > 0 ? `/assets/emblem/talents/${coreTalentId}.webp` : imgCoreTalent;
  const emblemSrc = player?.emblem ? `/assets/emblem/${player.emblem}.webp` : imgEmblem;

  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-[164px]" data-name="Emblem Build per player">
      {/* Header Info (Role + Player Name) */}
      <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Header info">
        <div className="h-[17px] relative shrink-0 w-[21px]" data-name="Container">
          <div className="absolute bg-[#533920] h-[17px] left-0 right-0 top-0" data-name="bg role" />
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[12px] top-[calc(50%-0.5px)]" data-name="role">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={roleSrc} />
          </div>
        </div>
        <div className="bg-[#d69345] content-stretch flex h-[17px] items-center justify-center relative shrink-0 w-[143px]" data-name="player name">
          <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-white w-[142px]">
            <p className="leading-[normal] truncate px-1">{playerName}</p>
          </div>
        </div>
      </div>

      {/* Image Hero */}
      <div className="h-[87px] relative shrink-0 w-[164px] overflow-hidden" data-name="Image Hero">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={heroSrc} />
      </div>

      {/* Container Emblem Info */}
      <div className="h-[38px] relative shrink-0 w-full" data-name="Container Emblem Info">
        <div className="absolute bg-[#533920] h-[38px] left-0 right-0 top-0" data-name="Rounded Rectangle" />
        <div className="absolute content-stretch flex gap-[12px] h-[38px] items-center justify-center left-0 top-0 w-[164px]" data-name="Container">
          <div className="relative shrink-0 size-[23px]" data-name="standar talent 1">
            <img alt="" className="absolute block inset-0 max-w-none size-full" height="23" src={talent1Src} width="23" />
          </div>
          <div className="relative shrink-0 size-[23px]" data-name="standar talent 2">
            <img alt="" className="absolute block inset-0 max-w-none size-full" height="23" src={talent2Src} width="23" />
          </div>
          <div className="relative shrink-0 size-[23px]" data-name="Core Talent">
            <img alt="" className="absolute block inset-0 max-w-none size-full" height="23" src={coreTalentSrc} width="23" />
          </div>
          <div className="relative shrink-0 size-[30px]" data-name="Emblem">
            <img alt="" className="absolute block inset-0 max-w-none size-full" height="30" src={emblemSrc} width="30" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ConatinerEmblemBuildBlue() {
  return (
    <div className="content-stretch flex gap-[5px] items-center relative shrink-0" data-name="Conatiner Emblem Build Blue">
      {[1, 2, 3, 4, 5].map((ipos) => (
        <SinglePlayerEmblemCard key={ipos} ipos={ipos} />
      ))}
    </div>
  );
}

function EmblemBuildTitle() {
  return (
    <div className="h-[142px] relative shrink-0 w-[169px]" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 169 142' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(1.0348e-15 14.2 -16.9 1.4614e-16 84.5 0)'><stop stop-color='rgba(108,73,41,1)' offset='0'/><stop stop-color='rgba(161,110,55,1)' offset='0.5'/><stop stop-color='rgba(214,147,69,1)' offset='1'/></radialGradient></defs></svg>\")" }} data-name="Emblem Build Title">
      <div aria-hidden className="absolute border border-[#e8d367] border-solid inset-0 pointer-events-none" />
      <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[143px] justify-center leading-[0] left-[84.5px] not-italic text-[29px] text-center text-white top-[71.5px] w-[169px]">
        <p className="leading-[normal] mb-0">EMBLEM</p>
        <p className="leading-[normal]">BUILD</p>
      </div>
    </div>
  );
}

function Container80() {
  return (
    <div className="h-[17px] relative shrink-0 w-[21px]" data-name="Container">
      <div className="absolute bg-[#533920] h-[17px] left-0 right-0 top-0" data-name="bg role" />
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[12px] top-[calc(50%-0.5px)]" data-name="role">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgLogo4} />
      </div>
    </div>
  );
}

function PlayerName5() {
  return (
    <div className="bg-[#d69345] content-stretch flex h-[17px] items-center justify-center relative shrink-0 w-[143px]" data-name="player name">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-white w-[142px]">
        <p className="leading-[normal]">nama</p>
      </div>
    </div>
  );
}

function HeaderInfo5() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Header info">
      <Container80 />
      <PlayerName5 />
    </div>
  );
}

function Container81() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[38px] items-center justify-center left-0 top-0 w-[164px]" data-name="Container">
      <div className="relative shrink-0 size-[23px]" data-name="standar talent 1">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="23" src={imgStandarTalent1} width="23" />
      </div>
      <div className="relative shrink-0 size-[23px]" data-name="standar talent 2">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="23" src={imgStandarTalent2} width="23" />
      </div>
      <div className="relative shrink-0 size-[23px]" data-name="Core Talent">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="23" src={imgCoreTalent} width="23" />
      </div>
      <div className="relative shrink-0 size-[30px]" data-name="Emblem">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="30" src={imgEmblem} width="30" />
      </div>
    </div>
  );
}

function ContainerEmblemInfo5() {
  return (
    <div className="h-[38px] relative shrink-0 w-full" data-name="Container Emblem Info">
      <div className="absolute bg-[#533920] h-[38px] left-0 right-0 top-0" data-name="Rounded Rectangle" />
      <Container81 />
    </div>
  );
}

function EmblemBuildPerPlayer5() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-[164px]" data-name="Emblem Build per player">
      <HeaderInfo5 />
      <div className="h-[87px] relative shrink-0 w-[164px]" data-name="Image Hero">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageHero} />
      </div>
      <ContainerEmblemInfo5 />
    </div>
  );
}

function Container82() {
  return (
    <div className="h-[17px] relative shrink-0 w-[21px]" data-name="Container">
      <div className="absolute bg-[#533920] h-[17px] left-0 right-0 top-0" data-name="bg role" />
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[12px] top-[calc(50%-0.5px)]" data-name="role">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgLogo4} />
      </div>
    </div>
  );
}

function PlayerName6() {
  return (
    <div className="bg-[#d69345] content-stretch flex h-[17px] items-center justify-center relative shrink-0 w-[143px]" data-name="player name">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-white w-[142px]">
        <p className="leading-[normal]">nama</p>
      </div>
    </div>
  );
}

function HeaderInfo6() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Header info">
      <Container82 />
      <PlayerName6 />
    </div>
  );
}

function Container83() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[38px] items-center justify-center left-0 top-0 w-[164px]" data-name="Container">
      <div className="relative shrink-0 size-[23px]" data-name="standar talent 1">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="23" src={imgStandarTalent1} width="23" />
      </div>
      <div className="relative shrink-0 size-[23px]" data-name="standar talent 2">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="23" src={imgStandarTalent2} width="23" />
      </div>
      <div className="relative shrink-0 size-[23px]" data-name="Core Talent">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="23" src={imgCoreTalent} width="23" />
      </div>
      <div className="relative shrink-0 size-[30px]" data-name="Emblem">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="30" src={imgEmblem} width="30" />
      </div>
    </div>
  );
}

function ContainerEmblemInfo6() {
  return (
    <div className="h-[38px] relative shrink-0 w-full" data-name="Container Emblem Info">
      <div className="absolute bg-[#533920] h-[38px] left-0 right-0 top-0" data-name="Rounded Rectangle" />
      <Container83 />
    </div>
  );
}

function EmblemBuildPerPlayer6() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-[164px]" data-name="Emblem Build per player">
      <HeaderInfo6 />
      <div className="h-[87px] relative shrink-0 w-[164px]" data-name="Image Hero">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageHero} />
      </div>
      <ContainerEmblemInfo6 />
    </div>
  );
}

function Container84() {
  return (
    <div className="h-[17px] relative shrink-0 w-[21px]" data-name="Container">
      <div className="absolute bg-[#533920] h-[17px] left-0 right-0 top-0" data-name="bg role" />
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[12px] top-[calc(50%-0.5px)]" data-name="role">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgLogo4} />
      </div>
    </div>
  );
}

function PlayerName7() {
  return (
    <div className="bg-[#d69345] content-stretch flex h-[17px] items-center justify-center relative shrink-0 w-[143px]" data-name="player name">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-white w-[142px]">
        <p className="leading-[normal]">nama</p>
      </div>
    </div>
  );
}

function HeaderInfo7() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Header info">
      <Container84 />
      <PlayerName7 />
    </div>
  );
}

function Container85() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[38px] items-center justify-center left-0 top-0 w-[164px]" data-name="Container">
      <div className="relative shrink-0 size-[23px]" data-name="standar talent 1">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="23" src={imgStandarTalent1} width="23" />
      </div>
      <div className="relative shrink-0 size-[23px]" data-name="standar talent 2">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="23" src={imgStandarTalent2} width="23" />
      </div>
      <div className="relative shrink-0 size-[23px]" data-name="Core Talent">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="23" src={imgCoreTalent} width="23" />
      </div>
      <div className="relative shrink-0 size-[30px]" data-name="Emblem">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="30" src={imgEmblem} width="30" />
      </div>
    </div>
  );
}

function ContainerEmblemInfo7() {
  return (
    <div className="h-[38px] relative shrink-0 w-full" data-name="Container Emblem Info">
      <div className="absolute bg-[#533920] h-[38px] left-0 right-0 top-0" data-name="Rounded Rectangle" />
      <Container85 />
    </div>
  );
}

function EmblemBuildPerPlayer7() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-[164px]" data-name="Emblem Build per player">
      <HeaderInfo7 />
      <div className="h-[87px] relative shrink-0 w-[164px]" data-name="Image Hero">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageHero} />
      </div>
      <ContainerEmblemInfo7 />
    </div>
  );
}

function Container86() {
  return (
    <div className="h-[17px] relative shrink-0 w-[21px]" data-name="Container">
      <div className="absolute bg-[#533920] h-[17px] left-0 right-0 top-0" data-name="bg role" />
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[12px] top-[calc(50%-0.5px)]" data-name="role">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgLogo4} />
      </div>
    </div>
  );
}

function PlayerName8() {
  return (
    <div className="bg-[#d69345] content-stretch flex h-[17px] items-center justify-center relative shrink-0 w-[143px]" data-name="player name">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-white w-[142px]">
        <p className="leading-[normal]">nama</p>
      </div>
    </div>
  );
}

function HeaderInfo8() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Header info">
      <Container86 />
      <PlayerName8 />
    </div>
  );
}

function Container87() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[38px] items-center justify-center left-0 top-0 w-[164px]" data-name="Container">
      <div className="relative shrink-0 size-[23px]" data-name="standar talent 1">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="23" src={imgStandarTalent1} width="23" />
      </div>
      <div className="relative shrink-0 size-[23px]" data-name="standar talent 2">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="23" src={imgStandarTalent2} width="23" />
      </div>
      <div className="relative shrink-0 size-[23px]" data-name="Core Talent">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="23" src={imgCoreTalent} width="23" />
      </div>
      <div className="relative shrink-0 size-[30px]" data-name="Emblem">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="30" src={imgEmblem} width="30" />
      </div>
    </div>
  );
}

function ContainerEmblemInfo8() {
  return (
    <div className="h-[38px] relative shrink-0 w-full" data-name="Container Emblem Info">
      <div className="absolute bg-[#533920] h-[38px] left-0 right-0 top-0" data-name="Rounded Rectangle" />
      <Container87 />
    </div>
  );
}

function EmblemBuildPerPlayer8() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-[164px]" data-name="Emblem Build per player">
      <HeaderInfo8 />
      <div className="h-[87px] relative shrink-0 w-[164px]" data-name="Image Hero">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageHero} />
      </div>
      <ContainerEmblemInfo8 />
    </div>
  );
}

function Container88() {
  return (
    <div className="h-[17px] relative shrink-0 w-[21px]" data-name="Container">
      <div className="absolute bg-[#533920] h-[17px] left-0 right-0 top-0" data-name="bg role" />
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.5px)] size-[12px] top-[calc(50%-0.5px)]" data-name="role">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgLogo4} />
      </div>
    </div>
  );
}

function PlayerName9() {
  return (
    <div className="bg-[#d69345] content-stretch flex h-[17px] items-center justify-center relative shrink-0 w-[143px]" data-name="player name">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-white w-[142px]">
        <p className="leading-[normal]">nama</p>
      </div>
    </div>
  );
}

function HeaderInfo9() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Header info">
      <Container88 />
      <PlayerName9 />
    </div>
  );
}

function Container89() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[38px] items-center justify-center left-0 top-0 w-[164px]" data-name="Container">
      <div className="relative shrink-0 size-[23px]" data-name="standar talent 1">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="23" src={imgStandarTalent1} width="23" />
      </div>
      <div className="relative shrink-0 size-[23px]" data-name="standar talent 2">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="23" src={imgStandarTalent2} width="23" />
      </div>
      <div className="relative shrink-0 size-[23px]" data-name="Core Talent">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="23" src={imgCoreTalent} width="23" />
      </div>
      <div className="relative shrink-0 size-[30px]" data-name="Emblem">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="30" src={imgEmblem} width="30" />
      </div>
    </div>
  );
}

function ContainerEmblemInfo9() {
  return (
    <div className="h-[38px] relative shrink-0 w-full" data-name="Container Emblem Info">
      <div className="absolute bg-[#533920] h-[38px] left-0 right-0 top-0" data-name="Rounded Rectangle" />
      <Container89 />
    </div>
  );
}

function EmblemBuildPerPlayer9() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-[164px]" data-name="Emblem Build per player">
      <HeaderInfo9 />
      <div className="h-[87px] relative shrink-0 w-[164px]" data-name="Image Hero">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageHero} />
      </div>
      <ContainerEmblemInfo9 />
    </div>
  );
}

function ConatinerEmblemBuildBlue1() {
  return (
    <div className="content-stretch flex gap-[5px] items-center relative shrink-0" data-name="Conatiner Emblem Build Blue">
      {[10, 9, 8, 7, 6].map((ipos) => (
        <SinglePlayerEmblemCard key={ipos} ipos={ipos} />
      ))}
    </div>
  );
}

function EmblemBuild() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-0 top-[873px] w-[1921px]" data-name="Emblem Build">
      <ConatinerEmblemBuildBlue />
      <EmblemBuildTitle />
      <ConatinerEmblemBuildBlue1 />
    </div>
  );
}

function LogoTurtle() {
  return (
    <motion.div className="absolute contents left-[1595px] top-[139px]" data-name="logo turtle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}>
      <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Inter:Black',sans-serif] font-black h-[143px] justify-center leading-none left-[1757px] not-italic text-transparent bg-clip-text bg-gradient-to-b from-[#FFE57F] via-[#E8D367] to-[#D69345] text-[32px] tracking-[4px] text-center top-[245.5px] drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] w-[324px] z-10">
        <p className="mb-1 uppercase">TURTLE</p>
        <p className="uppercase">SPAWNED</p>
      </div>
      <div className="absolute h-[229px] left-[1652px] top-[139px] w-[200px] z-20 pointer-events-none" data-name="image turtle">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[177.29%] left-[-50.5%] max-w-none top-[-42.36%] w-[203%]" src={imgImageTurtle} />
        </div>
      </div>
    </motion.div>
  );
}

function TurtleSpawnedNotification() {
  return (
    <div className="absolute contents left-[1595px] top-[139px]" data-name="Turtle Spawned Notification">
      <motion.div className="absolute bg-[#533920] border-l-4 border-[#E8D367] shadow-2xl h-[143px] left-[1595px] top-[174px] w-[325px]" data-name="Container" initial={{ x: 352 }} animate={{ x: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} />
      <LogoTurtle />
    </div>
  );
}

function Container92() {
  return (
    <div className="content-stretch flex gap-[3px] items-center relative shrink-0" data-name="Container">
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
    </div>
  );
}

function Container95() {
  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#533920] text-[20px] whitespace-nowrap">+1k</p>
      <div className="relative shrink-0 size-[32px]" data-name="logo">
        <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgLogo3} />
      </div>
    </div>
  );
}

function Container94() {
  return (
    <div className="absolute bg-[#d9d9d9] content-stretch flex flex-col h-[41px] items-start left-0 pb-[4px] pl-[6px] pr-[32px] pt-[5px] top-[5px] w-[114px]" data-name="Container">
      <Container95 />
    </div>
  );
}

function Container93() {
  return (
    <div className="h-[52px] relative shrink-0 w-[140px]" data-name="Container">
      <Container94 />
      <div className="absolute left-[84px] size-[52px] top-0">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="52" src={imgEllipse3} width="52" />
      </div>
    </div>
  );
}

function Container91() {
  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0 w-full" data-name="Container">
      <Container92 />
      <Container93 />
    </div>
  );
}

function Container97() {
  return (
    <div className="content-stretch flex gap-[3px] items-center relative shrink-0" data-name="Container">
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
    </div>
  );
}

function Container100() {
  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#533920] text-[20px] whitespace-nowrap">+1k</p>
      <div className="relative shrink-0 size-[32px]" data-name="logo">
        <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgLogo3} />
      </div>
    </div>
  );
}

function Container99() {
  return (
    <div className="absolute bg-[#d9d9d9] content-stretch flex flex-col h-[41px] items-start left-0 pb-[4px] pl-[6px] pr-[32px] pt-[5px] top-[5px] w-[114px]" data-name="Container">
      <Container100 />
    </div>
  );
}

function Container98() {
  return (
    <div className="h-[52px] relative shrink-0 w-[140px]" data-name="Container">
      <Container99 />
      <div className="absolute left-[84px] size-[52px] top-0">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="52" src={imgEllipse3} width="52" />
      </div>
    </div>
  );
}

function Container96() {
  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0 w-full" data-name="Container">
      <Container97 />
      <Container98 />
    </div>
  );
}

function Container102() {
  return (
    <div className="content-stretch flex gap-[3px] items-center relative shrink-0" data-name="Container">
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
    </div>
  );
}

function Container105() {
  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#533920] text-[20px] whitespace-nowrap">+1k</p>
      <div className="relative shrink-0 size-[32px]" data-name="logo">
        <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgLogo3} />
      </div>
    </div>
  );
}

function Container104() {
  return (
    <div className="absolute bg-[#d9d9d9] content-stretch flex flex-col h-[41px] items-start left-0 pb-[4px] pl-[6px] pr-[32px] pt-[5px] top-[5px] w-[114px]" data-name="Container">
      <Container105 />
    </div>
  );
}

function Container103() {
  return (
    <div className="h-[52px] relative shrink-0 w-[140px]" data-name="Container">
      <Container104 />
      <div className="absolute left-[84px] size-[52px] top-0">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="52" src={imgEllipse3} width="52" />
      </div>
    </div>
  );
}

function Container101() {
  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0 w-full" data-name="Container">
      <Container102 />
      <Container103 />
    </div>
  );
}

function Container107() {
  return (
    <div className="content-stretch flex gap-[3px] items-center relative shrink-0" data-name="Container">
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
    </div>
  );
}

function Container110() {
  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#533920] text-[20px] whitespace-nowrap">+1k</p>
      <div className="relative shrink-0 size-[32px]" data-name="logo">
        <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgLogo3} />
      </div>
    </div>
  );
}

function Container109() {
  return (
    <div className="absolute bg-[#d9d9d9] content-stretch flex flex-col h-[41px] items-start left-0 pb-[4px] pl-[6px] pr-[32px] pt-[5px] top-[5px] w-[114px]" data-name="Container">
      <Container110 />
    </div>
  );
}

function Container108() {
  return (
    <div className="h-[52px] relative shrink-0 w-[140px]" data-name="Container">
      <Container109 />
      <div className="absolute left-[84px] size-[52px] top-0">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="52" src={imgEllipse3} width="52" />
      </div>
    </div>
  );
}

function Container106() {
  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0 w-full" data-name="Container">
      <Container107 />
      <Container108 />
    </div>
  );
}

function Container112() {
  return (
    <div className="content-stretch flex gap-[3px] items-center relative shrink-0" data-name="Container">
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
    </div>
  );
}

function Container115() {
  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0" data-name="Container">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#533920] text-[20px] whitespace-nowrap">+1k</p>
      <div className="relative shrink-0 size-[32px]" data-name="logo">
        <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgLogo3} />
      </div>
    </div>
  );
}

function Container114() {
  return (
    <div className="absolute bg-[#d9d9d9] content-stretch flex flex-col h-[41px] items-start left-0 pb-[4px] pl-[6px] pr-[32px] pt-[5px] top-[5px] w-[114px]" data-name="Container">
      <Container115 />
    </div>
  );
}

function Container113() {
  return (
    <div className="h-[52px] relative shrink-0 w-[140px]" data-name="Container">
      <Container114 />
      <div className="absolute left-[84px] size-[52px] top-0">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="52" src={imgEllipse3} width="52" />
      </div>
    </div>
  );
}

function Container111() {
  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0 w-full" data-name="Container">
      <Container112 />
      <Container113 />
    </div>
  );
}

function BlueItemBuildContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[410px]" data-name="Blue Item Build Container">
      <Container91 />
      <Container96 />
      <Container101 />
      <Container106 />
      <Container111 />
    </div>
  );
}

function Container116() {
  return (
    <div className="h-[272px] overflow-clip relative shrink-0 w-[76px]" data-name="Container">
      <div className="absolute h-[272px] left-0 right-0 top-0" data-name="Logo">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgLogo5} />
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Koulen:Regular',sans-serif] h-[62px] justify-center leading-[0] left-1/2 not-italic text-[24px] text-center text-white top-1/2 tracking-[2.16px] w-[16px]">
        <p className="leading-[24px]">ITEM BUILD</p>
      </div>
    </div>
  );
}

function Container121() {
  return (
    <div className="content-stretch flex gap-[9px] items-center justify-center relative shrink-0 w-full" data-name="Container">
      <div className="relative shrink-0 size-[32px]" data-name="logo">
        <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgLogo3} />
      </div>
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#533920] text-[20px] whitespace-nowrap">+1k</p>
    </div>
  );
}

function Container120() {
  return (
    <div className="absolute bg-[#d9d9d9] content-stretch flex flex-col h-[41px] items-center justify-center left-[27px] pb-[4px] pl-[28px] pt-[5px] top-[5px] w-[114px]" data-name="Container">
      <Container121 />
    </div>
  );
}

function Container119() {
  return (
    <div className="h-[52px] relative shrink-0 w-[140px]" data-name="Container">
      <Container120 />
      <div className="absolute left-[8px] size-[52px] top-0">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="52" src={imgEllipse3} width="52" />
      </div>
    </div>
  );
}

function Container122() {
  return (
    <div className="content-stretch flex gap-[3px] items-center relative shrink-0" data-name="Container">
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
    </div>
  );
}

function Container118() {
  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0 w-full" data-name="Container">
      <Container119 />
      <Container122 />
    </div>
  );
}

function BlueItemBuildContainer1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Blue Item Build Container">
      <Container118 />
    </div>
  );
}

function Container126() {
  return (
    <div className="content-stretch flex gap-[9px] items-center justify-center relative shrink-0 w-full" data-name="Container">
      <div className="relative shrink-0 size-[32px]" data-name="logo">
        <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgLogo3} />
      </div>
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#533920] text-[20px] whitespace-nowrap">+1k</p>
    </div>
  );
}

function Container125() {
  return (
    <div className="absolute bg-[#d9d9d9] content-stretch flex flex-col h-[41px] items-center justify-center left-[27px] pb-[4px] pl-[28px] pt-[5px] top-[5px] w-[114px]" data-name="Container">
      <Container126 />
    </div>
  );
}

function Container124() {
  return (
    <div className="h-[52px] relative shrink-0 w-[140px]" data-name="Container">
      <Container125 />
      <div className="absolute left-[8px] size-[52px] top-0">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="52" src={imgEllipse3} width="52" />
      </div>
    </div>
  );
}

function Container127() {
  return (
    <div className="content-stretch flex gap-[3px] items-center relative shrink-0" data-name="Container">
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
    </div>
  );
}

function Container123() {
  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0 w-full" data-name="Container">
      <Container124 />
      <Container127 />
    </div>
  );
}

function BlueItemBuildContainer2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Blue Item Build Container">
      <Container123 />
    </div>
  );
}

function Container131() {
  return (
    <div className="content-stretch flex gap-[9px] items-center justify-center relative shrink-0 w-full" data-name="Container">
      <div className="relative shrink-0 size-[32px]" data-name="logo">
        <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgLogo3} />
      </div>
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#533920] text-[20px] whitespace-nowrap">+1k</p>
    </div>
  );
}

function Container130() {
  return (
    <div className="absolute bg-[#d9d9d9] content-stretch flex flex-col h-[41px] items-center justify-center left-[27px] pb-[4px] pl-[28px] pt-[5px] top-[5px] w-[114px]" data-name="Container">
      <Container131 />
    </div>
  );
}

function Container129() {
  return (
    <div className="h-[52px] relative shrink-0 w-[140px]" data-name="Container">
      <Container130 />
      <div className="absolute left-[8px] size-[52px] top-0">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="52" src={imgEllipse3} width="52" />
      </div>
    </div>
  );
}

function Container132() {
  return (
    <div className="content-stretch flex gap-[3px] items-center relative shrink-0" data-name="Container">
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
    </div>
  );
}

function Container128() {
  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0 w-full" data-name="Container">
      <Container129 />
      <Container132 />
    </div>
  );
}

function BlueItemBuildContainer3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Blue Item Build Container">
      <Container128 />
    </div>
  );
}

function Container136() {
  return (
    <div className="content-stretch flex gap-[9px] items-center justify-center relative shrink-0 w-full" data-name="Container">
      <div className="relative shrink-0 size-[32px]" data-name="logo">
        <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgLogo3} />
      </div>
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#533920] text-[20px] whitespace-nowrap">+1k</p>
    </div>
  );
}

function Container135() {
  return (
    <div className="absolute bg-[#d9d9d9] content-stretch flex flex-col h-[41px] items-center justify-center left-[27px] pb-[4px] pl-[28px] pt-[5px] top-[5px] w-[114px]" data-name="Container">
      <Container136 />
    </div>
  );
}

function Container134() {
  return (
    <div className="h-[52px] relative shrink-0 w-[140px]" data-name="Container">
      <Container135 />
      <div className="absolute left-[8px] size-[52px] top-0">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="52" src={imgEllipse3} width="52" />
      </div>
    </div>
  );
}

function Container137() {
  return (
    <div className="content-stretch flex gap-[3px] items-center relative shrink-0" data-name="Container">
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
    </div>
  );
}

function Container133() {
  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0 w-full" data-name="Container">
      <Container134 />
      <Container137 />
    </div>
  );
}

function BlueItemBuildContainer4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Blue Item Build Container">
      <Container133 />
    </div>
  );
}

function Container141() {
  return (
    <div className="content-stretch flex gap-[9px] items-center justify-center relative shrink-0 w-full" data-name="Container">
      <div className="relative shrink-0 size-[32px]" data-name="logo">
        <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgLogo3} />
      </div>
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#533920] text-[20px] whitespace-nowrap">+1k</p>
    </div>
  );
}

function Container140() {
  return (
    <div className="absolute bg-[#d9d9d9] content-stretch flex flex-col h-[41px] items-center justify-center left-[27px] pb-[4px] pl-[28px] pt-[5px] top-[5px] w-[114px]" data-name="Container">
      <Container141 />
    </div>
  );
}

function Container139() {
  return (
    <div className="h-[52px] relative shrink-0 w-[140px]" data-name="Container">
      <Container140 />
      <div className="absolute left-[8px] size-[52px] top-0">
        <img alt="" className="absolute block inset-0 max-w-none size-full" height="52" src={imgEllipse3} width="52" />
      </div>
    </div>
  );
}

function Container142() {
  return (
    <div className="content-stretch flex gap-[3px] items-center relative shrink-0" data-name="Container">
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="bg-[#d9d9d9] relative shrink-0 size-[41px]" data-name="Item">
        <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none" />
      </div>
    </div>
  );
}

function Container138() {
  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0 w-full" data-name="Container">
      <Container139 />
      <Container142 />
    </div>
  );
}

function BlueItemBuildContainer5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Blue Item Build Container">
      <Container138 />
    </div>
  );
}

function SingleBluePlayerItemRow({ ipos }: { ipos: number }) {
  const roomData = useRoomData();
  const players = Array.isArray(roomData?.players) ? roomData.players : [];
  const player = findPlayer(players, ipos);

  const heroId = Number(player?.heroid || player?.SelHeroID) || 0;
  const totalGold = Number(player?.totalGold ?? player?.gold_total ?? player?.gold) || 0;
  const formattedGold = String(totalGold);

  const rawEquips: number[] = Array.isArray(player?.equips)
    ? player.equips.map(Number)
    : [0, 0, 0, 0, 0, 0];

  const equips = [
    rawEquips[0] || 0,
    rawEquips[1] || 0,
    rawEquips[2] || 0,
    rawEquips[3] || 0,
    rawEquips[4] || 0,
    rawEquips[5] || 0,
  ];

  // Blue team: right to left -> reverse order
  const blueEquips = [...equips].reverse();

  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0 w-full" data-name="Container">
      {/* 6 Item Slots (Right to Left) */}
      <div className="content-stretch flex gap-[3px] items-center relative shrink-0" data-name="Container">
        {blueEquips.map((itemId, idx) => (
          <div key={idx} className="bg-[#d9d9d9] relative shrink-0 size-[41px] overflow-hidden rounded" data-name="Item">
            {itemId > 0 && <EquipIcon itemId={itemId} size={41} />}
            <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none z-10" />
          </div>
        ))}
      </div>

      {/* Gold & Hero Icon - kotak seperti item: pill w-[88px] + gap 9px + hero 41px */}
      <div className="h-[52px] relative shrink-0 w-[140px]" data-name="Container">
        <div className="absolute bg-[#d9d9d9] content-stretch flex flex-col h-[41px] items-center justify-center left-0 px-[6px] py-[5px] top-[5px] w-[88px]" data-name="Container">
          <div className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0 max-w-full" data-name="Container">
            <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-none not-italic relative shrink-0 text-[#533920] text-[15px] whitespace-nowrap">
              {formattedGold}
            </p>
            <div className="relative shrink-0 size-[24px]" data-name="logo">
              <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgLogo3} />
            </div>
          </div>
        </div>
        <div className="absolute left-[97px] top-[5px] bg-[#d9d9d9] relative shrink-0 size-[41px] overflow-hidden rounded z-10" data-name="Hero">
          <HeroIcon heroId={heroId} fallback={imgEllipse3} size={41} />
          <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none z-10" />
        </div>
      </div>
    </div>
  );
}

function SingleRedPlayerItemRow({ ipos }: { ipos: number }) {
  const roomData = useRoomData();
  const players = Array.isArray(roomData?.players) ? roomData.players : [];
  const player = findPlayer(players, ipos);

  const heroId = Number(player?.heroid || player?.SelHeroID) || 0;
  const totalGold = Number(player?.totalGold ?? player?.gold_total ?? player?.gold) || 0;
  const formattedGold = String(totalGold);

  const rawEquips: number[] = Array.isArray(player?.equips)
    ? player.equips.map(Number)
    : [0, 0, 0, 0, 0, 0];

  const equips = [
    rawEquips[0] || 0,
    rawEquips[1] || 0,
    rawEquips[2] || 0,
    rawEquips[3] || 0,
    rawEquips[4] || 0,
    rawEquips[5] || 0,
  ];

  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0 w-full" data-name="Container">
      {/* Hero Icon & Gold - kotak seperti item: hero 41px + gap 9px + pill w-[88px] */}
      <div className="h-[52px] relative shrink-0 w-[140px]" data-name="Container">
        <div className="absolute bg-[#d9d9d9] content-stretch flex flex-col h-[41px] items-center justify-center left-[50px] px-[6px] py-[5px] top-[5px] w-[88px]" data-name="Container">
          <div className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0 max-w-full" data-name="Container">
            <div className="relative shrink-0 size-[24px]" data-name="logo">
              <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgLogo3} />
            </div>
            <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-none not-italic relative shrink-0 text-[#533920] text-[15px] whitespace-nowrap">
              {formattedGold}
            </p>
          </div>
        </div>
        <div className="absolute left-0 top-[5px] bg-[#d9d9d9] relative shrink-0 size-[41px] overflow-hidden rounded z-10" data-name="Hero">
          <HeroIcon heroId={heroId} fallback={imgEllipse3} size={41} />
          <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none z-10" />
        </div>
      </div>

      {/* 6 Item Slots (Left to Right) */}
      <div className="content-stretch flex gap-[3px] items-center relative shrink-0" data-name="Container">
        {equips.map((itemId, idx) => (
          <div key={idx} className="bg-[#d9d9d9] relative shrink-0 size-[41px] overflow-hidden rounded" data-name="Item">
            {itemId > 0 && <EquipIcon itemId={itemId} size={41} />}
            <div aria-hidden className="absolute border-3 border-[#e8d367] border-solid inset-0 pointer-events-none z-10" />
          </div>
        ))}
      </div>
    </div>
  );
}

function DynamicBlueItemBuildContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[410px]" data-name="Blue Item Build Container">
      {[1, 2, 3, 4, 5].map((ipos) => (
        <SingleBluePlayerItemRow key={ipos} ipos={ipos} />
      ))}
    </div>
  );
}

function DynamicRedItemBuildContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[410px]" data-name="Container">
      {[6, 7, 8, 9, 10].map((ipos) => (
        <SingleRedPlayerItemRow key={ipos} ipos={ipos} />
      ))}
    </div>
  );
}

function Container90() {
  return (
    <motion.div className="absolute content-stretch flex gap-[9px] items-center justify-center left-1/2 -translate-x-1/2 top-[776px] w-[1026px]" data-name="Container" initial={{ opacity: 0, y: 200 }} animate={{ opacity: 1, y: 0 }} transition={{ opacity: { duration: 0.5, delay: 2.67, ease: "easeOut" }, y: { duration: 0.5, delay: 2.6, ease: "easeOut" } }}>
      <DynamicBlueItemBuildContainer />
      <Container116 />
      <DynamicRedItemBuildContainer />
    </motion.div>
  );
}

export default function Inmatch() {
  const [activeOverlay, setActiveOverlay] = useState<"none" | "emblem" | "item">("none");
  const [showTurtle, setShowTurtle] = useState(false);
  const [playerStats, setPlayerStats] = useState<{ visible: boolean; metric: PlayerStatsMetric }>(() => {
    try {
      const raw = localStorage.getItem(PLAYER_STATS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { visible?: boolean; metric?: unknown };
        return { visible: !!parsed.visible, metric: parsePlayerStatsMetric(parsed.metric) };
      }
    } catch {
      /* noop */
    }
    return { visible: false, metric: "gold" as PlayerStatsMetric };
  });

  useEffect(() => {
    const bc = new BroadcastChannel("mlbs_overlay_control");
    bc.onmessage = (event) => {
      if (event.data?.type === "SET_PLAYER_STATS") {
        const next = {
          visible: event.data.visible !== false,
          metric: parsePlayerStatsMetric(event.data.metric),
        };
        setPlayerStats(next);
        try {
          localStorage.setItem(PLAYER_STATS_KEY, JSON.stringify(next));
        } catch {
          /* noop */
        }
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === PLAYER_STATS_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue) as { visible?: boolean; metric?: unknown };
          setPlayerStats({ visible: !!parsed.visible, metric: parsePlayerStatsMetric(parsed.metric) });
        } catch {
          /* noop */
        }
      }
    };
    window.addEventListener("storage", handleStorage);

    const pollInterval = setInterval(() => {
      try {
        const raw = localStorage.getItem(PLAYER_STATS_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as { visible?: boolean; metric?: unknown };
          const next = { visible: !!parsed.visible, metric: parsePlayerStatsMetric(parsed.metric) };
          setPlayerStats((prev) => (prev.visible === next.visible && prev.metric === next.metric ? prev : next));
        }
      } catch {
        /* noop */
      }
    }, 500);

    return () => {
      bc.close();
      window.removeEventListener("storage", handleStorage);
      clearInterval(pollInterval);
    };
  }, []);

  useEffect(() => {
    // Sync state helper
    const syncOverlay = () => {
      const stored = localStorage.getItem("mlbs_active_overlay") as "none" | "emblem" | "item";
      if (stored) setActiveOverlay(stored);
    };

    syncOverlay();

    // 1. BroadcastChannel listener from Control Panel
    const bc = new BroadcastChannel("mlbs_overlay_control");
    bc.onmessage = (event) => {
      if (event.data?.type === "SET_OVERLAY") {
        setActiveOverlay(event.data.mode);
        localStorage.setItem("mlbs_active_overlay", event.data.mode);
      } else if (event.data?.type === "TRIGGER_TURTLE") {
        setShowTurtle(true);
        setTimeout(() => setShowTurtle(false), 5000);
      } else if (event.data?.type === "SET_SIDE_ITEM_VISIBLE") {
        const v = event.data.visible !== false;
        try {
          localStorage.setItem(SIDE_ITEM_VISIBLE_KEY, String(v));
        } catch {
          /* noop */
        }
        setGlobalSideItemVisible(v);
      } else if (event.data?.type === "SET_SIDE_MEDIA") {
        const slot = event.data.slot as SideMediaSlot;
        if (slot === "a" || slot === "b") {
          const d = event.data.data as Partial<SideMediaData> | undefined;
          const next: SideMediaData = {
            bg: typeof d?.bg === "string" && d.bg ? d.bg : SIDE_MEDIA_DEFAULTS[slot].bg,
            photos: Array.isArray(d?.photos) ? d.photos.filter((p) => typeof p === "string") : [],
          };
          try {
            localStorage.setItem(SIDE_MEDIA_KEYS[slot], JSON.stringify(next));
          } catch {
            /* noop */
          }
          setGlobalSideMedia(slot, next);
        }
      }
    };

    // 2. Storage Event Listener (Cross-window/tab sync)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "mlbs_active_overlay" && e.newValue) {
        setActiveOverlay(e.newValue as "none" | "emblem" | "item");
      }
    };
    window.addEventListener("storage", handleStorage);

    // 3. Polling fallback for guaranteed state sync across all browsers/OBS browser sources
    const pollInterval = setInterval(() => {
      const current = localStorage.getItem("mlbs_active_overlay") as "none" | "emblem" | "item";
      if (current && current !== activeOverlay) {
        setActiveOverlay(current);
      }
    }, 500);

    // 4. Keyboard Hotkeys: E = Emblem, I = Item, H/Esc = Hide
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === "e") {
        setActiveOverlay((prev) => {
          const next = prev === "emblem" ? "none" : "emblem";
          localStorage.setItem("mlbs_active_overlay", next);
          return next;
        });
      } else if (key === "i") {
        setActiveOverlay((prev) => {
          const next = prev === "item" ? "none" : "item";
          localStorage.setItem("mlbs_active_overlay", next);
          return next;
        });
      } else if (key === "h" || key === "escape") {
        setActiveOverlay("none");
        localStorage.setItem("mlbs_active_overlay", "none");
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      bc.close();
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(pollInterval);
    };
  }, [activeOverlay]);

  return (
    <div className="relative size-full overflow-hidden" data-name="inmatch">
      <Container />
      <div className="absolute h-[113.5px] left-[335px] top-0 w-[102px]">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
          <g id="Rectangle 18" />
        </svg>
      </div>
      <Container51 />

      {/* Pop-Up Overlay: Emblem Build OR Item Build (never overlapping) */}
      <AnimatePresence mode="wait">
        {activeOverlay === "emblem" && (
          <motion.div
            key="emblem"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-0 pointer-events-none"
          >
            <EmblemBuild />
          </motion.div>
        )}

        {activeOverlay === "item" && (
          <motion.div
            key="item"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-0 pointer-events-none"
          >
            <Container90 />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Player Stats Overlay (topmost layer) */}
      <AnimatePresence>
        {playerStats.visible && (
          <PlayerStatsOverlay key={`player-stats-${playerStats.metric}`} metric={playerStats.metric} />
        )}
      </AnimatePresence>

      {/* Turtle Spawn Notification Trigger */}
      <AnimatePresence>
        {showTurtle && (
          <motion.div
            key="turtle"
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <TurtleSpawnedNotification />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
