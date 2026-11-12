"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, uploadImage, readError } from "./api";
import { ImagePicker } from "./ImagePicker";
import { toast } from "./toast";

const inputClass =
  "w-full bg-[#163672] border border-white/10 text-white placeholder:text-white/45 rounded-lg px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-white";

/**
 * Create (no `product`) or edit (`product` given) form.
 * Uploads a newly picked image to Cloudinary first, then saves through the admin API.
 * With `onSubmit`, the form only validates and hands over the values so the caller can save in the background.
 */
export function ProductForm({ product, onSaved, onSubmit, onCancel, className = "" }) {
  const router = useRouter();
  const editing = Boolean(product);
  const [title, setTitle] = useState(product?.title ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (title.trim().length < 2) next.title = "Name must be at least 2 characters";
    if (!editing && !file) next.image = "Choose a product image";
    setErrors(next);
    if (Object.keys(next).length) return;
    if (onSubmit) return onSubmit({ title, description, file });

    setSaving(true);
    try {
      const body = { title, description };
      if (file) body.imagePublicId = await uploadImage(file, setProgress);

      const { data } = editing
        ? await api.patch(`/api/admin/products/${product._id}`, body)
        : await api.post("/api/admin/products", body);

      if (!editing) {
        setTitle("");
        setDescription("");
      }
      setFile(null);
      onSaved?.(data.product);
    } catch (err) {
      const { message, fields, expired } = readError(err);
      if (expired) return router.replace("/admin/login");
      if (fields) setErrors(fields);
      toast.error(message);
    } finally {
      setSaving(false);
      setProgress(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className={`flex flex-col gap-3 ${className}`}>
      <ImagePicker
        file={file}
        onChange={(f) => {
          setFile(f);
          setErrors((er) => ({ ...er, image: undefined }));
        }}
        currentUrl={product?.imageUrl}
        error={errors.image || errors.imagePublicId}
        progress={progress}
        className="flex-1 min-h-[140px]"
      />

      <div className="shrink-0">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Product name" aria-label="Product name" maxLength={80} className={inputClass} />
        {errors.title && <p className="mt-1.5 text-[13px] text-[#ffb4b4]">{errors.title}</p>}
      </div>

      <div className="shrink-0">
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optional)" aria-label="Description" rows={3} maxLength={600} className={`${inputClass} resize-none`} />
        {errors.description && <p className="mt-1.5 text-[13px] text-[#ffb4b4]">{errors.description}</p>}
      </div>

      <div className="shrink-0 flex gap-3">
        {onCancel && (
          <button type="button" onClick={onCancel} className="flex-1 border border-white/25 text-white font-semibold text-[15px] py-3 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={saving}
          className="flex-1 bg-white text-[#0b1f4b] font-semibold text-[15px] py-3 rounded-lg hover:bg-[#dbe4f3] disabled:opacity-60 transition-colors cursor-pointer"
        >
          {saving ? (progress != null && progress < 100 ? `Uploading ${progress}%…` : "Saving…") : editing ? "Save changes" : "Add product"}
        </button>
      </div>
    </form>
  );
}
