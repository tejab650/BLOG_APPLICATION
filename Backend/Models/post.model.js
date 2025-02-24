import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const postSchema = new mongoose.Schema(
  {
    _id: { type: String, default: uuidv4 },
    title:{type:String},
    desc:{type:String},
    post_img_url:{type:String},
    author_Id:{type:String,ref:'user'},
    categories:{type:Array}
  },
  { timestamps: true }
);

const postModel = mongoose.model("post", postSchema);

export default postModel;
