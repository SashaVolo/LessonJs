import fs from "fs";
import path from "path";
import fsPromises from "fs/promises";

interface Post { //тип пост
    id: number;
    name: string;
    description: string;
    pic: string;
    likecount: number;
}

interface ServiceResponse { //тип відповіді
    status: "succses" | "error";
    data?: Post[] | Post;
    message?: string;
    code?: number;
}

const pat = path.join(__dirname, "../../posts.json");
const posts: Post[] = JSON.parse(fs.readFileSync(pat, "utf8"));
let postsCopyAfterFilter: Post[] = [...posts];

export const postService = {
    getAllPosts: (filter?: string, skip?: string, take?: string): ServiceResponse => {
        if (filter) {
            let boolFilter: boolean;
            if (filter === "true") boolFilter = true;
            else if (filter === "false") boolFilter = false;
            else {
                return {
                    status: "error",
                    message: "query filter isn't a bool",
                };
            }
            if (boolFilter) postsCopyAfterFilter = posts.filter(post => post.name.includes("a"));
        }

        let postsCopyAfterSkip = [...postsCopyAfterFilter];
        if (skip) {
            const numSkip = Number(skip);
            if (isNaN(numSkip)) {
                return {
                    status: "error",
                    message: "query skip isn`t a number",
                };
            }
            postsCopyAfterSkip = postsCopyAfterFilter.slice(numSkip);
        }

        let postsCopyAfterTake = [...postsCopyAfterSkip];
        if (take) {
            const numTake = Number(take);
            if (isNaN(numTake)) {
                return {
                    status: "error",
                    message: "query take isn`t a number",
                };
            }
            postsCopyAfterTake = postsCopyAfterSkip.slice(0, numTake);
        }

        return {
            status: "succses",
            data: postsCopyAfterTake,
        };
    },

    getPostsById: (id: number): ServiceResponse => {
        if (isNaN(id)) {
            return {
                status: "error",
                message: "id isn`t a number",
            };
        }

        const findPost = posts.find(post => post.id === id);
        if (findPost != null) {
            return {
                status: "succses",
                data: findPost,
            };
        } else {
            return {
                status: "error",
                message: "not found post",
            };
        }
    },

    CreatePost: async (body: any) => {
        try {
            let arrPosts = []
            try { //перевірка що користувач увів все в масив, а не просто об'єктами
                arrPosts = [...body]  //копіюємо масив постів
            } catch {
                return {
                    status: "error",
                    message: `json is array, not object`,
                    code: 400
                }
            }
            for (const p of arrPosts) {
                let { name, description, pic, likecount } = p
                if (!name || !description || !pic) {
                    return {
                        status: "error",
                        message: `server didn't can to work with this data`,
                        code: 422
                    }
                }
                if (!likecount) likecount = 0
                const id = posts.length + 1
                const post = { id, name, description, pic, likecount }
                posts.push(post)
            }
            await fsPromises.writeFile("posts.json", JSON.stringify(posts, null, 2)) //перезапис нового масиву
            return {
                status: "succses",
                data: posts
            }
        }
        catch (err) {
            return {
                status: "error",
                message: `server error 500 ${err}`,
                code: 500
            }
        }
    }
};