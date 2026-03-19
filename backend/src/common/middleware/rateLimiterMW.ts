import { RequestHandler } from "express";
import { RateLimiterRedis } from "rate-limiter-flexible";
import { getRedisClient } from "../../infrastructure/cache/redis.js";
import { RedisClientType } from "redis";
import logger from "../utils/logger.js";

let redisClient: RedisClientType;
let limiter: RateLimiterRedis;

(async ()=>{
    redisClient = await getRedisClient();
    limiter = new RateLimiterRedis({
      storeClient: redisClient,
      points: 100,
      duration: 900,
    });
})();

export default (): RequestHandler=>{
    return async (req, res, next)=>{
        try{
            await limiter.consume(req.ip as string)
            return next();
        } catch(err: any){
            logger.info("ratelimiter reject:", err!.message)
            return res.status(429).json({ error: 'Too Many Requests' });
        }
    }
}