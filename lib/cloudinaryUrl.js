/**
 * Adds a Cloudinary delivery transformation (auto format/quality, width cap) to an
 * image URL. Non-Cloudinary URLs (e.g. the local fallback catalogue) pass through.
 */
export function cldUrl(url, width = 800) {
  if (!url?.includes("res.cloudinary.com/") || !url.includes("/image/upload/")) return url;
  return url.replace("/image/upload/", `/image/upload/f_auto,q_auto,c_limit,w_${width}/`);
}

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "yynppzbd";

/** Delivery URL for an image already in Cloudinary, by public id (e.g. "supercut/site/inserts-collage") */
export function cldImage(publicId, width = 1200) {
  return `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto,c_limit,w_${width}/${publicId}`;
}
