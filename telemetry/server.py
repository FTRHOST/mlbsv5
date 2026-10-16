import argparse
import asyncio
import hashlib
import json
import os
import sys
import time
from datetime import datetime, timedelta, timezone
import frida
import websockets
import subprocess

PORT = 8080
FRIDA_PORT = 2626  # Custom port untuk Frida
AGENT_PATH = os.path.join(os.path.dirname(__file__), "dist", "agent.js")
CONNECTED_CLIENTS = set()
loop = None

# ---------------------------------------------------------------------------
# Telemetry Debug Mode — mencatat semua payload yang terkirim.
# Aktifkan via:  python3 server.py --debug
#            atau: TELEMETRY_DEBUG=1 python3 server.py
#            atau: TELEMETRY_DEBUG_LOG=/path/file.jsonl python3 server.py --debug
# Kegunaan: cek apakah ada data duplikat atau tidak sesuai (anomali).
# ---------------------------------------------------------------------------
DEBUG = os.getenv("TELEMETRY_DEBUG", "0") == "1"
DEBUG_LOG_FILE = os.getenv(
    "TELEMETRY_DEBUG_LOG",
    os.path.join(os.path.dirname(__file__), "telemetry_payload_debug.jsonl"),
)
_debug_stats: dict = {}
_debug_last_hash: dict = {}
_debug_dup_streak: dict = {}


def _wib_now_str() -> str:
    try:
        wib = timezone(timedelta(hours=7))
        return datetime.now(wib).strftime("%d %B %Y %H:%M:%S")
    except Exception:
        return time.strftime("%Y-%m-%d %H:%M:%S")

def _validate_payload(obj: dict) -> list:
    """Kembalikan daftar warning bila payload tidak sesuai / aneh."""
    warnings: list = []
    try:
        ptype = obj.get("type", "unknown")
        if ptype == "mlbb_live_data":
            p = obj.get("payload", obj)
            gs = p.get("gameState")
            if not isinstance(gs, (int, float)) or gs < 0 or gs > 20:
                warnings.append(f"gameState tidak wajar: {gs!r}")
            players = p.get("players", [])
            if not isinstance(players, list):
                warnings.append("players bukan list")
                players = []
            if isinstance(gs, (int, float)) and gs >= 4 and len(players) != 10:
                warnings.append(f"IN_GAME tapi players={len(players)} (harusnya 10)")
            seen_ipos: set = set()
            seen_uid: set = set()
            hero_by_team: dict = {}
            for pl in players:
                ipos = pl.get("ipos")
                uid = str(pl.get("id", ""))
                if not isinstance(ipos, int) or ipos < 1 or ipos > 10:
                    warnings.append(f"ipos invalid: {ipos!r} (uid={uid})")
                elif ipos in seen_ipos:
                    warnings.append(f"DUPLIKAT ipos={ipos}")
                else:
                    seen_ipos.add(ipos)
                if uid and uid != "0":
                    if uid in seen_uid:
                        warnings.append(f"DUPLIKAT uid={uid}")
                    else:
                        seen_uid.add(uid)
                hero = pl.get("heroid", 0)
                if not isinstance(hero, int) or hero < 0 or hero > 500:
                    warnings.append(f"heroid tidak wajar: {hero} (uid={uid})")
                if isinstance(hero, int) and hero > 0:
                    key = f"{pl.get('team')}:{hero}"
                    hero_by_team.setdefault(key, []).append(ipos)
                hp, maxhp = pl.get("hp", 0), pl.get("maxHp", 0)
                if isinstance(hp, (int, float)) and isinstance(maxhp, (int, float)) and maxhp > 0 and hp > maxhp:
                    warnings.append(f"hp ({hp}) > maxHp ({maxhp}) ipos={ipos}")
            for key, slots in hero_by_team.items():
                if len(slots) > 1:
                    warnings.append(f"Hero duplikat dalam 1 tim {key} di slot {slots}")
            b = p.get("Battle", p.get("matchData", {})) or {}
            for k in ("blueTeamGold", "redTeamGold", "blueTeamKill", "redTeamKill"):
                if isinstance(b.get(k), (int, float)) and b[k] < 0:
                    warnings.append(f"Battle.{k} negatif: {b[k]}")
        elif ptype == "mlbb_kill_event":
            e = obj.get("event", obj) or {}
            deader = e.get("deader")
            if not deader:
                warnings.append("kill event tanpa deader")
            elif not deader.get("guid"):
                warnings.append("deader tanpa guid")
            killer = e.get("killer")
            if killer and deader and killer.get("guid") == deader.get("guid") and killer.get("guid"):
                warnings.append(f"killer == deader guid={killer.get('guid')} (bunuh diri? / data salah?)")
        elif ptype == "auto_match_result":
            w = obj.get("winnerCamp", (obj.get("payload") or {}).get("winnerCamp") if isinstance(obj.get("payload"), dict) else None)
            if w not in (1, 2):
                warnings.append(f"winnerCamp tidak valid: {w!r} (harusnya 1/2)")
    except Exception as ex:
        warnings.append(f"validator error: {ex}")
    return warnings


def _debug_log_payload(payload: dict, raw_msg: str = "") -> None:
    """Catat payload ke console + file JSONL + deteksi duplikat/tidak sesuai."""
    if not DEBUG:
        return
    try:
        ptype = str(payload.get("type", "unknown") if isinstance(payload, dict) else "unknown")
        canonical = json.dumps(payload, sort_keys=True, ensure_ascii=False, separators=(",", ":"))
        h = hashlib.sha1(canonical.encode("utf-8")).hexdigest()[:12]
        st = _debug_stats.setdefault(ptype, {"total": 0, "duplicates": 0, "mismatches": 0})
        st["total"] += 1

        last_h = _debug_last_hash.get(ptype)
        if last_h == h:
            st["duplicates"] += 1
            streak = _debug_dup_streak.get(ptype, 1) + 1
            _debug_dup_streak[ptype] = streak
            if streak <= 3:
                print(f"[TelemetryDebug] [{_wib_now_str()}] ⚠️ [DUPLIKAT x{streak}] type={ptype} "
                      f"hash={h} size={len(canonical)}B total={st['total']} dup={st['duplicates']}")
            elif streak == 4:
                print(f"[TelemetryDebug] [{_wib_now_str()}] ⚠️ [DUPLIKAT x{streak}+] type={ptype} — "
                      f"payload masih identik, dump disembunyikan sampai payload berubah...")
        else:
            _debug_dup_streak[ptype] = 1
            _debug_last_hash[ptype] = h
            warnings = _validate_payload(payload if isinstance(payload, dict) else {})
            if warnings:
                st["mismatches"] += 1
            head = (f"[TelemetryDebug] [{_wib_now_str()}] 📦 type={ptype} #{st['total']} "
                    f"size={len(canonical)}B hash={h} dup={st['duplicates']} mismatch={st['mismatches']}")
            if warnings:
                print(f"{head}\n  ⚠️ TIDAK SESUAI: {' | '.join(warnings)}")
            else:
                print(head)
            print(f"[TelemetryDebug][PAYLOAD][{ptype}] {canonical}")

        # Append ke file JSONL untuk audit pasca-match (grep-friendly).
        try:
            with open(DEBUG_LOG_FILE, "a", encoding="utf-8") as f:
                f.write(json.dumps({
                    "ts": _wib_now_str(),
                    "hash": h,
                    "stats": dict(st),
                    "data": payload,
                }, ensure_ascii=False) + "\n")
        except Exception as ex:
            print(f"[TelemetryDebug] [!] Gagal tulis debug log: {ex}")
    except Exception as ex:
        print(f"[TelemetryDebug] [!] debug logger error: {ex}")


# ---------------------------------------------------------------------------
# Match History — simpan payload pertandingan saat win ditentukan.
# Momen simpan = event WinLog agent: {"type":"auto_match_result","winnerCamp":N}
# (log agent: "[Match] [WinLog] Team yang menang: N (1:Blue, 2:Red)").
# File: public/historyMatch/[hh-mm_timAName-timBName].json  (+ index.json)
# Halaman Endmatch membaca index TERAKHIR dari history ini (lihat
# src/hooks/useMatchHistory.ts). Folder public/ dipilih agar file langsung
# bisa di-fetch browser overlay (Vite dev menyajikan public/ dari disk).
# ---------------------------------------------------------------------------
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HISTORY_DIR = os.path.join(REPO_ROOT, "public", "historyMatch")
HISTORY_INDEX = os.path.join(HISTORY_DIR, "index.json")

_history_last_live: dict = {}
_history_saved_win: int | None = None


def _load_root_env() -> None:
    """Muat <repo>/.env minimal (tanpa dependensi) untuk kredensial Supabase."""
    fp = os.path.join(REPO_ROOT, ".env")
    if not os.path.isfile(fp):
        return
    try:
        with open(fp, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                k, v = line.split("=", 1)
                k, v = k.strip(), v.strip()
                if not k or k in os.environ:
                    continue
                if len(v) >= 2 and v[0] == v[-1] and v[0] in ("'", '"'):
                    v = v[1:-1]
                os.environ[k] = v
    except OSError:
        pass


def _sanitize_name(name: str) -> str:
    import re
    s = (name or "").strip() or "Unknown"
    s = re.sub(r"[^A-Za-z0-9._-]+", "_", s)
    return s.strip("_") or "Unknown"


def _fetch_setup_team_names() -> tuple[str, str]:
    """Ambil (Team1Name, Team2Name) dari baris match_setup terbaru via REST."""
    import urllib.request
    import urllib.parse
    base = os.environ.get("VITE_SUPABASE_URL", "").strip().rstrip("/")
    key = os.environ.get("VITE_SUPABASE_ANON_KEY", "").strip()
    if not base or not key:
        return ("Blue", "Red")
    try:
        qs = urllib.parse.urlencode({
            "select": "Team1Name,Team2Name",
            "order": "updated_at.desc",
            "limit": "1",
        })
        req = urllib.request.Request(
            f"{base}/rest/v1/match_setup?{qs}",
            headers={"apikey": key, "Authorization": f"Bearer {key}"},
        )
        with urllib.request.urlopen(req, timeout=4) as resp:
            rows = json.loads(resp.read().decode("utf-8"))
        if rows:
            t1 = str(rows[0].get("Team1Name") or "").strip()
            t2 = str(rows[0].get("Team2Name") or "").strip()
            if t1 and t2:
                return (t1, t2)
    except Exception as ex:
        print(f"[History] [!] Gagal ambil match_setup: {ex}")
    return ("Blue", "Red")


def _fetch_uid_team_map() -> dict:
    """uid -> team_name dari team_mappings (untuk nama sisi blue/red)."""
    import urllib.request
    base = os.environ.get("VITE_SUPABASE_URL", "").strip().rstrip("/")
    key = os.environ.get("VITE_SUPABASE_ANON_KEY", "").strip()
    if not base or not key:
        return {}
    try:
        req = urllib.request.Request(
            f"{base}/rest/v1/team_mappings?select=team_name,uid",
            headers={"apikey": key, "Authorization": f"Bearer {key}"},
        )
        with urllib.request.urlopen(req, timeout=4) as resp:
            rows = json.loads(resp.read().decode("utf-8"))
        out: dict = {}
        for r in rows or []:
            uid = str(r.get("uid") or "").strip()
            nm = str(r.get("team_name") or "").strip()
            if uid and nm:
                out[uid] = nm
        return out
    except Exception as ex:
        print(f"[History] [!] Gagal ambil team_mappings: {ex}")
        return {}


def _resolve_side_names(players: list, uid_map: dict) -> tuple[str | None, str | None]:
    """Majority vote nama tim per sisi (meniru resolveSideTeamNames frontend)."""
    votes_blue: dict = {}
    votes_red: dict = {}
    for p in players or []:
        try:
            team = int(p.get("team", 0))
        except (TypeError, ValueError):
            continue
        uid = str(p.get("id") or "").strip()
        nm = uid_map.get(uid)
        if not nm:
            continue
        box = votes_blue if team == 1 else votes_red if team == 2 else None
        if box is None:
            continue
        box[nm] = box.get(nm, 0) + 1
    pick = lambda v: max(v.items(), key=lambda kv: kv[1])[0] if v else None
    return (pick(votes_blue), pick(votes_red))


def _write_history_index() -> None:
    try:
        files = sorted(
            f for f in os.listdir(HISTORY_DIR)
            if f.endswith(".json") and f != "index.json"
        )
        with open(HISTORY_INDEX, "w", encoding="utf-8") as f:
            json.dump(files, f, ensure_ascii=False)
    except Exception as ex:
        print(f"[History] [!] Gagal tulis index.json: {ex}")


def save_match_history(live_payload: dict, winner: int) -> str | None:
    """Simpan snapshot payload live + winner ke historyMatch. Kembalikan nama file."""
    global _history_saved_win
    try:
        if not isinstance(live_payload, dict):
            return None
        inner = live_payload.get("payload", live_payload)
        if not isinstance(inner, dict):
            return None
        players = inner.get("players", []) or []
        battle = dict(inner.get("Battle", inner.get("matchData", {})) or {})
        battle["winCamp"] = winner

        team_a, team_b = _fetch_setup_team_names()
        blue_nm, red_nm = _resolve_side_names(players, _fetch_uid_team_map())

        hhmm = _wib_now_str()[-8:-3].replace(":", "-")  # "HH-MM" dari WIB
        base = f"{hhmm}_{_sanitize_name(team_a)}-{_sanitize_name(team_b)}"
        fname = f"{base}.json"
        # Hindari timpa bila dua match selesai di menit yang sama.
        n = 2
        while os.path.exists(os.path.join(HISTORY_DIR, fname)):
            try:
                with open(os.path.join(HISTORY_DIR, fname), "r", encoding="utf-8") as f:
                    old = json.load(f)
                if old.get("winnerCamp") == winner:
                    break  # file yang sama -> timpa saja (idempoten)
            except Exception:
                pass
            fname = f"{base}-{n}.json"
            n += 1
        os.makedirs(HISTORY_DIR, exist_ok=True)

        entry = {
            "savedAt": _wib_now_str(),
            "winnerCamp": winner,
            "teamA": team_a,
            "teamB": team_b,
            "blueTeam": blue_nm,
            "redTeam": red_nm,
            "data": {
                "gameState": inner.get("gameState"),
                "draftPhase": inner.get("draftPhase"),
                "draftTimer": inner.get("draftTimer"),
                "mapDraw": inner.get("mapDraw"),
                "players": players,
                "Battle": battle,
                "battle": battle,
            },
        }
        with open(os.path.join(HISTORY_DIR, fname), "w", encoding="utf-8") as f:
            json.dump(entry, f, ensure_ascii=False)
        _write_history_index()
        _history_saved_win = winner
        print(f"[History] [WinLog] Team yang menang: {winner} (1:Blue, 2:Red) "
              f"-> tersimpan: historyMatch/{fname}")
        return fname
    except Exception as ex:
        print(f"[History] [!] Gagal simpan history: {ex}")
        return None


def handle_win_candidate(live_obj: dict) -> None:
    """Dipanggil tiap payload mlbb_live_data: simpan bila winCamp valid & belum disimpan.

    Direset (armed ulang) saat match baru: live payload dengan winCamp 0.
    """
    global _history_saved_win
    try:
        inner = live_obj.get("payload", live_obj) if isinstance(live_obj, dict) else {}
        if not isinstance(inner, dict):
            return
        battle = inner.get("Battle", inner.get("matchData", {})) or {}
        w = battle.get("winCamp", 0)
        try:
            w = int(w)
        except (TypeError, ValueError):
            return
        if w not in (1, 2):
            # Belum ada pemenang (atau match baru) -> bersenjata ulang.
            if battle.get("winCamp", 0) == 0:
                _history_saved_win = None
            return
        if _history_saved_win == w:
            return  # sudah tersimpan untuk kemenangan ini
        save_match_history(live_obj, w)
    except Exception as ex:
        print(f"[History] [!] handle_win_candidate error: {ex}")


def handle_match_result(winner: int) -> None:
    """Dipanggil saat event auto_match_result (momen [Match] [WinLog] agent)."""
    global _history_saved_win
    try:
        w = int(winner)
    except (TypeError, ValueError):
        return
    if w not in (1, 2):
        return
    if _history_saved_win == w and _history_last_live:
        return  # sudah tersimpan
    if not _history_last_live:
        print("[History] [!] auto_match_result diterima tapi belum ada live payload.")
        return
    save_match_history(_history_last_live, w)


async def broadcast(data):
    if not CONNECTED_CLIENTS:
        return
    # data bisa berupa JSON string (dari Frida send(JSON.stringify(...)))
    # atau dict. Jangan double-encode string agar overlay tidak perlu parse 2x.
    msg = data if isinstance(data, str) else json.dumps(data)
    disconnected = set()
    for client in list(CONNECTED_CLIENTS):
        try:
            await client.send(msg)
        except Exception:
            disconnected.add(client)
    CONNECTED_CLIENTS.difference_update(disconnected)

def on_message(message, data):
    global _history_last_live
    if message.get("type") == "send":
        payload = message.get("payload")
        if payload and loop:
            # Debug: catat semua payload sebelum broadcast (duplikat / tidak sesuai).
            try:
                parsed = json.loads(payload) if isinstance(payload, str) else payload
                # Frida agent mengirim JSON string berisi {type, payload/event/...}.
                # Normalisasi ke bentuk {type, ...} agar validator konsisten.
                if isinstance(parsed, dict):
                    _debug_log_payload(parsed)
                else:
                    _debug_log_payload({"type": "unknown_raw", "payload": str(parsed)[:2000]})
            except Exception:
                # payload bukan JSON (harusnya tidak terjadi) — tetap catat mentah.
                _debug_log_payload({"type": "unknown_raw", "payload": str(payload)[:2000]})
            # History: ingat live payload terakhir & simpan saat win ditentukan.
            try:
                obj = json.loads(payload) if isinstance(payload, str) else payload
                if isinstance(obj, dict):
                    ptype = obj.get("type")
                    if ptype == "mlbb_live_data":
                        _history_last_live = obj
                        handle_win_candidate(obj)
                    elif ptype == "auto_match_result":
                        handle_match_result(obj.get("winnerCamp"))
            except Exception as ex:
                print(f"[History] [!] parse payload error: {ex}")
            asyncio.run_coroutine_threadsafe(broadcast(payload), loop)
    elif message.get("type") == "error":
        print(f"[!] Error dari Frida agent: {message.get('stack', message)}")

async def ws_handler(websocket, path=None):
    CONNECTED_CLIENTS.add(websocket)
    remote_addr = websocket.remote_address
    print(f"[+] Client Overlay terhubung: {remote_addr}")
    try:
        await websocket.wait_closed()
    finally:
        CONNECTED_CLIENTS.remove(websocket)
        print(f"[-] Client Overlay terputus: {remote_addr}")

def setup_adb_forward():
    """Menjalankan perintah 'adb forward tcp:2626 tcp:2626' secara otomatis"""
    try:
        subprocess.check_call(
            ["adb", "forward", f"tcp:{FRIDA_PORT}", f"tcp:{FRIDA_PORT}"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )
        print(f"[+] ADB forward berhasil dikonfigurasi: tcp:{FRIDA_PORT} -> tcp:{FRIDA_PORT}")
        return True
    except (subprocess.CalledProcessError, FileNotFoundError) as e:
        print(f"[!] Gagal mengeksekusi ADB forward. Pastikan perangkat terhubung dan ADB terinstal. ({e})")
        return False

def find_target_pid(device):
    # 1. Cek via ADB ps -A
    try:
        res = subprocess.check_output(["adb", "shell", "ps -A"], stderr=subprocess.DEVNULL).decode("utf-8")
        for line in res.splitlines():
            if ":UnityKillsMe" in line or "com.mobilelegends" in line:
                parts = line.split()
                if len(parts) >= 2 and parts[1].isdigit():
                    if ":UnityKillsMe" in line:
                        return int(parts[1]), ":UnityKillsMe"
    except Exception:
        pass

    # 2. Fallback: Enumerate process via Frida Custom Port
    try:
        processes = device.enumerate_processes()
        for proc in processes:
            name_lower = proc.name.lower()
            if (
                ":unitykillsme" in name_lower 
                or "mobile legends" in name_lower 
                or "mobilelegends" in name_lower 
                or "com.mobile" in name_lower
            ):
                return proc.pid, proc.name
    except Exception:
        pass
    return None, None

def frida_worker():
    while True:
        try:
            if not os.path.exists(AGENT_PATH):
                print(f"[!] File {AGENT_PATH} belum ditemukan. Jalankan 'npm run build' terlebih dahulu.")
                time.sleep(3)
                continue
            
            # Otomatisasi ADB Forward sebelum inisialisasi koneksi Frida
            if not setup_adb_forward():
                time.sleep(3)
                continue
            
            print(f"[*] Menghubungkan ke Frida Server di 127.0.0.1:{FRIDA_PORT}...")
            device_manager = frida.get_device_manager()
            device = device_manager.add_remote_device(f"127.0.0.1:{FRIDA_PORT}")
            
            pid, name = find_target_pid(device)
            if not pid:
                print("[*] Menunggu proses target (:UnityKillsMe / MLBB) berjalan di perangkat...")
                time.sleep(2)
                continue

            print(f"[+] Menemukan proses target: {name} (PID: {pid}). Attaching Frida...")
            session = device.attach(pid)
            
            with open(AGENT_PATH, "r", encoding="utf-8") as f:
                script_code = f.read()
                
            script = session.create_script(script_code)
            script.on("message", on_message)
            script.load()
            print(f"[✔] Frida Agent berhasil dimuat ke PID {pid}! Mengirim telemetry data ke WebSocket...")

            def on_detached(reason, crash):
                print(f"[!] Frida terpisah (reason: {reason}). Mencoba hubungkan ulang...")
            
            session.on("detached", on_detached)

            # Menjaga thread tetap berjalan selama session aktif
            while not session.is_detached:
                time.sleep(1)
                
        except Exception as e:
            print(f"[!] Frida Worker error: {e}. Mencoba lagi dalam 3 detik...")
            time.sleep(3)

async def main():
    global loop, DEBUG, DEBUG_LOG_FILE
    loop = asyncio.get_running_loop()

    if DEBUG:
        print(f"[TelemetryDebug] ✅ DEBUG MODE AKTIF — semua payload akan dicatat.")
        print(f"[TelemetryDebug] 📝 Log file: {DEBUG_LOG_FILE}")
    else:
        print(f"[ℹ] Telemetry debug OFF. Aktifkan dengan: python3 server.py --debug")

    # Jalankan Frida Worker di Background Thread
    loop.run_in_executor(None, frida_worker)

    # Start WebSocket Server
    async with websockets.serve(ws_handler, "0.0.0.0", PORT):
        print(f"[🚀] WebSocket Server berjalan di ws://0.0.0.0:{PORT}")
        print(f"[ℹ] Overlay dapat terhubung ke ws://localhost:{PORT} atau IP lokal host ini.")
        await asyncio.Future()  # Run forever

if __name__ == "__main__":
    _parser = argparse.ArgumentParser(description="MLBB Telemetry WebSocket Server")
    _parser.add_argument("--debug", action="store_true", help="Aktifkan telemetry debug mode (catat semua payload, deteksi duplikat/tidak sesuai)")
    _parser.add_argument("--debug-log", default=None, help="Path file JSONL untuk debug log (default: telemetry_payload_debug.jsonl)")
    _parser.add_argument("--port", type=int, default=PORT, help="WebSocket port")
    _args = _parser.parse_args()
    if _args.debug:
        DEBUG = True
        os.environ["TELEMETRY_DEBUG"] = "1"
    if _args.debug_log:
        DEBUG_LOG_FILE = _args.debug_log
    if _args.port:
        PORT = _args.port
    _load_root_env()  # butuh VITE_SUPABASE_* untuk nama tim historyMatch
    os.makedirs(HISTORY_DIR, exist_ok=True)
    print(f"[History] 📁 Folder history: public/historyMatch/ (dibaca Endmatch)")
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n[*] Server dihentikan.")
        if DEBUG:
            print(f"[TelemetryDebug] 📊 Ringkasan: {json.dumps(_debug_stats, ensure_ascii=False)}")
        sys.exit(0)
