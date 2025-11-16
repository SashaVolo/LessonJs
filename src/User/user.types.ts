import type { Request, Response } from "express";
import { Prisma } from "../generated/prisma";

export type User = Prisma.UserGetPayload<{}> //типи prisma
export type CreateUser = Prisma.UserUncheckedCreateInput

// export type UserWithoutPassword = Prisma.UserGetPayload<
//     {
//         include: {
//             createdPosts: true
//         }
//     }>
export type UserWithoutPassword = Prisma.UserGetPayload<{
    omit: {
        id: true
        password: true
    }
}>
export type UserLogin = {
    email: string,
    password: string
}

export interface AuthResult {
    tocken: string;
}
export interface AuthenticatedUser {
	id: number;
}
export interface ServiceResponse { //тип відповіді
    status: "success" | "error"
    dataUser?: UserWithoutPassword
    dataAuth?: AuthResult
    message: string
    code: number
}

export interface IControllerContract {
    login: (
        req: Request<
            object,
            AuthResult | { message: string },
            UserLogin,
            object
        >,
        res: Response<AuthResult | { message: string }>,
    ) => void;
    register: (
        req: Request<object, AuthResult | { message: string }, CreateUser, object>,
        res: Response<AuthResult | { message: string }>,
    ) => void;
    me: (
        req: Request<object, UserWithoutPassword | { message: string }, object, object, { userId: number }>,
        res: Response<UserWithoutPassword | { message: string }, { userId: number }>,
    ) => void;
}

export interface IServiceContract {
    me: (id: number) => Promise<ServiceResponse>
    login: (body: UserLogin) => Promise<ServiceResponse>
    register: (body: CreateUser) => Promise<ServiceResponse>
}

export interface IRepositoryContract {
    findByEmail: (email: string) => Promise<User | null>;
	create: (body: CreateUser) => Promise<User | string>;
	findByIdWithoutPassword: (id: number) => Promise<UserWithoutPassword | null>;
}



