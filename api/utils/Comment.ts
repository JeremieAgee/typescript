import { PostLike } from "./PostLike";

export class Comment {
	id: number;
	postId: number;
	userId: number;
	context: string;
	likes?: PostLike[];
	constructor(id: number, postId: number, userId: number, context: string, likes?: PostLike[]) {
		this.id = id;
		this.postId = postId;
		this.userId = userId;
		this.context = context;
		this.likes = likes ?? [];
	}
	updateContext = (userId: number, context: string ) => {
		if(this.userId === userId){
			this.context = context;
		} 
	}
	addLike = (like: PostLike) => {
		this.likes?.push(like);
	};
	removeLike = (likeId: number, userId: number) => {
		this.likes?.find((like: PostLike)=>{
			return like.id ===likeId && like.userId === userId;
		})
	};
}
