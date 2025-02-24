import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";

export const createJwtToken = async (userId) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { Id:userId },
      process.env.SECRET_STR,
      { expiresIn: process.env.EXPIRES_IN },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
};


