import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    status: { type: String, default: "pending" }, // pending | published
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
