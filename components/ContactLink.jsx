"use client";

// The Contact section sits above the footer on every page, so contact links scroll to it
// (through Lenis when it is running) instead of opening another page.
function scrollToContact(e) {
  const target = document.getElementById("contact");
  if (!target) return;
  e?.preventDefault();
  if (window.__lenis) window.__lenis.scrollTo(target, { offset: -64 });
  else target.scrollIntoView({ behavior: "smooth" });
}

export function ContactLink({ onClick, children, ...props }) {
  return (
    <a
      {...props}
      href="#contact"
      onClick={(e) => {
        scrollToContact(e);
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
