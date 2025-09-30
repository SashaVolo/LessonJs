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
const { cwd } = require("process")
const pat = path.join(__dirname,"posts.json")   //отримання шляху до файлу json
const posts =JSON.parse(fs.readFileSync(pat,"utf8"))    //конвертація json у масив
let postsCopyAfterFiler=[...posts]  //копіювання масиву 

app.get("/posts", (req,res) =>{
    const take = req.query.take //створення query параметрів 
    const skip = req.query.skip
    const filter = req.query.filter
    if(filter){
        let boolFilter;
        if (filter === "true") boolFilter = true;   //умова для конвертації filter у булевий тип
        else if (filter === "false") boolFilter = false;
        else {
            res.status(400).json("query filter isn't a bool");
            return;
        }
        if(boolFilter) postsCopyAfterFilter=posts.filter(post => post.name.includes('a'))   //обираємо елементи у яких є "а"
    }
    let postsCopyAfterSkip=[...postsCopyAfterFilter]    //копіювання масиву після фільтру
    if(skip){
        const numSkip = Number(skip)    //конвертуємо у числовий тип skip
        if(isNaN(numSkip)){
            res.status(400).json("query skip isn`t a number")   //якщо конвентаціє дає NaN
            return
        }
        postsCopyAfterSkip = postsCopyAfterFilter.slice(numSkip)    //пропускаємо перші skip елементів
    }
    let postsCopyAfterTake=[...postsCopyAfterSkip]  //копіювання масиву після skip
    if(take){
        const numTake = Number(take)
        if(isNaN(numTake)){
            res.status(400).json("query take isn`t a number")
            return
        }
        postsCopyAfterTake = postsCopyAfterSkip.slice(0,numTake)    //виводимо take елементів
    }
    
    res.status(200).json(postsCopyAfterTake)    //відправляємо 
})

app.get("/posts/:id",(req,res)=>{ //створення route параметра 
    const id = Number(req.params.id)
    if(isNaN(id)){
        res.status(400).json("id isn`t a number")
        return
    }
    const findPost=posts.find(post=>post.id ===id)  //знаходимо об'єкт по id
    if(findPost!=null){
        res.status(200).json(findPost)
    }
    else{
        res.status(404).json("not found post")
    }

})

const pathUsers = path.join(__dirname,"users.json") 
const users = JSON.parse(fs.readFileSync(pathUsers,"utf8"))

app.get("/users",(req,res)=>{
    res.status(200).json(users)     //вивід усіх користувачів
})

app.get("/users/id/:id",(req,res)=>{   //вивід користувача по id
    const fields = req.query.fields
    const id = Number(req.params.id)
    if(isNaN(id)){
        res.status(400).json("id isn`t a number")
    }
    const findId =users.find(user => user.id ===id) //знаходження користувача по id
    if(findId==null){
        res.status(404).json("not found user")
        return
    }
    let findIdFields ={}
    if(fields){     //реалізація fields параметра 
        const fieldsArr=fields.split(',')   //переводимо в масив
        fieldsArr.forEach(element => {  // ходимо по кожному ключу
            if(findId[element] !==undefined){   // якщо такий ключ є у користувача
                findIdFields[element] = findId[element]   // то записуємо у інший об'єкт цей ключ
            }
        })
        res.status(200).json(findIdFields)  //виводимо об'єкт
        return
    }
    res.status(200).json(findId)    //якщо параметром не скористувались виводимо усі дані користувача
})

app.get("/users/name/:name",(req,res)=>{ //вивід користувача за ім'ям 
    const name = req.params.name
    const filterName = users.filter(user => user.name ===name)
    if(filterName.length === 0){ //якщо масив пустий
        res.status(404).json("not found users with that name") //вивести що користувачів не знайдено 
        return
    }
    res.status(200).json(filterName)
})

app.listen(PORT, HOST, () => { //слухач
    console.log(`http://${HOST}:${PORT}`)
})

"http://127.0.0.1:8000/users"
"http://127.0.0.1:8000/users/id/"
"http://127.0.0.1:8000/users/name/"
