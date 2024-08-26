import redis from 'express-redis-cache'


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const redisCache: any = redis({
    port:6444,
    host:"localhost",
    prefix:"temp_news",
    expire: 60 * 60
})



  
export default redisCache