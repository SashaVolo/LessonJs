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
getCurrentDay()
getCurrentMonth()
getCurrentYear()

getDate()