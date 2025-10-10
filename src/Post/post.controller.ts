// const postService=require("./post.service")
import { postService } from "./post.service"
import type { Request,Response } from "express"
export const postController = {
    getAllPosts: (req: Request,res:Response)=>{
        const filter = req.query.filter as string | undefined;
        const skip = req.query.skip as string | undefined;
        const take = req.query.take as string | undefined;
        const resp  = postService.getAllPosts(filter,skip,take)
        if(resp.status =="error"){
            res.status(400).json(resp.message)
            return
        }
        res.status(200).json(resp.data)    //відправляємо 
    },
    getPostsById:(req: Request,res:Response)=>{
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
    createPost: async (req: Request,res:Response)=>{
        const resp = await postService.CreatePost(req.body)
        if(resp.status =="error"){
            res.status(Number(resp.code)).json(resp.message)
            return
        }
        res.status(200).json(resp.data)
    }
}
