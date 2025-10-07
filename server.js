const express = require("express")

const postRouter = require("./src/Post/post.router")


const HOST = "127.0.0.1"
const PORT = 8000
const app = express()

app.use(express.json()); // для читання json

app.use(postRouter)

app.listen(PORT, HOST, () => { //слухач
    console.log(`http://${HOST}:${PORT}`)
})

