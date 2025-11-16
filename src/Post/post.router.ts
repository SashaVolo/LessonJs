
import { Router } from "express";
import {postController} from "./post.controller";
import { authMiddleware } from "../middlewares/auth-middleware";

const postRouter = Router();

// Отримати всі пости
postRouter.get("/posts",postController.getAllPosts);

// Отримати пост за ID
postRouter.get("/posts/:id", postController.getPostsById);

// Створити новий пост
postRouter.post("/posts", authMiddleware, postController.createPost);


//Обновити пост за id
postRouter.patch("/posts/:id", authMiddleware ,postController.updatePost);

postRouter.delete("/posts/:id", authMiddleware ,postController.deletePost);


export {postRouter}