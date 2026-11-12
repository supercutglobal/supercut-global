import Link from "next/link";
import Reveal from "./Reveal";
import { DISPLAY_FONT, GROTESK_FONT } from "./fonts";
import { IMAGES } from "../data/catalogueData";

function ArrowLink({ href, children }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2.5 text-white font-medium text-[15px] hover:text-white/70 transition-colors">
      {children}
      <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center transition-transform group-hover:translate-x-0.5">
        <svg viewBox="0 0 24 24" fill="none" stroke="#0b1f4b" strokeWidth={3} className="w-3 h-3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M9 7h8v8" />
        </svg>
      </span>
    </Link>
  );
}

export function HomeSections({ children }) {
  return (
    <div className="bg-[#0b1f4b] text-white" style={{ fontFamily: GROTESK_FONT }}>
      {/* Product line sections */}
      {children}

      {/* Crafting Excellence — text left, image right */}
      <section className="px-4 sm:px-8 md:px-12 lg:px-20 py-10 lg:py-14 grid lg:grid-cols-[1fr_340px] gap-10 lg:gap-20 items-center">
        <Reveal>
          <h2
            style={{ fontFamily: DISPLAY_FONT }}
            className="text-[clamp(44px,6.2vw,88px)] font-black uppercase leading-[1.04] tracking-[0.02em]"
          >
            <span className="block text-white">Engineered for</span>
            <span className="block text-white mt-1.5 sm:mt-3">Extreme Wear</span>
          </h2>
          <div className="mt-8 space-y-5 text-[17px] sm:text-[18.5px] leading-[1.65] text-white/80">
            <p>
              At SUPER CUT Hardface Solutions, we specialize in providing high-performance milling and hardfacing
              materials engineered to extend component lifespan, enhance operational efficiency, and reduce downtime
              across demanding industrial applications.
            </p>
            <p>
              Backed by years of field expertise and rigorous quality control, we deliver specialized wear solutions
              tailored to global industrial standards.
            </p>
          </div>
          <div className="mt-8">
            <ArrowLink href="/about">Learn More About Us</ArrowLink>
          </div>
        </Reveal>
        <Reveal variant="scale">
          <div className="w-full max-w-[340px] mx-auto aspect-[3/5] bg-white rounded-2xl overflow-hidden flex items-center justify-center">
            <img src={IMAGES.collage} alt="Super Cut tungsten carbide inserts" className="w-full h-auto object-contain scale-[1.2]" loading="lazy" />
          </div>
        </Reveal>
      </section>
    </div>
  );
}
