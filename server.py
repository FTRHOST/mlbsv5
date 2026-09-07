import asyncio
import json
import os
import sys
import time
import frida
import websockets

PORT = 8080
AGENT_PATH = os.path.join(os.path.dirname(__file__), "dist", "agent.js")

CONNECTED_CLIENTS = set()
loop = None


async def broadcast(data):
    if not CONNECTED_CLIENTS:
        return
    msg = json.dumps(data)
    disconnected = set()
    for client in list(CONNECTED_CLIENTS):
        try:
            await client.send(msg)
        except Exception:
            disconnected.add(client)

    CONNECTED_CLIENTS.difference_update(disconnected)


def on_message(message, data):
    if message.get("type") == "send":
        payload = message.get("payload")
        if payload and loop:
            asyncio.run_coroutine_threadsafe(broadcast(payload), loop)
    elif message.get("type") == "error":
        print(f"[!] Error from Frida agent: {message.get('stack', message)}")


async def ws_handler(websocket, path=None):
    CONNECTED_CLIENTS.add(websocket)
    remote_addr = websocket.remote_address
    print(f"[+] Client Overlay terhubung: {remote_addr}")
    try:
        await websocket.wait_closed()
    finally:
        CONNECTED_CLIENTS.remove(websocket)
        print(f"[-] Client Overlay terputus: {remote_addr}")


import subprocess

def find_target_pid(device):
    # 1. Cek via ADB ps -A (mencari sub-proses :UnityKillsMe atau package MLBB)
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

    # 2. Fallback: Enumerate process via Frida
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

            device = frida.get_usb_device(timeout=5)
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

            # Keep thread alive while session is active
            while not session.is_detached:
                time.sleep(1)

        except Exception as e:
            print(f"[!] Frida Worker error: {e}. Mencoba lagi dalam 3 detik...")
            time.sleep(3)


async def main():
    global loop
    loop = asyncio.get_running_loop()

    # Jalankan Frida Worker di Background Thread
    loop.run_in_executor(None, frida_worker)

    # Start WebSocket Server
    async with websockets.serve(ws_handler, "0.0.0.0", PORT):
        print(f"[🚀] WebSocket Server berjalan di ws://0.0.0.0:{PORT}")
        print(f"[ℹ] Overlay dapat terhubung ke ws://localhost:{PORT} atau IP lokal host ini.")
        await asyncio.Future()  # Run forever


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n[*] Server dihentikan.")
        sys.exit(0)
