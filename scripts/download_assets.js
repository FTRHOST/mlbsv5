import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, "../public");
const HEROES_DIR = path.join(PUBLIC_DIR, "assets/heroes-icon");
const EQUIPS_DIR = path.join(PUBLIC_DIR, "assets/equips");
const HEROES_SMALLMAP_DIR = path.join(PUBLIC_DIR, "assets/heroes");

// Ensure directories exist
fs.mkdirSync(HEROES_DIR, { recursive: true });
fs.mkdirSync(EQUIPS_DIR, { recursive: true });
fs.mkdirSync(HEROES_SMALLMAP_DIR, { recursive: true });

async function downloadFile(url, destPath) {
  if (!url) return false;
  try {
    const res = await fetch(url);
    if (!res.ok) return false;
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(destPath, buffer);
    return true;
  } catch (err) {
    console.error(`Failed to download ${url}:`, err.message);
    return false;
  }
}

async function main() {
  console.log("🚀 Starting Mobile Legends asset downloader (No Duplicates)...");

  // 1. Download Heroes Heads (Single file per ID: {heroId}.png)
  console.log("📥 Fetching hero list from Moonton API...");
  const heroRes = await fetch("https://api.gms.moontontech.com/api/gms/source/2713644/2766683", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ fields: ["hero_id", "head"], pageSize: 500 })
  });
  const heroData = await heroRes.json();
  const heroes = heroData.data?.records || [];
  console.log(`Found ${heroes.length} heroes. Downloading to ${HEROES_DIR}...`);

  let heroSuccess = 0;
  for (const item of heroes) {
    const heroId = item.data?.hero_id;
    const headUrl = item.data?.head;
    if (!heroId || !headUrl) continue;

    const targetPath = path.join(HEROES_DIR, `${heroId}.png`);
    if (fs.existsSync(targetPath)) {
      heroSuccess++;
      continue;
    }

    const ok = await downloadFile(headUrl, targetPath);
    if (ok) heroSuccess++;
  }
  console.log(`✅ ${heroSuccess}/${heroes.length} hero head icons ready.`);

  // 2. Download Equip Icons (Single file per ID: {equipId}.png)
  console.log("📥 Fetching equipment list from Moonton API...");
  const equipRes = await fetch("https://api.gms.moontontech.com/api/gms/source/2713644/2775075", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ fields: ["equipid", "equipname", "equipicon"], pageSize: 500 })
  });
  const equipData = await equipRes.json();
  const equips = equipData.data?.records || [];
  console.log(`Found ${equips.length} equipment items. Downloading to ${EQUIPS_DIR}...`);

  let equipSuccess = 0;
  for (const item of equips) {
    const equipId = item.data?.equipid;
    const iconUrl = item.data?.equipicon;
    if (!equipId || !iconUrl) continue;

    const targetPath = path.join(EQUIPS_DIR, `${equipId}.png`);
    if (fs.existsSync(targetPath)) {
      equipSuccess++;
      continue;
    }

    const ok = await downloadFile(iconUrl, targetPath);
    if (ok) equipSuccess++;
  }
  console.log(`✅ ${equipSuccess}/${equips.length} equipment icons ready.`);

  // 3. Download Hero Smallmap (Single file per ID: {heroId}.png -> assets/heroes/)
  // Sumber: hero.data.smallmap dari API hero-detail (sama seperti road_sort_icon)
  // POST https://api.gms.moontontech.com/api/gms/source/2669606/2756564
  console.log("📥 Fetching hero smallmap list from Moonton API...");
  const smallmapRes = await fetch("https://api.gms.moontontech.com/api/gms/source/2669606/2756564", {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      "x-appid": "2669606",
      "x-actid": "2669607",
      "x-lang": "en",
    },
    body: JSON.stringify({ pageSize: 200, pageIndex: 1, filters: [], sorts: [], object: [] })
  });
  const smallmapData = await smallmapRes.json();
  const smallmapRecords = smallmapData.data?.records || [];
  console.log(`Found ${smallmapRecords.length} heroes. Downloading smallmap to ${HEROES_SMALLMAP_DIR}...`);

  let smallmapSuccess = 0;
  for (const item of smallmapRecords) {
    const heroData = item.data?.hero?.data;
    const heroId = heroData?.heroid;
    const smallmapUrl = heroData?.smallmap;
    if (!heroId || !smallmapUrl) continue;

    const targetPath = path.join(HEROES_SMALLMAP_DIR, `${heroId}.png`);
    if (fs.existsSync(targetPath)) {
      smallmapSuccess++;
      continue;
    }

    const ok = await downloadFile(smallmapUrl, targetPath);
    if (ok) smallmapSuccess++;
  }
  console.log(`✅ ${smallmapSuccess}/${smallmapRecords.length} hero smallmaps ready.`);
  console.log("🎉 All assets stored cleanly with zero duplication!");
}

main().catch(err => {
  console.error("❌ Error downloading assets:", err);
});
