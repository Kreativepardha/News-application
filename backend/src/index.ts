import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { mainRouter } from './routes'
import fileUpload from 'express-fileupload'

dotenv.config()




const app = express()
app.use(express.json())
app.use(express.urlencoded({  extended: false  }))
app.use(cors())
app.use(fileUpload())
app.use(express.static("public"))



const PORT = process.env.PORT || 3001;
app.use("/api/v1", mainRouter)




app.listen(PORT, () => console.log(`Server started at ${PORT}`));
