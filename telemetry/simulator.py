import asyncio
import json
import os
import sys
import websockets

PORT = 8080
CONNECTED_CLIENTS = set()
DATA_FILE = "data.json"


def load_live_data():
    """Fungsi untuk membaca data dari file JSON eksternal secara realtime"""
    if not os.path.exists(DATA_FILE):
        print(
            f"[⚠️] Peringatan: File '{DATA_FILE}' tidak ditemukan! Membuat file template baru..."
        )
        # Template standar jika file hilang
        template = {"type": "mlbb_live_data", "payload": {}}
        with open(DATA_FILE, "w") as f:
            json.dump(template, f, indent=4)
        return template

    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except json.JSONDecodeError:
        # Jika Anda sedang mengetik dan file json belum selesai di-save/error
        print(
            "[⚠️] Gagal membaca JSON (Format tidak valid). Memakai data cache sebelumnya..."
        )
        return None
    except Exception as e:
        print(f"[❌] Error membaca file: {e}")
        return None


async def send_telemetry_loop():
    """Fungsi loop yang mengirimkan data simulasi secara berkala (real-time)"""
    last_data_str = ""

    while True:
        if CONNECTED_CLIENTS:
            current_data = load_live_data()

            if current_data is not None:
                msg = json.dumps(current_data)

                # Deteksi apakah data berubah dari detik sebelumnya
                if msg != last_data_str:
                    print("[🔄] [Simulasi] Mendeteksi perubahan data baru!")
                    last_data_str = msg

                disconnected = set()
                for client in list(CONNECTED_CLIENTS):
                    try:
                        await client.send(msg)
                    except Exception:
                        disconnected.add(client)

                CONNECTED_CLIENTS.difference_update(disconnected)
                print(
                    f"[*] [Simulasi Telemetry] Mengirim data terbaru ke {len(CONNECTED_CLIENTS)} client..."
                )

        # Cek dan kirim perubahan setiap 1 detik
        await asyncio.sleep(1)


async def ws_handler(websocket, path=None):
    CONNECTED_CLIENTS.add(websocket)
    remote_addr = websocket.remote_address
    print(f"[+] [SIMULATOR] Client Overlay Terhubung: {remote_addr}")

    # Kirim data langsung begitu client pertama kali terkoneksi
    init_data = load_live_data()
    if init_data:
        try:
            await websocket.send(json.dumps(init_data))
        except Exception:
            pass

    try:
        await websocket.wait_closed()
    finally:
        CONNECTED_CLIENTS.remove(websocket)
        print(f"[-] [SIMULATOR] Client Overlay Terputus: {remote_addr}")


async def main():
    # Jalankan loop pengiriman data di background task
    asyncio.create_task(send_telemetry_loop())

    # Start WebSocket Server Simulator
    async with websockets.serve(ws_handler, "0.0.0.0", PORT):
        print(f"[🚀] SIMULATOR RUNNING: ws://0.0.0.0:{PORT}")
        print(f"[ℹ] Buka overlay Anda, lalu arahkan ke ws://localhost:{PORT}")
        print(
            f"[💡] Untuk mengubah data, EDIT langsung file '{DATA_FILE}' tanpa perlu restart script!"
        )
        await asyncio.Future()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n[*] Simulator dihentikan.")
        sys.exit(0)
