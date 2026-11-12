import { SignJWT, jwtVerify } from "jose";

// The catalogue PDF is kept outside public/ so it can only be downloaded with a short-lived
// token, handed out after the download form has been filled in.
export const CATALOGUE_FILE = "private/catalogue.pdf";
const TOKEN_TTL = "10m";

function key() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) throw new Error("AUTH_SECRET must be set (32+ chars)");
  return new TextEncoder().encode(secret);
}

export function createDownloadToken(leadId) {
  return new SignJWT({ purpose: "catalogue" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(leadId)
    .setIssuedAt()
    .setExpirationTime(TOKEN_TTL)
    .sign(key());
}

export async function verifyDownloadToken(token) {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, key(), { algorithms: ["HS256"] });
    return payload.purpose === "catalogue";
  } catch {
    return false;
  }
}
