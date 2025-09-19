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

app.listen(PORT, HOST, () => {
    console.log(`http://${HOST}:${PORT}`)
})