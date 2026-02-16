import pino from "pino";
import config from "../config/index.js";

const isDev = config.NODE_ENV !== "production";

const logger = pino({
    level: isDev ? "debug" : "info",
    transport: isDev
        ? {
              target: "pino-pretty",
              options: {
                  colorize: true,
                  translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
              },
          }
        : undefined,
    redact: [
        "req.headers.authorization",
        "req.headers.cookie",
        "password",
        "token",
    ],
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
        level(label) {
            return { level: label.toUpperCase() };
        },
        bindings(bindings) {
            return { pid: bindings.pid, hostname: bindings.hostname };
        },
    },
    hooks: {
        logMethod(
            args: [obj: any, msg?: string | undefined, ...args: unknown[]],
            method: pino.LogFn
        ) {
            const [obj, msg, ...rest] = args;
            if (typeof obj === "object" && obj.reqId) {
                method.call(this, { ...obj, reqId: obj.reqId }, msg, ...rest);
            } else {
                method.apply(this, args);
            }
        },
    },
});

export default logger;
