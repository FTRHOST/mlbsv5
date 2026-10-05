import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRoomData } from "../../hooks/useRoomData";
import imgBackgroundImage from "../DraftPick/9e72be5c6dd2ff24c0dbe0129186324d1805d951.png";

// Label yang sudah dikenal. Value baru yang belum ada di sini otomatis
// tampil sebagai "MAP <id>" (mengikuti pola getMapDrawLabel di Inmatch).
const MAP_DRAW_LABELS: Record<number, string> = {
  1: "BROKEN WALLS",
  2: "DANGEROUS GRASS",
  3: "FLYING CLOUD",
  4: "EXPANDING RIVER",
  12: "VISION REVEAL",
  15: "HEALING TURTLE",
  16: "GOLDEN TURRET",
};

function labelFor(id: number): string {
  return MAP_DRAW_LABELS[id] ?? `MAP ${id}`;
}

// Rentang id yang dipindai di /public/assets/map-draw/.
// File baru (mis. 5.png) otomatis muncul di list tanpa rebuild — cukup refresh.
const SCAN_MIN_ID = 1;
const SCAN_MAX_ID = 20;
const IMG_EXTS = ["png", "jpg", "jpeg", "webp"];

// Durasi animasi acak (slot/shuffle) sebelum berhenti di hasil asli.
const SHUFFLE_MS = 5000;

function probeImage(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

async function detectMapDrawImages(): Promise<{ id: number; src: string }[]> {
  const found: { id: number; src: string }[] = [];
  for (let id = SCAN_MIN_ID; id <= SCAN_MAX_ID; id++) {
    for (const ext of IMG_EXTS) {
      const src = `/assets/map-draw/${id}.${ext}`;
      // eslint-disable-next-line no-await-in-loop
      if (await probeImage(src)) {
        found.push({ id, src });
        break;
      }
    }
  }
  return found;
}

function useMapDrawImages() {
  const [images, setImages] = useState<{ id: number; src: string }[]>([]);
  useEffect(() => {
    let cancelled = false;
    detectMapDrawImages().then((found) => {
      if (!cancelled) setImages(found);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return images;
}

function SelectIndicator() {
  return (
    <div className="-rotate-90 relative size-[40px] shrink-0">
      <div className="absolute inset-[-40%_-43.3%_-35%_-43.3%]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 74.641 70"
        >
          <g filter="url(#mapdraw_select_shadow)" id="Polygon 1">
            <path
              d="M37.3205 6 L68.1409 59.4004 H6.50005 Z"
              fill="#D9D9D9"
            />
            <path
              d="M37.3205 6 L68.1409 59.4004 H6.50005 Z"
              stroke="#D69345"
              strokeWidth="2"
            />
          </g>
          <defs>
            <filter
              colorInterpolationFilters="sRGB"
              filterUnits="userSpaceOnUse"
              height="70"
              id="mapdraw_select_shadow"
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
                result="effect1_dropShadow"
              />
              <feBlend
                in="SourceGraphic"
                in2="effect1_dropShadow"
                mode="normal"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function MapRow({
  id,
  src,
  selected,
  locked,
  height,
}: {
  id: number;
  src: string;
  selected: boolean;
  locked: boolean;
  height: number;
}) {
  return (
    <div className="flex flex-row gap-[39px] items-center justify-start relative">
      <div className="w-[490px] shrink-0 relative" style={{ height }}>
        {src ? (
          <img
            alt={labelFor(id)}
            className="absolute left-0 top-0 w-[490px] object-cover pointer-events-none"
            style={{
              height,
              borderStyle: "solid",
              borderWidth: 8,
              borderColor: selected ? "#e8d367" : "#533920",
              boxShadow: locked ? "0 0 28px #E8D367" : undefined,
            }}
            src={src}
          />
        ) : (
          <div
            className="absolute left-0 top-0 w-[490px] flex items-center justify-center bg-[#1e1e1e]"
            style={{
              height,
              borderStyle: "solid",
              borderWidth: 8,
              borderColor: selected ? "#e8d367" : "#533920",
              boxShadow: locked ? "0 0 28px #E8D367" : undefined,
            }}
          >
            <p className="font-['Inter:Bold',sans-serif] font-bold text-white text-[24px] m-0">
              {labelFor(id)}
            </p>
          </div>
        )}
        {/* Lock-in flash beam saat shuffle berhenti di hasil asli */}
        <AnimatePresence>
          {locked && (
            <motion.div
              key={`mapdraw_flash_${id}`}
              initial={{ opacity: 0.9, x: "-100%" }}
              animate={{ opacity: 0, x: "100%" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFF4BD] to-transparent z-10 pointer-events-none"
            />
          )}
        </AnimatePresence>
      </div>
      <div className="w-[40px] shrink-0 flex items-center justify-center">
        {selected && <SelectIndicator />}
      </div>
    </div>
  );
}

export default function MapDraw() {
  const roomData = useRoomData();
  const raw = Number(roomData?.mapDraw);
  const gameState = Number(roomData?.gameState);
  const determined = Number.isFinite(raw) && raw > 0;
  const selectedId = determined ? Math.floor(raw) : 0;

  const detected = useMapDrawImages();

  // List = gabungan gambar yang terdeteksi + value terpilih saat ini.
  // - Gambar baru (5.png, 6.png, ...) otomatis masuk list.
  // - Value baru tanpa gambar tetap muncul sebagai baris placeholder.
  const rows = useMemo(() => {
    const map = new Map<number, string>(detected.map((d) => [d.id, d.src]));
    if (selectedId > 0 && !map.has(selectedId)) map.set(selectedId, "");
    return [...map.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([id, src]) => ({ id, src }));
  }, [detected, selectedId]);

  // ── Shuffle animation state ──────────────────────────────
  // Berjalan saat gameState === 3 dan mapDraw sudah ditentukan.
  // Highlight + nama header berputar cepat ±5 detik (melambat di akhir),
  // lalu berhenti tepat di hasil asli (selectedId).
  const [displayId, setDisplayId] = useState(0);
  const [shuffling, setShuffling] = useState(false);
  const [lockKey, setLockKey] = useState(0);
  const timersRef = useRef<number[]>([]);
  const triggerRef = useRef<string | null>(null);
  const rowIdsRef = useRef<number[]>([]);
  const selectedRef = useRef(0);
  rowIdsRef.current = rows.map((r) => r.id);
  selectedRef.current = selectedId;

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  }, []);

  const startShuffle = useCallback(() => {
    const target = selectedRef.current;
    if (!(target > 0)) return;
    clearTimers();
    setLockKey(0);
    setShuffling(true);
    const startedAt = performance.now();
    // Mulai dari posisi acak agar tiap putaran terlihat natural.
    let idx = Math.floor(Math.random() * Math.max(1, rowIdsRef.current.length));

    const tick = () => {
      const elapsed = performance.now() - startedAt;
      if (elapsed >= SHUFFLE_MS) {
        setDisplayId(target);
        setShuffling(false);
        setLockKey((k) => k + 1);
        const t = window.setTimeout(() => setLockKey(0), 1600);
        timersRef.current.push(t);
        return;
      }
      const ids = rowIdsRef.current.length > 0 ? rowIdsRef.current : [target];
      idx = (idx + 1) % ids.length;
      setDisplayId(ids[idx]);
      // Melambat secara kuadratik: ~70ms per langkah di awal → ~450ms di akhir.
      const progress = elapsed / SHUFFLE_MS;
      const delay = 70 + progress * progress * 380;
      timersRef.current.push(window.setTimeout(tick, delay));
    };

    const ids = rowIdsRef.current.length > 0 ? rowIdsRef.current : [target];
    setDisplayId(ids[idx % ids.length]);
    timersRef.current.push(window.setTimeout(tick, 70));
  }, [clearTimers]);

  // Pemicu otomatis: kombinasi (gameState, mapDraw) yang berubah.
  // Payload telemetri yang berulang (nilai sama) tidak memicu ulang.
  useEffect(() => {
    const key = `${gameState}|${selectedId}`;
    if (triggerRef.current === key) return;
    triggerRef.current = key;
    clearTimers();
    setLockKey(0);
    if (gameState === 3 && selectedId > 0) {
      startShuffle();
    } else {
      setShuffling(false);
      setDisplayId(selectedId);
    }
    return () => clearTimers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, selectedId]);

  // Test manual dari Control Panel (test only): TRIGGER_MAPDRAW.
  useEffect(() => {
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel("mlbs_overlay_control");
      bc.onmessage = (event) => {
        if (event.data?.type === "TRIGGER_MAPDRAW") {
          triggerRef.current = `manual|${Date.now()}`;
          startShuffle();
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
    };
  }, [startShuffle]);

  // Tinggi baris adaptif supaya tetap muat di 1080px walau list bertambah.
  const rowH =
    rows.length <= 4
      ? 105
      : Math.max(64, Math.floor((925 - (rows.length - 1) * 12) / rows.length));
  const rowGap = rows.length <= 4 ? 23 : 12;

  const headerLabel = displayId > 0 ? labelFor(displayId) : "RANDOM MAP";

  return (
    <div className="bg-[#e63030] relative size-full" data-name="random-map-draw">
      {/* Background Image */}
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

      {/* Map Draw Container */}
      <div className="absolute left-0 top-[29px] w-[1920px] flex flex-col gap-[11px] items-end justify-start">
        {/* Selected Name */}
        <motion.div
          className="pr-[92px] flex flex-row gap-[52px] items-center justify-end self-stretch shrink-0 relative"
          data-name="map-draw-selected-name"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div
            className="shrink-0 w-[521px] h-[95px] relative"
            data-name="selected-name-container"
          >
            <div
              className="absolute top-[16px] w-[393px] h-[66px]"
              style={{
                left: 128,
                background:
                  "linear-gradient(90deg, rgba(214, 147, 69, 1) 0%, rgba(115, 115, 115, 0) 100%)",
                transform: "scale(-1, 1)",
                transformOrigin: "center",
              }}
              data-name="bg-map-draw-name"
            />
            <div
              className="absolute left-0 top-0 w-[505px] h-[95px] flex items-center justify-end text-right font-['Inter:Bold',sans-serif] font-bold text-white text-[48px] text-shadow-[0px_4px_16px_rgba(0,0,0,0.25)]"
              data-name="map-draw-name"
            >
              <motion.p
                key={headerLabel}
                className="leading-none m-0"
                initial={{ opacity: 0, y: shuffling ? 14 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: shuffling ? 0.12 : 0.4, ease: "easeOut" }}
              >
                {headerLabel}
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Map List */}
        <motion.div
          className="shrink-0 relative overflow-hidden pr-[52px]"
          style={{ width: 609 }}
          data-name="map-draw-instance"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
        >
          <div
            className="flex flex-col items-start justify-start"
            style={{ gap: rowGap }}
          >
            {rows.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.45,
                  delay: 0.25 + i * 0.12,
                  ease: "easeOut",
                }}
              >
                <MapRow
                  id={m.id}
                  src={m.src}
                  selected={m.id === displayId && displayId > 0}
                  locked={!shuffling && lockKey > 0 && m.id === displayId}
                  height={rowH}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
