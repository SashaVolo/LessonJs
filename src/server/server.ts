import express from "express"
import type {Express} from "express"
import { postRouter } from "../Post/post.router";
import { tagRouter } from "../Tag/tag.router";
import { userRouter } from "../User/user.router";


const HOST: string = "127.0.0.1"
const PORT: number = 8000
const app: Express = express()

app.use(express.json()); // для читання json

app.use(postRouter)
app.use(tagRouter)
app.use(userRouter)

app.listen(PORT, HOST, () => { //слухач
    console.log(`http://${HOST}:${PORT}`)
})

