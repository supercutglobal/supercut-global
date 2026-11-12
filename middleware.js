import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "./lib/session";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Content-Security-Policy with a fresh nonce per request: only scripts carrying the nonce (Next.js
 * adds it to its own) or loaded by them ('strict-dynamic') may run, so injected scripts are blocked.
 * Inline styles stay allowed because the animations use <style> blocks and style attributes.
 */
function contentSecurityPolicy(nonce) {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https://res.cloudinary.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    // Admin image uploads go straight to Cloudinary; dev needs websockets for hot reload
    `connect-src 'self' https://api.cloudinary.com${isDev ? " ws: wss:" : ""}`,
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // First gate for the dashboard: no valid session cookie, no page.
  // Pages and API routes still re-check the admin role against the database.
  if (pathname === "/admin" || (pathname.startsWith("/admin/") && !pathname.startsWith("/admin/login"))) {
    const session = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
    if (session?.role !== "admin") return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const nonce = btoa(crypto.randomUUID());
  const csp = contentSecurityPolicy(nonce);
  // Next.js reads the nonce from the request's CSP header and puts it on its own <script> tags
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  // Pages only: API responses, build assets and public files don't need a per-request nonce.
  // Prefetches are included on purpose, so the admin gate above always runs.
  matcher: ["/((?!api/|_next/static|_next/image|images/|favicon\\.svg|icons\\.svg).*)"],
};
