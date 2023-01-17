import express from "express"
import postsModel from "./model.js"

const postsRouter = express.Router()

postsRouter.post("/", async (req, res, next) => {
  try {
    const newPost = new postsModel(req.body)
    // here it happens validation (thanks to Mongoose) of req.body, if it is not ok Mongoose will throw an error
    // if it is ok the user is not saved yet
    const { _id } = await newPost.save()
    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

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
        const post = await postsModel.findById(req.params.postId)
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
        const updatedPost = await postsModel.findByIdAndUpdate(
          req.params.postId, // WHO you want to modify
          req.body, // HOW you want to modify
          { new: true, runValidators: true } // options. By default findByIdAndUpdate returns the record pre-modification. If you want to get back the newly updated record you shall use new:true
          // By default validation is off in the findByIdAndUpdate --> runValidators:true
        )
    
        // ****************************************** ALTERNATIVE METHOD ********************************************
        /*     const user = await UsersModel.findById(req.params.userId)
        // When you do a findById, findOne,.... you get back a MONGOOSE DOCUMENT which is NOT a normal object
        // It is an object with superpowers, for instance it has the .save() method that will be very useful in some cases
        user.age = 100
        await user.save() */
    
        if (updatedPost) {
          res.send(updatedPost)
        } else {
          next(createHttpError(404, `User with id ${req.params.postId} not found!`))
        }
      } catch (error) {
        next(error)
      }
    })

postsRouter.delete("/:postId", async (req, res, next) => {
    try {
        const deletedPost = await postsModel.findByIdAndDelete(req.params.postId)
    
        if (deletedPost) {
          res.status(204).send()
        } else {
          next(createHttpError(404, `Post with id ${req.params.postId} not found!`))
        }
      } catch (error) {
        next(error)
      }
    })

export default postsRouter