import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import xss from "xss-clean";
import cookieParser from "cookie-parser";
import passport from "passport";
import cors from 'cors';

import authRoutes from './Routes/auth.routes.js';
import postRoutes from './Routes/post.route.js';
import adminRoutes from './Routes/admin.routes.js';
import contactRoutes from './Routes/contact.routes.js';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

const corsOptions ={
    origin: ['http://localhost:3000'],
    methods:['GET','POST','PUT','DELETE'],
    allowheaders:['content-type'],
    credentials: true
};



app.use(express.json());
app.use(xss());
app.use(cors(corsOptions));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.static(join(__dirname, "./public/static")));
app.use(passport.initialize());


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/post",postRoutes);
app.use("/api/v1/admin",adminRoutes);
app.use("/api/v1/comment",contactRoutes);


export default app;