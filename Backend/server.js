import dotenv from "dotenv";
dotenv.config();

import app from "./index.js";
import mongoose from "mongoose";

const port = process.env.PORT;

async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`DB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error connection to Database: ${error.message}`);
    process.exit(1);
  }
}


app.listen(port, async () => {
  await connectDB();
  console.log(`Server running on port ${port}`);
});
