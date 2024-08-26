import Router from 'express'
import { isAuthenticated } from '../middlewares/authMiddleware'
import UserContoller from '../controllers/userController'


const router = Router()

router.get("/" , UserContoller.getUser)
router.put("/:id",UserContoller.updateProfile)

export {
    router as userRouter
}