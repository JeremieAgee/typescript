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
	isSet: boolean;
	constructor() {
		this.name = "Socially Crypto";
		this.posts = [];
		this.comments = [];
		this.likes = [];
		this.users = [];
		this.isSet = false;
		this.setSite();
	}
	/*
	Set intital values for site splits data into respected locations
	Then clears the site arrays that are no longer needed as they are duplicated info
	*/
	setSite = async () => {
		if (this.isSet) {
			return;
		}
		this.isSet = true;
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
			return new User(user.username, user.email, user.uid, user.id);
		});
		return newUsers;
	};
	fetchLikes = async () => {
		const likesData = await supabaseDB.get("/postlike");
		const newLikes = likesData.data.map((like: PostLike) => {
			return new PostLike(
				like.postId,
				like.userUid,
				like.userId,
				like.commentId,
				like.id
			);
		});
		return newLikes;
	};
	fetchComments = async () => {
		const commentData = await supabaseDB.get("/comment");
		const newComments = commentData.data.map((comment: Comment) => {
			return new Comment(
				comment.postId,
				comment.userId,
				comment.userUid,
				comment.context,
				comment.id
			);
		});
		return newComments;
	};
	fetchPosts = async () => {
		const postsData = await supabaseDB.get("/post");
		const newPosts = postsData.data.map((post: Post) => {
			return new Post(post.content, post.userId, post.userUid, post.id);
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
	findUser = (uid: string) => {
		const user = this.users.find((user: User) => {
			return uid === user.uid;
		});
		if (user) {
			return user;
		} else {
			throw new Error(`No user with ${uid} id found`);
		}
	};

	findPost = (postId: number) => {
		const foundPost = this.posts.find((post: Post) => {
			return post.id === postId;
		});
		if (foundPost) {
			return foundPost;
		} else {
			throw new Error(`No post with the id of ${postId}`);
		}
	};
	//API functions for all user routes
	postUser = async (req: Request, res: Response, next: NextFunction) => {
		const { username, email, uid } = req.body;
		const newUser = new User(username, email, uid);
		const userId = await supabaseDB.post("/users", newUser);
		newUser.id = userId;
		this.users.push(newUser);
	};
	putUser = async (req: Request, res: Response, next: NextFunction) => {
		const { username, email } = req.body;
		const userId = req.params.id;
		const updatedUser = new User(username, email, userId);

		const user = this.findUser(userId);
		user.updateUser(updatedUser);
		if (user && user.uid === userId) {
			await supabaseDB.put("/users", user.id, user);
			const index = this.users.findIndex((user: User) => {
				user.uid === userId;
			});
			this.users.splice(index, 1, user);
		}
		res.status(204).end();
	};

	getUsers = async (req: Request, res: Response, next: NextFunction) => {
		res.status(200).json(this.users);
	};

	getUserById = async (req: Request, res: Response, next: NextFunction) => {
		const userId = req.params.id;
		const user = this.findUser(userId);
		res.status(200).json(user);
	};

	deleteUser = async (req: Request, res: Response, next: NextFunction) => {
		const userId = req.params.id;
		const user = this.findUser(userId);
		await supabaseDB.delete("/users", user.id);
		res.status(204).end();
	};

	//API functions for the Post routes
	getPostById = (req: Request, res: Response, next: NextFunction) => {
		const postId = Number(req.params.id);
		const post = this.findPost(postId);
		res.status(200).json(post);
	};

	getPosts = (req: Request, res: Response, next: NextFunction) => {
		try {
			res.status(200).json(this.posts);
		} catch (err) {
			next(err);
		}
	};
	getLimitedPosts = async (req: Request, res: Response, next: NextFunction) => {
		const offset = Number(req.params.offset);
		const limit = Number(req.params.limit) + offset;
		if (limit <= this.posts.length) {
			const returnItems = this.posts.slice(offset, limit);
			res.status(200).json(returnItems);
		}
	};
	postPost = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { content, userId, userUid } = req.body;
			if (!userId || !content) {
				res.status(400).json({ message: `Missing one or more fields` });
			}
			const newPost = new Post(content, userId, userUid);
			const postId = await supabaseDB.post("/post", newPost);
			newPost.id = postId;
			this.posts.push(newPost);
			res.status(201).json(newPost);
		} catch (err) {
			next(err);
		}
	};
	putPost = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { content, userId, userUid } = req.body;
			const postId = Number(req.params.id);
			const post = this.findPost(postId);
			if (!content || !userId || !post) {
				res.status(400).json({ message: `Missing one or more fields` });
			}
			if (post.userId === userId) {
				const newPost = new Post(content, userId, userUid);
				post.update(newPost);
				await supabaseDB.put("/post", postId, post);
			}
			res.status(200).json();
		} catch (err) {
			next(err);
		}
	};
	deletePost = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const postId = Number(req.params.id);
			const { userId } = req.body;
			const foundPost = this.findPost(postId);
			if (foundPost && foundPost.userId === userId) {
				await supabaseDB.delete("/post", postId);
				res.status(204).end();
			}
		} catch (err) {
			next(err);
		}
	};
	postComment = async (req: Request, res: Response, next: NextFunction) => {
		const postId = Number(req.params.id);
		const post = this.findPost(postId);
		const { context, userId, userUid } = req.body;
		if (!context || !userId) {
			res.status(400).json({ message: `Missing one or more fields` });
		}
		const newComment = new Comment(postId, userId, userUid, context);
		const commentId = await supabaseDB.post("/comment", newComment);
		newComment.id = commentId;
		post.addComment(newComment);
		res.status(201).json(newComment);
	};
	putComment = async (req: Request, res: Response, next: NextFunction) => {
		const commentId = Number(req.params.id);
		const { postId, context, userId } = req.body;
		if (!postId || !context || !userId) {
			res.status(400).json({ message: `One or More fields missing` });
		}
		const foundPost = this.findPost(postId);
		if (foundPost) {
			const comment = foundPost.findComment(commentId);
			if (comment) {
				comment.updateContext(userId, context);
				await supabaseDB.put("/comment", commentId, comment);
			}
			res.status(200).json(comment);
		}
	};
	deleteComment = async (req: Request, res: Response, next: NextFunction) => {
		const commentId = Number(req.params.id);
		const { postId, userId } = req.body;
		if (!postId || !userId) {
			res.status(400).json({ message: `One or More fields missing` });
		}
		const foundPost = this.findPost(postId);
		if (foundPost) {
			const foundComment = foundPost.findComment(commentId);
			if (foundComment && foundComment.userId === userId) {
				foundPost.removeComment(commentId);
				await supabaseDB.delete("/comment", commentId);
				res.status(204).end();
			}
		}
	};
	addLikePost = async (req: Request, res: Response, next: NextFunction) => {
		const postId = Number(req.params.id);
		const foundPost = this.findPost(postId);
		const uid = req.params.uid;
		const user = this.findUser(uid);
		if (user && foundPost) {
			const newLike = new PostLike(postId, uid, user.id);
			const likeId = await supabaseDB.post("/postlike", newLike);
			newLike.id = likeId;
			foundPost.addlike(newLike);
			res.status(201).json(newLike);
		}
	};
	removeLikePost = async (req: Request, res: Response, next: NextFunction) => {
		const postId = Number(req.params.id);
		const uid = req.params.uid;
		const foundPost = this.findPost(postId);
		if (foundPost && foundPost.userUid === uid) {
			const foundLike = foundPost.findLike(uid);
			await supabaseDB.delete("/postlike", foundLike.id);
			res.status(204).end();
		}
	};
	addLikeComment = async (req: Request, res: Response, next: NextFunction) => {
		const postId = Number(req.params.id);
		const foundPost = this.findPost(postId);
		const commentId = Number(req.params.commentId);
		const uid = req.params.uid;
		const user = this.findUser(uid);
		if (foundPost && user) {
			const comment = foundPost.findComment(commentId);
			if (comment) {
				const newLike = new PostLike(postId, uid, commentId);
				const likeId = await supabaseDB.post("/postlike", newLike);
				newLike.id = likeId;
				comment.addLike(newLike);
				res.status(201).json(newLike);
			}
		}
	};
	removeLikeComment = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		const postId = Number(req.params.id);
		const foundPost = this.findPost(postId);
		const commentId = Number(req.params.commentId);
		const uid = req.params.uid;
		const user = this.findUser(uid);
		if (foundPost && user) {
			const comment = foundPost.findComment(commentId);
			if (comment) {
				const foundLike = comment.findLike(uid);
				if (foundLike) {
					await supabaseDB.delete("/postlike", foundLike.id);
					comment.removeLike(uid);
					res.status(204).end();
				}
			}
		}
	};
}
