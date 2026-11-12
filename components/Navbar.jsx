"use client";


import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "../data/catalogueData";
import { CONDENSED_FONT } from "./fonts";
import { ContactLink } from "./ContactLink";
import { CatalogueButton } from "./CatalogueDownload";
import { WEBMAIL_URL } from "../data/contactData";

// Every public page is rendered per request (for the CSP nonce), so Next's default prefetch stores
// nothing and each click would wait on the server. A full prefetch makes these clicks instant.
const linkPropsFor = (href) =>
  href === "#contact" ? { NavLink: ContactLink } : { NavLink: Link, prefetch: true };

function Logo() {
  return (
    <Link href="/" prefetch className="flex items-center shrink-0 bg-white rounded-lg px-[10px] py-[6px] sm:px-[12px] sm:py-[8px]">
      <img
        src="/images/supercut_logo_horizontal.webp"
        alt="SUPER CUT Hardface Solutions"
        className="h-7 sm:h-8 w-auto object-contain"
      />
    </Link>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile drawer whenever the route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40 animate-nav-slide-down transition-all duration-300 bg-[#0b1f4b]/95 backdrop-blur-md">
        <div className="px-4 sm:px-8 md:px-12 lg:px-20 h-[64px] flex items-center justify-between gap-x-4">
          <Logo />

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 flex-1 justify-center">
            {NAV_LINKS.map((l) => {
              const active = pathname === l.href;
              const { NavLink, ...linkProps } = linkPropsFor(l.href);
              return (
                <NavLink
                  key={l.href}
                  {...linkProps}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  style={{ fontFamily: CONDENSED_FONT }}
                  className={`group relative text-[12.5px] xl:text-[13px] font-semibold tracking-[0.12em] xl:tracking-[0.14em] uppercase transition-colors whitespace-nowrap py-1 ${active ? "text-white" : "text-white/70 hover:text-white"
                    }`}
                >
                  {l.label}
                  <span
                    className={`absolute left-0 -bottom-0.5 h-[2px] w-full bg-white origin-left transition-transform duration-300 ease-out ${active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                  />
                </NavLink>
              );
            })}
          </nav>

          {/* Right Action Group */}
          <div className="flex items-center gap-2 xl:gap-3">
            <a
              href={WEBMAIL_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: CONDENSED_FONT }}
              className="hidden lg:inline-block text-[13px] font-bold tracking-[0.12em] uppercase border border-white/40 text-white px-5 py-2.5 rounded-lg hover:bg-white/10 transition-colors shrink-0"
            >
              Login
            </a>
            <CatalogueButton
              style={{ fontFamily: CONDENSED_FONT }}
              className="hidden lg:inline-block text-[13px] font-bold tracking-[0.12em] uppercase bg-white text-[#0b1f4b] px-5 py-2.5 rounded-lg hover:bg-[#dbe4f3] transition-colors shrink-0"
            >
              Get Quote
            </CatalogueButton>

            {/* Mobile / Tablet Hamburger */}
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden w-11 h-11 flex items-center justify-center rounded-lg border border-white/20 hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <div className="w-5 h-3.5 flex flex-col justify-between items-center pointer-events-none">
                <span className={`h-[2px] w-5 bg-white rounded-full transition-all duration-300 origin-center ${open ? "rotate-45 translate-y-[5px]" : ""}`} />
                <span className={`h-[2px] w-5 bg-white rounded-full transition-all duration-200 ${open ? "opacity-0 scale-0" : "opacity-100"}`} />
                <span className={`h-[2px] w-5 bg-white rounded-full transition-all duration-300 origin-center ${open ? "-rotate-45 -translate-y-[7px]" : ""}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] bg-[#0b1f4b] border-t border-white/10 ${open ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
            }`}
        >
          <div className="px-4 sm:px-8 md:px-12 lg:px-20 py-3 sm:py-4 space-y-0.5">
            {NAV_LINKS.map((l, index) => {
              const { NavLink, ...linkProps } = linkPropsFor(l.href);
              return (
              <NavLink
                key={l.href}
                {...linkProps}
                href={l.href}
                onClick={() => setOpen(false)}
                aria-current={pathname === l.href ? "page" : undefined}
                style={{
                  fontFamily: CONDENSED_FONT,
                  transitionDelay: open ? `${40 + index * 25}ms` : "0ms",
                }}
                className={`block py-2.5 sm:py-3 border-b border-white/10 text-[15px] sm:text-[16px] font-bold tracking-[0.12em] uppercase transition-all duration-300 ${pathname === l.href ? "text-white" : "text-white/90 hover:text-white"
                  } ${open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
              >
                {l.label}
              </NavLink>
            );
            })}

            <div
              style={{ transitionDelay: open ? `${40 + NAV_LINKS.length * 25}ms` : "0ms" }}
              className={`pt-3 space-y-2.5 transition-all duration-300 ${open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
            >
              <a
                href={WEBMAIL_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                style={{ fontFamily: CONDENSED_FONT }}
                className="block w-full py-3.5 text-center text-[14px] font-bold tracking-[0.14em] uppercase border border-white/40 text-white rounded-lg hover:bg-white/10 active:scale-[0.99] transition-all"
              >
                Login
              </a>
              <CatalogueButton
                onClick={() => setOpen(false)}
                style={{ fontFamily: CONDENSED_FONT }}
                className="block w-full py-3.5 text-center text-[14px] font-bold tracking-[0.14em] uppercase bg-white text-[#0b1f4b] rounded-lg hover:bg-[#dbe4f3] active:scale-[0.99] shadow-md transition-all"
              >
                Get Quote
              </CatalogueButton>
            </div>
          </div>
        </div>
      </header>

      {/* Modal Backdrop Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`lg:hidden fixed inset-0 top-[64px] bg-black/60 backdrop-blur-sm transition-opacity duration-300 z-30 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        aria-hidden="true"
      />
    </>
  );
}
