import { createClient, type RedisClientType } from "redis";
import config from "../../config/index.js";
import logger from "../../utils/logger.js";

let redisClient: RedisClientType;

export async function getRedisClient(): Promise<RedisClientType> {
    if(!redisClient){
        redisClient= createClient({
            url: config.REDIS_URL,
        })
        
        redisClient.on("error", (err)=>{
            logger.error(`redis client error: ${err.message}`);
        });
        redisClient.on("connect", ()=>{
            logger.info("redis client connected");
        });
        redisClient.on("ready", ()=>{
            logger.info("redis ready");
        });

        await redisClient.connect();
    }

    return redisClient;
}

export async function isCacheAlive(): Promise<boolean> {
    const client = await getRedisClient();
    const ping = await client.ping();
    return ping ? true : false;
}

export async function closeRedis(){
    if(redisClient?.isOpen){
        await redisClient.quit();
    }
}