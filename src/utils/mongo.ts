import mongoose from "mongoose";
import { config } from "./env_loader.js";

export async function connectToMongo() {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("Connected to Database");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
