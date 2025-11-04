import type { Request, Response } from "express";
import { Prisma } from "../generated/prisma";

export type Tag = Prisma.TagGetPayload<{}> //типи prisma
export type TagWithPost = Prisma.TagGetPayload<{
    include:{
        posts:{
            include:{
                post: true
            }
        }
    }
}>
export type CreateTag = Prisma.TagCreateInput
export type CreateTagChecked = Prisma.TagUncheckedCreateInput

export type UpdateTag = Prisma.TagUpdateInput
export type UpdateTagChecked = Prisma.TagUncheckedUpdateInput

export interface ServiceResponse { //тип відповіді
    status: "success" | "error"
    dataTag?: TagWithPost 
    dataTags?: Tag[] 
    message?: string
    code: number
}

export interface IServiceContract {
    getAllTags: (skip?: string, take?: string) => Promise<ServiceResponse>
    getTagsById: (id: number) => Promise<ServiceResponse>
    createTag: (body: CreateTagChecked[]) => Promise<ServiceResponse>
    updateTag: (id: number, data: UpdateTagChecked) => Promise<ServiceResponse>
    deleteTag: (id: number) => Promise<ServiceResponse>
}
export interface IControllerContract {
    getAllTags: (
        req: Request<Record<string, never>, Tag[]|Tag| string, object, {skip?: string; take?: string }>,
        res: Response<Tag[]|Tag | string>) => Promise<void>
    getTagsById: (
        req: Request<{ id: string }, TagWithPost | string, object>,
        res: Response<TagWithPost| string>) => Promise<void>
    createTag: (
        req: Request<Record<string, never>, string, CreateTagChecked[]>, 
        res: Response<string>) => Promise<void>;
    updateTag: (
        req: Request<Record<string, never>, string, UpdateTagChecked>, 
        res: Response<string>) => Promise<void>;
    deleteTag: (
        req: Request<{ id: string }, Tag | string, object>,
        res: Response<Tag| string>) => Promise<void>
}
export interface IRepositoryContract {
    getAllTags: (skipTakeObj: {skip: number, take: number}|{skip: number}) => Promise<Tag[] | null>
    getTagsById: (id: number) => Promise<TagWithPost | null>
    createTag: (body: {data: CreateTagChecked}) => Promise<CreateTagChecked | null>
    updateTag: (id: number, data: UpdateTagChecked) => Promise<UpdateTagChecked | null>
    deleteTag: (id: number) => Promise<TagWithPost | null>
}

//СТВОРИТИ ТЕГ -BODY 
// [
//     {
//         name: "Sasha"
//     },
//     {
//         name: "Ol"
//     }
// ]

//Створити зв'язок через тег неможна, тільки через пост
// Оновити так само тільки за ім'ям
// {
//     name: "PatchName"
// }


