
import type { CreatePostChecked, ServiceResponse, IServiceContract } from "./post.types"
import { PrismaClient } from "../generated/prisma";


const client = new PrismaClient();
export const postService: IServiceContract = {
    getAllPosts: async (skip?, take?) => {
        try {
            if (skip) {
                const numSkip: number = Number(skip);
                if (isNaN(numSkip)) {
                    const respon: ServiceResponse = {
                        status: "error",
                        message: "query skip isn`t a number",
                        code: 400
                    }
                    return respon
                }
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
                const posts = await client.post.findMany({ // усі елементи в бд
                    take: Number(take),
                    skip: skip ? Number(skip) : 0
                })
                const respon: ServiceResponse = {
                    status: "succses",
                    message: `succses`,
                    dataPosts: posts,
                    code: 200
                }
                return respon
            }
            else {
                const posts = await client.post.findMany({ // усі елементи в бд
                    skip: skip ? Number(skip) : 0
                })
                const respon: ServiceResponse = {
                    status: "succses",
                    message: `succses`,
                    dataPosts: posts,
                    code: 200
                }
                return respon
            }
        }
        catch (err) {
            const respon: ServiceResponse = {
                status: "error",
                message: `server error 500 ${err}`,
                code: 500
            }
            return respon
        }
    },

    getPostsById: async (id) => {
        try {
            if (isNaN(id)) {
                const respon: ServiceResponse = {
                    status: "error",
                    message: "id isn`t a number",
                    code: 400
                }
                return respon
            }
            const findPost = await client.post.findUnique({ // знаходження елементу в бд
                where: { id },
                include:{
                    tags:true
                }
            })
            if (findPost) { // перевірка на наявність
                const respon: ServiceResponse = {
                    status: "succses",
                    message: `succses`,
                    dataPost: findPost,
                    code: 200
                }
                return respon
            } else {
                const respon: ServiceResponse = {
                    status: "error",
                    message: "not found post",
                    code: 404
                }
                return respon
            }
        } catch (err) {
            const respon: ServiceResponse = {
                status: "error",
                message: `server error 500 ${err}`,
                code: 500
            }
            return respon
        }
    },

    CreatePost: async (body: CreatePostChecked[]): Promise<ServiceResponse> => {
        try {
            let arrPosts: CreatePostChecked[] = []
            arrPosts = [...body]
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
                if (!Array.isArray(tags) || tags.length === 0) {
                    await client.post.create({ // створення елементу в бд, якщо не ввели теги
                        data: {
                            name: name,
                            description: description,
                            pic: pic,
                            likeCount: likeCount

                        }
                    })
                }
                else {
                    await client.post.create({ // створення елементу в бд , якщо ввели теги
                        data: {
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
                    })
                }
            }
            const respon: ServiceResponse = {
                status: "succses",
                message: `succses`,
                code: 200
            }
            return respon
        }
        catch (err) {
            const respon: ServiceResponse = {
                status: "error",
                message: `server error 500 ${err}`,
                code: 500
            }
            return respon
        }
    },
    UpdatePost: async (id, data) => { //обробник обновлення
        try {
            if (isNaN(id)) { //первірка на число рут параметра
                const respon: ServiceResponse = {
                    status: "error",
                    message: "id isn`t a number",
                    code: 400
                };
                return respon
            }
            const findPost = await client.post.findUnique({ // знаходження елемента в бд
                where: { id }
            });
            if (findPost == null) { // перевірка на наявність
                const respon: ServiceResponse = {
                    status: "error",
                    message: "not found post",
                    code: 404
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
                await client.post.update({  // оновлення в бд
                    where: { id },
                    data: {
                        name: data.name
                    }
                })

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
                await client.post.update({  // оновлення в бд
                    where: { id },
                    data: {
                        description: data.description
                    }
                })

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
                await client.post.update({ // оновлення в бд
                    where: { id },
                    data: {
                        pic: data.pic
                    }
                })

            }
            if (data.likeCount) {
                if (typeof data.likeCount !== "string") {
                    const respon: ServiceResponse = {
                        status: "error",
                        message: "Field type likecount",
                        code: 422
                    }
                    return respon
                }
                await client.post.update({  // оновлення в бд
                    where: { id },
                    data: {
                        likeCount: data.likeCount
                    }
                })
            }
            const respon: ServiceResponse = {
                status: "succses",
                message: `succses`,
                code: 200
            }
            return respon

        } catch (err) {
            const respon: ServiceResponse = {
                status: "error",
                message: `server error 500 ${err}`,
                code: 500
            }
            return respon
        }
    },
    deletePost: async (id) => {
        try {
            if (isNaN(id)) {
                const respon: ServiceResponse = {
                    status: "error",
                    message: "id isn`t a number",
                    code: 400
                }
                return respon
            }

            const postId = Number(id)
            const deletePost = await client.post.delete({ // видалення елементу в бд
                where: { id: postId },
                include:{
                    tags: true
                }
            })
            const respon: ServiceResponse = {
                status: "succses",
                message: `succses`,
                dataPost: deletePost,
                code: 200
            }
            return respon
        } catch (err) {
            const respon: ServiceResponse = {
                status: "error",
                message: `server error 500 ${err}`,
                code: 500
            }
            return respon
        }
    }
};