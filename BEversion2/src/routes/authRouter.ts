import { Router } from "express";
import AuthController from "../controllers/AuthController";
import { isAuthenticated } from "../middlewares/authMiddleware";


const router = Router()

router.post("/register",AuthController.register)
router.post("/login",AuthController.login)
router.get("/send-email", AuthController.sendToEmail)


export {
    router as authRouter
}