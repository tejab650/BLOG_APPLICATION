import express from 'express';
import { getAuthorDetails, logoutController, updateUserDetailsController, userLoginController, userSignupController, verifyTokenController } from '../Controllers/auth.controller.js';
import {authenticateToken} from "../Middlewares/verfiyJwtToken.js";
import { upload } from '../Utils/imageUploader.js';

const router = express.Router();

router.post("/signup", userSignupController);
router.post("/login", userLoginController);
router.get('/logout',authenticateToken,logoutController);
router.get("/verify",authenticateToken,verifyTokenController);
router.post("/update-profile",authenticateToken,upload.single('img'),updateUserDetailsController);

router.get("/:id",getAuthorDetails);

export default router;