
import { Router } from "express";
import {tagController} from "./tag.controller";

const tagRouter = Router();

// Отримати всі ТЕГИ
tagRouter.get("/tags", tagController.getAllTags);

// Отримати ТЕГ за ID
tagRouter.get("/tags/:id", tagController.getTagsById);

// Створити новий ТЕГ
tagRouter.post("/tags", tagController.createTag);


//Обновити ТЕГ за id
tagRouter.patch("/tags/:id",tagController.updateTag);

tagRouter.delete("/tags/:id",tagController.deleteTag);


export {tagRouter}


