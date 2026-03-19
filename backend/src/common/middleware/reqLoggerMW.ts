import { RequestHandler } from "express";
import logger from "../utils/logger.js";

export default (): RequestHandler => {
    return async (req, res, next) => {
        const start = Date.now();

        res.on("finish", () => {
            const duration = Date.now() - start;
            const { method, originalUrl, ip } = req;
            const ipFallback =
                (req.headers["x-forwarded-for"] as string)
                    ?.split(",")[0]
                    .trim() || req.socket.remoteAddress;
            const { statusCode } = res;

            logger.info({
                req: { method, url: originalUrl, ip },
                res: { statusCode },
                duration: duration,
                mgs: `${method} ${originalUrl} ${statusCode} ${duration}ms`,
            });
        });

        return next();
    };
};
