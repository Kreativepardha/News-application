import rateLimit from "express-rate-limit";



export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, //15 mins
    max: 10,
    message: "Too Many registration/Login attempts, please try again later"
})

export const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, //1 hour
    limit: 100,
})
