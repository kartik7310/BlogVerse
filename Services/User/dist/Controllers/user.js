import jwt from "jsonwebtoken";
import User from "../Model/user.js";
import { loginSchema } from "../utils/validations/loginSchema.js";
import TryCatch from "../utils/TryCatch.js";
import getBuffer from "../utils/dataUri.js";
import cloudinary from "../Config/Cloudinary.js";
export const login = TryCatch(async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({
            message: "Invalid input",
            errors: parsed.error.flatten().fieldErrors,
        });
        return;
    }
    const { email, name, image } = parsed.data;
    // Check if user exists or create a new one
    let user = await User.findOne({ email });
    if (!user) {
        user = await User.create({ email, name, image });
    }
    // Get the JWT secret
    const secretKey = process.env.SECRETE_JWT;
    if (!secretKey) {
        res.status(500).json({ message: "JWT secret is not configured" });
        return;
    }
    // Generate JWT token
    const token = jwt.sign({ id: user._id }, secretKey, {
        expiresIn: "1d",
    });
    // Return success response
    res.status(200).json({
        message: "Login successful",
        token,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            image: user.image,
        },
    });
});
export const myProfile = TryCatch(async (req, res) => {
    const userId = req.user;
    const user = await User.findById(userId);
    console.log(user);
    if (!user) {
        return res.status(404).json({ message: "user not valid" });
    }
    return res.json(user);
});
export const getUserProfile = TryCatch(async (req, res) => {
    const userId = req.params.id;
    const profile = await User.findById(userId);
    if (!profile) {
        res.status(404).json({ message: "profile not found" });
        return;
    }
    res.json(profile);
});
export const updateUserProfile = TryCatch(async (req, res) => {
    const userId = req.user;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized - Invalid user ID" });
    }
    const { name, instagram, facebook, linkedin, bio } = req.body;
    const updateProfile = await User.findByIdAndUpdate(userId, {
        name,
        instagram,
        facebook,
        linkedin,
        bio,
    }, { new: true });
    if (!updateProfile) {
        return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
        message: "User profile update successfully",
        updateProfile
    });
});
export const updateProfileImage = TryCatch(async (req, res) => {
    const userId = req.user;
    console.log(userId);
    const file = req.file;
    console.log("file is here ", file);
    if (!file) {
        res.status(400).json({ message: "no file to upload" });
        return;
    }
    const fileBuffer = getBuffer(file);
    if (!fileBuffer) {
        return res.status(400).json({ message: 'Failed to generate buffer' });
    }
    const cloud = await cloudinary.uploader.upload(fileBuffer.content, {
        folder: 'blogs',
    });
    const user = await User.findByIdAndUpdate(userId, {
        image: cloud.secure_url
    }, { new: true });
    res.json({ message: "profile pic upload successfully",
        user
    });
});
