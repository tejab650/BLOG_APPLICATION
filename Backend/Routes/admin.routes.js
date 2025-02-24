import express from 'express';
import { authenticateToken } from '../Middlewares/verfiyJwtToken.js';
import { allPosts, allUsersController, deletedPostController, getUserDetails } from '../Controllers/admin.controller.js';

const router = express.Router();

router.get("/users",authenticateToken,allUsersController);
router.get("/posts",authenticateToken,allPosts);
router.get("/user/:userId",authenticateToken,getUserDetails);
router.delete('/posts/:postId',authenticateToken,deletedPostController);

export default router;