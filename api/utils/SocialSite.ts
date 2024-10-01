import { Post } from "./Post";
import { PostLike } from "./PostLike";
import { User } from "./User";
import { Comment } from "./Comment";
import { supabaseDB } from "../databases/supabaseInstance";


export class SocialSite {
	name: string;
	posts: Post[];
	comments: Comment[];
	likes: PostLike[];
	users: User[];
	constructor() {
		this.name = "Socially Crypto";
	}
	setsite = async () =>{
		const [posts, comments, likes, users ] = await Promise.all([this.fetchPosts(), this.fetchComments(), this.fetchLikes(), this.fetchUsers() ]);
		this.users = users;
		this.likes = likes;
		this.comments = comments.map((comment: Comment)=>{
			comment.likes = this.findLikesByCommentId(comment.id)
			return comment
		});
		this.posts = posts.map((post:Post)=>{
			post.likes = this.findLikesByPostId(post.id)
			post.comments = this.findCommentByPostId(post.id);
			return post
		});
		this.likes = [];
		this.comments = [];
	}
	addUser = async (user: User) => {
        const userId = await supabaseDB.post("/users", user);
		const newUser = new User(user.username, user.email, userId);
		this.users.push(newUser);

	}
	fetchUsers = async () => {
		const users = await supabaseDB.get("/users");
		const newUsers = users.data.map((user: User) => {
			return new User(user.username, user.email, user.id);
		});
		return newUsers
	}
	fetchLikes = async () => {
		const likesData = await supabaseDB.get("/postlike");
		const newLikes = likesData.data.map((like: PostLike) => {
			return new PostLike(like.postId, like.userId, like.commentId, like.id );
		});
		return newLikes
	};
	fetchComments = async ()=>{
		const commentData = await supabaseDB.get("/comment");
		const newComments = commentData.data.map((comment: Comment)=>{
			return new Comment(comment.id, comment.postId, comment.userId, comment.context)
		})
		return newComments
	}
	fetchPosts = async () => {
		const postsData = await supabaseDB.get("/post");
		const newPosts = postsData.data.map((post: Post)=>{
			return new Post(post.content, post.comments, post.id)
		})
		return newPosts
	}
	findUser = (userId: number)=>{
		const user = this.users.find((user: User)=>{
			return userId === user.id;
		})
		if(user){
			return user
		} else {
			throw new Error(`No user with ${userId} id found`);
		}
	}
	findLikesByPostId = (postId: number) => {
		const newLikes = this.likes.filter((like: PostLike) => 
			like.postId === postId && like.commentId === undefined
		);
		return newLikes
	};
	findLikesByCommentId = (commentId: number) => {
		const newLikes = this.likes.filter((like: PostLike) => 
			like.commentId === commentId
		);
		return newLikes;
	};
	findCommentByPostId = (postId: number)=>{
		const newLikes = this.comments.filter((comment: Comment) => 
			comment.postId === postId
		);
		return newLikes;
	};
}
