import { getDb } from "./db";
import { logger } from "./logger";

// Counters live in MongoDB (collection "rateLimits"), so limits hold across restarts and
// multiple app instances. A TTL index deletes each counter when its window ends.
let indexReady;
async function collection() {
  const col = (await getDb()).collection("rateLimits");
  indexReady ??= col.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }).catch((err) => {
    indexReady = undefined;
    throw err;
  });
  await indexReady;
  return col;
}

/** Adds one hit to `key` and returns the count in the current window (fixed window of windowMs) */
export async function hit(key, windowMs) {
  try {
    const col = await collection();
    const doc = await col.findOneAndUpdate(
      { _id: key, expiresAt: { $gt: new Date() } },
      { $inc: { count: 1 } },
      { returnDocument: "after" }
    );
    if (doc) return doc.count;
    // No live window: start a new one (replaces an expired counter the TTL job hasn't removed yet)
    await col.replaceOne({ _id: key }, { count: 1, expiresAt: new Date(Date.now() + windowMs) }, { upsert: true });
    return 1;
  } catch (err) {
    // Fail open: a database hiccup must not lock everyone out
    logger.error({ err, key }, "rate limit unavailable");
    return 0;
  }
}

/** Current count for `key` without adding to it */
export async function count(key) {
  try {
    const doc = await (await collection()).findOne({ _id: key, expiresAt: { $gt: new Date() } });
    return doc?.count ?? 0;
  } catch (err) {
    logger.error({ err, key }, "rate limit unavailable");
    return 0;
  }
}

export async function clear(key) {
  try {
    await (await collection()).deleteOne({ _id: key });
  } catch (err) {
    logger.error({ err, key }, "rate limit unavailable");
  }
}
