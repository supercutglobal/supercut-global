// One-time import of the built-in catalogue (data/insertsData.js) into MongoDB,
// uploading each product image to Cloudinary. Safe to re-run: already-imported
// products (matched by seedId) are skipped.
// Usage: npm run seed-products
import crypto from "node:crypto";
import { MongoClient } from "mongodb";
import { PAGES } from "../data/insertsData.js";

const FOLDER = "supercut/products";
const { MONGODB_URI, CLOUDINARY_CLOUD_NAME: cloud, CLOUDINARY_API_KEY: key, CLOUDINARY_API_SECRET: secret } = process.env;
if (!MONGODB_URI || !cloud || !key || !secret) {
  console.error("MongoDB / Cloudinary env vars are missing. Run this through npm so .env is loaded.");
  process.exit(1);
}

function sign(params) {
  const toSign = Object.keys(params).sort().map((k) => `${k}=${params[k]}`).join("&");
  return crypto.createHash("sha1").update(toSign + secret).digest("hex");
}

// Catalogue images now live in Cloudinary, so Cloudinary copies them from their URL
async function upload(fileUrl, publicId) {
  const params = { folder: FOLDER, public_id: publicId, timestamp: Math.round(Date.now() / 1000) };
  const form = new FormData();
  form.append("file", fileUrl);
  for (const [k, v] of Object.entries(params)) form.append(k, String(v));
  form.append("api_key", key);
  form.append("signature", sign(params));

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || `Upload failed (${res.status})`);
  return data;
}

const client = new MongoClient(MONGODB_URI);
try {
  await client.connect();
  const products = client.db("supercut").collection("products");
  const items = PAGES.flatMap((p) => p.items);
  // Spaced timestamps keep the catalogue order, ahead of anything added later
  const base = new Date("2026-01-01T00:00:00Z").getTime();

  for (const [i, item] of items.entries()) {
    if (await products.findOne({ seedId: item.id })) {
      console.log(`skip    ${item.id} (already imported)`);
      continue;
    }
    const asset = await upload(item.image, item.id);
    await products.insertOne({
      title: item.title.join(" "),
      description: item.desc,
      imageUrl: asset.secure_url,
      imagePublicId: asset.public_id,
      seedId: item.id,
      createdAt: new Date(base + i * 1000),
      createdBy: "catalogue import",
    });
    console.log(`import  ${item.id} -> ${asset.public_id}`);
  }
  console.log(`Done. ${await products.countDocuments()} products in the database.`);
} finally {
  await client.close();
}
