import { unlink } from "node:fs";
import postModel from "../Models/post.model.js";
import {
  image_uploader,
  posts_image_uploader,
} from "../Utils/imageUploader.js";

export const uploadPost = async (req, res) => {
  console.log("Inside the upload post controller");
  console.log(req.body);
  console.log(req.file);
  const { title, desc, category } = req.body;
  const img_path = req.file.path;
  const userId = req.user.Id;
  //const userId = "2c1917a7-aa69-4d25-9e62-8db4103c2c46";
  try {
    const istitleExists = await postModel.findOne({ title });
    console.log(istitleExists);
    if (istitleExists) {
      return res.status(400).json({ message: "title already exists" });
    }
    const postData = new postModel({
      title: title,
      desc: desc,
      author_Id: userId,
      categories: category,
    });

    try {
      const result = await posts_image_uploader(img_path, userId);
      postData.post_img_url = result.secure_url;

      // to delete the image from local storage
      if (req.file.originalname !== "default.jpg") {
        unlink(img_path, (err) => {
          // if user uploads then delete the file
          if (err) {
            console.error("Error occurred during the deletion of file: ", err);
          } else {
            console.log("Successfully deleted the upload file");
          }
        });
      }
      await postData.save();
    } catch (error) {
      console.error("Error occurred during image uploadation: ", error.message);
      return res.status(400).json({ message: error.message });
    }
    res
      .status(201)
      .json({ message: "Blog posted successfully", blog: postData });
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllPosts = async (req, res) => {
  console.log("Inside the get all posts controller");
  const category  = req.query.category;
  try {
    let allPosts = "";
    if (category) {
      allPosts = await postModel.find({categories:{$in:[category]}}).sort({ createdAt: -1 });
    } else {
      allPosts = await postModel.find().sort({ createdAt: -1 });
    }
    return res
      .status(200)
      .json({ message: "Successfully retrived", posts: allPosts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllUserRelatedPosts = async (req, res) => {
  console.log("Inside the get user related posts controller");
  try {
    const posts = await postModel.find({ authorId: id }).sort({ createAt: -1 });
    return res.status(200).json({ message: "Fecthed siuccessfully", posts });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const displayPostById = async (req, res) => {
  const _id = req.params.id;
  //console.log("Post id is : ", _id);
  try {
    const post = await postModel
      .findById(_id)
      .populate("author_Id", "name img_url");
    return res.status(200).json({ message: "Successfully retrived", post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePostById = async (req, res) => {
  const _id = req.params.id;

  try {
    const deletedPost = await postModel.findByIdAndDelete(_id);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ message: "Post deleted successfully", deletedPost });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updatePostById = async (req, res) => {
  const _id = req.params.id;

  try {
    const updatedPost = await postModel.findByIdAndUpdate(_id, req.body, {
      new: true,
    });

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ message: "Post updated successfully", updatedPost });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllAuthorRelatedPosts = async (req, res) => {
  console.log("Inside the get all athor related posts ");
  if (!req.params.id) {
    return res.status(400).json({ message: "Some thing went wrong" });
  }
  const { id } = req.params;
  try {
    const posts = await postModel.find({ author_Id: id });
    //console.log("Posts are : ", posts);
    return res.status(200).json({ message: "Successfully retrieved", posts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
