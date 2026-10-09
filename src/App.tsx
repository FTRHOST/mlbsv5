import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router";
// AnimatePresence remounts each screen on tab switch, so entrance plays fresh each visit
import DraftPick from "@/pages/DraftPick/index";
import DraftPickLoading from "@/pages/DraftPickLoading/index";
import Inmatch from "@/pages/Inmatch/index";
import MapDraw from "@/pages/MapDraw/index";
import Endmatch from "@/pages/Endmatch/index";
import Bracket from "@/pages/Bracket/index";
import SesaatLagi from "@/pages/SesaatLagi/index";
import Win from "@/pages/Win/index";
import ControlPanel from "@/pages/ControlPanel/index";
import RoomPage from "@/pages/Room/index";

function ScaledScreen({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function calc() {
      if (!containerRef.current) return;
      const sw = containerRef.current.clientWidth;
      const sh = containerRef.current.clientHeight;
      setScale(Math.min(sw / 1920, sh / 1080));
    }
    calc();
    const ro = new ResizeObserver(calc);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden flex items-center justify-center bg-black">
      <div
        style={{
          width: 1920,
          height: 1080,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          flexShrink: 0,
          position: "relative",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ─── DraftPick screen — entrance once ─── */
function DraftPickScreen() {
  return (
    <motion.div
      className="relative w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      <DraftPick />
    </motion.div>
  );
}

/* ─── DraftPickLoading screen — entrance once ─── */
function DraftPickLoadingScreen() {
  return (
    <motion.div
      className="relative w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      <DraftPickLoading />
    </motion.div>
  );
}

/* ─── MapDraw screen — entrance once ─── */
function MapDrawScreen() {
  return (
    <motion.div
      className="relative w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      <MapDraw />
    </motion.div>
  );
}

/* ─── Endmatch screen — entrance once ─── */
function EndmatchScreen() {
  return (
    <motion.div
      className="relative w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      <Endmatch />
    </motion.div>
  );
}

/* ─── Inmatch screen — slide up + fade entrance once ─── */
function InmatchScreen() {
  return (
    <motion.div
      className="relative w-full h-full"
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Inmatch />
    </motion.div>
  );
}

/* ─── Bracket / SesaatLagi / Win screens — entrance once ─── */
function BracketScreen() {
  return (
    <motion.div
      className="relative w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      <Bracket />
    </motion.div>
  );
}

function SesaatLagiScreen() {
  return (
    <motion.div
      className="relative w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      <SesaatLagi />
    </motion.div>
  );
}

function WinScreen() {
  return (
    <motion.div
      className="relative w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      <Win />
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/draftpick" element={
          <motion.div
            className="w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ScaledScreen><DraftPickScreen /></ScaledScreen>
          </motion.div>
        } />
        <Route path="/draftloading" element={
          <motion.div
            className="w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ScaledScreen><DraftPickLoadingScreen /></ScaledScreen>
          </motion.div>
        } />
        <Route path="/inmatch" element={
          <motion.div
            className="w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ScaledScreen><InmatchScreen /></ScaledScreen>
          </motion.div>
        } />
        <Route path="/mapdraw" element={
          <motion.div
            className="w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ScaledScreen><MapDrawScreen /></ScaledScreen>
          </motion.div>
        } />
        <Route path="/endmatch" element={
          <motion.div
            className="w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ScaledScreen><EndmatchScreen /></ScaledScreen>
          </motion.div>
        } />
        <Route path="/bracket" element={
          <motion.div
            className="w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ScaledScreen><BracketScreen /></ScaledScreen>
          </motion.div>
        } />
        <Route path="/sesaatlagi" element={
          <motion.div
            className="w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ScaledScreen><SesaatLagiScreen /></ScaledScreen>
          </motion.div>
        } />
        <Route path="/win" element={
          <motion.div
            className="w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ScaledScreen><WinScreen /></ScaledScreen>
          </motion.div>
        } />
        <Route path="/control" element={<ControlPanel />} />
        <Route path="/room" element={<RoomPage />} />
        <Route path="/match" element={<RoomPage />} />
        <Route path="/match/room" element={<RoomPage />} />
        <Route path="*" element={<Navigate to="/draftpick" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <div className="w-screen h-screen flex flex-col bg-black overflow-hidden">
      <BrowserRouter>
        <div className="flex-1 min-h-0 overflow-y-auto">
          <AnimatedRoutes />
        </div>
      </BrowserRouter>
    </div>
  );
}
