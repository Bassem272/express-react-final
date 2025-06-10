import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); 

const url  = process.env.MONGO_URI; 

// singleton class to make sure that one connection exists
class MongoDB {
  constructor() {
    if (MongoDB.instance) {
      return MongoDB.instance;
    }
    this.isConnected = false;
    MongoDB.instance = this;
  }

  async connect() {
    if (this.isConnected) {
      console.log("MongoDB already connected");
      return;
    }
    try {
      await mongoose.connect(url);
      this.isConnected = true;
      console.log("MongoDB connected successfully");
    } catch (error) {
      console.error("MongoDB connection error:", error.message);
      throw error;
    }
  }

  async disconnect() {
    if (!this.isConnected) return;
    await mongoose.disconnect();
    this.isConnected = false;
    console.log("Mongo is shut down");
  }
}

const mongoDB = new MongoDB();
export default mongoDB;
