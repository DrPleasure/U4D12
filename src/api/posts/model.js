import mongoose from "mongoose";

const { Schema, model } = mongoose

const postsSchema = new Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: {
      value: { type: Number, required: true },
      unit: { type: String, required: true },
    },
    authors: [{
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }],
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);


      



export default model("Post", postsSchema)  //  this model is now automatically linked to the "Blogposts" collection, if it's not there it will be created