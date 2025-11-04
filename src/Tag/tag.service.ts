
import type { CreateTagChecked, ServiceResponse, IServiceContract, UpdateTagChecked, Tag } from "./tag.types"

import { tagRepository } from "./tag.repository";


export const tagService: IServiceContract = {
    getAllTags: async (skip?, take?) => {
        let tags: Tag[] | null
        let numSkip: number = 0
        if (skip) {
            numSkip = Number(skip);
            if (isNaN(numSkip)) {
                const respon: ServiceResponse = {
                    status: "error",
                    message: "query skip isn`t a number",
                    code: 400
                }
                return respon
            }
        }
        else {
            numSkip = 0
        }
        if (take) {
            const numTake: number = Number(take);
            if (isNaN(numTake)) {
                const respon: ServiceResponse = {
                    status: "error",
                    message: "query take isn`t a number",
                    code: 400
                }
                return respon
            }
            tags = await tagRepository.getAllTags({ skip: numSkip, take: Number(take) }) // запит у бд
        }
        else {
            tags = await tagRepository.getAllTags({ skip: numSkip }) // запит у бд
        }

        if (tags == null) {
            const respon: ServiceResponse = {
                status: "error",
                message: "Not found Tags",
                code: 404
            }
            return respon
        }
        const respon: ServiceResponse = {
            status: "success",
            message: `success`,
            dataTags: tags,
            code: 200
        }
        return respon
    },

    getTagsById: async (id) => {
        if (isNaN(id)) {
            const respon: ServiceResponse = {
                status: "error",
                message: "id isn`t a number",
                code: 400
            }
            return respon
        }
        const findTag = await tagRepository.getTagsById(id) //запит у бд
        if (findTag == null) {
            const respon: ServiceResponse = {
                status: "error",
                message: "Not found Tags",
                code: 404
            }
            return respon
        }
        const respon: ServiceResponse = {
            status: "success",
            message: `success`,
            dataTag: findTag,
            code: 200
        }
        return respon
    },

    createTag: async (body: CreateTagChecked[]) => {
        let arrTags: CreateTagChecked[] = []
        arrTags = [...body]
        let dataRep: { data: CreateTagChecked } //для відправки у бд
        for (const p of arrTags) {
            let { name } = p
            if (!name ) {
                const respon: ServiceResponse = {
                    status: "error",
                    message: `server didn't can to work with this data`,
                    code: 422
                }
                return respon
            }
            dataRep = {
                    data: {
                        name: name
                    }
                }
            const createTag = await tagRepository.createTag(dataRep)
            if (createTag == null) {
                const respon: ServiceResponse = {
                    status: "error",
                    message: "Not found Tags",
                    code: 404
                }
                return respon
            }
        }
        const respon: ServiceResponse = {
            status: "success",
            message: `success`,
            code: 200
        }
        return respon
    },
    updateTag: async (id, data) => { //обробник обновлення
        let dataRep: UpdateTagChecked = {} //для відправки у бд
        if (isNaN(id)) { //первірка на число рут параметра
            const respon: ServiceResponse = {
                status: "error",
                message: "id isn`t a number",
                code: 400
            };
            return respon
        }
        if (data.name) {
            if (typeof data.name !== "string") {
                const respon: ServiceResponse = {        //заміна даних на нові, якщо вони є у запросі, якщо користувач введе нові властивості, нічого не відбудетьсЯ
                    status: "error",
                    message: "Field type name",
                    code: 422
                }
                return respon
            }
            dataRep.name = data.name //для відправки у бд
        }
        const updateTag = await tagRepository.updateTag(id, dataRep) //запит у бд для оновлення
        if (updateTag == null) {
            const respon: ServiceResponse = {
                status: "error",
                message: "Not found Tag",
                code: 404
            }
            return respon
        }
        const respon: ServiceResponse = {
            status: "success",
            message: `success`,
            code: 200
        }
        return respon
    },
    deleteTag: async (id) => {
        if (isNaN(id)) {
            const respon: ServiceResponse = {
                status: "error",
                message: "id isn`t a number",
                code: 400
            }
            return respon
        }

        const tagId = Number(id)
        const deleteTag = await tagRepository.deleteTag(tagId) //запит у бд для видалення
        if (deleteTag == null) {
            const respon: ServiceResponse = {
                status: "error",
                message: "Not found Tags",
                code: 404
            }
            return respon
        }
        const respon: ServiceResponse = {
            status: "success",
            message: `success`,
            dataTag: deleteTag,
            code: 200
        }
        return respon
    }
};