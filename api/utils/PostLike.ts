export class PostLike {
	id: number;
	postId: number;
	userId: number;
	commentId?: number;
	constructor(
		postId: number,
		userId: number,
		commentId?: number,
		id?: number
	) {
		this.id = id||0;
		this.postId = postId;
		this.userId = userId;
		this.commentId = commentId;
	}
}
