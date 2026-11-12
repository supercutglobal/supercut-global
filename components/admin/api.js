import axios from "axios";

// Same-origin API client for the admin dashboard
export const api = axios.create({ headers: { "Content-Type": "application/json" } });

export const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** Client-side pre-check; the server and Cloudinary enforce the same rules again */
export function checkImageFile(file) {
  if (!ALLOWED_TYPES.includes(file.type)) return "Image must be JPG, PNG or WebP";
  if (file.size > MAX_IMAGE_BYTES) return "Image must be 5 MB or smaller";
  return null;
}

/**
 * Uploads straight to Cloudinary using a signature only an admin can get.
 * Returns the uploaded image's public id.
 */
export async function uploadImage(file, onProgress) {
  const { data: sig } = await api.post("/api/admin/sign-upload");

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", sig.apiKey);
  form.append("timestamp", sig.timestamp);
  form.append("folder", sig.folder);
  form.append("allowed_formats", sig.allowed_formats);
  form.append("signature", sig.signature);

  const { data } = await axios.post(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, form, {
    onUploadProgress: (e) => e.total && onProgress?.(Math.round((e.loaded / e.total) * 100)),
  });
  return data.public_id;
}

/** Turns an axios error into { message, fields } for the forms */
export function readError(err) {
  const data = err?.response?.data;
  if (err?.response?.status === 403) return { message: "Your session has expired. Please sign in again.", expired: true };
  if (data?.error?.message) return { message: data.error.message }; // Cloudinary error shape
  return { message: data?.error || "Something went wrong, please try again", fields: data?.fields };
}
