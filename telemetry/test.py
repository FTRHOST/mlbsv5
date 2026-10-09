import asyncio
import json
import sys
import websockets

PORT = 8080
CONNECTED_CLIENTS = set()

# ==============================================================================
# DATA SIMULASI (Ubah isi payload di bawah ini untuk testing)
# ==============================================================================
TEST_DATA = {
    "type": "mlbb_live_data",
    "payload": {
        "gameState": 3,
        "draftPhase": "BANNING",
        "draftTimer": 20,
        "mapDraw": 4,
        "players": [
            {
                "ipos": 1,
                "id": "2178663653",
                "name": "petwir-kepo",
                "role": 1,
                "team": 1,
                "heroid": 1,
                "uiHeroIDChoose": 0,
                "battleSpell": 20030,
                "emblem": 20001,
                "emblemSkills": [],
                "pickPhase": True,
                "banPhase": False,
                "SelHeroID": 100,
                "banHero": 6,
                "hp": 3530,
                "maxHp": 3530,
                "level": 9,
                "deathTime": 0,
                "kill": 0,
                "dead": 0,
                "assist": 0,
                "ultActive": False,
                "equips": [2305, 3002, 3005, 3003, 3015, 3008],
                "totalGold": 13330,
                "damageDealt": 0,
                "damageTaken": 0
            },
            {
                "ipos": 2,
                "id": "492814263104",
                "name": "Computer",
                "role": 2,
                "team": 1,
                "heroid": 2,
                "uiHeroIDChoose": 0,
                "battleSpell": 20020,
                "emblem": 0,
                "emblemSkills": [],
                "pickPhase": False,
                "banPhase": False,
                "SelHeroID": 2,
                "banHero": 0,
                "hp": 2286,
                "maxHp": 2558,
                "level": 1,
                "deathTime": 0,
                "kill": 0,
                "dead": 0,
                "assist": 0,
                "ultActive": False,
                "equips": [1411, 0, 0, 0, 0, 0],
                "totalGold": 330,
                "damageDealt": 3170,
                "damageTaken": 357
            },
            {
                "ipos": 3,
                "id": "493882829328",
                "name": "Computer",
                "role": 3,
                "team": 1,
                "heroid": 19,
                "uiHeroIDChoose": 0,
                "battleSpell": 20150,
                "emblem": 0,
                "emblemSkills": [],
                "pickPhase": False,
                "banPhase": False,
                "SelHeroID": 19,
                "banHero": 0,
                "hp": 1282,
                "maxHp": 2750,
                "level": 1,
                "deathTime": 0,
                "kill": 0,
                "dead": 0,
                "assist": 0,
                "ultActive": False,
                "equips": [1513, 0, 0, 0, 0, 0],
                "totalGold": 418,
                "damageDealt": 882,
                "damageTaken": 1877
            },
            {
                "ipos": 4,
                "id": "493882828592",
                "name": "Computer",
                "role": 4,
                "team": 1,
                "heroid": 22,
                "uiHeroIDChoose": 0,
                "battleSpell": 20150,
                "emblem": 115,
                "emblemSkills": [],
                "pickPhase": False,
                "banPhase": False,
                "SelHeroID": 22,
                "banHero": 0,
                "hp": 1998,
                "maxHp": 2550,
                "level": 1,
                "deathTime": 0,
                "kill": 0,
                "dead": 0,
                "assist": 0,
                "ultActive": False,
                "equips": [1301, 0, 0, 0, 0, 0],
                "totalGold": 405,
                "damageDealt": 1757,
                "damageTaken": 591
            },
            {
                "ipos": 5,
                "id": "4",
                "name": "Computer",
                "role": 5,
                "team": 1,
                "heroid": 66,
                "uiHeroIDChoose": 0,
                "battleSpell": 20150,
                "emblem": 0,
                "emblemSkills": [],
                "pickPhase": False,
                "banPhase": False,
                "SelHeroID": 66,
                "banHero": 0,
                "hp": 2525,
                "maxHp": 2525,
                "level": 2,
                "deathTime": 0,
                "kill": 0,
                "dead": 0,
                "assist": 0,
                "ultActive": False,
                "equips": [1301, 0, 0, 0, 0, 0],
                "totalGold": 481,
                "damageDealt": 2916,
                "damageTaken": 0
            },
            {
                "ipos": 6,
                "id": "5",
                "name": "Computer",
                "role": 1,
                "team": 2,
                "heroid": 2,
                "uiHeroIDChoose": 0,
                "battleSpell": 20020,
                "emblem": 0,
                "emblemSkills": [],
                "pickPhase": False,
                "banPhase": False,
                "SelHeroID": 2,
                "banHero": 0,
                "hp": 2558,
                "maxHp": 2558,
                "level": 1,
                "deathTime": 0,
                "kill": 0,
                "dead": 0,
                "assist": 0,
                "ultActive": False,
                "equips": [1411, 0, 0, 0, 0, 0],
                "totalGold": 330,
                "damageDealt": 0,
                "damageTaken": 0
            },
            {
                "ipos": 7,
                "id": "492814262896",
                "name": "Computer",
                "role": 2,
                "team": 2,
                "heroid": 22,
                "uiHeroIDChoose": 0,
                "battleSpell": 20040,
                "emblem": 114,
                "emblemSkills": [],
                "pickPhase": False,
                "banPhase": False,
                "SelHeroID": 22,
                "banHero": 0,
                "hp": 2306,
                "maxHp": 2550,
                "level": 1,
                "deathTime": 0,
                "kill": 0,
                "dead": 0,
                "assist": 0,
                "ultActive": False,
                "equips": [1301, 0, 0, 0, 0, 0],
                "totalGold": 330,
                "damageDealt": 657,
                "damageTaken": 313
            },
            {
                "ipos": 8,
                "id": "494066780160",
                "name": "Computer",
                "role": 3,
                "team": 2,
                "heroid": 38,
                "uiHeroIDChoose": 0,
                "battleSpell": 20040,
                "emblem": 0,
                "emblemSkills": [],
                "pickPhase": False,
                "banPhase": False,
                "SelHeroID": 38,
                "banHero": 0,
                "hp": 2219,
                "maxHp": 2380,
                "level": 1,
                "deathTime": 0,
                "kill": 0,
                "dead": 0,
                "assist": 0,
                "ultActive": False,
                "equips": [1301, 0, 0, 0, 0, 0],
                "totalGold": 330,
                "damageDealt": 224,
                "damageTaken": 169
            },
            {
                "ipos": 9,
                "id": "8",
                "name": "Computer",
                "role": 4,
                "team": 2,
                "heroid": 18,
                "uiHeroIDChoose": 0,
                "battleSpell": 20150,
                "emblem": 0,
                "emblemSkills": [],
                "pickPhase": False,
                "banPhase": False,
                "SelHeroID": 18,
                "banHero": 0,
                "hp": 2320,
                "maxHp": 2320,
                "level": 1,
                "deathTime": 0,
                "kill": 0,
                "dead": 0,
                "assist": 0,
                "ultActive": False,
                "equips": [1301, 0, 0, 0, 0, 0],
                "totalGold": 330,
                "damageDealt": 723,
                "damageTaken": 0
            },
            {
                "ipos": 10,
                "id": "494066781440",
                "name": "Computer",
                "role": 5,
                "team": 2,
                "heroid": 0,
                "uiHeroIDChoose": 0,
                "battleSpell": 20150,
                "emblem": 0,
                "emblemSkills": [],
                "pickPhase": False,
                "banPhase": False,
                "SelHeroID": 10,
                "banHero": 0,
                "hp": 2551,
                "maxHp": 2600,
                "level": 1,
                "deathTime": 0,
                "kill": 0,
                "dead": 0,
                "assist": 0,
                "ultActive": False,
                "equips": [1512, 0, 0, 0, 0, 0],
                "totalGold": 364,
                "damageDealt": 1154,
                "damageTaken": 86
            }
        ],
        "Battle": {
            "battleState": 6,
            "versionInGame": "2.2.22.1242.1.2861114",
            "winCamp": 1,
            "waktuPertandingan": 41,
            "blueTeamKill": 0,
            "redTeamKill": 0,
            "blueTeamGold": 14964,
            "redTeamGold": 1684,
            "blueTeamKillLord": 0,
            "redTeamKillLord": 0,
            "blueTeamKillTurtle": 0,
            "redTeamKillTurtle": 0,
            "turtleAlive": False,
            "lordAlive": False,
            "blueTeamDestroyTuret": 0,
            "redTeamDestroyTuret": 0
        }
    }
}
# ==============================================================================

async def send_telemetry_loop():
    """Fungsi loop yang mengirimkan data simulasi secara berkala (real-time)"""
    while True:
        if CONNECTED_CLIENTS:
            # Mengemas payload agar persis dengan format keluaran Frida Agent Anda
            msg = json.dumps(TEST_DATA)
            
            disconnected = set()
            for client in list(CONNECTED_CLIENTS):
                try:
                    await client.send(msg)
                except Exception:
                    disconnected.add(client)
            CONNECTED_CLIENTS.difference_update(disconnected)
            
            print(f"[*] [Simulasi Telemetry] Mengirim data terbaru ke {len(CONNECTED_CLIENTS)} client...")
        
        # Kirim data setiap 1 detik sekali (mirip pengiriman real-time dari game)
        await asyncio.sleep(1)

async def ws_handler(websocket, path=None):
    CONNECTED_CLIENTS.add(websocket)
    remote_addr = websocket.remote_address
    print(f"[+] [SIMULATOR] Client Overlay Terhubung: {remote_addr}")
    
    # Kirim data langsung begitu client pertama kali terkoneksi
    try:
        await websocket.send(json.dumps(TEST_DATA))
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
        print(f"[💡] Untuk mengubah data, edit langsung variabel TEST_DATA di script ini dan restart.")
        await asyncio.Future()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n[*] Simulator dihentikan.")
        sys.exit(0)

