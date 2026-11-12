// Creates an admin user, or resets the password of an existing one.
// Usage: npm run create-admin -- you@example.com "a-long-password"
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const [email, password] = process.argv.slice(2);

if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
  console.error('Usage: npm run create-admin -- you@example.com "a-long-password"');
  process.exit(1);
}
if (!password || password.length < 4) {
  console.error("Password must be at least 4 characters.");
  process.exit(1);
}
if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is not set. Run this through npm so .env is loaded.");
  process.exit(1);
}

const client = new MongoClient(process.env.MONGODB_URI);
try {
  await client.connect();
  const users = client.db("supercut").collection("users");
  await users.createIndex({ email: 1 }, { unique: true });

  const normalized = email.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(password, 12);
  const result = await users.updateOne(
    { email: normalized },
    { $set: { email: normalized, passwordHash, role: "admin", updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
    { upsert: true }
  );
  console.log(result.upsertedCount ? `Admin created: ${normalized}` : `Admin password updated: ${normalized}`);
} finally {
  await client.close();
}
