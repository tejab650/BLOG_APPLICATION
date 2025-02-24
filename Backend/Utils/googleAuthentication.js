import dotenv from "dotenv";
dotenv.config();

import passport from "passport";

import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { otpgeneration } from "./optGeneration.js";
import userModel from "../Models/user.model.js";
import { createJwtToken } from "./jwtTokenGeneration.js";


const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CALLBACK_URL = process.env.CALLBACK_URL;
passport.use(
  new GoogleStrategy(
    {
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL: CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await userModel.findOne({ authId: profile.id });
        let token = "";
        if (existingUser) {
          try {
            token = await createJwtToken(existingUser._id);
            console.log("In existingUser Inside the OAuth token is : ", token);
          } catch (error) {
            console.log("Inside the OAuth function");
            console.error("Error occured at creation of token ", error);
            return done(error, null);
          }
          return done(null, { user: existingUser, token });
        } else {
          const user = new userModel({
            name: profile.emails[0].value.split("@")[0],
            //phoneNumber: profile.phone,
            authId: profile.id,
            img_url:
              profile.photos && profile.photos[0]
                ? profile.photos[0].value
                : null,
            isVerified: true,
          });

          // const { otp } = otpgeneration(user.email);
          // console.log("Otp inside the google hander is : ", otp);
          // const tokenVerificationTime = new Date();
          // tokenVerificationTime.setSeconds(
          //   tokenVerificationTime.getSeconds() + 120
          // );

          // user.verificationToken = otp;
          // user.verificationTokenExpiresAt = tokenVerificationTime;

          await user.save();

          try {
            token = await createJwtToken(user._id);
            console.log("Inside the OAuth token is : ", token);
          } catch (error) {
            console.log("Inside the OAuth function");
            console.error("Error occured at creation of token ", error);
            return done(error, null);
          }

          return done(null, { user, token });
        }
      } catch (error) {
        done(error, null);
      }
    }
  )
);
