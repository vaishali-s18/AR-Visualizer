import "dotenv/config";
import mongoose from "mongoose";

await mongoose.connect(process.env.MONGO_URI);
console.log("Connected to MongoDB");

const db = mongoose.connection;
const source = db.collection("furniture_catalog");
const target = db.collection("products");

const existing = new Set(
  (await target.find({}, { projection: { assetId: 1 } }).toArray()).map(
    (d) => d.assetId
  )
);

const docs = await source.find({}).toArray();
const newDocs = docs.filter((d) => !existing.has(d.assetId));

if (newDocs.length === 0) {
  console.log("All documents already exist in products — nothing to migrate.");
  await mongoose.disconnect();
  process.exit(0);
}

// Map furniture_catalog shape → Product schema shape
const mapped = newDocs.map((d) => ({
  assetId: d.assetId,
  name: d.name,
  // Use first category as the category field (required by schema)
  category: d.categories?.[0] ?? "furniture",
  categories: d.categories,
  tags: d.tags,
  price: 0,                         // placeholder — update later
  dimensions: {
    width: d.scale?.width ?? null,
    height: d.scale?.height ?? null,
    depth: d.scale?.depth ?? null,
  },
  modelUrl: d.modelPath,
  thumbnailUrl: `https://cdn.polyhaven.com/asset_img/thumbs/${d.assetId}.png?width=256`,
  imageUrl: `https://cdn.polyhaven.com/asset_img/primary/${d.assetId}.png?width=512`,
  source: "polyhaven",
  inStock: true,
  rating: 5,
  reviews: 0,
}));

const result = await target.insertMany(mapped);
console.log(`✅ ${result.insertedCount} products migrated to 'products' collection`);

await mongoose.disconnect();
