import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async (): Promise<mongoose.Connection> => {
  try {
    const DB_URL = process.env.MONGODB_URI!;
 

    const conn = await mongoose.connect(DB_URL); // ← No options needed in Mongoose 6+
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn.connection;
  } catch (error: any) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
