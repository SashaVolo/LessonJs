const postService=require("./post.service")
const postController = {
    getAllPosts: (req,res)=>{
        const take = req.query.take //створення query параметрів 
        const skip = req.query.skip
        const filter = req.query.filter
        const resp  = postService.getAllPosts(filter,skip,take)
        if(resp.status =="error"){
            res.status(400).json(resp.message)
            return
        }
        res.status(200).json(resp.data)    //відправляємо 
    },
    getPostsById:(req,res)=>{
        const id = Number(req.params.id)
        const resp = postService.getPostsById(id)
        if(resp.status =="error"){
            if(resp.message=="not found post"){ //якщо не знайдено то 404
                res.status(404).json(resp.message)
                return
            }
            res.status(400).json(resp.message) //якщо інше то це не число, 400
            return
        }
        res.status(200).json(resp.data)
    },
    createPost: async (req,res)=>{
        const resp = await postService.CreatePost(req.body)
        if(resp.status =="error"){
            res.status(resp.code).json(resp.message)
            return
        }
        res.status(200).json(resp.data)
    }
}

module.exports = postController