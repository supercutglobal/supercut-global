"use client";

import Link from "next/link";
import Reveal from "./Reveal";
import { CatalogueButton } from "./CatalogueDownload";
import { CONDENSED_FONT, GROTESK_FONT } from "./fonts";
import { cldImage } from "../lib/cloudinaryUrl";
import { SALES_EMAIL } from "../data/contactData";

// Rotating 3D ring of products under the hero copy. Every card is the same size; seen from the
// front the ring looks concave (edges bigger, middle smaller), like a gallery you stand inside.
const RING = [
  { id: "composite-rod", alt: "Tungsten carbide composite rods" },
  { id: "star-cut-inserts", alt: "Star cut inserts" },
  { id: "octacut-inserts", alt: "SC Octacut inserts" },
  { id: "tricorn-inserts", alt: "SC Tricorn inserts" },
  { id: "round-tapered", alt: "Round tapered inserts" },
  { id: "square-inserts", alt: "Square inserts" },
  { id: "chip-breaker", alt: "SC Chip breaker" },
  { id: "rectangular-tapered", alt: "Rectangular tapered inserts" },
  { id: "pdc-inserts", alt: "PDC inserts" },
];
// 12 cards round the ring so the cards can be wide. Three products appear twice, always on
// opposite sides (6 slots apart), so the same photo is never on screen twice at once.
const CARDS = [0, 3, 2, 4, 1, 5, 0, 6, 2, 7, 1, 8].map((n) => RING[n]);
const STEP = 360 / CARDS.length;

const CONTACTS = [
  // Opens the visitor's own mail app with the address filled in
  { label: SALES_EMAIL, href: `mailto:${SALES_EMAIL}`, icon: "M3 6h18v12H3z M3 7l9 6 9-6" },
  { label: "Abu Dhabi, United Arab Emirates", icon: "M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" },
];

export function Home() {
  return (
    <section className="relative overflow-hidden">
      <style>{`@keyframes sc-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>

      <div className="relative bg-[#0b1f4b] px-4 sm:px-8 md:px-12 lg:px-20 pt-10 sm:pt-12 lg:pt-12 pb-12 sm:pb-16">
        <div className="flex flex-col items-center gap-2 sm:gap-3 lg:gap-2">
          {/* Copy */}
          <Reveal className="w-full">
            <div className="text-center max-w-5xl mx-auto">
              <h1
                style={{ fontFamily: CONDENSED_FONT }}
                className="text-white font-bold uppercase leading-[1.02] tracking-[0.01em] text-[26px] min-[390px]:text-[30px] sm:text-[44px] md:text-[54px] lg:text-[60px] xl:text-[66px]"
              >
                Premium milling, hardface
                <br className="hidden sm:block" /> &amp; wear-resistant alloys
              </h1>

              <p style={{ fontFamily: GROTESK_FONT }} className="mt-4 sm:mt-5 text-white/75 text-[14.5px] sm:text-[18px] lg:text-[22px] font-medium leading-snug">
                Engineered performance for high-abrasion
                <br className="hidden sm:block" /> &amp; impact applications
              </p>

              <div className="mt-7 sm:mt-8 flex items-center justify-center gap-3 sm:gap-4">
                <Link
                  href="/products"
                  style={{ fontFamily: CONDENSED_FONT }}
                  className="bg-white text-[#0b1f4b] font-semibold uppercase tracking-[0.12em] text-[11px] sm:text-sm px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-lg hover:bg-[#dbe4f3] transition-colors shadow-lg whitespace-nowrap"
                >
                  Explore Products
                </Link>
                <CatalogueButton
                  style={{ fontFamily: CONDENSED_FONT }}
                  className="border-2 border-white/60 text-white font-semibold uppercase tracking-[0.12em] text-[11px] sm:text-sm px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-lg hover:bg-white hover:text-[#0b1f4b] transition-colors whitespace-nowrap"
                >
                  Get a Quote
                </CatalogueButton>
              </div>

              <ul style={{ fontFamily: GROTESK_FONT }} className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-[13px] sm:text-[15px] text-white/85 w-fit max-w-full mx-auto text-left">
                {CONTACTS.map((c) => {
                  const body = (
                    <>
                      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d={c.icon} />
                      </svg>
                      <span className="truncate">{c.label}</span>
                    </>
                  );
                  return (
                    <li key={c.label} className="min-w-0">
                      {c.href ? (
                        <a href={c.href} className="flex items-center gap-2.5 hover:underline underline-offset-4">{body}</a>
                      ) : (
                        <span className="flex items-center gap-2.5">{body}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>

          {/* Rotating product ring, full width (cancels the section padding).
              --r ring radius, --w card width. Cards face the
              centre and hide their backs, so only the far, concave half of the ring is visible. */}
          <Reveal variant="fade-up" delay={150} className="w-full">
            <div
              className="relative -mx-4 sm:-mx-8 md:-mx-12 lg:-mx-20 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]"
              style={{
                // Radius from the screen width so the ring always reaches both edges; card width is what
                // fits 12 cards round that circle (2·r·tan 15° ≈ 0.536·r) minus a small gap
                "--r": "clamp(200px, 54vw, 1000px)",
                "--w": "calc(var(--r) * 0.52)",
                "--h": "calc(var(--w) * 0.78)",
                height: "calc(var(--h) * 1.12)",
                perspective: "calc(var(--r) * 1.6)",
              }}
            >
              <div className="absolute left-1/2 top-1/2 w-0 h-0 [transform-style:preserve-3d] motion-safe:animate-[sc-ring_60s_linear_infinite]">
                {CARDS.map((p, i) => (
                  <Link
                    key={`${p.id}-${i}`}
                    href="/products"
                    aria-label={p.alt}
                    className="absolute block [backface-visibility:hidden]"
                    style={{
                      width: "var(--w)",
                      height: "var(--h)",
                      left: "calc(var(--w) / -2)",
                      top: "calc(var(--h) / -2)",
                      transform: `rotateY(${i * STEP}deg) translateZ(calc(var(--r) * -1))`,
                    }}
                  >
                    <img
                      src={cldImage(`supercut/products/${p.id}`, 600)}
                      alt={p.alt}
                      loading="lazy"
                      className="w-full h-full object-cover rounded-2xl bg-white ring-1 ring-white/15 shadow-[0_24px_40px_-16px_rgba(0,0,0,0.7)]"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="bg-[#f8f4ea] text-[#0b1f4b] overflow-hidden py-3">
        <div className="flex whitespace-nowrap w-max" style={{ animation: "sc-marquee 28s linear infinite" }}>
          {[0, 1].map((k) => (
            <span key={k} style={{ fontFamily: CONDENSED_FONT }} className="uppercase tracking-[0.2em] text-[13px] pr-8">
              Tungsten Carbide Composite Rods &nbsp; • &nbsp; Star Cut Inserts &nbsp; • &nbsp; SC Octacut &nbsp; • &nbsp; PDC Inserts &nbsp; • &nbsp; HF-5000 Flexible Rope &nbsp; • &nbsp; Nickel Silver Tinning Rods &nbsp; • &nbsp; ISO 9001:2015 &nbsp; • &nbsp;
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
