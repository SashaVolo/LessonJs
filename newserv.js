const moment = require("moment")

function getCurrentDay(){
    console.log(moment().format('dddd'))
}
function getCurrentMonth(){
    console.log(moment().format('MMMM'))
}
function getCurrentYear(){
    console.log(moment().format('YYYY'))
}
function getDate(){
    console.log(moment().format("YYYY/MM/DD HH:mm:ss"))
}
function getWeekDay(){
    return moment().format('dddd')
}

function getTime(){

    return moment().format("HH:mm:ss")
    
}

getCurrentDay()
getCurrentMonth()
getCurrentYear()


console.log(getWeekDay())

const express = require("express")

const HOST = "127.0.0.1"
const PORT = 8000
const app = express()

let date = getDate()


app.get("/timestamp", (req,res) =>{
    res.json({timestamp: getTime()})
})

const fs = require("fs")
const path = require("path")
const pat = path.join(__dirname,"posts.json")
const posts =JSON.parse(fs.readFileSync(pat,"utf8"))
let postsCopyAfterFiler=[...posts]
console.log(posts[0].id)

app.get("/posts", (req,res) =>{
    //res.json(posts)
    const take = req.query.take
    const skip = req.query.skip
    const filter = req.query.filter
    if(filter){
        let boolFilter;
        if (filter === "true") boolFilter = true;
        else if (filter === "false") boolFilter = false;
        else {
            res.status(400).json("query filter isn't a bool");
            return;
        }
        if(boolFilter) postsCopyAfterFilter=posts.filter(post => post.name.includes('a'))
    }
    let postsCopyAfterSkip=[...postsCopyAfterFilter]
    if(skip){
        const numSkip = Number(skip)
        if(isNaN(numSkip)){
            res.status(400).json("query skip isn`t a number")
            return
        }
        postsCopyAfterSkip = postsCopyAfterFilter.slice(numSkip)
    }
    let postsCopyAfterTake=[...postsCopyAfterSkip]
    if(take){
        const numTake = Number(take)
        if(isNaN(numTake)){
            res.status(400).json("query take isn`t a number")
            return
        }
        console.log("y5jjtut")
        postsCopyAfterTake = postsCopyAfterSkip.slice(0,numTake)
    }
    
    res.status(200).json(postsCopyAfterTake)
})

app.get("/posts/:id",(req,res)=>{
    const id = Number(req.params.id)
    if(isNaN(id)){
        console.log(id)
        res.status(400).json("id isn`t a number")
        return
    }
    const findPost=posts.find(post=>post.id ===id)
    if(findPost!=null){
        res.status(200).json(findPost)
    }
    else{
        res.status(404).json("not found post")
    }

})

app.listen(PORT, HOST, () => {
    console.log(`http://${HOST}:${PORT}`)
})
