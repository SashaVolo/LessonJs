export interface Post { //тип пост
    id: number;
    name: string;
    description: string;
    pic: string;
    likecount: number;
}

export interface ServiceResponse { //тип відповіді
    status: "succses" | "error";
    data?: Post[] | Post;
    message?: string;
    code?: number;
}



export type CreatePostData = Omit<Post,"id">
export type UpdatePostData =Partial<Omit<Post,"id">>

