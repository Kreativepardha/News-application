import express from 'express'
import { getUser, updateUser } from '../controllers/userController'

const router = express.Router()

router.get("/", getUser)
router.put("/", updateUser)

export {
    router as userRouter
}
