import { client } from "../client/client";
import { Prisma } from "../generated/prisma";
import { IRepositoryContract } from "./tag.types";

export const tagRepository: IRepositoryContract = {
    getAllTags: async (skipTakeObj) => {
        try {
            const Tags = await client.tag.findMany(skipTakeObj)
            return Tags
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
    getTagsById: async (id) => {
        try {
            const findTag = await client.tag.findUnique({ // знаходження елементу в бд
                where: { id },
                include: {
                    posts: {
                        include: {
                            post: true
                        }
                    }
                }
            })
            return findTag
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
    createTag: async (dataRep) => {
        try {
            const createTag = await client.tag.create(dataRep)
            return createTag
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
    updateTag: async (id, dataRep) => {
        try {
            const updateTag = await client.tag.update({  // оновлення в бд
                where: { id },
                data: dataRep
            })

            return updateTag
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
    deleteTag: async (id) => {
        try {
            await client.postTag.deleteMany({
                where: { postId: id }
            })

            const deleteTag = await client.tag.delete({ // видалення елементу в бд
                where: { id },
                include: {
                    posts: {
                        include: {
                            post: true
                        }
                    }
                }
            })
            return deleteTag
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