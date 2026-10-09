import { motion } from "motion/react";
import { useBracketData } from "../../hooks/useBracketControl";

function TeamBox({ name, delay = 0 }: { name: string; delay?: number }) {
  return (
    <motion.div
      className="bg-[#e8d367] flex items-center justify-center flex-1 self-stretch overflow-hidden min-h-[88px]"
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
    >
      <p className="text-black text-center font-bold text-[32px] leading-tight m-0 px-2 truncate w-full">
        {name}
      </p>
    </motion.div>
  );
}

function Match({ a, b, delay = 0 }: { a: string; b: string; delay?: number }) {
  return (
    <div className="flex flex-col gap-[11px] items-center justify-center shrink-0 w-[322px] h-[187px]">
      <TeamBox name={a} delay={delay} />
      <TeamBox name={b} delay={delay + 0.08} />
    </div>
  );
}

function Schedule({ date, place, className = "" }: { date: string; place: string; className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center w-[322px] absolute ${className}`}>
      <p className="text-white text-left font-medium text-[20px] self-stretch m-0">{date}</p>
      <p className="text-white text-center font-bold text-[36px] self-stretch m-0">{place}</p>
    </div>
  );
}

export default function Bracket() {
  const { bracket } = useBracketData();

  return (
    <div className="relative w-[1920px] h-[1080px] overflow-hidden bg-[#2b2118]">
      {/* Background */}
      <img
        alt=""
        src="/assets/bracket/bg.png"
        className="absolute inset-0 size-full object-cover pointer-events-none"
      />
      <div className="absolute left-0 top-0 w-[1920px] h-[100px] bg-[#533920]" />
      <div className="absolute left-0 bottom-0 w-[1920px] h-[100px] bg-[#533920]" />
      {/* Glow */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 820,
          height: 408,
          left: 1081,
          top: 398,
          background:
            "radial-gradient(closest-side, rgba(83,57,32,1) 0%, rgba(83,57,32,0) 53%)",
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 820,
          height: 408,
          left: 1100,
          top: 282,
          background:
            "radial-gradient(closest-side, rgba(83,57,32,1) 0%, rgba(83,57,32,0) 53%)",
        }}
      />
      <img
        alt=""
        src="/assets/bracket/logo-intechfest.png"
        className="absolute w-[700px] h-[740px] object-cover pointer-events-none"
        style={{ left: 1217, top: 173 }}
      />

      {/* Bracket columns */}
      <div className="absolute left-0 top-[76px] w-[1920px] h-[980px] flex flex-row gap-[203px] items-center justify-center">
        <div className="flex flex-col gap-[38px] items-center justify-center">
          <Match a={bracket.m1a} b={bracket.m1b} delay={0.3} />
          <Match a={bracket.m2a} b={bracket.m2b} delay={0.45} />
          <Match a={bracket.m3a} b={bracket.m3b} delay={0.6} />
        </div>
        <div className="flex flex-col gap-[38px] items-center justify-center">
          <Match a={bracket.m4a} b={bracket.m4b} delay={0.75} />
          <Match a={bracket.m5a} b={bracket.m5b} delay={0.9} />
        </div>
        <div className="flex flex-col gap-[11px] items-center justify-center w-[322px] h-[187px]">
          <TeamBox name={bracket.fa} delay={1.05} />
          <TeamBox name={bracket.fb} delay={1.13} />
        </div>
      </div>

      {/* Connectors */}
      <img alt="" src="/assets/bracket/connector-1.svg" className="absolute pointer-events-none" style={{ left: 596, top: 292 }} />
      <img alt="" src="/assets/bracket/connector-2.svg" className="absolute pointer-events-none" style={{ left: 596, top: 522 }} />
      <img alt="" src="/assets/bracket/connector-3.svg" className="absolute pointer-events-none" style={{ left: 596, top: 728 }} />
      <img alt="" src="/assets/bracket/connector-4.svg" className="absolute pointer-events-none" style={{ left: 1121, top: 411 }} />
      <img alt="" src="/assets/bracket/connector-5.svg" className="absolute pointer-events-none" style={{ left: 1121, top: 616 }} />

      {/* Header */}
      <div className="absolute left-0 top-0 w-[1278px] h-[100px] flex items-center justify-center">
        <p className="text-white text-center font-bold text-[64px] m-0">PLAYOFFS BRACKET</p>
      </div>
      <div className="absolute w-[642px] h-[100px] bg-[#d69345]" style={{ left: 1278, top: 0 }} />
      <div className="absolute w-[642px] h-[100px] flex items-center justify-center" style={{ left: 1278, top: 0 }}>
        <p className="text-white text-center font-bold text-[64px] m-0">INTECHFEST</p>
      </div>

      <Schedule date="17 OKTOBER 2026" place="K3.B.317/318" className="left-[274px] top-[173px]" />
      <Schedule date="17 OKTOBER 2026" place="K3.B.317/318" className="left-[799px] top-[277px]" />
      <Schedule date="21 OKTOBER 2026" place="AUDIT K3" className="left-[1324px] top-[393px]" />
    </div>
  );
}
