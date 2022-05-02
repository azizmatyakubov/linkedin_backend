import mongoose from "mongoose";

const { Schema, model } = mongoose;

const experienceSchema = new Schema(
  {
    role: { type: String, required: true },
    company: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    description: { type: String, required: true },
    area: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamp: true }
);

export default model("Experience", experienceSchema);
/* {
        "_id": "5d925e677360c41e0046d1f5",  //server generated
        "role": "CTO",
        "company": "Strive School",
        "startDate": "2019-06-16T22:00:00.000Z",
        "endDate": "2019-06-16T22:00:00.000Z", //could be null
        "description": "Doing stuff here and there",
        "area": "Berlin",
         "user":{ // <— populated , this means dont store user on experience, store only _id
            "_id": "5d84937322b7b54d848eb41b", //server generated
            "name": "Diego",
            "surname": "Banovaz",
            "email": "diego@strive.school",
            "bio": "SW ENG",
            "title": "COO @ Strive School",
            "area": "Berlin",
            "image": ..., //server generated on upload, set a default here
            "username": "admin",
            "createdAt": "2019-09-20T08:53:07.094Z", //server generated
            "updatedAt": "2019-09-20T09:00:46.977Z", //server generated
        },
        "createdAt": "2019-09-30T19:58:31.019Z",  //server generated
        "updatedAt": "2019-09-30T19:58:31.019Z",  //server generated
        "image": ... //server generated on upload, set a default here
    }*/
