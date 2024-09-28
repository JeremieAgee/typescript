export class PostLike {
	id: number;
	postId: number;
	userId: string;
	commentId?: number;
	constructor(
		id: number,
		postId: number,
		userId: string,
		commentId?: number
	) {
		this.id = id;
		this.postId = postId;
		this.userId = userId;
		this.commentId = commentId;
	}
}
