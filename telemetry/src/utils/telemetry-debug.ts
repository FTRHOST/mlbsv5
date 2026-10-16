import { debugLog, getIndonesianDateTime } from "./logger.js";

/**
 * Telemetry Debug Mode — mencatat semua payload yang terkirim via send().
 *
 * Tujuan:
 *  - Melihat apakah ada data yang duplikat (payload identik beruntun).
 *  - Melihat apakah ada data yang tidak sesuai (nilai aneh / inkonsisten).
 *
 * Cara pakai:
 *  - Aktifkan:  setTelemetryDebugEnabled(true)
 *  - Matikan:   setTelemetryDebugEnabled(false)
 *  - Default OFF agar tidak menambah overhead / spam log di production.
 *    Nyalakan hanya saat investigasi via Frida CLI:
 *      frida -U -p <PID> -l dist/agent.js --runtime=v8 -e "TELEMETRY_DEBUG=1"
 *    atau panggil rpc export `setTelemetryDebug(true)` bila tersedia.
 *
 * Stealth note: saat debug OFF, debugSend() hanya meneruskan ke send()
 * tanpa JSON.parse / alokasi tambahan (zero overhead).
 */

// Flag global — bisa di-override dari Frida CLI sebelum/sesudah load:
//   (globalThis as any).TELEMETRY_DEBUG = true
declare const TELEMETRY_DEBUG: boolean | undefined;

let telemetryDebugEnabled: boolean =
  typeof TELEMETRY_DEBUG !== "undefined" ? !!TELEMETRY_DEBUG : false;

try {
  const g = globalThis as any;
  if (typeof g.TELEMETRY_DEBUG !== "undefined") {
    telemetryDebugEnabled = !!g.TELEMETRY_DEBUG;
  }
  // Expose setter agar bisa di-toggle dari Frida CLI / rpc tanpa rebuild:
  //   rpc.exports.setTelemetryDebug(true)
  g.setTelemetryDebug = (v: boolean) => setTelemetryDebugEnabled(!!v);
  g.isTelemetryDebug = () => telemetryDebugEnabled;
} catch (e) {}

export function setTelemetryDebugEnabled(v: boolean): void {
  telemetryDebugEnabled = !!v;
  try {
    (globalThis as any).TELEMETRY_DEBUG = telemetryDebugEnabled;
  } catch (e) {}
  debugLog(
    "TelemetryDebug",
    `Debug mode ${telemetryDebugEnabled ? "DIAKTIFKAN ✅" : "dimatikan"}. ` +
      `Semua payload ${telemetryDebugEnabled ? "akan dicatat" : "tidak lagi dicatat"}.`,
  );
}

export function isTelemetryDebugEnabled(): boolean {
  // Cek ulang global agar toggle dari CLI langsung berlaku tanpa rebuild.
  try {
    const g = globalThis as any;
    if (typeof g.TELEMETRY_DEBUG === "boolean") return g.TELEMETRY_DEBUG;
  } catch (e) {}
  return telemetryDebugEnabled;
}

interface DebugStats {
  total: number;
  duplicates: number;
  mismatches: number;
}

const statsByType = new Map<string, DebugStats>();
// Hash sederhana (FNV-1a) dari JSON string — murah, tanpa alloc besar.
const lastHashByType = new Map<string, number>();
const lastJsonByType = new Map<string, string>();
let duplicateStreakByType = new Map<string, number>();

function fnv1a(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function getStats(type: string): DebugStats {
  let s = statsByType.get(type);
  if (!s) {
    s = { total: 0, duplicates: 0, mismatches: 0 };
    statsByType.set(type, s);
  }
  return s;
}

export function getTelemetryDebugStats(): Record<string, DebugStats> {
  const out: Record<string, DebugStats> = {};
  statsByType.forEach((v, k) => {
    out[k] = { ...v };
  });
  return out;
}

// ---------------------------------------------------------------------------
// Validasi "tidak sesuai" (mismatch / anomali). Mengembalikan daftar warning.
// Ringan & defensif: semua akses dibungkus try/catch oleh pemanggil.
// ---------------------------------------------------------------------------
function validatePayload(type: string, obj: any): string[] {
  const warnings: string[] = [];
  try {
    if (type === "mlbb_live_data") {
      const p = obj?.payload ?? obj;
      if (typeof p.gameState !== "number" || p.gameState < 0 || p.gameState > 20) {
        warnings.push(`gameState tidak wajar: ${JSON.stringify(p.gameState)}`);
      }
      const players = Array.isArray(p.players) ? p.players : [];
      if (p.gameState >= 4 && players.length !== 10) {
        warnings.push(`IN_GAME tapi players=${players.length} (harusnya 10)`);
      }
      const seenIpos = new Set<number>();
      const seenUid = new Set<string>();
      const seenHeroByTeam = new Map<string, number[]>();
      for (const pl of players) {
        if (typeof pl.ipos !== "number" || pl.ipos < 1 || pl.ipos > 10) {
          warnings.push(`ipos invalid: ${JSON.stringify(pl.ipos)} (uid=${pl.id})`);
        } else if (seenIpos.has(pl.ipos)) {
          warnings.push(`DUPLIKAT ipos=${pl.ipos}`);
        } else {
          seenIpos.add(pl.ipos);
        }
        const uid = String(pl.id ?? "");
        if (uid && uid !== "0") {
          if (seenUid.has(uid)) warnings.push(`DUPLIKAT uid=${uid}`);
          else seenUid.add(uid);
        }
        if (typeof pl.heroid !== "number" || pl.heroid < 0 || pl.heroid > 500) {
          warnings.push(`heroid tidak wajar: ${pl.heroid} (uid=${uid})`);
        }
        if (pl.heroid > 0) {
          const key = `${pl.team}:${pl.heroid}`;
          const arr = seenHeroByTeam.get(key) ?? [];
          arr.push(pl.ipos);
          seenHeroByTeam.set(key, arr);
        }
        if (typeof pl.hp === "number" && typeof pl.maxHp === "number" && pl.maxHp > 0 && pl.hp > pl.maxHp) {
          warnings.push(`hp (${pl.hp}) > maxHp (${pl.maxHp}) ipos=${pl.ipos}`);
        }
        if (typeof pl.level === "number" && (pl.level < 0 || pl.level > 30)) {
          warnings.push(`level tidak wajar: ${pl.level} ipos=${pl.ipos}`);
        }
        if (typeof pl.deathTime === "number" && (pl.deathTime < 0 || pl.deathTime > 120)) {
          warnings.push(`deathTime tidak wajar: ${pl.deathTime}s ipos=${pl.ipos} (offset/satuan pasca-patch?)`);
        }
      }
      seenHeroByTeam.forEach((slots, key) => {
        if (slots.length > 1) {
          warnings.push(`Hero duplikat dalam 1 tim ${key} di slot [${slots.join(",")}]`);
        }
      });
      const b = p.Battle ?? p.matchData;
      if (b) {
        for (const k of ["blueTeamGold", "redTeamGold", "blueTeamKill", "redTeamKill"] as const) {
          if (typeof b[k] === "number" && b[k] < 0) {
            warnings.push(`Battle.${k} negatif: ${b[k]}`);
          }
        }
        if (typeof b.waktuPertandingan === "number" && (b.waktuPertandingan < 0 || b.waktuPertandingan > 7200)) {
          warnings.push(`waktuPertandingan tidak wajar: ${b.waktuPertandingan}s`);
        }
      }
    } else if (type === "mlbb_kill_event") {
      const e = obj?.event ?? obj;
      if (!e.deader) {
        warnings.push("kill event tanpa deader");
      } else if (!e.deader.guid) {
        warnings.push("deader tanpa guid");
      }
      if (e.killer && e.deader && e.killer.guid === e.deader.guid && e.killer.guid !== 0) {
        warnings.push(`killer == deader guid=${e.killer.guid} (bunuh diri? / data salah?)`);
      }
      if (typeof e.t === "number" && (e.t < 0 || e.t > 7200)) {
        warnings.push(`kill t tidak wajar: ${e.t}s`);
      }
    } else if (type === "mlbb_boss_event") {
      const e = obj?.event ?? obj;
      if (!e.killer) {
        warnings.push("boss event tanpa killer");
      }
      if (e.bossKind !== "turtle" && e.bossKind !== "lord" && e.bossKind !== "unknown") {
        warnings.push(`bossKind tidak valid: ${JSON.stringify(e.bossKind)}`);
      }
      if (typeof e.t === "number" && (e.t < 0 || e.t > 7200)) {
        warnings.push(`boss t tidak wajar: ${e.t}s`);
      }
    } else if (type === "auto_match_result") {
      const w = obj?.winnerCamp ?? obj?.payload?.winnerCamp;
      if (w !== 1 && w !== 2) {
        warnings.push(`winnerCamp tidak valid: ${JSON.stringify(w)} (harusnya 1/2)`);
      }
    }
  } catch (e) {}
  return warnings;
}

/**
 * Pengganti send() dengan pencatatan debug.
 * @param jsonString string JSON yang siap dikirim (sudah di-stringify pemanggil).
 */
export function debugSend(jsonString: string): void {
  if (!isTelemetryDebugEnabled()) {
    send(jsonString);
    return;
  }

  let type = "unknown";
  let warnings: string[] = [];
  let hash = 0;
  try {
    hash = fnv1a(jsonString);
  } catch (e) {}

  try {
    const obj = JSON.parse(jsonString);
    type = String(obj?.type ?? "unknown");

    const stats = getStats(type);
    stats.total++;

    // --- Deteksi duplikat: hash sama dengan payload sebelumnya tipe sama ---
    const lastHash = lastHashByType.get(type);
    const isDuplicate = lastHash !== undefined && lastHash === hash;
    if (isDuplicate) {
      stats.duplicates++;
      const streak = (duplicateStreakByType.get(type) ?? 1) + 1;
      duplicateStreakByType.set(type, streak);
      // Ringkas log saat streak panjang: log tiap duplikat tetap 1 baris,
      // tapi tidak dump full JSON lagi setelah streak >= 3 (hemat log).
      if (streak <= 3) {
        debugLog(
          "TelemetryDebug",
          `⚠️ [DUPLIKAT x${streak}] type=${type} hash=${hash.toString(16)} ` +
            `size=${jsonString.length}B — payload identik dengan kiriman sebelumnya. ` +
            `total=${stats.total} dup=${stats.duplicates}`,
        );
      } else if (streak === 4) {
        debugLog(
          "TelemetryDebug",
          `⚠️ [DUPLIKAT x${streak}+] type=${type} — payload masih identik, ` +
            `dump disembunyikan sampai payload berubah...`,
        );
      }
      // Tetap kirim (debug tidak mengubah perilaku), lalu return cepat.
      try {
        send(jsonString);
      } catch (e) {}
      return;
    } else {
      duplicateStreakByType.set(type, 1);
    }
    lastHashByType.set(type, hash);
    lastJsonByType.set(type, jsonString.length > 8192 ? jsonString.slice(0, 8192) + "…[truncated]" : jsonString);

    // --- Validasi isi ---
    warnings = validatePayload(type, obj);
    if (warnings.length > 0) {
      stats.mismatches++;
    }

    const ts = getIndonesianDateTime();
    const head = `[${ts}] [TelemetryDebug] 📦 type=${type} #${stats.total} ` +
      `size=${jsonString.length}B hash=${hash.toString(16)} ` +
      `dup=${stats.duplicates} mismatch=${stats.mismatches}`;
    if (warnings.length > 0) {
      debugLog("TelemetryDebug", `${head}\n  ⚠️ TIDAK SESUAI: ${warnings.join(" | ")}`);
    } else {
      debugLog("TelemetryDebug", head);
    }
    // Dump full payload (penting untuk audit duplikat/tidak sesuai).
    // Dipisah jadi 1 baris log agar mudah di-grep.
    console.log(`[TelemetryDebug][PAYLOAD][${type}] ${jsonString}`);
  } catch (e) {
    // JSON.parse gagal (seharusnya tidak terjadi) — tetap kirim + catat.
    try {
      debugLog("TelemetryDebug", `⚠️ payload bukan JSON valid (size=${jsonString.length}B): ${String(e)}`);
    } catch (e2) {}
  }

  try {
    send(jsonString);
  } catch (e) {}
}
