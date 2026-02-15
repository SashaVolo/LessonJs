import type { CreatePostChecked, ServiceResponse, IServiceContract, UpdatePostChecked, PostFrontend } from "./post.types"
import { PostRepository } from "./post.repository";

export const postService: IServiceContract = {
    toggleLike: async (postId: number, userId: number) => {
        if (isNaN(postId)) {
            const respon: ServiceResponse = {
                status: "error",
                message: "Invalid Post ID",
                code: 400
            };
            return respon;
        }

        const post = await PostRepository.getPostsById(postId);
        if (!post) {
            const respon: ServiceResponse = {
                status: "error",
                message: "Post not found",
                code: 404
            };
            return respon;
        }

        const result = await PostRepository.toggleLike(postId, userId);

        if (!result) {
            const respon: ServiceResponse = {
                status: "error",
                message: "Database error",
                code: 500
            };
            return respon;
        }

        const respon: ServiceResponse = {
            status: "success",
            message: result.liked ? "Liked" : "Unliked",
            code: 200,
            dataLike: result
        };
        return respon;
    },

    getAllPosts: async (skip?: string, take?: string, userId?: number) => {
        let numSkip: number = 0;

        if (skip) {
            numSkip = Number(skip);
            if (isNaN(numSkip)) {
                return { status: "error", message: "skip error", code: 400 };
            }
        }

        let numTake: number | undefined = undefined;
        if (take) {
            numTake = Number(take);
            if (isNaN(numTake)) {
                return { status: "error", message: "take error", code: 400 };
            }
        }
        const queryOptions: { skip: number; take?: number } = { skip: numSkip };
        if (numTake !== undefined) {
            queryOptions.take = numTake;
        }

        const posts = await PostRepository.getAllPosts(queryOptions, userId);

        if (posts == null) {
            return { status: "error", message: "Not found posts", code: 404 };
        }

        const formattedPosts: PostFrontend[] = posts.map(post => {
            const isLiked = Array.isArray(post.likedBy) && post.likedBy.length > 0;
            const { likedBy, ...postData } = post;

            return {
                ...postData,
                isLiked: isLiked
            };
        });

        const respon: ServiceResponse = {
            status: "success",
            message: "success",
            dataPosts: formattedPosts,
            code: 200
        };
        return respon;
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
        const findPost = await PostRepository.getPostsById(id)
        if (findPost == null) {
            const respon: ServiceResponse = {
                status: "error",
                message: "Not found posts",
                code: 404
            }
            return respon
        }


        const isLiked = Array.isArray(findPost.likedBy) && findPost.likedBy.length > 0;
        const { likedBy, ...postData } = findPost;
        
        const postFrontend: PostFrontend = { ...postData, isLiked: isLiked };

        const respon: ServiceResponse = {
            status: "success",
            message: `success`,
            dataPost: postFrontend,
            code: 200
        }
        return respon
    },

    CreatePost: async (body: CreatePostChecked[], id: number) => {
        let arrPosts: CreatePostChecked[] = [...body]
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
            
            let dataRep: CreatePostChecked;
            if (!Array.isArray(tags) || tags.length === 0) {
                dataRep = {
                    createdBy: createdBy,
                    name: name,
                    description: description,
                    pic: pic,
                    likeCount: likeCount,
                }
            }
            else {
                dataRep = {
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
            const createPost = await PostRepository.CreatePost(dataRep)
            if (createPost == null) {
                const respon: ServiceResponse = {
                    status: "error",
                    message: "Error creating post",
                    code: 500
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

    UpdatePost: async (id, data, userId) => {
        if (isNaN(id)) {
            const respon: ServiceResponse = {
                status: "error",
                message: "id isn`t a number",
                code: 400
            };
            return respon
        }
        const findPost = await PostRepository.getPostsById(id)
        if (!findPost) {
            const respon: ServiceResponse = {
                status: "error",
                message: "not found post",
                code: 404,
            }
            return respon
        }
        
        if (findPost.createdBy !== userId) {
            const respon: ServiceResponse = {
                status: "error",
                message: "you dont have permissions",
                code: 403,
            }
            return respon
        }

        let dataRep: UpdatePostChecked = {}
        if (data.name) {
            if (typeof data.name !== "string") {
                const respon: ServiceResponse = {
                    status: "error",
                    message: "Field type name",
                    code: 422
                }
                return respon
            }
            dataRep.name = data.name
        }
        if (data.description) {
            if (typeof data.description !== "string") {
                const respon: ServiceResponse = {
                    status: "error",
                    message: "Field type description",
                    code: 422
                }
                return respon
            }
            dataRep.description = data.description
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
            dataRep.pic = data.pic
        }
        if (data.likeCount !== undefined) {
            if (typeof data.likeCount !== "number") {
                const respon: ServiceResponse = {
                    status: "error",
                    message: "Field type likecount",
                    code: 422
                }
                return respon
            }
            dataRep.likeCount = data.likeCount
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
            dataRep.tags = {
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

        const updatePost = await PostRepository.UpdatePost(id, dataRep)
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

    deletePost: async (id, userId) => {
        if (isNaN(id)) {
            const respon: ServiceResponse = {
                status: "error",
                message: "id isn`t a number",
                code: 400
            }
            return respon
        }

        const findPost = await PostRepository.getPostsById(id)
        if (!findPost) {
            const respon: ServiceResponse = {
                status: "error",
                message: "not found post",
                code: 404,
            }
            return respon
        }

        if (findPost.createdBy !== userId) {
            const respon: ServiceResponse = {
                status: "error",
                message: "you dont have permissions",
                code: 403,
            }
            return respon
        }

        const deleteResult = await PostRepository.deletePost(id)
        if (deleteResult == null) {
            const respon: ServiceResponse = {
                status: "error",
                message: "Error deleting post",
                code: 500
            }
            return respon
        }

        const { likedBy, ...postData } = deleteResult;
        const postFrontend: PostFrontend = { ...postData, isLiked: false };

        const respon: ServiceResponse = {
            status: "success",
            message: `success`,
            dataPost: postFrontend,
            code: 200
        }
        return respon
    }
};