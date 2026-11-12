import { NextResponse } from "next/server";

/**
 * The visitor's IP. Proxies append to X-Forwarded-For, so the entries a client typed in itself
 * come first and the one our own proxy added is last. TRUSTED_PROXY_HOPS = how many proxies sit
 * in front of the app (Hostinger: 1). With 0 (or no header) the header is ignored entirely.
 */
export function clientIp(request) {
  const hops = Number(process.env.TRUSTED_PROXY_HOPS ?? 1);
  const chain = (request.headers.get("x-forwarded-for") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (hops > 0 && chain.length >= hops) return chain[chain.length - hops];
  return request.headers.get("x-real-ip") || "local";
}

export class BodyError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

/**
 * Reads a JSON body but stops once it passes maxBytes, so an oversized request can't tie up
 * memory. Throws BodyError (413 / 400); answer it with bodyErrorResponse().
 */
export async function readJson(request, maxBytes = 16 * 1024) {
  const declared = Number(request.headers.get("content-length"));
  if (declared > maxBytes) throw new BodyError(413, "Request too large");
  if (!request.body) throw new BodyError(400, "Invalid request");

  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel();
      throw new BodyError(413, "Request too large");
    }
    chunks.push(value);
  }

  try {
    return JSON.parse(new TextDecoder().decode(Buffer.concat(chunks)));
  } catch {
    throw new BodyError(400, "Invalid request");
  }
}

export const bodyErrorResponse = (err) => NextResponse.json({ error: err.message }, { status: err.status });
