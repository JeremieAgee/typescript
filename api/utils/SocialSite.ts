import { Post } from "./Post";
import { PostLike } from "./PostLike";
import { User } from "./User";
import { supabaseDB } from "../databases/supabaseInstance";
import { firebaseDB } from "../databases/firebase.config";
import { getUsers } from "./firebase.Utils";

export class SocialSite {
	name: string;
	posts: Post[];
	content: string;
	comments: Comment[];
	likes: PostLike[];
	users: User[];
	constructor() {
		this.name = "Socially Crypto";
		this.fetchLikes();
	}
	fetchLikes = async () => {
		const users = await getUsers(firebaseDB);
		const postsData = await supabaseDB.get("/post");
		const commentData = await supabaseDB.get("/comment");
		const likesData = await supabaseDB.get("/postlike");
		this.likes = likesData.data.map((like: PostLike) => {
			return new PostLike(like.id, like.postId, like.userId, like.commentId);
		});
		
	};
	findLikesByPostId = (postId: number) => {
		const newLikes = this.likes.map((like: PostLike) => {
			return like.postId === postId && like.commentId === undefined;
		});
		return newLikes;
	};
	findLikeByCommentId = (commentId: number) => {
		return this.likes.find((like: PostLike) => {
			return like.commentId === commentId;
		});
	};
}
