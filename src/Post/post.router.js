const express = require('express')
const postController = require("./post.controller")
const router = express.Router()
router.get("/posts", postController.getAllPosts)
router.get("/posts/:id",postController.getPostsById)

router.post("/posts",postController.createPost)

module.exports=router