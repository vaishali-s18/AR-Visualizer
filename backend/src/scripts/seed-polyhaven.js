import "dotenv/config";
import mongoose from "mongoose";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(
  readFileSync(join(__dirname, "../../polyhaven-catalog.json"), "utf-8")
);

await mongoose.connect(process.env.MONGO_URI);
console.log("Connected to MongoDB");

const collection = mongoose.connection.collection("furniture_catalog");

// Avoid duplicate inserts
const existingIds = new Set(
  (await collection.find({}, { projection: { assetId: 1 } }).toArray()).map(
    (d) => d.assetId
  )
);

const newDocs = data.filter((d) => !existingIds.has(d.assetId));

if (newDocs.length === 0) {
  console.log("All documents already exist — nothing to insert.");
} else {
  const result = await collection.insertMany(newDocs);
  console.log(`✅ ${result.insertedCount} documents inserted into furniture_catalog`);
}

await mongoose.disconnect();
