/**
 * Download Missing Models Script
 * Downloads specific furniture GLBs from Sketchfab (CC0 license) to fill
 * the gaps in the AR Interior Design Visualizer catalogue.
 *
 * Missing model types:
 *  - Bed (for Beds category)
 *  - Vase / decorative pot (for Decor - Terracotta Vase Set)
 *  - Mirror / decorative frame (for Decor - Geometric Wall Mirror)
 *
 * Run from the backend folder:
 *   node src/scripts/download-missing-models.js
 */

const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const { pipeline } = require('stream/promises');

const SKETCHFAB_TOKEN = process.env.SKETCHFAB_TOKEN || 'ebd4b4dd774f4fb9ab963714050d237e';
const OUTPUT_DIR = path.resolve(__dirname, '../../../frontend/public/models');

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const fetchJson = async (url, options = {}) => {
  const res = await fetch(url, options);
  const body = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}\nURL: ${url}\n${body}`);
  return JSON.parse(body);
};

const fetchJsonWithRetry = async (url, options = {}, retries = 5) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fetchJson(url, options);
    } catch (err) {
      if (!err.message.startsWith('429') || attempt === retries) throw err;
      const ms = 1500 * Math.pow(2, attempt);
      console.warn(`  Rate-limited. Retrying in ${ms}ms...`);
      await delay(ms);
    }
  }
};

const downloadFile = async (url, dest) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${res.status} ${url}`);
  await pipeline(res.body, fs.createWriteStream(dest));
};

const fileExists = async (p) => {
  try { await fsPromises.access(p); return true; } catch { return false; }
};

const sanitize = (s) =>
  String(s).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '').replace(/-+/g, '-').replace(/(^-|-$)/g, '');

/**
 * Search Sketchfab for a CC0-licensed downloadable model matching `query`.
 * Returns { uid, name, filename } of the first valid match.
 */
const findAndDownload = async (categorySlug, query, outputFileName) => {
  const destPath = path.join(OUTPUT_DIR, outputFileName);
  if (await fileExists(destPath)) {
    console.log(`  ✓ Already exists: ${outputFileName}`);
    return outputFileName;
  }

  console.log(`\n🔍 Searching Sketchfab for: "${query}"`);
  const searchUrl = new URL('https://api.sketchfab.com/v3/search');
  searchUrl.searchParams.set('type', 'models');
  searchUrl.searchParams.set('q', query);
  searchUrl.searchParams.set('downloadable', 'true');
  searchUrl.searchParams.set('license', 'cc0');
  searchUrl.searchParams.set('page_size', '24');

  const headers = { Authorization: `Token ${SKETCHFAB_TOKEN}` };

  let searchData;
  try {
    searchData = await fetchJsonWithRetry(searchUrl.toString(), { headers });
  } catch (err) {
    console.warn(`  ⚠ Search failed for "${query}": ${err.message}`);
    return null;
  }

  const results = searchData?.results || [];
  if (results.length === 0) {
    console.warn(`  ⚠ No results for "${query}"`);
    return null;
  }

  for (const item of results) {
    const uid = item.uid;
    const name = item.name || uid;

    // Verify details & license
    let details;
    try {
      details = await fetchJsonWithRetry(`https://api.sketchfab.com/v3/models/${uid}`, { headers });
      await delay(300);
    } catch {
      continue;
    }

    if (!details.isDownloadable) continue;
    const licSlug = String(details.license?.slug || '').toLowerCase();
    const licLabel = String(details.license?.label || '').toLowerCase();
    if (!licSlug.includes('cc0') && !licLabel.includes('cc0')) {
      console.log(`  Skip "${name}" — license: ${licLabel || licSlug}`);
      continue;
    }

    // Get download URL
    let dlData;
    try {
      dlData = await fetchJsonWithRetry(`https://api.sketchfab.com/v3/models/${uid}/download`, { headers });
      await delay(300);
    } catch {
      continue;
    }

    const glbUrl = dlData?.glb?.url;
    if (!glbUrl) {
      console.log(`  Skip "${name}" — no GLB URL`);
      continue;
    }

    console.log(`  ↓ Downloading "${name}" → ${outputFileName}`);
    try {
      await downloadFile(glbUrl, destPath);
      console.log(`  ✅ Saved: ${outputFileName}`);
      return outputFileName;
    } catch (err) {
      console.warn(`  ✗ Download failed: ${err.message}`);
      // Remove partial file
      try { await fsPromises.unlink(destPath); } catch {}
      continue;
    }
  }

  console.warn(`  ⚠ No suitable CC0 model found for "${query}"`);
  return null;
};

const TARGETS = [
  {
    query: 'bed bedroom furniture',
    outputFileName: 'bed-modern-01.glb',
    description: 'Bed (for Beds category)',
  },
  {
    query: 'ceramic vase decorative pot',
    outputFileName: 'decor-vase-terracotta-01.glb',
    description: 'Decorative Vase (for Terracotta Vase Set)',
  },
  {
    query: 'floor mirror full length mirror furniture',
    outputFileName: 'decor-mirror-01.glb',
    description: 'Mirror (for Geometric Wall Mirror)',
  },
];

const main = async () => {
  if (!SKETCHFAB_TOKEN) {
    throw new Error('SKETCHFAB_TOKEN not set');
  }

  await fsPromises.mkdir(OUTPUT_DIR, { recursive: true });
  console.log(`Output directory: ${OUTPUT_DIR}\n`);

  const results = {};
  for (const target of TARGETS) {
    console.log(`\n──────────────────────────────`);
    console.log(`Target: ${target.description}`);
    const filename = await findAndDownload(
      sanitize(target.description),
      target.query,
      target.outputFileName,
    );
    results[target.outputFileName] = filename ? `✅ ${filename}` : '❌ Not downloaded';
    await delay(800);
  }

  console.log('\n══════════════════════════════');
  console.log('DOWNLOAD SUMMARY:');
  for (const [key, val] of Object.entries(results)) {
    console.log(`  ${key}: ${val}`);
  }
  console.log('══════════════════════════════\n');
};

main().catch((err) => {
  console.error('Script failed:', err.message);
  process.exit(1);
});
