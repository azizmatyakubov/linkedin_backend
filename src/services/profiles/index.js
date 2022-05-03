import express from "express"
import createError from "http-errors"
import profileSchema from "./model.js"
import { pipeline } from "stream"
import experienceSchema from "../experiences/model.js"
import q2m from "query-to-mongo"
// import { createReadStream, createWriteStream } from "fs-extra"
// import request from "request"
// import { getPdfReadableStream } from "../../lib/pdf-tools.js"
import multer from "multer"
import { saveProfileAvatar } from "../../lib/fs-tools.js"

const profileRouter = express.Router()

//CREATE ERRORS
// finish pdf enpoint
// post an avatar

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
profileRouter.post("/:userId/uploadAvatar", multer().single("avatar"), async (req, res, next) => {
  try {
    // by now is saving the full image, not the URL, then i have to store in cloudinary and then modify "newImage"
    const profile = await profileSchema.findById(req.params.profileId)
    await saveProfileAvatar(`${req.params.userId}.jpeg`, req.file.buffer)

    if (profile) {
      // const newImage = await profileSchema(req.body).save()

      const updatedProfile = await profileSchema.findOneAndUpdate(
        { _id: req.params.username },
        { $push: { image: newImage } },
        { new: true, runValidators: true }
      )
      res.status(201).send(updatedProfile)
    } else {
      console.log("No Profile found")
    }

    res.status(201).send("Uploaded Succesfully")
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
// profileRouter.get("/profileId/CV", async (req, res, next) => {
//   try {
//     // const pdfToDowload = await getBooks()
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename=${req.params.profileId}_CV.pdf`
//     );
//     const source = getPdfReadableStream(pdfToDowload);
//     const destination = res;

//     pipeline(source, destination, (err) => {
//       if (err) console.log(err);
//     });
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// });

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
      const experienceToInsert = await experienceSchema(req.body).save()

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

    console.log(user)
    if (user) {
      res.send(user)
    } else {
      next(createError(404, `Blog post with ${req.params.blogPostId} not found`))
    }
  } catch (error) {
    next(error)
  }
})

profileRouter.get("/:userName/experiences/:experienceId", async (req, res, next) => {
  try {
    const user = await profileSchema
      .findById(req.params.userName)
      .populate("experiences")
      // const user = await profileSchema.find().populate({ path: "experiences" });
      // console.log(user);
      .populate({
        path: "experiences",
        select: " name surname email bio title area image username experiences",
      })
    if (user) {
      const experience = user.experiences.find((experience) => req.params.experienceId === experience._id.toString())
      console.log(experience)
      if (experience) {
        res.send(experience)
      } else {
        next(createError(404, "Experience not found"))
      }
    } else {
      next(createError(404, "Blog post not found"))
    }
  } catch (error) {
    next(error)
  }
})

profileRouter.put("/:userName/experiences/:experienceId", async (req, res, next) => {
  try {
    const user = await profileSchema.findOne({
      userName: req.params.userName,
    })
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
    next(error)
  }
})

export default profileRouter
