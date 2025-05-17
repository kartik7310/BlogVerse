import mongoose, { Schema } from "mongoose";
// Define the schema
const userSchema = new Schema({
    id: { type: String, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    instagram: { type: String },
    facebook: { type: String },
    linkedin: { type: String },
    bio: { type: String },
}, { timestamps: true });
// Create the model
const User = mongoose.model("User", userSchema);
export default User;
