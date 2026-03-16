import { Server } from "node:http";
import { closeRedis } from "../config/redis.js";
import logger from "./logger.js";

// TODO: close database connection
export default async (eventName: string, server: Server) => {
    logger.info(`Graceful Shutdown called with signal: ${eventName}`);
    await closeRedis();
    server.close();
};
