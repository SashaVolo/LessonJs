import { client } from "../client/client";
import { Prisma } from "../generated/prisma";
import { IRepositoryContract } from "./user.types";

export const userRepository: IRepositoryContract = {
    findByEmail: async (email) => {
        try {
            const findUser = await client.user.findUnique({
                where:{
                    email
                }
            })
            return findUser
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
    findByIdWithoutPassword: async (id) => {
    try {
            const findUser = await client.user.findUnique({
                where:{
                    id
                },
                omit:{
                    password: true
                }
            })
            return findUser
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
    create: async (body) => {
        try {
            const createUser = await client.user.create({data:body})
            return createUser
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                switch (error.code) {
                    case "P1000":
                        return "Authentication failed. Invalid database credentials."
                    case "P1001":
                        return "Authentication failed. Invalid database credentials."
                    case "P1002":
                        return "Database connection timed out."
                    case "P2024":
                        return "Timed out fetching a new connection from the connection pool."
                    case "P2025":
                        return "Record not found or unable to perform the requested operation."
                    default:
                        return `Prisma error: ${error.code}`
                }
            }
            else {
                return `Unknown server error: ${error}`
            }

        }
    }

}