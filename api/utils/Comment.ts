export class Comment {
	id: number;
	postId: number;
	userId: string;
	context: string;
	likes: number;
	constructor(id: number, postId: number, userId: string, context: string, likes?: number) {
		this.id = id;
		this.postId = postId;
		this.userId = userId;
		this.context = context;
		this.likes = likes ?? 0;
	}
	updateContext = (userId: string, context: string ) => {
		if(this.userId === userId){
			this.context = context;
		} 
	}
	addLike = () => {
		this.likes++;
	};
	removeLike = () => {
		if(this.likes>0){this.likes--;}
	};
}
