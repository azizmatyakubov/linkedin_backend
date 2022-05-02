import express from "express";
import experienceModel from "./model.js";
import multer from "multer";
import { saveExperiencesImage } from "../../lib/fs-tools.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

const experienceRouter = express.Router();

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: { folder: "experienceLinkedinImage" },
  }),
});

experienceRouter.post("/", async (req, res, next) => {
  try {
    const newExperience = new experienceModel(req.body);
    const { _id } = await newExperience.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

experienceRouter.get("/", async (req, res, next) => {
  try {
    const experiences = await experienceModel.find();
    res.send(experiences);
  } catch (error) {
    next(error);
  }
});

experienceRouter.get("/:experienceId", async (req, res, next) => {
  try {
    const experience = await experienceModel.findById(req.params.experienceId);
    if (experience) {
      res.send(experiences);
    } else {
      res.send({ message: "Experience Not Found" });
    }
  } catch (error) {
    next(error);
  }
});

experienceRouter.put("/:experienceId", async (req, res, next) => {
  try {
    const updateExperience = await experienceModel.findByIdAndUpdate(
      req.params.experienceId,
      req.body,
      { new: true, runValidators: true }
    );
    if (updateExperience) {
      res.send(updateExperience);
    } else {
      res.send({ message: "Experience Not Found" });
    }
  } catch (error) {
    next(error);
  }
});

experienceRouter.delete("/:experienceId", async (req, res, next) => {
  try {
    const deleteExperience = await experienceModel.findByIdAndDelete(
      req.params.experienceId
    );
    if (deleteExperience) {
      res.send(deleteExperience);
    } else {
      res.send({ message: "Experience Not Found" });
    }
  } catch (error) {
    next(error);
  }
});

//-----------------------------------for upload picture

// experienceRouter.post(
//   "/:experienceId/picture",
//   multer().single("image"),
//   async (req, res, next) => {
//     try {
//       await saveExperiencesImage(req.file.originalname, req.file.buffer);
//       res.send();
//     } catch (error) {
//       next(error);
//     }
//   }
// );

// experienceRouter.put(
//   "/:experienceId/picture",
//   cloudinaryUploader,
//   async (req, res, next) => {
//     try {
//       const newPicture = await experienceModel.findByIdAndUpdate(
//         req.params.experienceId,
//         req.body,
//         { new: true, runValidators: true }
//       );
//       if (newPicture) {
//         res.send(newPicture);
//       }
//     } catch (error) {
//       next(error);
//     }
//   }
// );

export default experienceRouter;
