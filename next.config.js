/** @type {import('next').NextConfig} */

// Sent on every response. A full script CSP is left out on purpose: Next.js inline scripts and
// the inline <style> blocks used by the animations would need nonces; frame-ancestors alone is safe.
const securityHeaders = [
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  // Browsers only honour this over HTTPS, so it is harmless in local development
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
];

const nextConfig = {
  // Lets a production build run alongside `next dev` without sharing .next
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Don't advertise the framework in an X-Powered-By header
  poweredByHeader: false,
  // pino runs its pretty-printer in a worker thread; it must load from node_modules, not the bundle
  serverExternalPackages: ["pino", "pino-pretty", "thread-stream"],
  // The route reads this PDF at runtime, which the file tracer can't see; without this it is left out of serverless deployments
  outputFileTracingIncludes: {
    "/api/catalogue/download": ["./private/catalogue.pdf"],
  },
  experimental: {
    reactCompiler: true,
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Admin pages and APIs must never be stored by browsers or shared caches
      { source: "/admin/:path*", headers: [{ key: "Cache-Control", value: "no-store" }] },
      { source: "/api/admin/:path*", headers: [{ key: "Cache-Control", value: "no-store" }] },
    ];
  },
};

export default nextConfig;
