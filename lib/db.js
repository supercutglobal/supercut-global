import { MongoClient } from "mongodb";

const DB_NAME = "supercut";

// Reuse one client across hot reloads and serverless invocations
const globalForMongo = globalThis;

function getClient() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not set");
  if (!globalForMongo.__mongoClientPromise) {
    globalForMongo.__mongoClientPromise = new MongoClient(process.env.MONGODB_URI).connect();
  }
  return globalForMongo.__mongoClientPromise;
}

export async function getDb() {
  const client = await getClient();
  return client.db(DB_NAME);
}
