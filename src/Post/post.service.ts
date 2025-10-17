import fs from "fs";
import path from "path";
import fsPromises from "fs/promises";
import type { Post, CreatePostData, UpdatePostData, ServiceResponse, IServiceContract } from "./post.types"


const pat = path.join(__dirname, "../../posts.json");
const posts: Post[] = JSON.parse(fs.readFileSync(pat, "utf8"));
let postsCopyAfterFilter: Post[] = [...posts];

export const postService:IServiceContract = {
    getAllPosts: (filter?: string, skip?: string, take?: string): ServiceResponse => {
        if (filter) {
            let boolFilter: boolean;
            if (filter === "true") boolFilter = true;
            else if (filter === "false") boolFilter = false;
            else {
                const respon: ServiceResponse = {
                    status: "error",
                    message: "query filter isn't a bool",
                    code: 400
                }
                return respon
            }
            if (boolFilter) postsCopyAfterFilter = posts.filter(post => post.name.includes("a"));
        }

        let postsCopyAfterSkip = [...postsCopyAfterFilter];
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
            postsCopyAfterSkip = postsCopyAfterFilter.slice(numSkip);
        }

        let postsCopyAfterTake = [...postsCopyAfterSkip];
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
            postsCopyAfterTake = postsCopyAfterSkip.slice(0, numTake);
        }
        const respon: ServiceResponse = {
            status: "succses",
            message: `succses`,
            data: postsCopyAfterTake,
            code: 200
        }
        return respon
    },

    getPostsById: (id: number): ServiceResponse => {
        if (isNaN(id)) {
            const respon: ServiceResponse = {
                status: "error",
                message: "id isn`t a number",
                code: 400
            }
            return respon
        }

        const findPost: Post | undefined = posts.find(post => post.id === id);
        if (findPost != null) {
            const respon: ServiceResponse = {
                status: "succses",
                message: `succses`,
                data: findPost,
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
    },

    CreatePost: async (body: CreatePostData[]) => {
        try {
            let arrPosts: CreatePostData[] = []
            arrPosts = [...body]
            for (const p of arrPosts) {
                let { name, description, pic, likecount } = p
                if (!name || !description || !pic) {
                    const respon: ServiceResponse = {
                        status: "error",
                        message: `server didn't can to work with this data`,
                        code: 422
                    }
                    return respon
                }
                if (!likecount) likecount = 0
                const id = posts.length + 1
                const post = { id, name, description, pic, likecount }
                posts.push(post)
            }
            await fsPromises.writeFile("posts.json", JSON.stringify(posts, null, 2)) //перезапис нового масиву
            const respon: ServiceResponse = {
                status: "succses",
                message: `succses`,
                data: posts,
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
    UpdatePost: async (id: number, data: UpdatePostData) => { //обробник обновлення
        try {
            if (isNaN(id)) { //первірка на число рут параметра
                const respon: ServiceResponse = {
                    status: "error",
                    message: "id isn`t a number",
                    code: 400
                };
                return respon
            }
            const findPost: Post | undefined = posts.find(post => post.id === id); // знаходження поста з id
            if (findPost == null) {
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
                findPost.name = data.name;
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
                findPost.description = data.description;
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
                findPost.pic = data.pic;
            }
            if (data.likecount) {
                if (typeof data.likecount !== "string") {
                    const respon: ServiceResponse = {
                        status: "error",
                        message: "Field type likecount",
                        code: 422
                    }
                    return respon
                }
                findPost.likecount = data.likecount;
            }

            await fsPromises.writeFile("posts.json", JSON.stringify(posts, null, 2)) //перезапис нового масиву
            const respon: ServiceResponse = {
                status: "succses",
                message: `succses`,
                data: posts,
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