
import { client } from "../client/client";
import { Prisma } from "../generated/prisma";
import { IRepositoryContract, CreatePostChecked, UpdatePostChecked, Post } from "./post.types";

export const PostRepository: IRepositoryContract = {
    toggleLike: async (postId: number, userId: number) => {
        try {
            const existingLike = await client.postLike.findUnique({
                where: {
                    userId_postId: { userId, postId }
                }
            });

            if (existingLike) {
                await client.$transaction([
                    client.postLike.delete({
                        where: { userId_postId: { userId, postId } }
                    }),
                    client.post.update({
                        where: { id: postId },
                        data: { likeCount: { decrement: 1 } }
                    })
                ]);
                const updatedPost = await client.post.findUnique({ where: { id: postId } });
                return { liked: false, newLikeCount: updatedPost?.likeCount || 0 };
            } else {
                await client.$transaction([
                    client.postLike.create({
                        data: { userId, postId }
                    }),
                    client.post.update({
                        where: { id: postId },
                        data: { likeCount: { increment: 1 } }
                    })
                ]);
                const updatedPost = await client.post.findUnique({ where: { id: postId } });
                return { liked: true, newLikeCount: updatedPost?.likeCount || 0 };
            }
        } catch (error) {
            handlePrismaError(error);
            return null;
        }
    },

    getAllPosts: async (skipTakeObj, userId) => {
        try {
            const posts = await client.post.findMany({
                ...skipTakeObj,
                orderBy: { id: 'desc' },
                include: {
                    user: true,
                    tags: {
                        include: {
                            tag: true
                        }
                    },
                    likedBy: {
                        where: {
                            userId: userId || -1
                        }
                    }
                }
            });
            return posts as Post[];
        } catch (error) {
            handlePrismaError(error);
            return null;
        }
    },

    getPostsById: async (id: number) => {
        try {
            const findPost = await client.post.findUnique({
                where: { id },
                include: {
                    user: true,
                    tags: {
                        include: {
                            tag: true
                        }
                    },
                    likedBy: true
                }
            });
            return findPost as Post;
        } catch (error) {
            handlePrismaError(error);
            return null;
        }
    },

    CreatePost: async (data: CreatePostChecked) => {
        try {
            const createPost = await client.post.create({
                data,
                include: {
                    user: true,
                    tags: {
                        include: {
                            tag: true
                        }
                    },
                    likedBy: true
                }
            });
            return createPost as Post;
        } catch (error) {
            handlePrismaError(error);
            return null;
        }
    },

    UpdatePost: async (id: number, data: UpdatePostChecked) => {
        try {
            if (data.tags) {
                await client.postTag.deleteMany({
                    where: { postId: id }
                });
            }
            const updatePost = await client.post.update({
                where: { id },
                data,
                include: {
                    user: true,
                    tags: {
                        include: {
                            tag: true
                        }
                    },
                    likedBy: true
                }
            });
            return updatePost as Post;
        } catch (error) {
            handlePrismaError(error);
            return null;
        }
    },

    deletePost: async (id: number) => {
        try {
            await client.postTag.deleteMany({
                where: { postId: id }
            });
            await client.postLike.deleteMany({
                where: { postId: id }
            });
            const deletePost = await client.post.delete({
                where: { id },
                include: {
                    user: true,
                    tags: {
                        include: {
                            tag: true
                        }
                    },
                    likedBy: true
                }
            });
            return deletePost;
        } catch (error) {
            handlePrismaError(error);
            return null;
        }
    }
};

function handlePrismaError(error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
            case "P1000": console.error("Authentication failed. Invalid database credentials."); break;
            case "P1001": console.error("Database server was not found or is unreachable."); break;
            case "P1002": console.error("Database connection timed out."); break;
            case "P2024": console.error("Timed out fetching a new connection from the connection pool."); break;
            case "P2025": console.error("Record not found or unable to perform the requested operation."); break;
            default: console.error(`Prisma error: ${error.code}`);
        }
    } else {
        console.error("Unknown server error:", error);
    }
}