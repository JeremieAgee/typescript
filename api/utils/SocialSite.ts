import { Post } from "./Post";
import { PostLike } from "./PostLike";
import { User } from "./User";
import { db } from "../databases/supabaseInstance"
export class SocialSite {
	name: string;
	posts: Post[];
	content: string;
	comments: Comment[];
	likes: PostLike[];
    users: User[]
	constructor() {
		this.name = "Socially Crypto";
		this.fetchData();
	}
	fetchData = async () => {
		const postsData = await db.get("/post");
		const commentData = await db.get("/comment");
		const likesData = await db.get("/postlike");
		this.likes = likesData.data;
	};
	findLikeByMovieId = (postId: number) => {
        return this.likes.find((like:PostLike)=>{
            return like.postId===postId;
        })
    };
	findLikeByCommentId = (commentId: number) => {
        
    };
}
