import type { Request, Response } from "express";

export interface Post { //тип пост
    id: number;
    name: string;
    description: string;
    pic: string;
    likecount: number;
}

export interface ServiceResponse { //тип відповіді
    status: "succses" | "error";
    data?: Post[] | Post;
    message?: string;
    code?: number;
}

export type CreatePostData = Omit<Post, "id">
export type UpdatePostData = Partial<Omit<Post, "id">>

export interface IServiceContract {
    getAllPosts: (filter?: string, skip?: string, take?: string) => ServiceResponse
    getPostsById: (id: number) => ServiceResponse
    CreatePost: (body: CreatePostData[]) => Promise<ServiceResponse>
    UpdatePost: (id: number, data: UpdatePostData) => Promise<ServiceResponse>
}
export interface IControllerContract {
    getAllPosts: (
        req: Request<Record<string, never>, Post[] | string, object, { filter?: string; skip?: string; take?: string }>,
        res: Response<Post[] | string>) => void
    getPostsById: (
        req: Request<{ id: string }, Post | string, object>,
        res: Response<Post | string>) => void
    createPost: (
        req: Request<Record<string, never>, Post[] | string, CreatePostData[]>, 
        res: Response<Post[] | string>) => Promise<void>;
    updatePost: (
        req: Request<Record<string, never>, Post[] | string, UpdatePostData>, 
        res: Response<Post[] | string>) => Promise<void>;
}
