"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import AOS from "aos";
import "aos/dist/aos.css";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Contact } from "./Contact";
import { FloatingActions } from "./FloatingActions";
import { Toaster } from "./admin/Toaster";

export function SiteShell({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-out-quart",
      once: false,
      mirror: true,
      offset: 50,
    });

    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      touchMultiplier: 1.6,
      wheelMultiplier: 0.9,
    });
    window.__lenis = lenis;

    // Re-measure AOS offsets only when layout changes, not every frame —
    // per-frame AOS.refresh() fights Lenis and makes scrolling janky.
    const onLoad = () => AOS.refresh();
    window.addEventListener("load", onLoad);

    let raf;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", onLoad);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  // Lenis keeps its own scroll position, so a new route must reset it
  // explicitly, and AOS must pick up the new page's elements.
  useEffect(() => {
    window.__lenis?.scrollTo(0, { immediate: true });
    AOS.refreshHard();
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#0b1f4b] text-[#0b1526] antialiased overflow-x-clip" style={{ fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}>
      <style>{`html.lenis, html.lenis body { height: auto; } .lenis.lenis-smooth { scroll-behavior: auto !important; } .lenis.lenis-stopped { overflow: hidden; } ::selection { background: #ffffff; color: #0b1f4b; }`}</style>
      {isAdmin ? (
        <>
          <main>{children}</main>
          <Toaster />
        </>
      ) : (
        <>
          <Navbar />
          <FloatingActions />
          <main className="pt-[64px]">{children}</main>
          {/* Contact details on every page, like a footer (office map on the home page only); contact links scroll here */}
          <Contact showMap={pathname === "/"} />
          <Footer />
        </>
      )}
    </div>
  );
}
