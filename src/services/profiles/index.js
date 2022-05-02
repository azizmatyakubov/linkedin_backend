import express from "express"
import createError from "http-errors"
import profileSchema from "./model.js"
import { pipeline } from "stream"
// import { createReadStream, createWriteStream } from "fs-extra"
// import request from "request"
// import { getPdfReadableStream } from "../../lib/pdf-tools.js"

const profileRouter = express.Router()

//CREATE ERRORS
// finish pdf enpoint

////////////
profileRouter.post("/", async (req, res, next) => {
  try {
    const profile = new profileSchema(req.body)

    const { _id } = await profile.save()

    res.status(201).send(_id)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

////////////
profileRouter.get("/", async (req, res, next) => {
  try {
    const profile = await profileSchema.find()
    res.status(200).send(profile)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

////////////
profileRouter.get("/:profileId", async (req, res, next) => {
  try {
    const profile = await profileSchema.findById(req.params.profileId)
    if (profile) {
      res.status(200).send(profile)
    } else {
      console.log("This profile does not exist")
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})
//  GET https://yourapi.herokuapp.com/api/profile/{userId}/CV
// Generates and download a PDF with the CV of the user (details, picture, experiences)
profileRouter.get("/profileId/CV", async (req, res, next) => {
  try {
    // const pdfToDowload = await getBooks()
    res.setHeader("Content-Disposition", `attachment; filename=${req.params.profileId}_CV.pdf`)
    const source = getPdfReadableStream(pdfToDowload)
    const destination = res

    pipeline(source, destination, (err) => {
      if (err) console.log(err)
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
})

////////////
profileRouter.put("/:profileId", async (req, res, next) => {
  try {
    const profile = await profileSchema.findByIdAndUpdate(req.params.profileId, req.body, { new: true })
    if (profile) {
      res.status(200).send(profile)
    } else {
      console.log("This profile does not exist")
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})
////////////
profileRouter.delete("/:profileId", async (req, res, next) => {
  try {
    const profile = await profileSchema.findByIdAndDelete(req.params.profileId)
    if (profile) {
      res.status(200).send("Profile Destroyed")
    } else {
      console.log("This profile does not exist")
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

export default profileRouter