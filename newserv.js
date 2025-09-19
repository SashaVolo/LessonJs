const express = require("express")

const HOST = "127.0.0.1"
const PORT = 8000
const app = express()

const users = [
    {
        id: "001",
        name: "Mykola",
        age: 27
    },
    {
        id: "002",
        name: "Bohdan",
        age: 19
    },
    {
        id: "003",
        name: "Felix",
        age: 14
    },
    {
        id: "004",
        name: "Swagй",
        age: 67
    }
]

app.get("/", (req,res) =>{
    res.json(users)
})
app.get("/user", (req,res) =>{

    res.json(users[Math.floor(Math.random() * users.length)])
})

app.listen(PORT, HOST, () => {
    console.log(`http://${HOST}:${PORT}`)
})