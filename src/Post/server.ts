import express from "express"
import type {Express} from "express"
import { postRouter } from "./post.router";


const HOST: string = "127.0.0.1"
const PORT: number = 8000
const app: Express = express()

app.use(express.json()); // для читання json

app.use(postRouter)

app.listen(PORT, HOST, () => { //слухач
    console.log(`http://${HOST}:${PORT}`)
})

