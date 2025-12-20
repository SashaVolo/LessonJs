
import type { CreatePostChecked, ServiceResponse, IServiceContract, UpdatePostChecked, Post } from "./post.types"

import { PostRepository } from "./post.repository";


export const postService: IServiceContract = {
    getAllPosts: async (skip?, take?) => {
        let posts: Post[] | null
        let numSkip: number = 0
        if (skip) {
            numSkip = Number(skip);
            if (isNaN(numSkip)) {
                const respon: ServiceResponse = {
                    status: "error",
                    message: "query skip isn`t a number",
                    code: 400
                }
                return respon
            }
        }
        else {
            numSkip = 0
        }
        if (take) {
            const numTake: number = Number(take);
            if (isNaN(numTake)) {
                const respon: ServiceResponse = {
                    status: "error",
                    message: "query take isn`t a number",
                    code: 400
                }
                return respon
            }
            posts = await PostRepository.getAllPosts({ skip: numSkip, take: Number(take) }) // запит у бд
        }
        else {
            posts = await PostRepository.getAllPosts({ skip: numSkip }) // запит у бд
        }

        if (posts == null) {
            const respon: ServiceResponse = {
                status: "error",
                message: "Not found posts",
                code: 404
            }
            return respon
        }
        const respon: ServiceResponse = {
            status: "success",
            message: `success`,
            dataPosts: posts,
            code: 200
        }
        return respon
    },

    getPostsById: async (id) => {
        if (isNaN(id)) {
            const respon: ServiceResponse = {
                status: "error",
                message: "id isn`t a number",
                code: 400
            }
            return respon
        }
        const findPost = await PostRepository.getPostsById(id) //запит у бд
        if (findPost == null) {
            const respon: ServiceResponse = {
                status: "error",
                message: "Not found posts",
                code: 404
            }
            return respon
        }
        const respon: ServiceResponse = {
            status: "success",
            message: `success`,
            dataPost: findPost,
            code: 200
        }
        return respon
    },

    CreatePost: async (body: CreatePostChecked[],id:number) => {
        
        let arrPosts: CreatePostChecked[] = []
        arrPosts = [...body]
        let dataRep: { data: CreatePostChecked } //для відправки у бд
        for (const p of arrPosts) {
            let { name, description, pic, likeCount, tags } = p
            if (!name || !description || !pic) {
                const respon: ServiceResponse = {
                    status: "error",
                    message: `server didn't can to work with this data`,
                    code: 422
                }
                return respon
            }
            if (!likeCount) likeCount = 0
            let createdBy = id;
            if (!Array.isArray(tags) || tags.length === 0) { //перевірка на наявніть тегів
                dataRep = {
                    data: {
                        createdBy: createdBy,
                        name: name,
                        description: description,
                        pic: pic,
                        likeCount: likeCount,
                    }
                }
            }
            else { //якщо теги є тоді прив'язати чи створити теги
                dataRep = {
                    data: {
                        createdBy: createdBy,
                        name: name,
                        description: description,
                        pic: pic,
                        likeCount: likeCount,
                        tags: {
                            create: tags.map(tagName => ({
                                tag: {
                                    connectOrCreate: {
                                        where: { name: tagName },
                                        create: { name: tagName }
                                    }
                                }
                            }))
                        }
                    }
                }
            }
            const createPost = await PostRepository.CreatePost(dataRep)
            if (createPost == null) {
                const respon: ServiceResponse = {
                    status: "error",
                    message: "Not found posts",
                    code: 404
                }
                return respon
            }
        }
        const respon: ServiceResponse = {
            status: "success",
            message: `success`,
            code: 200
        }
        return respon
    },
    UpdatePost: async (id, data,userId) => { //обробник обновлення
        let dataRep: UpdatePostChecked = {} //для відправки у бд
        if (isNaN(id)) { //первірка на число рут параметра
            const respon: ServiceResponse = {
                status: "error",
                message: "id isn`t a number",
                code: 400
            };
            return respon
        }
        const findPost = await PostRepository.getPostsById(id)
        if(!findPost){
            const respon: ServiceResponse = {
                status:"error",
                message: "not found post",
                code: 404,
            }
            return respon
        }
        if(findPost.createdBy!==userId){
            const respon: ServiceResponse = {
                status:"error",
                message: "you dont have permissions",
                code: 401,
            }
            return respon
        }
        if (data.name) {
            if (typeof data.name !== "string") {
                const respon: ServiceResponse = {        //заміна даних на нові, якщо вони є у запросі, якщо користувач введе нові властивості, нічого не відбудетьсЯ
                    status: "error",
                    message: "Field type name",
                    code: 422
                }
                return respon
            }
            dataRep.name = data.name //для відправки у бд
        }
        if (data.description) {
            if (typeof data.description !== "string") { //також тут валідація на типи
                const respon: ServiceResponse = {
                    status: "error",
                    message: "Field type description",
                    code: 422
                }
                return respon
            }
            dataRep.description = data.description //для відправки у бд
        }
        if (data.pic) {
            if (typeof data.pic !== "string") {
                const respon: ServiceResponse = {
                    status: "error",
                    message: "Field type pic",
                    code: 422
                }
                return respon
            }
            dataRep.pic = data.pic //для відправки у бд
        }
        if (data.likeCount) {
            if (typeof data.likeCount !== "number") {
                const respon: ServiceResponse = {
                    status: "error",
                    message: "Field type likecount",
                    code: 422
                }
                return respon
            }
            dataRep.likeCount = data.likeCount //для відправки у бд
        }
        if (data.tags) {
            if (!Array.isArray(data.tags)) {
                const respon: ServiceResponse = {
                    status: "error",
                    message: "Tags must be an array ",
                    code: 422
                };
                return respon;
            }
            dataRep.tags = { // для запиту у бд на перезапис тегів
                create: data.tags.map(tagName => ({
                    tag: {
                        connectOrCreate: {
                            where: { name: tagName },
                            create: { name: tagName }
                        }
                    }
                }))
            }
        }
        const updatePost = await PostRepository.UpdatePost(id, dataRep) //запит у бд для оновлення
        if (updatePost == null) {
            const respon: ServiceResponse = {
                status: "error",
                message: "Not found post",
                code: 404
            }
            return respon
        }
        const respon: ServiceResponse = {
            status: "success",
            message: `success`,
            code: 200
        }
        return respon
    },
    deletePost: async (id,userId) => {
        if (isNaN(id)) {
            const respon: ServiceResponse = {
                status: "error",
                message: "id isn`t a number",
                code: 400
            }
            return respon
        }

        const postId = Number(id)
        const findPost = await PostRepository.getPostsById(id)
        if(!findPost){
            const respon: ServiceResponse = {
                status:"error",
                message: "not found post",
                code: 404,
            }
            return respon
        }
        // if(findPost.createdBy!==userId){
        //     const respon: ServiceResponse = {
        //         status:"error",
        //         message: "you dont have permissions",
        //         code: 401,
        //     }
        //     return respon
        // }
        console.log(userId)
        const deletePost = await PostRepository.deletePost(postId) //запит у бд для видалення
        if (deletePost == null) {
            const respon: ServiceResponse = {
                status: "error",
                message: "Not found posts",
                code: 404
            }
            return respon
        }
        const respon: ServiceResponse = {
            status: "success",
            message: `success`,
            dataPost: deletePost,
            code: 200
        }
        return respon
    }
};