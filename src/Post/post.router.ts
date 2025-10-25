// const express = require('express')
// const postController = require("./post.controller")
// const router = express.Router()
// router.get("/posts", postController.getAllPosts)
// router.get("/posts/:id",postController.getPostsById)

// router.post("/posts",postController.createPost)

// module.exports=router


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