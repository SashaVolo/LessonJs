import type { Request, Response } from "express";
import { Prisma } from "../generated/prisma";

export type Post = Prisma.PostGetPayload<{}> //типи prisma
export type PostWithTag = Prisma.PostGetPayload<{
    include:{
        tags: true
    }
}>
export type CreatePost = Prisma.PostCreateInput
export type CreatePostChecked = Prisma.PostUncheckedCreateInput
export type UpdatePost = Prisma.PostUpdateInput
export type UpdatePostChecked = Prisma.PostUncheckedUpdateInput

export interface ServiceResponse { //тип відповіді
    status: "succses" | "error"
    dataPost?: PostWithTag
    dataPosts?: Post[]
    message?: string
    code?: number
}

export interface IServiceContract {
    getAllPosts: (skip?: string, take?: string) => Promise<ServiceResponse>
    getPostsById: (id: number) => Promise<ServiceResponse>
    CreatePost: (body: CreatePostChecked[]) => Promise<ServiceResponse>
    UpdatePost: (id: number, data: UpdatePostChecked) => Promise<ServiceResponse>
    deletePost: (id: number) => Promise<ServiceResponse>
}
export interface IControllerContract {
    getAllPosts: (
        req: Request<Record<string, never>, Post[]|Post| string, object, {skip?: string; take?: string }>,
        res: Response<Post[]|Post | string>) => Promise<void>
    getPostsById: (
        req: Request<{ id: string }, PostWithTag | string, object>,
        res: Response<PostWithTag| string>) => Promise<void>
    createPost: (
        req: Request<Record<string, never>, string, CreatePostChecked[]>, 
        res: Response<string>) => Promise<void>;
    updatePost: (
        req: Request<Record<string, never>, string, UpdatePostChecked>, 
        res: Response<string>) => Promise<void>;
    deletePost: (
        req: Request<{ id: string }, Post | string, object>,
        res: Response<Post| string>) => Promise<void>
}

// інформація:
// повну інформацію про елемент можна дізначися через рут параметр,
// Можна створювати елемент з тегами чи без
//не можна змінювати теги у елемента
