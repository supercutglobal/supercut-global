import { SignJWT, jwtVerify } from "jose";

// Edge-safe session helpers (used by middleware and route handlers)

export const SESSION_COOKIE = "sc_session";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

function secretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) throw new Error("AUTH_SECRET must be set (32+ chars)");
  return new TextEncoder().encode(secret);
}

export async function createSessionToken({ userId, email, role }) {
  return new SignJWT({ email, role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secretKey());
}

export async function verifySessionToken(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ["HS256"] });
    // Other tokens signed with the same secret (device, catalogue) carry a purpose: never a session
    if (payload.purpose) return null;
    return { userId: payload.sub, email: payload.email, role: payload.role };
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: SESSION_MAX_AGE,
};

/**
 * "Trusted device" cookie, set after a successful admin login. Failed logins from a trusted device
 * are counted per device instead of per IP, so other people's failures (or many visitors sharing
 * one IP behind a proxy) can never lock the admin out of a browser they have signed in from.
 * Its subject is a random device id, not a user id, so it can't be replayed as a session.
 */
export const DEVICE_COOKIE = "sc_device";
const DEVICE_MAX_AGE = 60 * 60 * 24 * 90; // 90 days

export function createDeviceToken({ deviceId, email }) {
  return new SignJWT({ purpose: "device", email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(deviceId)
    .setIssuedAt()
    .setExpirationTime(`${DEVICE_MAX_AGE}s`)
    .sign(secretKey());
}

export async function verifyDeviceToken(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ["HS256"] });
    return payload.purpose === "device" ? { deviceId: payload.sub, email: payload.email } : null;
  } catch {
    return null;
  }
}

export const deviceCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/api/auth", // only ever sent to the login route
  maxAge: DEVICE_MAX_AGE,
};
