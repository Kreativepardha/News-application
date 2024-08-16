import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { mainRouter } from './routes'
import fileUpload from 'express-fileupload'
import helmet from 'helmet'
import { limiter } from './config/ratelimiter'
import logger from './config/logger'

dotenv.config()




const app = express()
app.use(express.json())
app.use(express.urlencoded({  extended: false  }))
app.use(helmet())
app.use(cors())
app.use(fileUpload())
app.use(express.static("public"))

app.use(limiter)

const PORT = process.env.PORT || 3001;
app.use("/api/v1", mainRouter)


logger.error("Hey i am just testing ..")


app.listen(PORT, () => console.log(`Server started at ${PORT}`));
