import express from "express"
import createError from "http-errors"
import postSchema from "./model.js"



const postRouter = express.Router()


postRouter.post("/", async (req, res, next) => {
  try {
    const post = new postSchema(req.body)

    const { _id } = await post.save()

    res.status(201).send(_id)
  } catch (error) {
    console.log(error)
    next(error)
  }
})


postRouter.get("/", async (req, res, next) => {
  try {
    const post = await postSchema.find().populate("user")
    res.status(200).send(post)
  } catch (error) {
    console.log(error)
    next(error)
  }
})


postRouter.get("/:postId", async (req, res, next) => {
  try {
    const post = await postSchema.findById(req.params.postId)
    if (profile) {
      res.status(200).send(post)
    } else {
      console.log("This post does not exist")
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})


postRouter.put("/:postId", async (req, res, next) => {
  try {
    const post = await postSchema.findByIdAndUpdate(req.params.postId, req.body, { new: true })
    if (post) {
      res.status(200).send(post)
    } else {
      console.log("This post does not exist")
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

postRouter.delete("/:postId", async (req, res, next) => {
  try {
    const post = await postSchema.findByIdAndDelete(req.params.postId)
    if (post) {
      res.status(200).send("Post Destroyed")
    } else {
      console.log("This post does not exist")
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

export default postRouter