import { motion } from "motion/react";
import { useBracketData } from "../../hooks/useBracketControl";

function TeamBox({ name, delay = 0 }: { name: string; delay?: number }) {
  return (
    <motion.div
      className="bg-[#e8d367] flex items-center justify-center flex-1 self-stretch overflow-hidden min-h-[68px]"
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
    >
      <p className="text-black text-center font-bold text-[24px] leading-tight m-0 px-2 truncate w-full">
        {name}
      </p>
    </motion.div>
  );
}

function Match({
  a,
  b,
  delay = 0,
  className = "w-[304px] h-[147px]",
}: {
  a: string;
  b: string;
  delay?: number;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-[11px] items-center justify-center shrink-0 ${className}`}>
      <TeamBox name={a} delay={delay} />
      <TeamBox name={b} delay={delay + 0.08} />
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
      {/* Footer */}
      <div className="absolute left-0 bottom-0 w-[1920px] h-[70px] bg-[#533920]" />

      {/* Logo + glow */}
      <div className="absolute w-[700px] h-[740px] overflow-hidden pointer-events-none" style={{ left: 1217, top: 173 }}>
        <img
          alt=""
          src="/assets/bracket/logo-container.png"
          data-name="Logo Container"
          className="absolute left-0 top-0 w-[700px] h-[740px] object-cover pointer-events-none"
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 820.1,
            height: 408.16,
            left: 46,
            top: 224.21,
            background:
              "radial-gradient(closest-side, rgba(83,57,32,1) 0%, rgba(83,57,32,0) 53%)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 820.1,
            height: 408.16,
            left: 64.9,
            top: 108,
            background:
              "radial-gradient(closest-side, rgba(83,57,32,1) 0%, rgba(83,57,32,0) 53%)",
          }}
        />
      </div>

      {/* Bracket */}
      <div className="absolute left-0 top-[100px] w-[1917px] h-[911px] flex flex-row gap-[25px] items-center justify-center pr-[104px]">
        <div className="flex flex-col gap-[35px] items-end justify-center shrink-0 w-[1366px] relative">
          {/* Baris atas: M1–M5 */}
          <div className="flex flex-row gap-[25px] items-center justify-end self-stretch shrink-0 h-[438px] relative">
            {/* M1 + M2 */}
            <div className="flex flex-row gap-[25px] items-center justify-center shrink-0 relative">
              <div className="flex flex-col gap-[69px] items-start justify-start shrink-0 relative">
                <Match a={bracket.m1a} b={bracket.m1b} delay={0.3} />
                <Match a={bracket.m2a} b={bracket.m2b} delay={0.42} />
              </div>
              <div className="flex flex-col gap-[139px] items-center justify-center shrink-0 relative">
                <img alt="" src="/assets/bracket/conn-m1.svg" className="shrink-0 w-[101px] h-[89px] pointer-events-none" />
                <img alt="" src="/assets/bracket/conn-m2.svg" className="shrink-0 w-[101px] h-[80px] pointer-events-none" />
              </div>
            </div>
            {/* M3 + M4 */}
            <div className="flex flex-row gap-[25px] items-center justify-center shrink-0 relative">
              <div className="flex flex-col gap-[69px] items-start justify-start shrink-0 relative">
                <Match a={bracket.m3a} b={bracket.m3b} delay={0.54} />
                <Match a={bracket.m4a} b={bracket.m4b} delay={0.66} />
              </div>
              <img alt="" src="/assets/bracket/conn-m3m4.svg" className="shrink-0 w-[101px] h-[222px] pointer-events-none" />
            </div>
            {/* M5 */}
            <div className="flex flex-col gap-[69px] items-center justify-center shrink-0 relative">
              <Match a={bracket.m5a} b={bracket.m5b} delay={0.78} />
            </div>
          </div>
          {/* Baris bawah: M6 + M7 */}
          <div className="flex flex-row gap-[25px] items-center justify-end self-stretch shrink-0 h-[438px] relative">
            <div className="flex flex-row gap-[25px] items-center justify-center shrink-0 relative">
              <Match a={bracket.m6a} b={bracket.m6b} delay={0.9} />
              <img alt="" src="/assets/bracket/conn-m6.svg" className="shrink-0 w-[101px] h-[84px] pointer-events-none" />
            </div>
            <div className="flex flex-col gap-[69px] items-center justify-center shrink-0 relative">
              <Match a={bracket.m7a} b={bracket.m7b} delay={1.02} />
            </div>
          </div>
        </div>

        <img alt="" src="/assets/bracket/conn-final.svg" className="shrink-0 w-[101px] h-[483px] pointer-events-none" />

        {/* Grand final M8 */}
        <div className="flex flex-col gap-[11px] items-start justify-start shrink-0 w-[322px] relative">
          <div className="flex flex-col items-center justify-center self-stretch shrink-0 relative">
            <p className="text-white text-left font-medium text-[20px] self-stretch m-0">21 OKTOBER 2026</p>
            <p className="text-white text-center font-bold text-[36px] self-stretch m-0">AUDIT K3</p>
          </div>
          <Match a={bracket.fa} b={bracket.fb} delay={1.14} className="w-full h-[187px]" />
        </div>
      </div>

      {/* Header */}
      <div className="absolute left-0 top-0 w-[1920px] flex flex-row items-center justify-between">
        <div className="bg-[#533920] flex flex-row items-center justify-center shrink-0 w-[1278px] h-[100px]">
          <p className="text-white text-center font-bold text-[64px] m-0">PLAYOFFS BRACKET</p>
        </div>
        <div className="bg-[#d69345] flex flex-row items-center justify-center shrink-0 w-[642px] h-[100px]">
          <p className="text-white text-center font-bold text-[64px] m-0">INTECHFEST</p>
        </div>
      </div>
    </div>
  );
}
