import express from 'express'
import { getUser, updateProfile } from '../controllers/userController'

const router = express.Router()

router.get("/", getUser)
router.put("/:id", updateProfile)

export {
    router as userRouter
}
