import Joi from "joi";
import userModel from "../Models/user.model.js";
import { comparePassword, hashPassword } from "../Utils/hashPassword.js";
import { image_uploader } from "../Utils/imageUploader.js";
import { createJwtToken } from "../Utils/jwtTokenGeneration.js";
import { unlink } from "node:fs";

const userSignupSchemaValidator = Joi.object({
  name: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9._]"))
    .required()
    .messages({
      "any.required": "Name is required",
      "string.pattern.base": "Inavlid Name",
    })
    .normalize(),
  email: Joi.string()
    .email({ tlds: { allow: ["com"] } })
    .pattern(new RegExp("^[a-zA-Z0-9._%+-]+@gmail"))
    .required()
    .messages({
      "any.required": "Phone Number is required",
      "string.email": "Invalid Email format",
      "string.pattern.base": "Invalid email address",
    }),

  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9@]{3,30}$"))
    .min(6)
    .required()
    .messages({
      "any.required": "Password is required",
      "string.min": "Password must contains atleast 6 characters",
      "string.pattern.base":
        'Password must contains only letters, numbers, or "@".',
    }),
});

const userLoginSchemaValidator = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: ["com"] } })
    .pattern(new RegExp("^[a-zA-Z0-9._%+-]+@gmail"))
    .required()
    .messages({
      "any.required": "Phone Number is required",
      "string.email": "Invalid Email format",
      "string.pattern.base": "Invalid email address",
    }),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9@]{3,30}$"))
    .min(6)
    .required()
    .messages({
      "any.required": "Password is required",
      "string.min": "Password must contains atleast 6 characters",
      "string.pattern.base":
        'Password must contains only letters, numbers, or "@".',
    }),
});

export const userSignupController = async (req, res) => {
  console.log("inside the userSignup controller");
  console.log(req.body);

  const { name, email, password } = req.body;

  try {
    const requestData = {
      name: name,
      email: email,
      password: password,
    };
    console.log(requestData);
    const { error } = userSignupSchemaValidator.validate(requestData, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((e) => e.message);
      return res
        .status(400)
        .json({ message: "Invalid details", error: errors });
    }

    const existingUser = await userModel.findOne({
      $or: [{ email }, { name }],
    });

    if (existingUser) {
      if (existingUser.name === name) {
        return res
          .status(400)
          .json({ message: `Name Already Exists: ${name}` });
      }
      if (existingUser.email === email) {
        return res
          .status(400)
          .json({ message: `Email Already Exists: ${email}` });
      }
    }
    const hashedpassword = await hashPassword(password);
    const user = new userModel({
      name: name,
      email: email,
      password: hashedpassword,
    });
    //await user.save();

    let default_img_path = "public/static/images/default.jpg";

    // for incase if user uploads the image

    // if (!req.file) {
    //   default_img_path = "public/static/images/default.jpg";
    // } else {
    //   default_img_path = req.file.path;
    // }

    try {
      const result = await image_uploader(default_img_path, user._id);
      user.img_url = result.secure_url;

      // to delete the image from local storage
      // unlink(default_img_path, (err) => {     # if user uploads then delete the file
      //   if (err) {
      //     console.error("Error occurred during the deletion of file: ", err);
      //   } else {
      //     console.log("Successfully deleted the upload file");
      //   }
      // });
    } catch (error) {
      console.error("Error occurred during image uploadation: ", error.message);
      return res.status(400).json({ message: "Invalid image type" });
    }

    //   const { otp } = otpgeneration(phoneNumber);
    //   console.log("opt is: ", otp);
    //   const tokenVerificationTime = new Date();
    //   tokenVerificationTime.setSeconds(tokenVerificationTime.getSeconds() + 120);

    //   user.verificationToken = otp;
    //   user.verificationTokenExpiresAt = tokenVerificationTime;

    if (email === "admin@gmail.com" && name === "admin") {
      user.roles = "ADMIN";
    }
    await user.save();

    // const body = `Hello ${name},\nYour One-Time Password (OTP) is: ${otp}. This OTP is valid for 2 minutes. Please do not share it with anyone.\nIf you did not request this, please ignore this message or contact support.`;
    // await sendOtp(phoneNumber, body);

    const token = await createJwtToken(user._id);
    console.log("User token to be set in cookie: ", user._id);
    res.cookie("token", token, {
      signed: true,
      httpOnly: true,
      secure: false,
      maxAge: 10 * 60 * 60 * 1000,
    });
    const userDetails = {
      _id: user._id,
      name: user.name,
      email: user.email,
      img_url: user.img_url,
    };
    return res.status(201).json({
      message: "User successfully registered",
      user: userDetails,
      token,
    });
  } catch (error) {
    console.error("Error occured in signupcontroller : ", error.message);
    return res
      .status(500)
      .json({ message: `Internal server error ${error.message}` });
  }
};

export const userLoginController = async (req, res) => {
  console.log("Inside userLoginController function ");
  console.log(req.body);

  const { email, password } = req.body;
  try {
    const { error } = userLoginSchemaValidator.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((e) => e.message);
      return res
        .status(400)
        .json({ message: "Invalid details", error: errors });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: `User not found with these email ${email}` });
    }
    if (!user.password) {
      return res.status(400).json({
        message:
          "Plz login through google . while the user is registered with their google account",
      });
    }
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    //   if (!user.isVerified) {
    //     console.log("User is not verified the otp");
    //     return res.status(400).json({ message: "Plz conform the identity" });
    //   }

    const token = await createJwtToken(user._id);
    res.cookie("token", token, {
      signed: true,
      httpOnly: true,
      secure: false,
      maxAge: 10 * 60 * 60 * 1000,
    });
    const userDetails = {
      _id: user._id,
      name: user.name,
      email: user.email,
      img_url: user.img_url,
    };
    return res
      .status(200)
      .json({ message: "User logged In", user: userDetails, token });
  } catch (error) {
    console.error("Error is : ", error.message);
    return res
      .status(500)
      .json({ message: `Internal server error occured ${error.message}` });
  }
};

export const verifyTokenController = async (req, res) => {
  console.log("INSIDE the verify token controller ");
  try {
    const _id = req.user.Id;
    const userDetails = await userModel.findOne({ _id }).select("-password");
    return res
      .status(200)
      .json({ message: "Verified successfully", user: userDetails });
  } catch (error) {
    console.log("error inside the verfiy token controller : ", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const updateUserDetailsController = async (req, res) => {
  console.log("Inside update user details controller");
  console.log("Request Body:", req.body);
  console.log("Request File:", req.file);

  const { name } = req.body;
  let img_path;
  if (req.file) {
    img_path = req.file.path;
  }
  const _id = req.user.Id;
  console.log(_id);

  try {
    const user = await userModel.findOne({ _id });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (img_path) {
      try {
        // Upload Image
        const result = await image_uploader(img_path, user._id);
        user.img_url = result.secure_url;

        // Delete local image after upload
        if (req.file.originalname !== "default.jpg") {
          unlink(img_path, (err) => {
            if (err) console.error("Error deleting uploaded file:", err);
            else console.log("Successfully deleted uploaded file");
          });
        }
      } catch (error) {
        console.error("Error during image upload:", error.message);
        return res.status(400).json({ message: "Invalid image type" });
      }
    }
    user.name = name;
    await user.save();

    return res
      .status(200)
      .json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error inside update profile controller:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAuthorDetails = async (req, res) => {
  const _id = req.params.id;
  try {
    const author = await userModel
      .findOne({ _id })
      .select("_id name email img_url");
    if (!author) {
      return res.status(400).json({ message: "Something went wrong" });
    }
    return res.status(200).json({ message: "Successfull", author });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const logoutController = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Successfully logged out" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
