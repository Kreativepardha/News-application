import redis from 'express-redis-cache';

const redisCache: any = redis({
        port:6379,
        host:"localhost",
        prefix:"news_app",
        expire: 60 * 60,
})


export default redisCache;