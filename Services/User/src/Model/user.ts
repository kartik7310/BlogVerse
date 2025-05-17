import mongoose, { Document, Schema } from "mongoose";

// Define the interface
export interface IUser extends Document {
  id:string;
  name: string;
  email: string;
  image: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  bio?: string;
}

// Define the schema
const userSchema: Schema<IUser> = new Schema(
  {
    id:{type:String,unique:true},
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    instagram: { type: String },
    facebook: { type: String },
    linkedin: { type: String },
    bio: { type: String },
  },
  { timestamps: true }
);

// Create the model
const User = mongoose.model<IUser>("User", userSchema);
export default User;
