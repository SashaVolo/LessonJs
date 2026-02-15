import { Request, Response } from "express";
import { postService } from "./post.service";
import { IControllerContract } from "./post.types";

export const postController: IControllerContract = {
    toggleLike: async (req: Request<{ id: string }>, res: Response) => {
        const postId = Number(req.params.id);
        const userId = Number(res.locals.userId);

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const resp = await postService.toggleLike(postId, userId);

        if (resp.status === "error") {
            res.status(resp.code).json({ message: resp.message });
            return;
        }

        res.status(200).json(resp);
    },

    getAllPosts: async (req: Request<Record<string, never>, any, any, { skip?: string; take?: string }>, res: Response) => {
        const { skip, take } = req.query;
        const userId = res.locals.userId ? Number(res.locals.userId) : undefined;

        const resp = await postService.getAllPosts(skip, take, userId);

        if (resp.status === "error") {
            res.status(resp.code).json({ message: resp.message });
            return;
        }

        res.status(200).json(resp.dataPosts);
    },

    getPostsById: async (req: Request<{ id: string }>, res: Response) => {
        const id = Number(req.params.id);
        const resp = await postService.getPostsById(id);

        if (resp.status === "error") {
            res.status(resp.code).json({ message: resp.message });
            return;
        }

        res.status(200).json(resp.dataPost);
    },

    createPost: async (req: Request<Record<string, never>, any, any>, res: Response) => {
        const userId = Number(res.locals.userId);
        const resp = await postService.CreatePost(req.body, userId);

        if (resp.status === "error") {
            res.status(resp.code).json({ message: resp.message });
            return;
        }

        res.status(200).json({ message: resp.message });
    },

    updatePost: async (req: Request<{ id: string }, any, any>, res: Response) => {
        const id = Number(req.params.id);
        const userId = Number(res.locals.userId);
        const resp = await postService.UpdatePost(id, req.body, userId);

        if (resp.status === "error") {
            res.status(resp.code).json({ message: resp.message });
            return;
        }

        res.status(200).json({ message: resp.message });
    },

    deletePost: async (req: Request<{ id: string }>, res: Response) => {
        const id = Number(req.params.id);
        const userId = Number(res.locals.userId);
        const resp = await postService.deletePost(id, userId);

        if (resp.status === "error") {
            res.status(resp.code).json({ message: resp.message });
            return;
        }

        res.status(200).json(resp.dataPost);
    }
};