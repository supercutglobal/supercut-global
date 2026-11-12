import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import { getDb } from "./db";
import { SESSION_COOKIE, verifySessionToken } from "./session";

/**
 * Returns the signed-in admin, or null.
 * The token alone is not trusted for the role: the user is re-read from the
 * database so a demoted or deleted admin loses access immediately.
 */
export async function getAdmin() {
  const store = await cookies();
  const session = await verifySessionToken(store.get(SESSION_COOKIE)?.value);
  if (!session || !ObjectId.isValid(session.userId)) return null;

  const db = await getDb();
  const user = await db
    .collection("users")
    .findOne({ _id: new ObjectId(session.userId) }, { projection: { email: 1, role: 1 } });

  if (!user || user.role !== "admin") return null;
  return { id: user._id.toString(), email: user.email };
}
