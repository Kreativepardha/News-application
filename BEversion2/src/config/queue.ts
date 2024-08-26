import { RedisOptions } from "bullmq"


export const redisConnection: RedisOptions = {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6444', 10),
}

export const defaultQueueConfig = {
        delay:5000,
        removeOnComplete: {
            count:100,
            age: 60 * 60 *24,
        },
        attempts:3,
        backoff:{ 
            type:"exponential",
            delay: 1000,
        },
    }

