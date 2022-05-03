import express from "express"
import createError from "http-errors"
import postSchema from "./model.js"
import multer from "multer"

import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"

const postRouter = express.Router()


const cloudinaryUploader = multer({
    storage: new CloudinaryStorage({
      cloudinary, // this searches in .env for something called CLOUDINARY_URL which contains your API Environment variable
      params: {
        folder: "postImages",
      },
    }),
  }).single("post")

postRouter.post("/:userId", async (req, res, next) => {
  try {

    const post = new postSchema({...req.body, user: req.params.userId})

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
    const post = await postSchema.findById(req.params.postId).populate("user")
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


postRouter.put("/:postId", async (req, res, next) => {
  try {
    const post = await postSchema.findByIdAndUpdate(req.params.postId, req.body, { new: true }).populate("user")
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

// UPLOADING PICTURE FOR POST
postRouter.post("/:postId/uploadImage", cloudinaryUploader, async(req, res, next) => {
    try {
      console.log(req.file)
      const post = await postSchema.findByIdAndUpdate(req.params.postId, {image: req.file.path}, {new: true})
      if(post) {
        res.send(post.image)
      } else {
          console.log(error.message)
      }
    } catch (error) {
      console.log(error)
      next(error)
    }
  })


export default postRouter