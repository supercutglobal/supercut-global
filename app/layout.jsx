import "./globals.css";
import { headers } from "next/headers";
import { SiteShell } from "../components/SiteShell";

export const metadata = {
  title: {
    default: "SUPER CUT — Hardface Solutions | Premium Milling & Wear-Resistant Alloys",
    template: "%s | SUPER CUT Hardface Solutions",
  },
  description:
    "SUPER CUT Hardface Solutions — Premium Milling, Hardface & Wear-Resistant Alloys. Tungsten Carbide Composite Rods, Inserts, Hardfacing Rope, Brazing Alloys.",
  icons: {
    icon: "/images/supercut_logo_stacked.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }) {
  // Reading the request headers renders every page per request, which the CSP nonce set in
  // middleware.js needs (a pre-built page can't carry a per-request nonce). Data stays cached.
  await headers();
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800&family=Oswald:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
