import express from "express"
import createError from "http-errors"
import profileSchema from "./model.js"
import { pipeline } from "stream"
import experienceSchema from "../experiences/model.js"
import q2m from "query-to-mongo"
//-----for creating and upload a new image
import multer from "multer"
import { saveExperiencesImage } from "../../lib/fs-tools.js"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import { v2 as cloudinary } from "cloudinary"
import { getPdfReadableStream } from "../../lib/pdf-tools.js"
import json2csv from "json2csv"
import fs from "fs-extra"
import csv from "csv-express"

const profileRouter = express.Router()

const cloudinaryAvatarUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "profile_avatars",
    },
  }),
}).single("avatar")

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
///////////

//  POST https://yourapi.herokuapp.com/api/profile/{userId}/picture
// Replace user profile picture (name = profile)
profileRouter.put("/:profileId/uploadAvatar", cloudinaryAvatarUploader, async (req, res, next) => {
  try {
    const profile = await profileSchema.findByIdAndUpdate(req.params.profileId, { image: req.file.path }, { new: true })

    if (profile) {
      res.status(201).send(profile)
    } else {
      console.log("profile not found")
    }
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
    const profile = await profileSchema.findById(req.params.profileId).populate("experiences")
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
profileRouter.get("/:profileId/downloadCV", async (req, res, next) => {
  try {
    const profile = await profileSchema.findById(req.params.profileId)
    //do a loop to retrieve every experiences ... toString/toObject
    if (profile) { 

    //   const pdfStream = await generateBlogPDF(blog);

    //res.setHeader("Content-Type", "application/pdf");
    // pipeline(pdfStream, res, (err) => {
    //   if (err) {
    //     console.log(err);
    //   }
    // });
    //pdfStream.end();
    res.setHeader("Content-Type", "application/pdf");
      const source =await  getPdfReadableStream(profile)
      const destination = res

      pipeline(source, destination, (err) => {
        if (err) console.log(err)
      })
     // source.end()
    } else {
      console.log("this profile does not exist")
    }
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

//----------------------------------creating the endponits for the experience
profileRouter.post("/:username/experiences", async (req, res, next) => {
  try {
    const user = await profileSchema.find({ _id: req.params.username })
    if (user) {
      const experienceToInsert = await experienceSchema({
        ...req.body,
        user: req.params.username,
      }).save()

      const modifiedUser = await profileSchema.findOneAndUpdate(
        { _id: req.params.username },
        { $push: { experiences: experienceToInsert } },
        { new: true, runValidators: true }
      )

      if (modifiedUser) {
        res.send(modifiedUser)
      }
    }
  } catch (error) {
    next(error)
  }
})

profileRouter.get("/:username/experiences", async (req, res, next) => {
  try {
    const user = await profileSchema.findById(req.params.username).populate("experiences")
    console.log(user.experiences)
    if (user) {
      res.send(user.experiences)
    } else {
      next(createError(404, `Blog post with ${req.params.blogPostId} not found`))
    }
  } catch (error) {
    next(error)
  }
})

profileRouter.get("/:userName/experiences/:experienceId", async (req, res, next) => {
  try {
    const user = await profileSchema.findById(req.params.userName).populate("experiences")
    if (user) {
      const experience = await user.experiences.find((experience) => req.params.experienceId === experience._id.toString()).populate("user")
      console.log(user.experiences)
      if (experience) {
        res.send(experience)
      } else {
        next(createError(404, "Experience not found"))
      }
      await user.save()
      res.send(user)
    } else {
      next(createError(404, "Blog post not found"))
    }
  } catch (error) {
    next(error)
  }
})

profileRouter.delete("/:userName/experiences/:experienceId", async (req, res, next) => {
  try {
    const modifiedUser = await profileSchema.findOneAndDelete(
      req.params.userName,
      {
        $pull: { experiences: { _id: req.params.experienceId } },
      },
      { new: true }
    )

    if (modifiedUser) {
      res.send(modifiedUser)
    } else {
      next(createError(404, "blogPost not found"))
    }
  } catch (error) {
    console.log(error)
  }
})

profileRouter.put("/:userName/experiences/:experienceId", async (req, res, next) => {
  try {
    const user = await profileSchema.findById(req.params.userName).populate("experiences")
    if (user) {
      const index = user.experiences.findIndex((experience) => experience._id.toString() === req.params.experienceId)
      if (index !== -1) {
        user.experiences[index] = {
          ...user.experiences[index],
          ...req.body,
        }
        await user.save()
        res.send(user)
      } else {
        next(createError(404, "comment not found"))
      }
    } else {
      next(createError(404, "Blog post not found"))
    }
  } catch (error) {
    next(error)
  }
})

profileRouter.delete("/:userName/experiences/:experienceId", async (req, res, next) => {
  try {
    const modifiedUser = await profileSchema.findByIdAndUpdate(
      req.params.userName,
      {
        $pull: {
          experiences: req.params.experienceId,
        },
      },
      { new: true }
    )
    if (modifiedUser) {
      res.send(modifiedUser)
    }
  } catch (error) {
    res.send(error)
  }
})

//---------------------------------Change the experience picture
const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: { folder: "experienceLinkedinImage" },
  }),
}).single("expImage")

profileRouter.put("/:userId/experiences/:expId/picture", cloudinaryUploader, async (req, res, next) => {
  try {
    const experience = await experienceSchema.findByIdAndUpdate(req.params.expId, { image: req.file.path }, { new: true })
    res.send(experience)
  } catch (error) {
    next(error)
  }
})

//---------------------------for downloading the csv

profileRouter.get("/:userId/downloadExperiencesCSV", async (req, res, next) => {
  try {
    var filename = "experiences.csv"

    experienceSchema
      .find({ user: req.params.userId })
      .lean()
      .exec({}, function (err, experiences) {
        if (err) res.send(err)

        res.statusCode = 200
        res.setHeader("Content-Type", "text/csv")
        res.setHeader("Content-Disposition", "attachment; filename=" + filename)
        res.csv(experiences, true)
      })
  } catch (error) {
    console.log(error)
  }
})

export default profileRouter
