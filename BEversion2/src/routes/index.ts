import { Router } from "express";
import { authRouter } from "./authRouter";
import { authLimiter } from "../config/ratelimiter";
import { userRouter } from "./userRouter";
import { isAuthenticated } from "../middlewares/authMiddleware";
import { newsRouter } from "./newsRouter";
import redisCache from "../config/redisConfig";


const router =  Router()


router.use("/auth",authLimiter ,authRouter)
router.use("/user",isAuthenticated,userRouter)
router.use("/news", redisCache.route(), isAuthenticated,newsRouter)


export {
    router as mainRouter
}