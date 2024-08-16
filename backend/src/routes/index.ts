import { Router } from "express";
import express from 'express'
import { authRouter } from "./authRouter";
import { authMiddleware } from "../middleware/authMiddleware";
import { userRouter } from "./userRouter";
import { newsRouter } from "./newsRouter";
import redisCache from "../DB/redisConfig";

const router = express.Router()


router.use("/auth", authRouter  )
router.use("/user",authMiddleware, userRouter  )
router.use("/news",  redisCache.route() ,authMiddleware,newsRouter )

export {
    router as mainRouter
}




