import { postService } from "./post.service"
import { IControllerContract } from "./post.types";
//в контролері в мене немає визовів типів, які я створював, тому не імпортую

export const postController:IControllerContract = {
    getAllPosts: (req,res)=>{
        const filter = req.query.filter
        const skip = req.query.skip;
        const take = req.query.take;
        const resp  = postService.getAllPosts(filter,skip,take)
        if(resp.status =="error"||resp.data==undefined){
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
        const resp= await postService.CreatePost(req.body)
        if(resp.status =="error"){
            res.status(Number(resp.code)).json(resp.message)
            return
        }
        res.status(200).json(resp.data)
    },
    updatePost: async (req,res)=>{
        const id = Number(req.params.id)
        const resp= await postService.UpdatePost(id, req.body);

        if(resp.status =="error"){
            res.status(Number(resp.code)).json(resp.message)
            return
        }
        res.status(200).json(resp.data)    
    }
}
