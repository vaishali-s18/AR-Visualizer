/**
 * convert-gltf-to-glb.cjs
 * Converts every .gltf file in public/models/ subfolders into a single
 * self-contained .glb file placed directly in public/models/.
 *
 * Run:  node frontend/scripts/convert-gltf-to-glb.cjs
 */

const { execSync } = require('child_process');
const fs   = require('fs');
const path = require('path');

const MODELS_DIR = path.join(__dirname, '..', 'public', 'models');

function findGltfFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...findGltfFiles(full));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.gltf')) results.push(full);
  }
  return results;
}

const gltfFiles = findGltfFiles(MODELS_DIR);

if (gltfFiles.length === 0) {
  console.log('No .gltf files found — nothing to convert.');
  process.exit(0);
}

console.log(`Found ${gltfFiles.length} .gltf file(s) to convert:\n`);

let ok = 0, skip = 0, fail = 0;

for (const gltfPath of gltfFiles) {
  const folderName = path.basename(path.dirname(gltfPath));
  const outGlb = path.join(MODELS_DIR, `${folderName}.glb`);

  if (fs.existsSync(outGlb)) {
    const gltfMtime = fs.statSync(gltfPath).mtimeMs;
    const glbMtime  = fs.statSync(outGlb).mtimeMs;
    if (glbMtime > gltfMtime) {
      console.log(`  ✓ SKIP   ${folderName}.glb  (already up-to-date)`);
      skip++; continue;
    }
  }

  const cmd = `gltf-pipeline -i "${gltfPath}" -o "${outGlb}"`;
  process.stdout.write(`  ⟳  ${folderName}  →  ${folderName}.glb  ...`);

  try {
    execSync(cmd, { stdio: 'pipe' });
    const sizeMb = (fs.statSync(outGlb).size / 1024 / 1024).toFixed(2);
    console.log(`  ✅  ${sizeMb} MB`);
    ok++;
  } catch (err) {
    console.log(`  ❌  FAILED — ${err.stderr?.toString().trim() || err.message}`);
    fail++;
  }
}

console.log(`\n─────────────────────────────────`);
console.log(`✅ ${ok} converted   ⏭ ${skip} skipped   ❌ ${fail} failed`);
if (ok > 0) console.log(`\nGLBs written to: ${MODELS_DIR}`);
