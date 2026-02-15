import type { Request, Response } from "express";
import { Prisma } from "../generated/prisma";

export type Post = Prisma.PostGetPayload<{
    include: {
        user: true,
        tags: {
            include: {
                tag: true
            }
        },
        likedBy: true 
    }
}>

export type PostFrontend = Omit<Post, 'likedBy'> & { isLiked: boolean };

export type CreatePost = Prisma.PostCreateInput
export type CreatePostChecked = Prisma.PostUncheckedCreateInput

export type UpdatePost = Prisma.PostUpdateInput
export type UpdatePostChecked = Prisma.PostUncheckedUpdateInput

export interface ServiceResponse {
    status: "success" | "error"
    dataPost?: PostFrontend | Post
    dataPosts?: PostFrontend[] | Post[]
    dataLike?: { liked: boolean, newLikeCount: number }
    message?: string
    code: number
}

export interface IServiceContract {
    toggleLike: (postId: number, userId: number) => Promise<ServiceResponse>
    getAllPosts: (skip?: string, take?: string, userId?: number) => Promise<ServiceResponse>
    getPostsById: (id: number) => Promise<ServiceResponse>
    CreatePost: (body: CreatePostChecked[], id: number) => Promise<ServiceResponse>
    UpdatePost: (id: number, data: UpdatePostChecked, userId: number) => Promise<ServiceResponse>
    deletePost: (id: number, userId: number) => Promise<ServiceResponse>
}

export interface IControllerContract {
    toggleLike: (
        req: Request<{ id: string }>,
        res: Response
    ) => Promise<void>

    getAllPosts: (
        req: Request<Record<string, never>, any, any, { skip?: string; take?: string }>,
        res: Response
    ) => Promise<void>

    getPostsById: (
        req: Request<{ id: string }>,
        res: Response
    ) => Promise<void>

    createPost: (
        req: Request<Record<string, never>, any, CreatePostChecked[]>,
        res: Response
    ) => Promise<void>

    updatePost: (
        req: Request<{ id: string }, any, UpdatePostChecked>,
        res: Response
    ) => Promise<void>

    deletePost: (
        req: Request<{ id: string }>,
        res: Response
    ) => Promise<void>
}

export interface IRepositoryContract {
    toggleLike: (postId: number, userId: number) => Promise<{ liked: boolean, newLikeCount: number } | null | undefined>
    getAllPosts: (skipTakeObj: { skip: number, take?: number }, userId?: number) => Promise<Post[] | null | undefined>
    getPostsById: (id: number) => Promise<Post | null | undefined>
    CreatePost: (data: CreatePostChecked) => Promise<Post | null | undefined>
    UpdatePost: (id: number, data: UpdatePostChecked) => Promise<Post | null | undefined>
    deletePost: (id: number) => Promise<Post | null | undefined>
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