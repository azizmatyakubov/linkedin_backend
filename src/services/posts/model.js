import mongoose from "mongoose"
const { Schema, model } = mongoose

const postSchema = new Schema(
  {
    text: { type: String, required: true },
    image: { type: String, required: true, default: 'https://penmadsidrap.com/uploads/blog_image/default.jpg' },
    user: {type: Schema.Types.ObjectId, required: true, ref: 'Profile'},
  },
  { timestamps: true }
)

export default model("Post", postSchema)
