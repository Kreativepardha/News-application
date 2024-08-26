import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import { mainRouter } from './routes'
import { limiter } from './config/ratelimiter'
import fileUpload from 'express-fileupload'
import logger from './config/logger'

dotenv.config()


const app = express()
const PORT = process.env.PORT || 4001
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(fileUpload())
app.use(express.urlencoded({ extended:false	}))
app.use(express.static("public"))

app.use(limiter)

app.use("/api/v1", mainRouter)

logger.error("serve started log ")

console.log("DB",process.env.DATABASE_URL)

app.listen(PORT, () => {
	console.log(`Server started at PORT: ${PORT}`)
})