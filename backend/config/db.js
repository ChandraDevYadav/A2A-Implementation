import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDB() {
  try {
    await mongoose.connect(env.MONGODB_URI, { dbName: "a2a_mern" });
    console.log("[db] Connected");
  } catch (err) {
    console.error("[db] Connection error", err.message);
    process.exit(1);
  }
}
