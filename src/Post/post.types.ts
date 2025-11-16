import type { Request, Response } from "express";
import { Prisma } from "../generated/prisma";

export type Post = Prisma.PostGetPayload<{}> //типи prisma
export type PostWithTag = Prisma.PostGetPayload<{
    include:{
        tags:{
            include:{
                tag: true
            }
        }
        
    }
}>
export type CreatePost = Prisma.PostCreateInput
export type CreatePostChecked = Prisma.PostUncheckedCreateInput

export type UpdatePost = Prisma.PostUpdateInput
export type UpdatePostChecked = Prisma.PostUncheckedUpdateInput

export interface ServiceResponse { //тип відповіді
    status: "success" | "error"
    dataPost?: PostWithTag 
    dataPosts?: Post[] 
    message?: string
    code: number
}

export interface IServiceContract {
    getAllPosts: (skip?: string, take?: string) => Promise<ServiceResponse>
    getPostsById: (id: number) => Promise<ServiceResponse>
    CreatePost: (body: CreatePostChecked[],id: number) => Promise<ServiceResponse>
    UpdatePost: (id: number, data: UpdatePostChecked,userId: number) => Promise<ServiceResponse>
    deletePost: (id: number,userId: number) => Promise<ServiceResponse>
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
        res: Response<string,{ userId: number }>) => Promise<void>;
    deletePost: (
        req: Request<{ id: string }, Post | string, object>,
        res: Response<Post| string>) => Promise<void>
}
export interface IRepositoryContract {
    getAllPosts: (skipTakeObj: {skip: number, take: number}|{skip: number}) => Promise<Post[] | null>
    getPostsById: (id: number) => Promise<PostWithTag | null>
    CreatePost: (body: {data: CreatePostChecked}) => Promise<CreatePostChecked | null>
    UpdatePost: (id: number, data: UpdatePostChecked) => Promise<UpdatePostChecked | null>
    deletePost: (id: number) => Promise<PostWithTag | null>
}

// інформація:
// повну інформацію про елемент можна дізнатися через рут параметр,
// Можна створювати елемент з тегами чи без. теги вказуємо масивом назв тегів, теги створяться, якщо таких назв не було 
// [
//   {
//     "name": "yhryhthyj",
//     "description": "Описаниеого поста",
//     "pic": "https://picsum.photos/200",
//     "likecount": 20,
//     "tags": ["tag1","tag3"]
//   }
// ]
// можна змінювати теги у елемента через patch запит, теги вказуємо масивом назв тегів, теги створяться, якщо таких назв не було
//АЛЕ ЦЕ ПЕРЕЗАПИС ТЕГІВ. не додавання 