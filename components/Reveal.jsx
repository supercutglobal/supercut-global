"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

// AOS-powered reveal — replaces custom IntersectionObserver.
// Maps variant prop to AOS animations. Animations trigger every time on scroll.
let aosInitialized = false;

function initAOS() {
  if (!aosInitialized) {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: false,
      mirror: true,
      offset: 50,
    });
    aosInitialized = true;
  }
}

export default function Reveal({ children, delay = 0, variant = "fade-up", className = "", as: Tag = "div" }) {
  useEffect(() => {
    initAOS();
  }, []);

  // Map old variant names to AOS animations
  const aosMap = {
    scale: "zoom-in",
    "fade-up": "fade-up",
    "fade-down": "fade-down",
    "fade-left": "fade-left",
    "fade-right": "fade-right",
    "flip-left": "flip-left",
    "flip-right": "flip-right",
    "flip-up": "flip-up",
    "zoom-in": "zoom-in",
    "zoom-out": "zoom-out",
    "slide-up": "slide-up",
  };

  const aosAnimation = aosMap[variant] || variant;

  return (
    <Tag
      data-aos={aosAnimation}
      data-aos-delay={delay}
      data-aos-once="false"
      className={className}
    >
      {children}
    </Tag>
  );
}
