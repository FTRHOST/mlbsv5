import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LANE_DIR = path.join(__dirname, "../public/assets/lane");

fs.mkdirSync(LANE_DIR, { recursive: true });

// Fallback mapping hasil analisis https://www.mobilelegends.com/hero/detail?channelid=3309114&heroid=133
// source: POST https://api.gms.moontontech.com/api/gms/source/2669606/2756564
const FALLBACK = {
  1: "https://akmweb.youngjoygame.com/web/gms/image/6a246099f7eb83a8856306d8b4c84fc2.svg", // Exp Lane
  2: "https://akmweb.youngjoygame.com/web/gms/image/facab1eacb218d767b5acb80304bfafd.svg", // Mid Lane
  3: "https://akmweb.youngjoygame.com/web/gms/image/a3dbb075b4d8186c29f02f7d47da236a.svg", // Roam
  4: "https://akmweb.youngjoygame.com/web/gms/image/de611167c7310681135f0b4198137bfa.svg", // Jungle (hero 133 Hirara)
  5: "https://akmweb.youngjoygame.com/web/gms/image/91f817c656908a83c2e24eecb3b70986.svg", // Gold Lane
};

async function fetchLaneMapFromApi() {
  const res = await fetch("https://api.gms.moontontech.com/api/gms/source/2669606/2756564", {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      "x-appid": "2669606",
      "x-actid": "2669607",
      "x-lang": "en",
      Referer: "https://www.mobilelegends.com/",
    },
    body: JSON.stringify({ pageSize: 200, pageIndex: 1, filters: [], sorts: [], object: [] }),
  });
  if (!res.ok) throw new Error(`API status ${res.status}`);
  const json = await res.json();
  const records = json.data?.records || [];
  const map = {};
  for (const r of records) {
    const roadsort = r.data?.hero?.data?.roadsort || [];
    for (const rs of roadsort) {
      const icon = rs?.data?.road_sort_icon;
      const id = rs?.data?.road_sort_id;
      const title = rs?.data?.road_sort_title;
      if (id && icon && !map[id]) map[id] = { url: icon, title };
    }
  }
  return map;
}

async function downloadFile(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  // validasi ringan: svg harus diawali <svg
  const head = buf.subarray(0, 200).toString("utf8");
  if (!head.includes("<svg")) throw new Error(`Bukan SVG valid: ${url}`);
  fs.writeFileSync(destPath, buf);
}

async function main() {
  console.log("🚀 Download road_sort_icon ke public/assets/lane/[road_sort_id].svg ...");

  let laneMap = {};
  try {
    console.log("📥 Fetch lane map dari Moonton API...");
    laneMap = await fetchLaneMapFromApi();
    console.log(`Ditemukan ${Object.keys(laneMap).length} lane dari API.`);
  } catch (e) {
    console.warn(`⚠️ Gagal fetch API (${e.message}), pakai fallback hardcoded.`);
  }
  if (Object.keys(laneMap).length === 0) {
    for (const [id, url] of Object.entries(FALLBACK)) laneMap[id] = { url, title: "fallback" };
  }

  let ok = 0;
  for (const [id, { url, title }] of Object.entries(laneMap)) {
    const dest = path.join(LANE_DIR, `${id}.svg`);
    try {
      await downloadFile(url, dest);
      console.log(`✅ [${id}] ${title} -> ${url} -> assets/lane/${id}.svg`);
      ok++;
    } catch (e) {
      console.error(`❌ [${id}] gagal:`, e.message);
    }
  }
  console.log(`🎉 Selesai: ${ok}/${Object.keys(laneMap).length} file tersimpan di ${LANE_DIR}`);
}

main().catch((e) => {
  console.error("❌ Error:", e);
  process.exit(1);
});
