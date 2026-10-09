#!/usr/bin/env python3
"""Otomatisasi pindah scene OBS berdasarkan key `gameState` dari telemetry MLBB.

Sumber data : WebSocket telemetry (telemetry/server.py, default ws://localhost:8080).
Kontrol OBS : OBS WebSocket v5 (OBS >= 28, Tools -> WebSocket Server Settings).

Mapping (sesuai permintaan):
    gameState 3 -> scene "mapdraw"       + transisi "Stinger"
    gameState 5 -> scene "draft-loading"  + transisi "Stinger"
    gameState 6 -> scene "match"          + transisi "Stinger"
    gameState 7 -> scene "victory"        + transisi "Move" (fallback "Stinger" bila belum ada)
    gameState 8 -> scene "end-match"      + transisi "Stinger"

Hanya bereaksi saat nilai BERUBAH (edge-trigger), bukan setiap tick ~1 detik.

Contoh:
    pip install websockets            # satu-satunya dependensi (sudah dipakai server.py)
    export OBS_WS_PASSWORD="rahasia"  # atau isi di .env (lihat .env.example)
    python scripts/auto_scene_switch.py
    python scripts/auto_scene_switch.py --dry-run   # tes tanpa menyentuh OBS
"""

from __future__ import annotations

import argparse
import asyncio
import base64
import hashlib
import json
import logging
import os
import re
import sys
import uuid

try:
    import websockets
except ImportError:  # pragma: no cover
    print("[!] Modul 'websockets' belum terinstal. Jalankan: pip install websockets",
          file=sys.stderr)
    sys.exit(1)

LOG = logging.getLogger("auto_scene")

# gameState -> (nama scene OBS, nama transisi OBS). Nama bersifat case-sensitive
# mengikuti scene_order di obs-source/intechfest.json.
SCENE_MAP: dict[int, tuple[str, str]] = {
    3: ("mapdraw", "Stinger"),
    5: ("draft-loading", "Stinger"),
    6: ("match", "Stinger"),
    7: ("victory", "Move"),
    8: ("end-match", "Stinger"),
}

FALLBACK_TRANSITION = "Stinger"  # dipakai bila transisi mapping tidak ada di OBS.

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def load_dotenv(path: str | None = None) -> None:
    """Loader .env minimal tanpa dependensi tambahan (KEY=VALUE, # komentar).

    Tidak menimpa variabel yang sudah ada di environment.
    """
    candidates = []
    if path:
        candidates.append(path)
    else:
        candidates.append(os.path.join(REPO_ROOT, ".env"))
    for fp in candidates:
        if not fp or not os.path.isfile(fp):
            continue
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
                    if len(v) >= 2 and ((v[0] == v[-1] == '"') or (v[0] == v[-1] == "'")):
                        v = v[1:-1]
                    os.environ[k] = v
        except OSError as e:
            LOG.warning("Gagal membaca %s: %s", fp, e)


def extract_game_state(raw: object) -> int | None:
    """Ambil `gameState` dari pesan telemetry dalam format apa pun.

    Meniru parseMlbbLiveData() di src/hooks/useRoomData.ts: pesan bisa berupa
    string JSON berlapis (server.py melakukan json.dumps di atas string payload
    Frida), objek {'type':'send','payload':...}, atau objek langsung
    {'gameState': N, ...}. Mengembalikan int atau None bila tidak ditemukan.
    """
    data: object = raw
    if isinstance(data, (bytes, bytearray)):
        try:
            data = bytes(data).decode("utf-8", errors="replace")
        except Exception:
            return None

    # Unwrap string JSON berlapis (maks. 3 level, sama seperti frontend).
    for _ in range(3):
        if isinstance(data, str):
            s = data.strip()
            if len(s) >= 2 and s[0] == '"' and s[-1] == '"':
                try:
                    data = json.loads(s)
                    continue
                except (json.JSONDecodeError, ValueError):
                    pass
            # Coba parse langsung; pola Python-repr "message: {...} data: None" juga didukung.
            parsed = _try_parse_text(s)
            if parsed is not None:
                data = parsed
                continue
        break
    if isinstance(data, str):  # masih string mentah -> coba sekali lagi
        parsed = _try_parse_text(data.strip())
        if parsed is not None:
            data = parsed

    # Telusuri wrapper send/mlbb_live_data sampai ketemu gameState.
    seen = 0
    while isinstance(data, dict) and seen < 6:
        seen += 1
        if "gameState" in data:
            try:
                return int(data["gameState"])  # type: ignore[arg-type]
            except (TypeError, ValueError):
                return None
        inner = data.get("payload", data.get("data"))
        if isinstance(inner, str):
            inner_parsed = _try_parse_text(inner.strip())
            data = inner_parsed if inner_parsed is not None else inner
            if isinstance(data, str):
                return None
            continue
        if isinstance(inner, dict):
            data = inner
            continue
        return None
    return None


def _try_parse_text(s: str) -> object | None:
    if not s:
        return None
    if s.startswith("message:"):
        s = s[len("message:"):].strip()
    idx = s.rfind(" data:")
    if idx != -1 and s[idx + len(" data:"):].strip() in ("None", "null", ""):
        s = s[:idx].strip()
    try:
        return json.loads(s)
    except (json.JSONDecodeError, ValueError):
        pass
    m = s.find('{"type"')
    if m != -1:
        try:
            return json.loads(s[m:])
        except (json.JSONDecodeError, ValueError):
            pass
        # Greedy: sampai '}' terakhir (meniru regex frontend), abaikan sisa Python-repr.
        tail = s[m:]
        end = tail.rfind("}")
        if end != -1:
            try:
                return json.loads(tail[: end + 1])
            except (json.JSONDecodeError, ValueError):
                pass
    # 4. Konversi Python-repr (single quote, None/True/False) seperti frontend.
    try:
        py = re.sub(r"\bNone\b", "null", s)
        py = re.sub(r"\bTrue\b", "true", py)
        py = re.sub(r"\bFalse\b", "false", py)

        def _sq_to_dq(mo: re.Match) -> str:
            inner = mo.group(1).replace('"', '\\"')
            return f'"{inner}"'

        py = re.sub(r"'([^'\\]*(?:\\.[^'\\]*)*)'", _sq_to_dq, py)
        parsed = json.loads(py)
        if isinstance(parsed, dict):
            return parsed
    except (json.JSONDecodeError, ValueError):
        pass
    return None


# ---------------------------------------------------------------- OBS WS v5 --
# Protokol: https://github.com/obsproject/obs-websocket/blob/master/docs/generated/protocol.md
# OpCode: Hello=0, Identify=1, Identified=2, Request=6, RequestResponse=7.

class ObsClient:
    def __init__(self, host: str, port: int, password: str, timeout: float = 10.0):
        self.url = f"ws://{host}:{port}"
        self.password = password
        self.timeout = timeout
        self.ws: websockets.WebSocketClientProtocol | None = None

    async def connect(self) -> None:
        LOG.info("Menghubungkan ke OBS WebSocket %s ...", self.url)
        self.ws = await websockets.connect(self.url, max_size=10 * 1024 * 1024)
        hello = await self._recv()
        if not hello or hello.get("op") != 0:
            raise ConnectionError(f"Hello OBS tidak valid: {hello}")
        await self._identify(hello.get("d", {}))
        LOG.info("Terhubung ke OBS.")

    async def close(self) -> None:
        ws, self.ws = self.ws, None
        if ws is not None:
            try:
                await ws.close()
            except Exception:
                pass

    async def _recv(self) -> dict:
        assert self.ws is not None
        msg = await asyncio.wait_for(self.ws.recv(), timeout=self.timeout)
        if isinstance(msg, (bytes, bytearray)):
            msg = bytes(msg).decode("utf-8", errors="replace")
        return json.loads(msg)

    async def _identify(self, hello_data: dict) -> None:
        auth_payload: dict = {"rpcVersion": 1}
        auth = hello_data.get("authentication")
        if auth:
            salt = auth.get("salt", "")
            challenge = auth.get("challenge", "")
            secret = base64.b64encode(
                hashlib.sha256((self.password + salt).encode("utf-8")).digest()
            ).decode("utf-8")
            auth_resp = base64.b64encode(
                hashlib.sha256((secret + challenge).encode("utf-8")).digest()
            ).decode("utf-8")
            auth_payload["authentication"] = auth_resp
            if not self.password:
                LOG.warning("OBS meminta password tapi OBS_WS_PASSWORD kosong.")
        assert self.ws is not None
        await self.ws.send(json.dumps({"op": 1, "d": auth_payload}))
        resp = await self._recv()
        if resp.get("op") != 2:
            raise ConnectionError(f"Identify OBS gagal: {resp}")

    async def request(self, request_type: str, request_data: dict | None = None) -> dict:
        assert self.ws is not None
        rid = str(uuid.uuid4())
        await self.ws.send(json.dumps({
            "op": 6,
            "d": {"requestType": request_type,
                  "requestId": rid,
                  "requestData": request_data or {}},
        }))
        while True:
            resp = await self._recv()
            if resp.get("op") == 5:  # Event OBS -> abaikan, tunggu response
                continue
            if resp.get("op") == 7 and resp.get("d", {}).get("requestId") == rid:
                return resp.get("d", {})
            # Pesan lain (mis. RequestBatchResponse) -> tunggu yang cocok.

    async def validate_setup(self) -> None:
        """Log peringatan bila scene/transisi mapping belum ada di OBS."""
        try:
            scenes = await self.request("GetSceneList")
            names = [s.get("sceneName") for s in scenes.get("responseData", {}).get("scenes", [])]
            LOG.info("Scene OBS tersedia: %s", ", ".join(names) or "(kosong)")
            for gs, (scene, _tr) in sorted(SCENE_MAP.items()):
                if scene not in names:
                    LOG.warning("gameState %d -> scene '%s' TIDAK ADA di OBS!", gs, scene)
        except Exception as e:
            LOG.warning("Gagal membaca daftar scene OBS: %s", e)
        try:
            trs = await self.request("GetSceneTransitionList")
            existing = [t.get("transitionName")
                        for t in trs.get("responseData", {}).get("transitions", [])]
            current = trs.get("responseData", {}).get("currentSceneTransitionName")
            LOG.info("Transisi OBS tersedia: %s (aktif: %s)", ", ".join(existing), current)
            for gs, (_scene, tr) in sorted(SCENE_MAP.items()):
                if tr not in existing:
                    LOG.warning(
                        "gameState %d -> transisi '%s' TIDAK ADA di OBS "
                        "(buat dulu; akan fallback ke '%s').", gs, tr, FALLBACK_TRANSITION)
        except Exception as e:
            LOG.warning("Gagal membaca daftar transisi OBS: %s", e)

    async def switch_scene(self, scene: str, transition: str, dry_run: bool = False) -> bool:
        if dry_run:
            LOG.info("[DRY-RUN] gameState -> scene '%s' (transisi '%s')", scene, transition)
            return True
        assert self.ws is not None
        # 1. Set transisi dulu agar kepakai saat scene berganti.
        for name in ([transition] if transition == FALLBACK_TRANSITION
                     else [transition, FALLBACK_TRANSITION]):
            r = await self.request("SetCurrentSceneTransition", {"transitionName": name})
            if r.get("requestStatus", {}).get("result"):
                if name != transition:
                    LOG.warning("Transisi '%s' tidak ada, memakai fallback '%s'.",
                                transition, FALLBACK_TRANSITION)
                break
            LOG.warning("Set transisi '%s' gagal: %s", name,
                        r.get("requestStatus", {}).get("comment"))
        else:
            return False
        # 2. Pindah scene program.
        r = await self.request("SetCurrentProgramScene", {"sceneName": scene})
        if r.get("requestStatus", {}).get("result"):
            LOG.info("Scene -> '%s' (transisi '%s')", scene, transition)
            return True
        LOG.error("Gagal pindah ke scene '%s': %s", scene,
                  r.get("requestStatus", {}).get("comment"))
        return False


async def telemetry_loop(url: str, on_state) -> None:
    """Terhubung ke telemetry WS selamanya; panggil on_state(int) tiap pesan valid."""
    backoff = 2.0
    while True:
        try:
            LOG.info("Menghubungkan ke telemetry %s ...", url)
            async with websockets.connect(url, max_size=10 * 1024 * 1024) as ws:
                LOG.info("Terhubung ke telemetry.")
                backoff = 2.0
                async for msg in ws:
                    try:
                        gs = extract_game_state(msg)
                    except Exception as e:
                        LOG.debug("Parse telemetry gagal: %s", e)
                        continue
                    if gs is not None:
                        await on_state(gs)
        except asyncio.CancelledError:
            raise
        except Exception as e:
            LOG.warning("Telemetry terputus (%s). Coba lagi dalam %.0f dtk ...", e, backoff)
            await asyncio.sleep(backoff)
            backoff = min(backoff * 1.5, 30.0)


async def amain(args: argparse.Namespace) -> int:
    obs = ObsClient(args.obs_host, args.obs_port, args.obs_password)
    if not args.dry_run:
        try:
            await obs.connect()
        except Exception as e:
            LOG.error("Tidak bisa terhubung ke OBS (%s). "
                      "Pastikan OBS terbuka + WebSocket Server aktif + password benar.", e)
            return 1
        await obs.validate_setup()
    else:
        LOG.info("[DRY-RUN] Melewati koneksi OBS.")

    last_state: int | None = None
    last_switch = 0.0

    async def on_state(gs: int) -> None:
        nonlocal last_state, last_switch
        if gs == last_state:
            return  # hanya saat BERUBAH
        last_state = gs
        mapping = SCENE_MAP.get(gs)
        if mapping is None:
            LOG.debug("gameState %d berubah (tidak ada mapping, diabaikan).", gs)
            return
        scene, transition = mapping
        now = asyncio.get_event_loop().time()
        if now - last_switch < args.min_interval:
            LOG.debug("Debounce: abaikan gameState %d (%.1fs sejak switch terakhir).",
                      gs, now - last_switch)
            return
        last_switch = now
        try:
            await obs.switch_scene(scene, transition, dry_run=args.dry_run)
        except Exception as e:
            LOG.error("Switch scene gagal: %s", e)

    try:
        await telemetry_loop(args.telemetry_ws, on_state)
    except KeyboardInterrupt:
        pass
    finally:
        await obs.close()
    return 0


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        description="Pindah scene OBS otomatis berdasarkan gameState telemetry MLBB.")
    p.add_argument("--telemetry-ws", default=os.environ.get("TELEMETRY_WS_URL", "ws://localhost:8080"),
                   help="URL WebSocket telemetry (default: $TELEMETRY_WS_URL atau ws://localhost:8080)")
    p.add_argument("--obs-host", default=os.environ.get("OBS_WS_HOST", "localhost"))
    p.add_argument("--obs-port", type=int, default=int(os.environ.get("OBS_WS_PORT", "4455")))
    p.add_argument("--obs-password", default=os.environ.get("OBS_WS_PASSWORD", ""),
                   help="Password OBS WebSocket (default: $OBS_WS_PASSWORD)")
    p.add_argument("--dry-run", action="store_true",
                   help="Hanya log tanpa benar-benar memindah scene OBS.")
    p.add_argument("--min-interval", type=float, default=1.5,
                   help="Jeda minimum antar switch scene dalam detik (default: 1.5).")
    p.add_argument("--env-file", default=None,
                   help="Path file .env (default: <repo>/.env).")
    p.add_argument("-v", "--verbose", action="store_true")
    return p


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    load_dotenv(args.env_file)
    # Baca ulang kredensial setelah .env dimuat (argumen CLI tetap menang).
    if args.obs_password == parser.get_default("obs_password"):
        args.obs_password = os.environ.get("OBS_WS_PASSWORD", "")
    if args.obs_host == parser.get_default("obs_host"):
        args.obs_host = os.environ.get("OBS_WS_HOST", "localhost")
    try:
        if args.obs_port == parser.get_default("obs_port"):
            args.obs_port = int(os.environ.get("OBS_WS_PORT", "4455"))
    except ValueError:
        pass
    if args.telemetry_ws == parser.get_default("telemetry_ws"):
        args.telemetry_ws = os.environ.get("TELEMETRY_WS_URL", "ws://localhost:8080")
    logging.basicConfig(level=logging.DEBUG if args.verbose else logging.INFO,
                        format="%(asctime)s [%(levelname)s] %(message)s",
                        datefmt="%H:%M:%S")
    try:
        return asyncio.run(amain(args))
    except KeyboardInterrupt:
        LOG.info("Dihentikan.")
        return 0


if __name__ == "__main__":
    sys.exit(main())
