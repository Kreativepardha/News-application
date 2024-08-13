import express from 'express'
import { createNews, deleteNews, getAllNews, getNews, updateNews } from '../controllers/newsController'


const router = express.Router()

router.get("/",getAllNews )
router.post("/",createNews )
router.get("/:id", getNews)
router.put("/:id", updateNews)
router.delete("/:id", deleteNews)


export {
    router as newsRouter
}