import config from "./config/index.js";
import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";

import { initRoutes } from "./routes/index.js";
import reqLoggerMW from "./common/middleware/reqLoggerMW.js";
import gracefulShutdown from "./common/utils/gracefulShutdown.js";
import { isDBAlive } from "./infrastructure/db/postgres.js";
import { isCacheAlive } from "./infrastructure/cache/redis.js";
import logger from "./common/utils/logger.js";

const app = express();

const PORT = config.PORT;

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(cors(config.CORS_OPTIONS));
app.use(reqLoggerMW());

(async () => {
    try {
        await isDBAlive();
        await isCacheAlive();
    } catch (err: any) {
        logger.error(err.message);
        process.exit(1);
    }
})();

initRoutes(app);

const server = app.listen(PORT, () =>
    logger.info(`server listening on port ${PORT}`)
);

process.on("SIGINT", async eventName => {
    await gracefulShutdown(eventName, server);
});
process.on("SIGTERM", async eventName => {
    await gracefulShutdown(eventName, server);
});
