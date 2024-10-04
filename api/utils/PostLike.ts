export class PostLike {
	id: number;
	postId: number;
	userId: number;
	userUid: string;
	commentId?: number;
	constructor(
		postId: number,
		userUid: string,
		userId: number,
		commentId?: number,
		id?: number
	) {
		this.id = id || 0;
		this.postId = postId;
		this.userId = userId;
		this.userUid = userUid;
		this.commentId = commentId;
	}
}
