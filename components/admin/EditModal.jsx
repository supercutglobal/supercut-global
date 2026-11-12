"use client";

import { useEffect } from "react";
import { ProductForm } from "./ProductForm";

export default function EditModal({ product, onClose, onSubmit }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div role="dialog" aria-modal="true" aria-label={`Edit ${product.title}`} onClick={onClose} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg max-h-[92vh] bg-[#13306b] border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col">
        <h2 className="shrink-0 text-[20px] font-semibold mb-3">Edit product</h2>
        <ProductForm product={product} onSubmit={onSubmit} onCancel={onClose} className="flex-1 min-h-[440px]" />
      </div>
    </div>
  );
}
