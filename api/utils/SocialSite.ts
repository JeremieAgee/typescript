import { Post } from "./Post";
import { PostLike } from "./PostLike";
import { User } from "./User";
import { Comment } from "./Comment";
import { supabaseDB } from "../databases/supabaseInstance";
import { Request, Response, NextFunction } from "express";

export class SocialSite {
	name: string;
	posts: Post[];
	comments: Comment[];
	likes: PostLike[];
	users: User[];
	constructor() {
		this.name = "Socially Crypto";
		this.posts = [];
		this.comments = [];
		this.likes = [];
		this.users = [];
		this.setsite();
	}
	/*
	Set intital values for site splits data into respected locations
	then clears the site arrays that are no longer needed as they are duplicated info
	*/
	setsite = async () => {
		const [posts, comments, likes, users] = await Promise.all([
			this.fetchPosts(),
			this.fetchComments(),
			this.fetchLikes(),
			this.fetchUsers(),
		]);
		this.users = users;
		this.likes = likes;
		this.comments = comments.map((comment: Comment) => {
			comment.likes = this.findLikesByCommentId(comment.id);
			return comment;
		});
		this.posts = posts.map((post: Post) => {
			post.likes = this.findLikesByPostId(post.id);
			post.comments = this.findCommentsByPostId(post.id);
			return post;
		});
		this.likes = [];
		this.comments = [];
		console.log(`Site has been set`);
	};
	//Fetch initial site data
	fetchUsers = async () => {
		const users = await supabaseDB.get("/users");
		const newUsers = users.data.map((user: User) => {
			return new User(user.username, user.email, user.id);
		});
		return newUsers;
	};
	fetchLikes = async () => {
		const likesData = await supabaseDB.get("/postlike");
		const newLikes = likesData.data.map((like: PostLike) => {
			return new PostLike(like.postId, like.userId, like.commentId, like.id);
		});
		return newLikes;
	};
	fetchComments = async () => {
		const commentData = await supabaseDB.get("/comment");
		const newComments = commentData.data.map((comment: Comment) => {
			return new Comment(
				comment.id,
				comment.postId,
				comment.userId,
				comment.context
			);
		});
		return newComments;
	};
	fetchPosts = async () => {
		const postsData = await supabaseDB.get("/post");
		const newPosts = postsData.data.map((post: Post) => {
			return new Post(post.content, post.userId, post.id);
		});
		return newPosts;
	};

	//Utilities sorting and dividing for site setup
	findLikesByPostId = (postId: number) => {
		const newLikes = this.likes.filter(
			(like: PostLike) =>
				like.postId === postId &&
				(like.commentId === null || like.commentId === undefined)
		);
		return newLikes;
	};
	findLikesByCommentId = (commentId: number) => {
		const newLikes = this.likes.filter(
			(like: PostLike) => like.commentId === commentId
		);
		return newLikes;
	};
	findCommentsByPostId = (postId: number) => {
		const newLikes = this.comments.filter(
			(comment: Comment) => comment.postId === postId
		);
		return newLikes;
	};

	//Utilities for finding site objects
	findUser = (userId: number) => {
		const user = this.users.find((user: User) => {
			return userId === user.id;
		});
		if (user) {
			return user;
		} else {
			throw new Error(`No user with ${userId} id found`);
		}
	};
	
	findPost = (postId: number)=>{	
		const foundPost = this.posts.find((post:Post)=>{
			return post.id === postId
		}) 
		if (foundPost){
			return foundPost
		} else {
			throw new Error(`No post with the id of ${postId}`)
		}

	}
	//API functions for all user routes
	postUser = async (req: Request, res: Response, next: NextFunction) => {
		const { username, email } = req.body;
		const newUser = new User(username, email);
		const userId = await supabaseDB.post("/users", newUser);
		newUser.id = userId;
		this.users.push(newUser);
	};
	putUser = async (req: Request, res: Response, next: NextFunction) => {
		const { username, email, id } = req.body;
		const updatedUser = new User(username, email);
		const userId = Number(req.params.id);
		const user = this.findUser(userId);
		user.updateUser(updatedUser);
		if (user && user.id === id) {
			await supabaseDB.put("/users", userId, user);
			const index = this.users.findIndex((user: User) => {
				user.id === userId;
			});
			this.users.splice(index, 1, user);
		}
	};
	
	getUsers = async (req: Request, res: Response, next: NextFunction) => {
		res.status(200).json(this.users);
	}

	getUserById = async (req: Request, res: Response, next: NextFunction) => {
		const userId = Number(req.params.id);
		const user = this.findUser(userId);
		res.status(200).json(user);
	};

	deleteUser = async (req: Request, res: Response, next: NextFunction) => {
		const userId = Number(req.params.id);
		const user = this.findUser(userId);
		if (user) {
			await supabaseDB.delete("/users", userId);
			res.status(203).json();
		}
	};

	//API functions for the Post routes
	getPostById = (req: Request, res: Response, next: NextFunction) => {
		const postId = Number(req.params.id);
		const post =  this.findPost(postId)
		res.status(200).json(post);

	};

	getPosts = (req: Request, res: Response, next: NextFunction) => {
		try {
			res.status(200).json(this.posts);
		} catch (err) {
			next(err);
		}
	};
	postPost = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { content, userId } = req.body;
			const newPost = new Post(content, userId);
			const postId = await supabaseDB.post("/post", newPost);
			newPost.id = postId;
			this.posts.push(newPost);
		} catch (err) {
			next(err);
		}
	};
	putPost = (req: Request, res: Response, next: NextFunction) => {
		try {
			const { content, userId} = req.body;
			const postId = Number(req.params.id);
			const newPost = new Post(content, userId)
			const post = this.findPostById(postId);
			if(post&&post.userId){
				post.update(newPost)
			}
		} catch (err) {
			next(err);
		}
	};
	deletePost = (req: Request, res: Response, next: NextFunction) => {
		try {
			const { content, userId } = req.body;
			res.status(200).json(this.posts);
		} catch (err) {
			next(err);
		}
	};
}
