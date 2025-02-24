import dotenv from 'dotenv';
dotenv.config();

import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/static/images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// console.log('In the imageUploader File');
// console.log(process.env.CLOUD_NAME);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const upload = multer({ storage });

export const image_uploader = async (path, id) => {
  const resultResponse = await cloudinary.uploader.upload(path, {
    public_id: id,
    overwrite: true,
    invalidate: true,
    allowed_formats: ["png", "jpg", "jpeg"],
  });

  return resultResponse;
};

export const posts_image_uploader = async (path, id) => {
  const resultResponse = await cloudinary.uploader.upload(path, {
    allowed_formats: ["png", "jpg", "jpeg"],
    folder:"posts"
  });

  return resultResponse;
};
