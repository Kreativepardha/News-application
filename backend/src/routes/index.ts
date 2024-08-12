import { Router } from "express";
import express from 'express'
import { authRouter } from "./authRouter";
import { authMiddleware } from "../middleware/authMiddleware";
import { userRouter } from "./userRouter";

const router = express.Router()


router.use("/auth", authRouter  )
router.use("/user",authMiddleware, userRouter  )

export {
    router as mainRouter
}




