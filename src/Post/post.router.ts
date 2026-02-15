
import { Router } from "express";
import {postController} from "./post.controller";
import { authMiddleware, authMiddlewareOptional } from "../middlewares/auth-middleware";

const postRouter = Router();

// Отримати всі пости
postRouter.get("/posts", authMiddlewareOptional, postController.getAllPosts);

// Отримати пост за ID
postRouter.get("/posts/:id", postController.getPostsById);

// Створити новий пост
postRouter.post("/posts", authMiddleware, postController.createPost);


//Обновити пост за id
postRouter.patch("/posts/:id", authMiddleware ,postController.updatePost);

postRouter.delete("/posts/:id", authMiddleware ,postController.deletePost);
postRouter.post("/posts/:id/like", authMiddleware, postController.toggleLike);

export {postRouter}