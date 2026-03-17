import { Server } from "node:http";
import { closeDatabaseConn } from "../internal/db/postgres.js";
import { closeRedis } from "../internal/cache/redis.js";
import logger from "./logger.js";

export default async (eventName: string, server: Server) => {
    logger.info(`graceful shutdown called with signal: ${eventName}`);
    await closeDatabaseConn();
    await closeRedis();
    server.close();
};
