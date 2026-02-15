import type { Request, Response } from "express";
import { Prisma } from "../generated/prisma";

export type User = Prisma.UserGetPayload<{}> 
export type CreateUser = Prisma.UserUncheckedCreateInput

export type UserWithoutPassword = Prisma.UserGetPayload<{
    omit: {
        password: true 
    }
}>

export type UserLogin = {
    email: string,
    password: string
}

export type UpdateAvatarInput = {
    avatar: string;
}

export interface AuthResult {
    token: string;
}

export interface AuthenticatedUser {
    id: number;
}

export interface ServiceResponse {
    status: "success" | "error"
    dataUser?: UserWithoutPassword
    dataAuth?: AuthResult
    message: string
    code: number
}

export interface IControllerContract {
    login: (
        req: Request<object, AuthResult | { message: string }, UserLogin, object>,
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
    updateAvatar: (
        req: Request<object, ServiceResponse, UpdateAvatarInput>, 
        res: Response<ServiceResponse>
    ) => Promise<void>;
}

export interface IServiceContract {
    me: (id: number) => Promise<ServiceResponse>
    login: (body: UserLogin) => Promise<ServiceResponse>
    register: (body: CreateUser) => Promise<ServiceResponse>

    updateAvatar: (userId: number, avatar: string) => Promise<ServiceResponse>
}

export interface IRepositoryContract {
    findByEmail: (email: string) => Promise<User | null>;
    create: (body: CreateUser) => Promise<User | string>;
    findByIdWithoutPassword: (id: number) => Promise<UserWithoutPassword | null>;
    
    updateAvatar: (userId: number, avatar: string) => Promise<UserWithoutPassword | null>;
}