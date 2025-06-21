import mongoose, { Document, Schema } from "mongoose";
export interface IUser extends Document {
  name: string;
  email: string;
  image: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  bio?: string;
  password: string;
  provider: "manual" | "google";
}

const userSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    instagram: { type: String },
    facebook: { type: String },
    linkedin: { type: String },
    bio: { type: String },
    password: { type: String },
    provider: { type: String, enum: ["manual", "google"], default: "manual" },
  },
  { timestamps: true }
);

// Create the model
const User = mongoose.model<IUser>("User", userSchema);
export default User;
