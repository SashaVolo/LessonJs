import { tagService } from "./tag.service"
import { IControllerContract } from "./tag.types";


export const tagController:IControllerContract = {
    getAllTags:async (req,res)=>{
        const skip = req.query.skip;
        const take = req.query.take;
        const resp  = await tagService.getAllTags(skip,take)
        if(resp.status =="error"){
            res.status(400).json(resp.message)
            return
        }
        res.status(200).json(resp.dataTags)    //відправляємо 
    },
    getTagsById:async(req,res)=>{
        const id = Number(req.params.id)
        const resp = await tagService.getTagsById(id)
        if(resp.status =="error"){
            res.status(resp.code).json(resp.message)
            return
        }
        res.status(200).json(resp.dataTag)
    },
    createTag: async (req,res)=>{
        const resp= await tagService.createTag(req.body)
        res.status(Number(resp.code)).json(resp.message)
    },
    updateTag: async (req,res)=>{
        const id = Number(req.params.id)
        const resp= await tagService.updateTag(id, req.body);
        res.status(Number(resp.code)).json(resp.message)   
    },
    deleteTag: async (req,res) =>{
        const id = Number(req.params.id)
        const resp = await tagService.deleteTag
        (id)
        if(resp.status =="error"){
            if(resp.status =="error"){
            res.status(resp.code).json(resp.message)
            return
        }
        }
        res.status(200).json(resp.dataTag)
    }
}
