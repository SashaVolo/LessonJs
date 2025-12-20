import { client } from "../client/client";
import { Prisma } from "../generated/prisma";
import { IRepositoryContract } from "./post.types";

export const PostRepository: IRepositoryContract = {
    getAllPosts: async (skipTakeObj) => {
        try {
        const posts = await client.post.findMany({
            ...skipTakeObj, // Разворачиваем skip и take
            include: {
                user: true, // Включаем автора
                tags: {
                    include: {
                        tag: true // Включаем теги
                    }
                }
            }
        });
        
        return posts;
    }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                switch (error.code) {
                    case "P1000":
                        console.error("Authentication failed. Invalid database credentials.")
                        break
                    case "P1001":
                        console.error("Database server was not found or is unreachable.")
                        break
                    case "P1002":
                        console.error("Database connection timed out.")
                        break
                    case "P2024":
                        console.error("Timed out fetching a new connection from the connection pool.")
                        break
                    case "P2025":
                        console.error("Record not found or unable to perform the requested operation.")
                        break
                    default:
                        console.error(`Prisma error: ${error.code}`)
                }
            }
            else {
                console.error("Unknown server error:", error)
            }
            return null
        }
    },
    getPostsById: async (id) => {
        try {
            const findPost = await client.post.findUnique({ // знаходження елементу в бд
                where: { id },
                include: {
                    user: true,
                    tags: {
                        include: {
                            tag: true
                        }
                    }
                }
            })
            return findPost
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                switch (error.code) {
                    case "P1000":
                        console.error("Authentication failed. Invalid database credentials.")
                        break
                    case "P1001":
                        console.error("Database server was not found or is unreachable.")
                        break
                    case "P1002":
                        console.error("Database connection timed out.")
                        break
                    case "P2024":
                        console.error("Timed out fetching a new connection from the connection pool.")
                        break
                    case "P2025":
                        console.error("Record not found or unable to perform the requested operation.")
                        break
                    default:
                        console.error(`Prisma error: ${error.code}`)
                }
            }
            else {
                console.error("Unknown server error:", error)
            }
            return null
        }
    },
    CreatePost: async (dataRep) => {
        try {
            const createPost = await client.post.create(dataRep)
            return createPost
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                switch (error.code) {
                    case "P1000":
                        console.error("Authentication failed. Invalid database credentials.")
                        break
                    case "P1001":
                        console.error("Database server was not found or is unreachable.")
                        break
                    case "P1002":
                        console.error("Database connection timed out.")
                        break
                    case "P2024":
                        console.error("Timed out fetching a new connection from the connection pool.")
                        break
                    case "P2025":
                        console.error("Record not found or unable to perform the requested operation.")
                        break
                    default:
                        console.error(`Prisma error: ${error.code}`)
                }
            }
            else {
                console.error("Unknown server error:", error)
            }
            return null
        }
    },
    UpdatePost: async (id, dataRep) => {
        try {
            if (dataRep.tags) {
                await client.postTag.deleteMany({
                    where: { postId: id }
                })
            }
            const updatePost = await client.post.update({  // оновлення в бд
                where: { id },
                data: dataRep
            })
            return updatePost
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                switch (error.code) {
                    case "P1000":
                        console.error("Authentication failed. Invalid database credentials.")
                        break
                    case "P1001":
                        console.error("Database server was not found or is unreachable.")
                        break
                    case "P1002":
                        console.error("Database connection timed out.")
                        break
                    case "P2024":
                        console.error("Timed out fetching a new connection from the connection pool.")
                        break
                    case "P2025":
                        console.error("Record not found or unable to perform the requested operation.")
                        break
                    default:
                        console.error(`Prisma error: ${error.code}`)
                }
            }
            else {
                console.error("Unknown server error:", error)
            }
            return null
        }
    },
    deletePost: async (id) => {
        try {
            await client.postTag.deleteMany({
                where: { postId: id }
            })

            const deletePost = await client.post.delete({ // видалення елементу в бд
                where: { id },
                include: {
                    user: true,
                    tags: {
                        include: {
                            tag: true
                        }
                    }
                }
            })
            return deletePost
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                switch (error.code) {
                    case "P1000":
                        console.error("Authentication failed. Invalid database credentials.")
                        break
                    case "P1001":
                        console.error("Database server was not found or is unreachable.")
                        break
                    case "P1002":
                        console.error("Database connection timed out.")
                        break
                    case "P2024":
                        console.error("Timed out fetching a new connection from the connection pool.")
                        break
                    case "P2025":
                        console.error("Record not found or unable to perform the requested operation.")
                        break
                    default:
                        console.error(`Prisma error: ${error.code}`)
                }
            }
            else {
                console.error("Unknown server error:", error)
            }
            return null
        }
    }

}