
import { Router } from "express";
import {postController} from "./post.controller";

const postRouter = Router();

// Отримати всі пости
postRouter.get("/posts", postController.getAllPosts);

// Отримати пост за ID
postRouter.get("/posts/:id", postController.getPostsById);

// Створити новий пост
postRouter.post("/posts", postController.createPost);


//Обновити пост за id
postRouter.patch("/posts/:id",postController.updatePost);

postRouter.delete("/posts/:id",postController.deletePost);


export {postRouter}