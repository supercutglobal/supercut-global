import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "../../../../lib/db";
import { loginSchema, fieldErrors } from "../../../../lib/validation";
import {
  SESSION_COOKIE,
  DEVICE_COOKIE,
  createSessionToken,
  createDeviceToken,
  verifyDeviceToken,
  sessionCookieOptions,
  deviceCookieOptions,
} from "../../../../lib/session";
import { withHttpLog } from "../../../../lib/httpLog";
import { clientIp, readJson, bodyErrorResponse } from "../../../../lib/http";
import { hit, count, clear } from "../../../../lib/rateLimit";

// 5 failed attempts lock for 15 minutes (kept in MongoDB, survives restarts). Counted per trusted
// device when the browser has the admin's device cookie, otherwise per IP, so failures by others
// can't lock the admin out of a browser they have signed in from before.
const MAX_FAILS = 5;
const LOCK_MS = 15 * 60 * 1000;

// Compared against when the email is unknown, so timing doesn't reveal which emails exist
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 12);

export const POST = withHttpLog(async function POST(request, _context, log) {
  let body;
  try {
    body = await readJson(request);
  } catch (err) {
    return bodyErrorResponse(err);
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Check the highlighted fields", fields: fieldErrors(parsed.error) }, { status: 400 });
  }
  const { email, password } = parsed.data;

  const ip = clientIp(request);
  const device = await verifyDeviceToken(request.cookies.get(DEVICE_COOKIE)?.value);
  const trusted = device?.email === email;
  const failKey = trusted ? `login-fail:device:${device.deviceId}` : `login-fail:${ip}`;
  if ((await count(failKey)) >= MAX_FAILS) {
    log.warn({ ip, trustedDevice: trusted }, "login throttled");
    return NextResponse.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
  }
  const db = await getDb();
  const user = await db.collection("users").findOne({ email });
  const valid = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);

  if (!user || !valid || user.role !== "admin") {
    await hit(failKey, LOCK_MS);
    log.warn({ email, ip, reason: !user ? "unknown email" : !valid ? "wrong password" : "not an admin" }, "admin login failed");
    return NextResponse.json({ error: "Incorrect email or password" }, { status: 401 });
  }

  await clear(failKey);
  log.info({ userId: user._id.toString(), email: user.email }, "admin logged in");
  const token = await createSessionToken({ userId: user._id.toString(), email: user.email, role: user.role });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  // (Re)issue the trusted-device cookie, keeping the same device id if it already had one
  const deviceId = trusted ? device.deviceId : crypto.randomUUID();
  res.cookies.set(DEVICE_COOKIE, await createDeviceToken({ deviceId, email: user.email }), deviceCookieOptions);
  return res;
});
