"use client";

import Reveal from "./Reveal";
import { CONDENSED_FONT } from "./fonts";
import { OFFERINGS_LEFT, OFFERINGS_RIGHT } from "../data/aboutData";


export function About() {
  return (
    <section className="bg-[#0b1f4b] py-16 lg:py-24 text-white">
      <div className="px-4 sm:px-8 md:px-12 lg:px-20">

        {/* Top Section: About Box (Left) + Lead Paragraph (Right) */}
        <div className="grid lg:grid-cols-[400px_1fr] xl:grid-cols-[440px_1fr] gap-6 lg:gap-10 items-center mb-7 sm:mb-8">
          {/* About Us Box */}
          <Reveal variant="fade-right">
            <div className="border border-white/15 rounded-2xl p-6 sm:p-8 bg-[#13306b]">
              <div className="flex items-stretch gap-4">
                <div className="w-[4px] bg-white rounded-xs shrink-0 self-stretch my-1" />
                <div>
                  <h2
                    style={{ fontFamily: CONDENSED_FONT }}
                    className="uppercase text-[46px] sm:text-[58px] lg:text-[64px] font-black leading-[0.88] tracking-tight"
                  >
                    <span className="text-white">ABOUT</span>{" "}
                    <span className="text-white">US</span>
                  </h2>
                  <p className="mt-3 text-[15px] sm:text-[16px] text-white leading-tight">
                    <strong className="font-black text-white">SUPER CUT</strong>{" "}
                    <span className="font-medium text-white/60">Hardface Solutions</span>
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Lead Description */}
          <Reveal delay={100} variant="fade-left">
            <p className="text-[16px] sm:text-[17.5px] lg:text-[18.5px] leading-[1.65] text-white/80">
              <strong className="font-bold text-white">
                At SUPER CUT Hardface Solutions,
              </strong>{" "}
              we specialize in providing high-performance milling and hardfacing
              materials engineered to extend component lifespan, enhance operational
              efficiency, and reduce downtime across demanding industrial applications.
              Backed by years of field expertise and rigorous quality control, we
              deliver specialized wear solutions tailored to global industrial
              standards.
            </p>
          </Reveal>
        </div>

        {/* We're Global */}
        <Reveal delay={150} className="mb-8 border-l-4 border-white pl-4 sm:pl-5">
          <h3 style={{ fontFamily: CONDENSED_FONT }} className="font-bold uppercase tracking-[0.1em] text-[13px] text-white mb-2">
            We're Global
          </h3>
          <p className="text-[16px] sm:text-[17.5px] lg:text-[18.5px] leading-[1.65] text-white/80">
            With an established presence across key markets in the Middle East, Europe, and the USA, our
            global network allows us to serve clients efficiently with expert technical
            assistance and rapid deployment.
          </p>
        </Reveal>

        {/* We're Comprehensive — Core Product Offerings */}
        <div className="mb-12 border-l-4 border-white pl-4 sm:pl-5">
          <Reveal delay={200}>
            <h3 style={{ fontFamily: CONDENSED_FONT }} className="font-bold uppercase tracking-[0.1em] text-[13px] text-white mb-2">
              We're Comprehensive
            </h3>
            <h3 className="font-extrabold text-[21px] sm:text-[23px] text-white mb-4">
              Our Core Product Offerings:
            </h3>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-x-10 lg:gap-x-14 gap-y-3">
            {/* Left Column Offerings */}
            <Reveal delay={250}>
              <ul className="space-y-3 text-[15.5px] sm:text-[17px] leading-[1.5] text-white/80">
                {OFFERINGS_LEFT.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="text-xl leading-none font-bold text-white select-none mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* Right Column Offerings */}
            <Reveal delay={300}>
              <ul className="space-y-3 text-[15.5px] sm:text-[17px] leading-[1.5] text-white/80">
                {OFFERINGS_RIGHT.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="text-xl leading-none font-bold text-white select-none mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>

      </div>

    </section>
  );
}
