// Import Dotenv
require("dotenv").config();
// Import Express
import express from "express";
import genericError from "./middleware/genericError";
import notFound from "./middleware/notFound";
import home from "./routes/home";
import { SocialSite } from "./utils/SocialSite";

// Import CORS
const cors = require("cors");

const site = new SocialSite();

// create an express application
const app = express();

// define a port
const PORT = process.env.PORT;

// Define our Middleware
/*
const corsOptions = {
  origin: process.env.TYPESCRIPT_CLIENT,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
 Use CORS Middleware
app.use(cors(corsOptions));
*/
// Use JSON middleware to parse request bodies
app.use(express.json());

// Define our Routes
// Home Route
app.get("/", home);

// Post routes
app.get("/posts", site.getPosts);
app.get("/posts/:id", site.getPostById);
app.post("/posts", site.postPost);
app.put("/posts/:id", site.putPost);
app.delete("/posts/:id", site.deletePost);
app.get("/posts/:offset/:limit", site.getLimitedPosts);

// User routes
app.post("/users", site.postUser);
app.put("/users/:id", site.putUser);
app.delete("/users/:id", site.deleteUser);

// Comment routes
app.post("/posts/:id/comments", site.postComment);
app.put("/posts/:id/comments/:commentId", site.putComment);
app.delete("/posts/:id/comments/:commentid", site.deleteComment);

//Like Post routes
app.post("/posts/:id/like/:uid", site.addLikePost);
app.delete("/posts/:id/like/:uid", site.removeLikePost);

//Like Comment routes
app.post("/posts/:id/comments/:commentId/like/:uid", site.addLikeComment);
app.delete("/posts/:id/comments/:commentId/like/:uid", site.removeLikeComment)



// Generic Error Handling
app.use(genericError);

// 404 Resource not found Error Handling
app.use(notFound);

// make the server listen on our port
app.listen(PORT, () => {
	console.log(`The server is running on http://localhost:${PORT}`);
});

// export our app for testing
module.exports = app;
