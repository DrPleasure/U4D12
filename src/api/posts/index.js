import express from "express"
import postsModel from "./model.js"
import bcrypt from "bcrypt"
import atob from "atob"
import { adminOnlyMiddleware } from "../../lib/auth/adminOnly.js"
import { basicAuthMiddleware } from "../../lib/auth/basicAuth.js"
import createHttpError from "http-errors"

const postsRouter = express.Router()

// Require authentication for POST, PUT, and DELETE endpoints
const authMiddleware = (req, res, next) => {
  if (req.method === "POST" || req.method === "PUT" || req.method === "DELETE") {
  basicAuthMiddleware(req, res, next)
  } else {
  next()
  }
  }
  postsRouter.use(authMiddleware)
  
  postsRouter.post("/", async (req, res, next) => {
    try {
      const newPost = new postsModel({ ...req.body, authors: [req.user._id] });
      const { _id } = await newPost.save();
      res.status(201).send({ _id });
    } catch (error) {
      next(error);
    }
  });
  
  postsRouter.get("/", async (req, res, next) => {
  try {
  const posts = await postsModel.find()
  res.send(posts)
  } catch (error) {
  next(error)
  }
  })
  
  postsRouter.get("/:postId", async (req, res, next) => {
  try {
  const post = await postsModel.findOne({ _id: req.params.postId })
  if (post) {
  res.send(post)
  } else {
  next(createHttpError(404, `Post with id ${req.params.postId} not found!`))
  }
  } catch (error) {
  next(error)
  }
  })
  
  postsRouter.put("/:postId", async (req, res, next) => {
    try {
      const post = await postsModel.findOne({ _id: req.params.postId });
      if (!post) {
        next(createHttpError(404, `Post with id ${req.params.postId} not found!`));
      } else if (!post.authors.includes(req.user._id)) {
        next(createHttpError(401, "Unauthorized to update this post"));
      } else {
        const updatedPost = await postsModel.findOneAndUpdate(
          { _id: req.params.postId },
          req.body,
          { new: true, runValidators: true }
        );
        res.send(updatedPost);
      }
    } catch (error) {
      next(error);
    }
  });
  
  
  postsRouter.delete("/:postId", async (req, res, next) => {
    try {
      const post = await postsModel.findOne({ _id: req.params.postId });
      if (!post) {
        next(createHttpError(404, `Post with id ${req.params.postId} not found!`));
        return;
      }
  
      // check if the user is one of the authors
      if (!post.authors.includes(req.user._id)) {
        next(createHttpError(401, "Not authorized to delete this post"));
        return;
      }
  
      // remove the user from the authors list
      post.authors = post.authors.filter((author) => author.toString() !== req.user._id.toString());
  
      // if there are no more authors, delete the post
      if (!post.authors.length) {
        await post.delete();
      } else {
        // otherwise, save the updated post with the remaining authors
        await post.save();
      }
  
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });
  
// ADDS THE /me/stories ENDPOINT - retrieving all the posts from the authenticated user

postsRouter.get("/me/stories", async (req, res, next) => {
  try {
    const posts = await postsModel.find({ authors: { $in: [req.user._id] } });
    res.send(posts);
  } catch (error) {
    next(error);
  }
});




  export default postsRouter