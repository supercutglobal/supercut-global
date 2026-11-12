"use client";

import { useEffect } from "react";
import { CONDENSED_FONT, GROTESK_FONT } from "./fonts";
import { CatalogueButton } from "./CatalogueDownload";
import { whatsappUrl } from "../data/contactData";

export default function ProductModal({ item, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const title = item.title.join(" ");

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
      >
        <div className="flex justify-between items-center px-5 sm:px-6 py-4 border-b border-neutral-200 shrink-0">
          <span style={{ fontFamily: CONDENSED_FONT }} className="text-[#0b1f4b] text-[11px] font-bold uppercase tracking-[0.12em]">
            Super Cut
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-neutral-500 hover:text-neutral-900 p-1.5 rounded-lg hover:bg-neutral-100 text-xl font-bold cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="h-52 sm:h-64 w-full bg-[#ececec] flex items-center justify-center">
            <img src={item.image} alt={item.alt} className="max-w-full max-h-full object-contain p-6 mix-blend-multiply" />
          </div>

          <div className="p-5 sm:p-6 text-center flex flex-col items-center">
            <h3 style={{ fontFamily: GROTESK_FONT }} className="text-[#111] text-[24px] sm:text-[28px] font-semibold leading-tight">
              {title}
            </h3>
            <p className="mt-2 max-w-md text-[14.5px] sm:text-[15.5px] text-neutral-600 leading-relaxed">{item.desc}</p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href={whatsappUrl(`Hello Super Cut, I would like to inquire about ${title}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0b1f4b] text-white font-semibold text-sm px-6 py-3 rounded-lg hover:bg-[#13306b] transition-colors"
              >
                Enquire on WhatsApp
              </a>
              <CatalogueButton
                className="border-2 border-[#111] text-[#111] font-semibold text-sm px-6 py-3 rounded-lg hover:bg-[#111] hover:text-white transition-colors"
              >
                Full Catalogue (PDF)
              </CatalogueButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
