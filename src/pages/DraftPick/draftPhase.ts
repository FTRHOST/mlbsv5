/**
 * Parse key `draftPhase` dari payload telemetry.
 *
 * Agent mengirim STRING: "IDLE" | "BANNING" | "BLUE BANNING" | "RED BANNING" |
 * "PICKING" | "BLUE PICKING" | "RED PICKING" | "PREPARATION" | "IN_GAME"
 * (lihat telemetry draftState.currentDraftPhase). Nilai numerik legacy 1-7
 * (baris rooms lama / payload uji) tetap didukung: 1-3 BANNING, 4-6 PICKING,
 * 7 PREPARATION, dengan set giliran yang sama seperti sebelumnya.
 */
export interface DraftPhaseInfo {
  /** Label pendek untuk kotak phase (BANNING / PICKING / PREPARATION / IN GAME). */
  label: string;
  blueTurn: boolean;
  redTurn: boolean;
}

export function parseDraftPhase(raw: unknown): DraftPhaseInfo {
  const s = String(raw ?? "").toUpperCase().trim();

  // Backward-compat numerik legacy.
  if (/^\d+$/.test(s)) {
    const n = Number(s);
    if (n >= 1 && n <= 3) {
      return { label: "BANNING", blueTurn: n === 1 || n === 3, redTurn: n === 2 || n === 3 };
    }
    if (n >= 4 && n <= 6) {
      return { label: "PICKING", blueTurn: n === 4 || n === 6, redTurn: n === 5 || n === 6 };
    }
    if (n === 7) return { label: "PREPARATION", blueTurn: true, redTurn: true };
    return { label: "BANNING", blueTurn: false, redTurn: false };
  }

  if (s.includes("IN_GAME") || s === "INGAME") {
    return { label: "IN GAME", blueTurn: false, redTurn: false };
  }

  let label = "BANNING";
  if (s.includes("PICK")) label = "PICKING";
  else if (s.includes("PREPARATION")) label = "PREPARATION";

  // Belum ada fase aktif (lobby/kosong): label default, tanpa sorot giliran.
  if (s === "" || s === "IDLE" || s.indexOf("WAITING") === 0) {
    return { label: "BANNING", blueTurn: false, redTurn: false };
  }

  const isBlue = s.includes("BLUE");
  const isRed = s.includes("RED");
  // Fase generik tanpa prefix sisi (mis. "BANNING") = giliran bersama.
  const shared = !isBlue && !isRed;
  return { label, blueTurn: isBlue || shared, redTurn: isRed || shared };
}
