
import { PostLike } from "./PostLike";

export class Comment {
	id: number;
	postId: number;
	userId: number;
	userUid: string;
	context: string;
	likes: PostLike[];
	constructor(
		postId: number,
		userId: number,
		userUid: string,
		context: string,
		id?: number,
		likes?: PostLike[]
	) {
		this.id = id || 0;
		this.postId = postId;
		this.userId = userId;
		this.userUid = userUid;
		this.context = context;
		this.likes = likes ?? [];
	}
	updateContext = (userUid: string, context: string) => {
		if (this.userUid === userUid) {
			this.context = context;
		}
	};

	addLike = (like: PostLike) => {
		this.likes.push(like);
	};
	removeLike = (userUid:string)=>{
		const foundLike = this.findLike(userUid);
		if(foundLike&&foundLike.userUid === userUid){
			const i = this.likes.findIndex((like:PostLike)=>{
				return like.userUid=== userUid;
			})
			this.likes.splice(i, 1);
		}
	}
	findLike = (likeUid: string) => {
		const foundLike = this.likes.find((like: PostLike) => {
			return like.userUid === likeUid;
		});
		if(foundLike){
			return foundLike
		}
	};
}
