export class PostLike {
	id: number;
	postId: number;
	commentId?: number;
	constructor(
		id: number,
		postId: number,
		commentId?: number
	) {
		this.id = id;
		this.postId = postId;
		this.commentId = commentId;
	}
}
