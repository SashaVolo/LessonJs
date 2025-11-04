import { postService } from "./post.service"
import { IControllerContract } from "./post.types";

export const postController:IControllerContract = {
    getAllPosts:async (req,res)=>{
        const skip = req.query.skip;
        const take = req.query.take;
        const resp  = await postService.getAllPosts(skip,take)
        if(resp.status =="error"){
            res.status(400).json(resp.message)
            return
        }
        res.status(200).json(resp.dataPosts)    //відправляємо 
    },
    getPostsById:async(req,res)=>{
        const id = Number(req.params.id)
        const resp = await postService.getPostsById(id)
        if(resp.status =="error"){
            res.status(resp.code).json(resp.message)
            return
        }
        res.status(200).json(resp.dataPost)
    },
    createPost: async (req,res)=>{
        const resp= await postService.CreatePost(req.body)
        res.status(Number(resp.code)).json(resp.message)
    },
    updatePost: async (req,res)=>{
        const id = Number(req.params.id)
        const resp= await postService.UpdatePost(id, req.body);
        res.status(Number(resp.code)).json(resp.message)   
    },
    deletePost: async (req,res) =>{
        const id = Number(req.params.id)
        const resp = await postService.deletePost
        (id)
        if(resp.status =="error"){
            if(resp.status =="error"){
            res.status(resp.code).json(resp.message)
            return
        }
        }
        res.status(200).json(resp.dataPost)
    }
}
