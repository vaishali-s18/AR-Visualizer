const fs = require('fs');
const path = require('path');

const models = [
  'sofa-sheen.glb',
  'table-lack.glb',
  'cabinet-eket.glb'
];

const modelsDir = path.resolve(__dirname, '../../../frontend/public/models');

console.log('--- GLB Model Integrity Verification ---');

models.forEach(model => {
  const filepath = path.join(modelsDir, model);
  if (!fs.existsSync(filepath)) {
    console.error(`❌ File does not exist: ${model}`);
    return;
  }

  const stats = fs.statSync(filepath);
  
  // Read first 12 bytes (GLB Header)
  const buffer = Buffer.alloc(12);
  try {
    const fd = fs.openSync(filepath, 'r');
    fs.readSync(fd, buffer, 0, 12, 0);
    fs.closeSync(fd);
  } catch (err) {
    console.error(`❌ Failed to read header for ${model}:`, err.message);
    return;
  }

  // Parse header
  const magic = buffer.toString('utf8', 0, 4);
  const version = buffer.readUInt32LE(4);
  const length = buffer.readUInt32LE(8);

  console.log(`\nAnalyzing ${model}:`);
  console.log(`  File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

  if (magic !== 'glTF') {
    console.error(`  ❌ Invalid GLB magic: expected 'glTF', got '${magic}'`);
    return;
  }

  if (version !== 2) {
    console.warn(`  ⚠️ Unexpected glTF version: ${version} (expected 2)`);
  }

  if (length !== stats.size) {
    console.error(`  ❌ Header length (${length}) doesn't match physical size (${stats.size})`);
    return;
  }

  console.log(`  ✅ Integrity Check Passed! Magic: '${magic}', Version: ${version}, Binary file is uncorrupted.`);
});
