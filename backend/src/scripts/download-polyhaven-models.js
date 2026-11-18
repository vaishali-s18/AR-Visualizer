import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.resolve(__dirname, '../../frontend/public/models');

const ASSETS = [
  'ArmChair_01',
  'GreenChair_01',
  'GothicBed_01',
  'GothicCabinet_01',
  'GothicCommode_01',
  'Lantern_01',
  'Ottoman_01',
  'desk_lamp_arm_01',
  'Chandelier_01',
  'Chandelier_02',
  'ClassicConsole_01',
  'ClassicNightstand_01',
  'CoffeeTable_01',
  'Sofa_01',
  'antique_ceramic_vase_01',
  'WoodenChair_01',
  'Rockingchair_01',
  'Shelf_01'
];

async function downloadFile(url, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  const arrayBuffer = await res.arrayBuffer();
  fs.writeFileSync(dest, Buffer.from(arrayBuffer));
}

async function fetchAsset(assetId) {
  console.log(`\nFetching metadata for ${assetId}...`);
  try {
    const res = await fetch(`https://api.polyhaven.com/files/${assetId}`);
    if (!res.ok) {
      console.warn(`Could not get files for ${assetId}: ${res.status}`);
      return;
    }
    const data = await res.json();
    const gltfRes = data.gltf?.['1k'] || data.gltf?.['2k'] || data.gltf?.['4k'];
    if (!gltfRes) {
      console.warn(`No GLTF format found for ${assetId}`);
      return;
    }

    const gltfInfo = gltfRes.gltf;
    const targetDir = path.join(OUTPUT_DIR, assetId);
    fs.mkdirSync(targetDir, { recursive: true });

    // Download main .gltf
    const mainGltfPath = path.join(targetDir, `${assetId}.gltf`);
    console.log(`Downloading ${assetId}.gltf...`);
    await downloadFile(gltfInfo.url, mainGltfPath);

    // Download includes (bin + textures)
    const includes = gltfInfo.include || {};
    for (const [relPath, incData] of Object.entries(includes)) {
      const destPath = path.join(targetDir, relPath);
      console.log(`  Downloading ${relPath}...`);
      await downloadFile(incData.url, destPath);
    }

    console.log(`✅ ${assetId} downloaded successfully!`);
  } catch (err) {
    console.error(`Error downloading ${assetId}:`, err.message);
  }
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  for (const asset of ASSETS) {
    await fetchAsset(asset);
  }
  console.log('\n🎉 Finished downloading Poly Haven models!');
}

main();
