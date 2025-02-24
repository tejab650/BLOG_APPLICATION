import { console } from "inspector";
import postModel from "../Models/post.model.js";
import userModel from "../Models/user.model.js";

export const allUsersController = async (req, res) => {
  console.log("Inside the all users controller");
  try {
    const users = await userModel.find().select("-password").sort({createdAt:-1});
    const usersWithPosts = await Promise.all(
      users.map(async (user) => {
        const userPostsCount = await postModel.countDocuments({
          author_Id: user._id,
        });
        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          image: user.img_url,
          postsCount: userPostsCount,
        };
      })
    );
    return res
      .status(200)
      .json({ message: "Successfully retrieved", Users: usersWithPosts });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const allPosts = async (req, res) => {
  console.log("Inside the all posts controller");
  try {
    const posts = await postModel
      .find()
      .populate("author_Id", "name")
      .sort({ createdAt: -1 });
    return res.status(200).json({ message: "Successfully retrived", posts });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const getUserDetails = async (req, res) => {
  console.log("Inside the get user details controller ");
  const { userId } = req.params;
  try {
    const user = await userModel.findOne({ _id: userId }).select("-password");
    const userPosts = await postModel.find({ author_Id: user._id });
    const count = userPosts.length;
    return res.status(200).json({
      message: "User details fetched successfully",
      user,
      posts: userPosts,
      count:count
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const deletedPostController = async(req,res)=>{
    console.log("Inside the delete post controller ");
    const {postId} = req.params;
    try {
        const deletedPost = await postModel.findByIdAndDelete(postId);
        return res.status(200).json({message:"Successfully deleted the post"});
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message:error.message});
    }
}
