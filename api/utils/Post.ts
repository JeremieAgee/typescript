import { Comment } from "./Comment";
import { PostLike } from "./PostLike";
export class Post {
	id: number;
	content: string;
	comments: Comment[];
	likes:  PostLike[];
	constructor(
		content: string,
		comments?: Comment[],
		id?: number,
		likes?: PostLike[]
	) {
		this.id = id ?? 0;
		this.content = content;
		this.comments = comments ?? [];
		this.likes = likes ?? [];
	}
	addComment = async (comment: Comment) => {
		this.comments.push(comment);
	};
	removeComment = async (commentId: number) => {
		if(this.findComment(commentId)){
           const index = this.comments.findIndex((comment:Comment)=>{
            return (comment.id===commentId);
           });
           this.comments.splice(index, 1);
        }
	};
    addlike = (like: PostLike) => {
        this.likes.push(like);
    };
    removeLike = () => {
        
    }
    findComment = (commentId: number) =>{
        const foundComment = this.comments.find((comment: Comment)=>{
            return comment.id === commentId;
        })
        if(foundComment){
            return foundComment;
        } else {
            return new Error(`No comment found with id of `)
        }
    }
}
