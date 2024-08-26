import redis from 'express-redis-cache'


const redisCache: any = redis({
    port:6444,
    host:"localhost",
    prefix:"temp_news",
    expire: 60 * 60
})

// redisCache.on('message', (message: string) => {
//     console.log('Redis cache event:', message);
//   });
  
//   redisCache.on('connected', () => {
//     console.log('Connected to Redis');
//   });
  
//   redisCache.on('disconnected', () => {
//     console.log('Disconnected from Redis');
//   });
  
//   redisCache.on('error', (err: Error) => {
//     console.error('Redis connection error:', err);
//   });

  
export default redisCache