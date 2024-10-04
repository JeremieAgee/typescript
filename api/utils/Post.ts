import { Comment } from "./Comment";
import { PostLike } from "./PostLike";
export class Post {
	id: number;
	content: string;
	userId: number;
	userUid: string;
	comments: Comment[];
	likes: PostLike[];
	constructor(
		content: string,
		userId: number,
		userUid: string,
		id?: number,
		comments?: Comment[],
		likes?: PostLike[]
	) {
		this.id = id ?? 0;
		this.content = content;
		this.userUid = userUid;
		this.userId = userId;
		this.comments = comments ?? [];
		this.likes = likes ?? [];
	}
	update = (post: Post) => {
		if (this.id === post.id) {
			this.content = post.content;
		}
	};

	addComment = (comment: Comment) => {
		this.comments.push(comment);
	};
	removeComment = (commentId: number) => {
		if (this.findComment(commentId)) {
			const index = this.comments.findIndex((comment: Comment) => {
				return comment.id === commentId;
			});
			this.comments.splice(index, 1);
		}
	};
	addlike = (like: PostLike) => {
		
		this.likes.push(like);
	};
	removeLike = (like: PostLike) => {
		const foundLike = this.findLike(like.userUid);
		if (foundLike) {
			const index = this.likes.findIndex((oldlike: PostLike) => {
				oldlike.id === foundLike.id;
			});
			this.likes.splice(index, 1);
		}
	};
	findComment = (commentId: number) => {
		const foundComment = this.comments.find((comment: Comment) => {
			return comment.id === commentId;
		});
		if (foundComment) {
			return foundComment;
		}
	};
	findLike = (likeUid: string) => {
		const foundLike = this.likes.find((like: PostLike) => {
			return like.userUid === likeUid;
		});
		if (foundLike) {
			return foundLike;
		} else {
			throw new Error(`No like found`);
		}
	};
}
