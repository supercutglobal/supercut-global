"use client";

import { useEffect, useRef, useState } from "react";
import { checkImageFile } from "./api";
import { cldUrl } from "../../lib/cloudinaryUrl";

/**
 * Inline image picker (click or drag & drop) with preview.
 * Holds the chosen File; the parent uploads it on save.
 */
export function ImagePicker({ file, onChange, currentUrl, error, progress, className = "" }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!file) return setPreviewUrl(null);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const pick = (f) => {
    if (!f) return;
    const problem = checkImageFile(f);
    setLocalError(problem || "");
    if (!problem) onChange(f);
  };

  const shown = previewUrl || cldUrl(currentUrl, 700);
  const message = localError || error;

  return (
    <div className={`flex flex-col ${className}`}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          pick(e.dataTransfer.files?.[0]);
        }}
        className={`relative w-full flex-1 min-h-[150px] rounded-lg border-2 border-dashed overflow-hidden flex items-center justify-center transition-colors cursor-pointer ${
          dragging ? "border-white bg-white/10" : "border-white/25 hover:border-white/60 bg-[#0b1f4b]"
        }`}
      >
        {shown ? (
          <>
            <img src={shown} alt="Product preview" className="absolute inset-0 w-full h-full object-contain bg-white p-2" />
            <span className="absolute bottom-2 right-2 bg-[#0b1f4b]/85 text-white text-[12px] font-semibold px-2.5 py-1 rounded-lg">
              Change image
            </span>
          </>
        ) : (
          <span className="text-white/70 text-[14px] text-center px-4">
            Click or drop an image here
            <br />
            <span className="text-white/45 text-[12.5px]">JPG, PNG or WebP · max 5 MB</span>
          </span>
        )}
        {progress != null && progress < 100 && (
          <span className="absolute inset-x-0 bottom-0 h-1.5 bg-white/20">
            <span className="block h-full bg-white transition-[width]" style={{ width: `${progress}%` }} />
          </span>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          pick(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      {message && <p className="mt-1.5 text-[13px] text-[#ffb4b4]">{message}</p>}
    </div>
  );
}
