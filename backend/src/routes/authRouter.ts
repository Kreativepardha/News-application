import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware'
import { login , register} from '../controllers/authController'

const router = express.Router()

router.post("/register", register)
router.post("/login",login)


export {
    router as authRouter
}
