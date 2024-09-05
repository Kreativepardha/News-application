import { Router } from "express";
import { NewsController } from "../controllers/newsController";
import { isAuthenticated } from "../middlewares/authMiddleware";


const router = Router()

router.get("/" ,isAuthenticated ,NewsController.getAllNews)
router.post("/",   NewsController.createNews)
router.get("/:id", NewsController.getNews)
router.get("/:id",NewsController.updateNews)
router.get("/:id",NewsController.deleteNews)

export {
    router as newsRouter
}