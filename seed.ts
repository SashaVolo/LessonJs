import {PrismaClient } from "./src/generated/prisma"

const client = new PrismaClient()
let countPost: number = 0;
async function CreatePost(){
    try {
        const post = await client.post.create({
            data: {
                name: `Мой ${countPost} пост`,
                description: "Это пост",
                pic: "image.png",
                likeCount: 10
            }
        })
        console.log(post)
        countPost++;
        return post;

    } catch {
        console.log("error")
        return
    }
}
let countTag: number = 0;
async function CreateTag() {
    try {
        const tag = await client.tag.create({
            data: {
                name: `Мой ${countTag} тег`
            }
        })
        console.log(tag)
        countTag++;
        return tag;

    } catch {
        console.log("error")
        return
    }
}


async function Connect(postid: number, tagid: number) {
    try {
        await client.postTag.create({
            data: {
                postId: postid,
                tagId: tagid
            }
        })
    } catch {
        console.log("err");
        return
    }
}

async function getPostById(postId: number) { //доп, нахождения поста по айди
    try {
        const posts = await client.post.findMany();//берет все елементы
        const post = posts.find(p => p.id === postId);

        if (post) {
            console.log("Пост найден:", post);
        } else {
            console.log(`Пост с id=${postId} не найден`);
        }
    } catch (err) {
        console.error("err");
    }
}

async function main() {
    try {
        // Создание постов и тегов
        const post1 = await CreatePost();
        const post2 = await CreatePost();
        const tag1 = await CreateTag();
        const tag2 = await CreateTag();

        // Создание связей
        if(post1&&post2&&tag1&&tag2){
        await Connect(post1.id, tag1.id);
        await Connect(post2.id, tag1.id);
        await Connect(post1.id, tag2.id);

        console.log("посты, теги и связи созданы")}

        getPostById(2); // доп
    }catch{
        console.log("er")
        return
    }

}
main();
