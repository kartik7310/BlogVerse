import mongoose, { Schema } from "mongoose";
const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    instagram: { type: String },
    facebook: { type: String },
    linkedin: { type: String },
    bio: { type: String },
    password: { type: String },
    provider: { type: String, enum: ["manual", "google"], default: "manual" },
}, { timestamps: true });
// Create the model
const User = mongoose.model("User", userSchema);
export default User;
