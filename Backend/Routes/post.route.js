import express from 'express';
import { authenticateToken } from '../Middlewares/verfiyJwtToken.js';
import { upload } from '../Utils/imageUploader.js';
import { deletePostById, displayPostById, getAllAuthorRelatedPosts, getAllPosts, updatePostById, uploadPost } from '../Controllers/post.controller.js';

const Router = express.Router();

Router.post('/addPost',authenticateToken,upload.single("image"),uploadPost);
Router.get("/allPosts",getAllPosts);
Router.get("/:id",displayPostById);
Router.delete("/:id",deletePostById);
Router.put("/:id",updatePostById);

Router.get("/Userposts/:id",getAllAuthorRelatedPosts);


export default Router;