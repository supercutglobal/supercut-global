import crypto from "node:crypto";

const ALLOWED_FORMATS = ["jpg", "jpeg", "png", "webp"];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function credentials() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary environment variables are not set");
  }
  return { cloud: CLOUDINARY_CLOUD_NAME, key: CLOUDINARY_API_KEY, secret: CLOUDINARY_API_SECRET };
}

/** Cloudinary signature: SHA-1 of the sorted params joined with &, plus the API secret */
export function signParams(params) {
  const { secret } = credentials();
  const toSign = Object.keys(params)
    .filter((k) => params[k] !== undefined && params[k] !== "")
    .sort()
    .map((k) => `${k}=${Array.isArray(params[k]) ? params[k].join(",") : params[k]}`)
    .join("&");
  return crypto.createHash("sha1").update(toSign + secret).digest("hex");
}

function authHeader() {
  const { key, secret } = credentials();
  return "Basic " + Buffer.from(`${key}:${secret}`).toString("base64");
}

/**
 * Confirms the asset really exists in our account and is an acceptable image.
 * Returns { ok: true, url } or { ok: false, error }.
 */
export async function verifyUploadedImage(publicId) {
  const { cloud } = credentials();
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloud}/resources/image/upload/${encodeURIComponent(publicId).replace(/%2F/g, "/")}`,
    { headers: { Authorization: authHeader() }, cache: "no-store" }
  );
  if (res.status === 404) return { ok: false, error: "Image not found in Cloudinary" };
  if (!res.ok) return { ok: false, error: "Could not verify image with Cloudinary" };

  const asset = await res.json();
  if (!ALLOWED_FORMATS.includes(asset.format)) {
    return { ok: false, error: "Image must be JPG, PNG or WebP" };
  }
  if (asset.bytes > MAX_IMAGE_BYTES) return { ok: false, error: "Image must be 5 MB or smaller" };
  return { ok: true, url: asset.secure_url };
}

export async function deleteImage(publicId) {
  const { cloud } = credentials();
  const params = { public_id: publicId, timestamp: Math.round(Date.now() / 1000) };
  const body = new URLSearchParams({
    ...params,
    timestamp: String(params.timestamp),
    api_key: credentials().key,
    signature: signParams(params),
  });
  await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/destroy`, { method: "POST", body });
}
