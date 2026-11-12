import pino from "pino";

const isDev = process.env.NODE_ENV !== "production";

/**
 * App-wide pino logger. JSON lines in production (Vercel captures stdout);
 * pretty, one-line coloured output in development (request details stay in the JSON).
 */
export const logger = pino({
  level: process.env.LOG_LEVEL || (isDev ? "debug" : "info"),
  base: { service: "supercut-web" },
  // Never write secrets to the logs
  redact: {
    paths: ["req.headers.cookie", "req.headers.authorization", "*.password", "*.passwordHash", "password"],
    censor: "[redacted]",
  },
  ...(isDev && {
    transport: {
      target: "pino-pretty",
      options: { colorize: true, translateTime: "SYS:HH:MM:ss", ignore: "pid,hostname,service,reqId,req,res,responseTime" },
    },
  }),
});
