"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Reveal from "./Reveal";
import { GROTESK_FONT } from "./fonts";
const PAGE_SIZE = 6;

// Popup code is only downloaded when a product is first opened
const ProductModal = dynamic(() => import("./ProductModal"), { ssr: false });


export function ProductsGrid({ items: allItems = [] }) {
  const [query, setQuery] = useState("");
  const [activeItem, setActiveItem] = useState(null);
  const [page, setPage] = useState(1);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allItems;
    return allItems.filter((it) => `${it.title.join(" ")} ${it.desc}`.toLowerCase().includes(q));
  }, [query, allItems]);

  const pageCount = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageItems = items.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const goToPage = (n) => {
    setPage(n);
    window.__lenis?.scrollTo(0, { immediate: true });
  };

  return (
    <section className="bg-[#0b1f4b] text-white py-16 lg:py-24 min-h-screen">
      <div className="px-4 sm:px-8 md:px-12 lg:px-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 sm:mb-12">
          <h1 style={{ fontFamily: GROTESK_FONT }} className="text-[44px] sm:text-[56px] font-bold leading-none tracking-tight">
            Products
          </h1>
          <label className="relative w-full sm:w-80">
            <span className="sr-only">Search products</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 pointer-events-none">
              <circle cx="11" cy="11" r="7" />
              <path strokeLinecap="round" d="M20 20l-3.5-3.5" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search"
              className="w-full bg-[#d9d9d9] text-[#111] placeholder:text-neutral-600 rounded-lg pl-10 pr-4 py-2.5 text-[15px] focus:outline-none focus:ring-2 focus:ring-white"
            />
          </label>
        </div>

        {items.length === 0 ? (
          <p className="text-white/60 text-[16px] py-20 text-center">No products match “{query}”.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {pageItems.map((item, idx) => (
              <Reveal key={item.id} delay={(idx % 3) * 60} className="h-full">
                <button
                  type="button"
                  onClick={() => setActiveItem(item)}
                  className="group w-full h-full text-left rounded-xl overflow-hidden bg-[#f4f4f4] flex flex-col cursor-pointer ring-2 ring-transparent hover:ring-white transition-all duration-300"
                >
                  <div className="relative aspect-[4/3] w-full bg-[#e4e4e4] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.alt}
                      // First row is on screen at load; the rest wait until scrolled near
                      loading={currentPage === 1 && idx < 3 ? "eager" : "lazy"}
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-contain p-5 mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 sm:p-5 flex-1 flex flex-col items-start transition-colors duration-300 group-hover:bg-[#0b1f4b]">
                    <h2
                      style={{ fontFamily: GROTESK_FONT }}
                      className="text-[#111] group-hover:text-white text-[17px] sm:text-[18px] font-semibold leading-snug line-clamp-2 min-h-[2.75em] transition-colors"
                    >
                      {item.title.join(" ")}
                    </h2>
                    <span className="block mt-1.5 mb-4 h-[2px] w-24 bg-[#0b1f4b] group-hover:bg-white transition-colors" />
                    <span className="mt-auto inline-flex items-center gap-2 bg-[#0b1f4b] text-white group-hover:bg-white group-hover:text-[#0b1f4b] text-[13.5px] font-semibold px-4 py-2 rounded-lg transition-colors">
                      View Product
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </span>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        )}

        {pageCount > 1 && (
          <nav aria-label="Products pagination" className="mt-12 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="w-10 h-10 rounded-lg border border-white/15 flex items-center justify-center text-white hover:border-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
              </svg>
            </button>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => goToPage(n)}
                aria-current={n === currentPage ? "page" : undefined}
                style={{ fontFamily: GROTESK_FONT }}
                className={`w-10 h-10 rounded-lg text-[15px] font-semibold transition-colors cursor-pointer ${n === currentPage
                  ? "bg-white text-[#0b1f4b]"
                  : "border border-white/15 text-white hover:border-white hover:bg-white/10"
                  }`}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === pageCount}
              aria-label="Next page"
              className="w-10 h-10 rounded-lg border border-white/15 flex items-center justify-center text-white hover:border-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </nav>
        )}
      </div>

      {activeItem && <ProductModal item={activeItem} onClose={() => setActiveItem(null)} />}
    </section>
  );
}
