export class Comment {
	id: number;
	postId: number;
	context: string;
	likes: number;
	constructor(id: number, postId: number, context: string, likes: number) {
		this.id = id;
		this.postId = postId;
		this.context = context;
		this.likes = likes;
	}
	addLike = () => {
		this.likes++;
	};
	removeLike = () => {
		this.likes--;
	};
}
