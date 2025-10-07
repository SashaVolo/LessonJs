const fs = require("fs") 
const path = require("path")

const fsPromises = require("fs/promises")   //для асинх запису поста

const pat = path.join(__dirname,"../../posts.json")   //отримання шляху до файлу json
const posts =JSON.parse(fs.readFileSync(pat,"utf8"))    //конвертація json у масив
let postsCopyAfterFilter=[...posts]  //копіювання масиву 

const postService={
    getAllPosts: (filter,skip,take)=>{
        if(filter){
            let boolFilter;
            if (filter === "true") boolFilter = true;   //умова для конвертації filter у булевий тип
            else if (filter === "false") boolFilter = false;
            else {
                return{
                    status: "error",
                    message: "query filter isn't a bool"
                }
            }
            if(boolFilter) postsCopyAfterFilter=posts.filter(post => post.name.includes('a'))   //обираємо елементи у яких є "а"
        }
        let postsCopyAfterSkip=[...postsCopyAfterFilter]    //копіювання масиву після фільтру
        if(skip){
            const numSkip = Number(skip)    //конвертуємо у числовий тип skip
            if(isNaN(numSkip)){
                //якщо конвентаціє дає NaN
                return{
                    status: "error",
                    message: "query skip isn`t a number"
                }
            }
            postsCopyAfterSkip = postsCopyAfterFilter.slice(numSkip)    //пропускаємо перші skip елементів
        }
        let postsCopyAfterTake=[...postsCopyAfterSkip]  //копіювання масиву після skip
        if(take){
            const numTake = Number(take)
            if(isNaN(numTake)){
                return{
                    status: "error",
                    message: "query take isn`t a number"
                }
            }
        postsCopyAfterTake = postsCopyAfterSkip.slice(0,numTake)    //виводимо take елементів
        }
        return{
                status: "succses",
                data: postsCopyAfterTake
            }
    },
    getPostsById:(id)=>{
        if(isNaN(id)){
            return{
                status: "error",
                message: "id isn`t a number"
            }
        }
        const findPost=posts.find(post=>post.id ===id)  //знаходимо об'єкт по id
        if(findPost!=null){
            return{
                status: "succses",
                data: findPost
            }
        }
        else{
            return{
                status: "error",
                message: "not found post"
            }
        }    
    },
    CreatePost: async (body) =>{
        try{
            let arrPosts=[]
            try{ //перевірка що користувач увів все в масив, а не просто об'єктами
            arrPosts = [...body]  //копіюємо масив постів
            }catch{
                return{
                status: "error",
                message: `json is array, not object`,
                code: 400
                }
            }
            for (const p of arrPosts) {
                let {name, description, pic, likecount} = p
                if (!name || !description || !pic) {
                    return {
                        status: "error",
                        message: `server didn't can to work with this data`,
                        code: 422
                    }
                }
                if (!likecount) likecount = 0
                const id = posts.length + 1
                const post = { id, name, description, pic, likecount }
                posts.push(post)
            }
            await fsPromises.writeFile("posts.json",JSON.stringify(posts, null, 2)) //перезапис нового масиву
            return{
                status: "succses",
                data: posts
            } 
        }
        catch(err){
            return{
                status: "error",
                message: `server error 500 ${err}`,
                code: 500
            }
        }
    }

}
module.exports = postService