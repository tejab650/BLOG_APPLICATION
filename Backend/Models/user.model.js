import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, default: uuidv4 },
    name: { type: String, unique: true},
    email: { type: String, unique: true},
    password: {
      type: String,
      required: function () {
        return !this.authId;
      },
    },
    img_url: { type: String },
    authId: { type: String },
    roles:{
      type:[String],
      default:["USER"]
    }
  },
  { timestamps: true }
);

const userModel = mongoose.model("user", userSchema);

export default userModel;
