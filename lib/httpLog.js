import { NextResponse } from "next/server";
import { logger } from "./logger";
import { clientIp } from "./http";

/**
 * Wraps a route handler with pino HTTP logging, in the same shape pino-http uses
 * (req, res, responseTime), since App Router handlers have no Node http server to hook.
 * - one "request completed" line per request; warn for 4xx, error for 5xx
 * - an x-request-id header on every response, also on each log line
 * - unexpected errors are logged with their stack and answered with a JSON 500
 * The handler receives a child logger as its third argument for its own events.
 */
export function withHttpLog(handler) {
  return async function loggedHandler(request, context) {
    const start = performance.now();
    const reqId = request.headers.get("x-request-id") || crypto.randomUUID();
    const url = new URL(request.url);
    const req = {
      id: reqId,
      method: request.method,
      url: url.pathname + url.search,
      remoteAddress: clientIp(request),
      userAgent: request.headers.get("user-agent") || undefined,
    };
    const log = logger.child({ reqId });

    let response;
    try {
      response = await handler(request, context, log);
    } catch (err) {
      log.error({ err, req }, "request failed");
      response = NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    const status = response.status;
    const responseTime = Math.round(performance.now() - start);
    const level = status >= 500 ? "error" : status >= 400 ? "warn" : "info";
    log[level](
      { req, res: { statusCode: status }, responseTime },
      `${req.method} ${req.url} ${status} ${responseTime}ms`
    );
    response.headers.set("x-request-id", reqId);
    return response;
  };
}
