import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
export async function mongoConnection() {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error("MONGO_URI is not defined in environment variables.");
        }
        console.log("Connecting to MongoDB...");
        await mongoose.connect(mongoUri);
        console.log("✅ Database connected successfully.");
    }
    catch (error) {
        console.error("❌ Failed to connect to MongoDB:", error);
        process.exit(1);
    }
}
