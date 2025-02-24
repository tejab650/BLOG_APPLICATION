import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const contactSchema = new mongoose.Schema(
  {
    _id: { type: String, default: uuidv4 },
    name:{type:String},
    email:{type:String},
    message:{type:String},
    authorId:{type:String,ref:'user'}
  },
  { timestamps: true }
);

const contactModel = mongoose.model("contact", contactSchema);

export default contactModel;
