const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const { pipeline } = require('stream/promises');

const SKETCHFAB_TOKEN = process.env.SKETCHFAB_TOKEN || 'ebd4b4dd774f4fb9ab963714050d237e';
const OUTPUT_DIR = path.resolve(__dirname, '../../../frontend/public/models');
const SEED_FILE = path.resolve(__dirname, '../../seed-data.json');

const CATEGORY_MAP = [
  {
    label: 'Sofas',
    queries: ['sofa', 'couch', 'armchair', 'loveseat', 'settee'],
  },
  {
    label: 'Chairs',
    queries: ['chair', 'dining chair', 'accent chair', 'lounge chair', 'office chair'],
  },
  {
    label: 'Tables',
    queries: ['coffee table', 'dining table', 'side table', 'console table', 'end table'],
  },
  {
    label: 'Lighting',
    queries: ['floor lamp', 'table lamp', 'pendant lamp', 'lamp', 'lighting'],
  },
  {
    label: 'Storage',
    queries: ['bookshelf', 'cabinet', 'storage cabinet', 'shelf', 'wardrobe'],
  },
];
const TARGET_PER_CATEGORY = 5;
const DEFAULT_SEARCH_LICENSE = 'cc0';
// CC0-only licensing is enforced here for simplicity, as requested.
const ALLOWED_LICENSE_SLUGS = new Set(['cc0']);
const MAX_SEARCH_PAGES = 10;
const MAX_RETRIES = 6;
const BASE_RETRY_DELAY_MS = 1200;
const MAX_PAGE_SIZE = 50;

const sanitizeFileName = (value) =>
  String(value)
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchJson = async (url, options = {}) => {
  const res = await fetch(url, options);
  const body = await res.text();
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText} \nURL: ${url}\n${body}`);
  }
  return JSON.parse(body);
};

const fetchJsonWithRetry = async (url, options = {}, retries = MAX_RETRIES) => {
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await fetchJson(url, options);
    } catch (err) {
      const isRetryable = err.message.startsWith('429');
      if (!isRetryable || attempt === retries) {
        throw err;
      }
      const delayMs = BASE_RETRY_DELAY_MS * Math.pow(2, attempt);
      console.warn(`Retry ${attempt + 1}/${retries} after ${delayMs}ms for ${url}`);
      await delay(delayMs);
    }
  }
};

const fileExists = async (filePath) => {
  try {
    await fsPromises.access(filePath);
    return true;
  } catch {
    return false;
  }
};

const downloadUrlToFile = async (url, destinationPath) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Download failed: ${res.status} ${res.statusText} ${url}`);
  }
  await pipeline(res.body, fs.createWriteStream(destinationPath));
};

const buildModelFileName = (categoryLabel, modelName, uid) => {
  const base = sanitizeFileName(`${categoryLabel}-${modelName}`);
  return `${base}-${uid.slice(0, 8)}.glb`;
};

const buildSearchUrl = (query, page = 1, pageSize = MAX_PAGE_SIZE, license = DEFAULT_SEARCH_LICENSE) => {
  const url = new URL('https://api.sketchfab.com/v3/search');
  url.searchParams.set('type', 'models');
  url.searchParams.set('q', query);
  url.searchParams.set('downloadable', 'true');
  if (license) {
    url.searchParams.set('license', license);
  }
  url.searchParams.set('page', String(page));
  url.searchParams.set('page_size', String(pageSize));
  return url.toString();
};

const getModelDetails = async (uid) => {
  const url = `https://api.sketchfab.com/v3/models/${uid}`;
  return fetchJson(url, {
    headers: { Authorization: `Token ${SKETCHFAB_TOKEN}` },
  });
};

const getDownloadInfo = async (uid) => {
  const url = `https://api.sketchfab.com/v3/models/${uid}/download`;
  return fetchJson(url, {
    headers: { Authorization: `Token ${SKETCHFAB_TOKEN}` },
  });
};

const main = async () => {
  if (!SKETCHFAB_TOKEN) {
    throw new Error('Sketchfab token is required. Set SKETCHFAB_TOKEN or update the script.');
  }

  await fsPromises.mkdir(OUTPUT_DIR, { recursive: true });
  console.log(`Saving downloaded GLB files to: ${OUTPUT_DIR}`);

  const seedEntries = [];
  const downloadedByUid = new Map();

  for (const { queries, label } of CATEGORY_MAP) {
    console.log(`\nSearching category: ${label}`);
    let categoryCount = 0;
    let licenseFilter = DEFAULT_SEARCH_LICENSE;
    let didFallback = false;
    const seenUids = new Set();

    for (const query of queries) {
      if (categoryCount >= TARGET_PER_CATEGORY) break;
      console.log(`  Trying query: ${query}`);
      let page = 1;

      while (categoryCount < TARGET_PER_CATEGORY) {
        const searchUrl = buildSearchUrl(query, page, MAX_PAGE_SIZE, licenseFilter);
        const searchResult = await fetchJsonWithRetry(searchUrl, {
          headers: { Authorization: `Bearer ${SKETCHFAB_TOKEN}` },
        });

        if (!Array.isArray(searchResult.results) || searchResult.results.length === 0) {
          console.log(`    No more search results for ${query} (page ${page}).`);
          if (licenseFilter && !didFallback) {
            console.log(`    License filter '${licenseFilter}' returned no models; retrying without license filter.`);
            licenseFilter = '';
            didFallback = true;
            page = 1;
            continue;
          }
          break;
        }

        for (const item of searchResult.results) {
          if (categoryCount >= TARGET_PER_CATEGORY) break;
          if (!item.uid || seenUids.has(item.uid)) continue;
          seenUids.add(item.uid);

          const uid = item.uid;
          const displayName = item.name || `sketchfab-${uid}`;
          const existing = downloadedByUid.get(uid);
          if (existing) {
            seedEntries.push({ name: displayName, category: label, modelUrl: `/models/${existing.filename}` });
            categoryCount += 1;
            continue;
          }

          let details;
          try {
            details = await getModelDetails(uid);
          } catch (err) {
            console.warn(`  Skipping ${displayName} (${uid}) — failed to load details: ${err.message}`);
            continue;
          }

          if (!details.isDownloadable) {
            continue;
          }

          const licenseSlug = String(details.license?.slug || '').toLowerCase();
          const licenseLabel = String(details.license?.label || '').toLowerCase();
          if (!ALLOWED_LICENSE_SLUGS.has(licenseSlug) && !licenseLabel.includes('cc0')) {
            console.log(`  Skipping ${displayName} (${uid}) — unsupported license ${licenseLabel || licenseSlug}`);
            continue;
          }

          let downloadData;
          try {
            downloadData = await getDownloadInfo(uid);
          } catch (err) {
            console.warn(`  Skipping ${displayName} (${uid}) — download info failed: ${err.message}`);
            continue;
          }

          const glbUrl = downloadData?.glb?.url;
          if (!glbUrl) {
            console.warn(`  Skipping ${displayName} (${uid}) — no GLB download URL available.`);
            continue;
          }

          const filename = buildModelFileName(label, displayName, uid);
          const destinationPath = path.join(OUTPUT_DIR, filename);

          if (!(await fileExists(destinationPath))) {
            console.log(`  Downloading ${displayName} → ${filename}`);
            await downloadUrlToFile(glbUrl, destinationPath);
            console.log(`  Saved ${filename}`);
          } else {
            console.log(`  Already exists: ${filename}`);
          }

          downloadedByUid.set(uid, { filename });
          seedEntries.push({ name: displayName, category: label, modelUrl: `/models/${filename}` });
          categoryCount += 1;
          await delay(550);
        }

        if (categoryCount >= TARGET_PER_CATEGORY) break;
        if (!searchResult.next || page >= MAX_SEARCH_PAGES) break;
        page += 1;
        await delay(400);
      }
    }

    console.log(`  Collected ${categoryCount}/${TARGET_PER_CATEGORY} entries for ${label}`);
  }

  await fsPromises.writeFile(SEED_FILE, JSON.stringify(seedEntries, null, 2), 'utf8');
  console.log(`\nSeed data written to: ${SEED_FILE}`);
  console.log(`Total models mapped: ${seedEntries.length}`);
};

main().catch((error) => {
  console.error('Sketchfab downloader failed:', error);
  process.exit(1);
});
