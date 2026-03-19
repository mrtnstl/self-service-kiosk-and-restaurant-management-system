import { Server } from "node:http";
import { closeDatabaseConn } from "../../infrastructure/db/postgres.js";
import { closeRedis } from "../../infrastructure/cache/redis.js";
import logger from "./logger.js";

export default async (eventName: string, server: Server) => {
    logger.info(`graceful shutdown called with signal: ${eventName}`);
    await closeDatabaseConn();
    await closeRedis();
    server.close();
};
