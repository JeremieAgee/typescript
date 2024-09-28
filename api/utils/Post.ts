import { Comment } from "./Comment";
export class Post {
	id: number;
	content: string;
	comments: Comment[];
	likes: number;
	constructor(
		id: number,
		content: string,
		comments: Comment[],
		likes: number
	) {
		this.id = id;
		this.content = content;
		this.comments = comments;
		this.likes = likes;
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
    addlike = () => {
        this.likes++;
    };
    removeLike = () => {
        this.likes--;
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
