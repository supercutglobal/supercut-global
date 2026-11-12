"use client";

import { useState, useEffect } from "react";
import Reveal from "./Reveal";

import { OFFICES, SALES_EMAIL, PHONE } from "../data/contactData";
import { cldImage } from "../lib/cloudinaryUrl";

/** `showMap`: the world map with office pins is only shown on the home page */
export function Contact({ showMap = true }) {
  const [activeOffice, setActiveOffice] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className="bg-[#0b1f4b] pt-6 sm:pt-8 md:pt-10 overflow-hidden">
      {/* Top Left: Stacked SUPER CUT Logo */}
      <div className="px-4 sm:px-8 md:px-12 lg:px-20">
        <Reveal>
          <div className="mb-1 sm:mb-2 inline-block bg-white rounded-lg px-[12px] py-[8px]">
            <img
              src="/images/supercut_logo_stacked.webp"
              alt="SUPER CUT Hardface Solutions"
              className="h-12 sm:h-16 md:h-20 lg:h-24 w-auto object-contain block"
            />
          </div>
        </Reveal>
      </div>

      {/* Center: Full-Width World Map with transparent background, static upright orientation, and 3 icons in mobile view */}
      {showMap && (
      <Reveal delay={60}>
        <div className="relative w-full mb-4 sm:mb-6 md:mb-8 select-none">
          <style>{`
            @keyframes map-sonar-ping-mobile {
              0% {
                transform: translate(-50%, -50%) scale(0.2);
                opacity: 0.9;
              }
              60% {
                opacity: 0.4;
              }
              100% {
                transform: translate(-50%, -50%) scale(2.0);
                opacity: 0;
              }
            }
            @keyframes map-sonar-ping-desktop {
              0% {
                transform: translate(-50%, -50%) scale(0.2);
                opacity: 0.9;
              }
              60% {
                opacity: 0.5;
              }
              100% {
                transform: translate(-50%, -50%) scale(3.8);
                opacity: 0;
              }
            }
            @keyframes map-pin-float {
              0%, 100% {
                transform: translateY(0px);
              }
              50% {
                transform: translateY(-4px);
              }
            }
            @keyframes map-stream-flow {
              0% {
                stroke-dashoffset: 850;
              }
              100% {
                stroke-dashoffset: 0;
              }
            }
          `}</style>

          {/* Static Upright Earth Container. Pins are placed in % of this box, so narrowing it shrinks the whole map */}
          <div className="relative w-full sm:w-[92%] md:w-[85%] lg:w-[75%] max-w-[1150px] mx-auto">
            {/* 
              Transparent Background World Map, Edge-to-Edge w-full
            */}
            <img
              src={cldImage("supercut/site/global-network-map", 1400)}
              loading="lazy"
              decoding="async"
              alt="Super Cut Global Presence Map"
              className="w-full h-auto object-contain block pointer-events-none invert opacity-40"
            />

            {/* Clean Red Flowing Connecting Stream across hubs inside the continents */}
            <svg
              viewBox="0 0 1000 500"
              className="absolute inset-0 w-full h-full pointer-events-none z-0"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="flowGradRed" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
                  <stop offset="50%" stopColor="#ffffff" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.25" />
                </linearGradient>
              </defs>

              {/* Connecting Guide Arc — anchored exactly at each pin tip */}
              <path
                d="M 180 205 Q 310 95 440 130 Q 555 155 660 210"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.2"
                strokeDasharray="4 6"
                strokeOpacity="0.3"
              />
              {/* Flowing Animated Stream */}
              <path
                d="M 180 205 Q 310 95 440 130 Q 555 155 660 210"
                fill="none"
                stroke="url(#flowGradRed)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="65 785"
                style={{ animation: "map-stream-flow 4.2s linear infinite" }}
              />
            </svg>

            {/* Red Teardrop Location Icons: the 3 real Super Cut offices (USA, UK, MENA) */}
            {OFFICES.map((office) => {
              const isHovered = activeOffice === office.id;
              const isLeftEdge = office.id === "usa";
              const isRightEdge = office.id === "mena";

              return (
                <div
                  key={office.id}
                  style={{
                    left: office.left,
                    top: office.top,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-full z-10 cursor-pointer group block"
                  onMouseEnter={() => setActiveOffice(office.id)}
                  onMouseLeave={() => setActiveOffice(null)}
                  onClick={() => setActiveOffice(activeOffice === office.id ? null : office.id)}
                >
                  {/* Delicate Non-Overlapping Red Sonar Waves at Pin Base */}
                  <div className="absolute bottom-0 left-1/2 pointer-events-none -translate-x-1/2 translate-y-1/2 w-3 h-3 sm:w-5 sm:h-5 flex items-center justify-center">
                    {/* Core red droplet dot */}
                    <div className="absolute w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-white shadow-[0_0_6px_#ffffff]" />

                    {/* Expanding Sonar Ping Ring 1 - Crimson Red (compact on mobile to prevent overlap) */}
                    <div
                      className="absolute w-4 h-4 sm:w-6 sm:h-6 rounded-full border border-white/70 bg-white/10"
                      style={{
                        // Delay is part of the shorthand: mixing it with animationDelay upsets React on rerender
                        animation: isMobile
                          ? "map-sonar-ping-mobile 2.4s cubic-bezier(0.1, 0.45, 0.3, 1) 0s infinite"
                          : "map-sonar-ping-desktop 2.6s cubic-bezier(0.1, 0.45, 0.3, 1) 0s infinite",
                      }}
                    />

                    {/* Expanding Sonar Ping Ring 2 - Crimson Red */}
                    <div
                      className="absolute w-4 h-4 sm:w-6 sm:h-6 rounded-full border border-white/50 bg-white/5"
                      style={{
                        // Delay is part of the shorthand: mixing it with animationDelay upsets React on rerender
                        animation: isMobile
                          ? "map-sonar-ping-mobile 2.4s cubic-bezier(0.1, 0.45, 0.3, 1) 1.0s infinite"
                          : "map-sonar-ping-desktop 2.6s cubic-bezier(0.1, 0.45, 0.3, 1) 1.0s infinite",
                      }}
                    />
                  </div>

                  {/* Red Teardrop Pin - Clean Vector with White Center Dot (Floating Upright) */}
                  <div
                    className="relative transform transition-all duration-200 ease-out group-hover:scale-125 group-hover:-translate-y-1"
                    style={{
                      animation: `map-pin-float 3.2s ease-in-out ${office.delay} infinite`,
                    }}
                  >
                    <svg
                      viewBox="0 0 32 44"
                      className="w-4 sm:w-5 md:w-6 lg:w-7 h-auto block drop-shadow-[0_2px_5px_rgba(0,0,0,0.3)]"
                      aria-label={office.tag}
                    >
                      {/* Teardrop pin body in vivid red */}
                      <path
                        d="M16 0C7.16344 0 0 7.16344 0 16C0 27.5 16 44 16 44C16 44 32 27.5 32 16C32 7.16344 24.8366 0 16 0Z"
                        fill="#ffffff"
                      />
                      {/* Inner center dot in pure white */}
                      <circle cx="16" cy="15" r="5" fill="#0b1f4b" />
                    </svg>
                  </div>

                  {/* Interactive Tooltip Card on Hover / Touch - Perfectly Upright Above Pin */}
                  <div
                    className={`absolute bottom-[118%] ${isLeftEdge
                      ? "left-0 sm:left-1/2 sm:-translate-x-1/2"
                      : isRightEdge
                        ? "right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2"
                        : "left-1/2 -translate-x-1/2"
                      } bg-[#13306b] border border-white/10 text-white text-xs px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg shadow-2xl whitespace-nowrap transition-all duration-150 pointer-events-none z-30 ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
                      }`}
                  >
                    <p className="font-bold text-white text-[11px] sm:text-[13px]">{office.tag}</p>
                    <p className="text-neutral-300 text-[10px] sm:text-[11.5px] mt-0.5">{office.city}</p>
                    <div
                      className={`w-2 h-2 bg-[#13306b] rotate-45 absolute -bottom-1 ${isLeftEdge
                        ? "left-3 sm:left-1/2 sm:-translate-x-1/2"
                        : isRightEdge
                          ? "right-3 sm:right-auto sm:left-1/2 sm:-translate-x-1/2"
                          : "left-1/2 -translate-x-1/2"
                        }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>
      )}

      {/* Lower Section: Divider and Contact Information. Contact links scroll to here (#contact) */}
      <div id="contact" className="px-4 sm:px-8 md:px-12 lg:px-20 scroll-mt-16">
        {/* Clean Horizontal Divider Rule */}
        <div className="w-full h-[1px] sm:h-[1.5px] bg-white/15 my-6 sm:my-8 md:my-12" />

        {/* Contact Us Section with Vertical Separator & Offices */}
        <Reveal delay={120}>
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] lg:grid-cols-[260px_1fr] gap-4 sm:gap-6 md:gap-10 lg:gap-12 items-start mb-8 sm:mb-12 md:mb-16">
            {/* Left: Contact Us : */}
            <div>
              <h2 className="text-[26px] sm:text-[32px] md:text-[38px] lg:text-[44px] font-extrabold text-white tracking-tight leading-none">
                Contact Us :
              </h2>
            </div>

            {/* Right: The 3 Offices with Vertical Divider on md+ screens */}
            <div className="border-t md:border-t-0 md:border-l-[1.5px] border-white/15 pt-4 sm:pt-5 md:pt-0 md:pl-6 lg:pl-10 space-y-4 sm:space-y-5 md:space-y-6">
              {/* Super Cut – USA */}
              <div>
                <h3 className="font-bold text-white text-[15px] sm:text-[16px] md:text-[17.5px] flex items-baseline gap-2 leading-tight">
                  <span className="text-white">•</span>
                  <span>Super Cut – USA</span>
                </h3>
                <p className="text-white/70 text-[13px] sm:text-[14px] md:text-[15.5px] pl-3.5 sm:pl-4 mt-0.5 sm:mt-1 font-normal leading-snug">
                  9463 Hwy 377 Benbrook, TX 76126, Texas.
                </p>
              </div>

              {/* Super Cut – UK */}
              <div>
                <h3 className="font-bold text-white text-[15px] sm:text-[16px] md:text-[17.5px] flex items-baseline gap-2 leading-tight">
                  <span className="text-white">•</span>
                  <span>Super Cut – UK</span>
                </h3>
                <p className="text-white/70 text-[13px] sm:text-[14px] md:text-[15.5px] pl-3.5 sm:pl-4 mt-0.5 sm:mt-1 font-normal leading-snug">
                  19 Arthur street Luton, LU1 3SF, London
                </p>
              </div>

              {/* Super Cut – MENA */}
              <div>
                <h3 className="font-bold text-white text-[15px] sm:text-[16px] md:text-[17.5px] flex items-baseline gap-2 leading-tight">
                  <span className="text-white">•</span>
                  <span>Super Cut – MENA</span>
                </h3>
                <p className="text-white/70 text-[13px] sm:text-[14px] md:text-[15.5px] pl-3.5 sm:pl-4 mt-0.5 sm:mt-1 font-normal leading-snug">
                  PO Box : 778323, Abu Dhabi United Arab Emirates
                </p>
              </div>

              {/* Email and telephone on one line (wraps on narrow phones) */}
              <div className="pt-1 flex flex-wrap items-baseline gap-x-6 sm:gap-x-8 gap-y-1.5">
                {[
                  { label: "Email", value: SALES_EMAIL, href: `mailto:${SALES_EMAIL}` },
                  { label: "Phone", value: PHONE.label, href: `tel:${PHONE.tel}` },
                ].map((c) => (
                  <p key={c.label} className="text-[13px] sm:text-[14px] md:text-[15.5px] leading-snug flex flex-wrap items-baseline gap-x-2">
                    <span className="font-bold text-white">{c.label}:</span>
                    <a href={c.href} className="text-white/70 hover:text-white hover:underline underline-offset-4 transition-colors">{c.value}</a>
                  </p>
                ))}
              </div>

            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
