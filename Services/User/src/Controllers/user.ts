

import User from "../Model/user.js";
import { loginSchema, signupSchema } from "../utils/validations/validaton.js";
import { authenticateRequest } from "../Middleware/auth.js";
import TryCatch from "../utils/TryCatch.js";
import getBuffer from "../utils/dataUri.js";
import cloudinary from "../Config/Cloudinary.js";
import { auth2client } from "../utils/googleConfig.js";
import axios from "axios"
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";



interface GoogleUserInfo {
  email: string;
  name: string;
  picture: string;
}



export const register = TryCatch(async (req, res): Promise<void> => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: "Invalid input",
      errors: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  const { name, email, password } = parsed.data;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(409).json({ message: "A user with this email already exists" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    provider: "manual",
  });

  res.status(201).json({
    message: "Registration successful",
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    },
  });
});


export const login = TryCatch(async (req, res): Promise<void> => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: "Invalid input",
      errors: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  const { email, password } = parsed.data;
  const user = await User.findOne({ email });
  if (!user || user.provider !== "manual") {
    res.status(401).json({ message: "Email not found" });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password!);
  if (!isMatch) {
    res.status(401).json({ message: "Invalid email or password" });
    return;
  }

  const { id, name } = user;
  const token = generateToken({ id, username: name });

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


export const googleLogin = TryCatch(async(req,res):Promise<void>=>{

    const { code } = req.body;
    console.log("code is here",code);
    
    if (!code) {
     res.status(400).json({ message: "Authorization code is required" });
     return;
    }
    const {tokens}= await auth2client.getToken(code);
    auth2client.setCredentials(tokens);


    const googleUser  = await axios.get<GoogleUserInfo>(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`
    );


    const { email, name: userName, picture: image } = googleUser.data;


    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        name: userName,
        image,
        provider: "google",
      });
    }
  const {id,name} = user
 const token = generateToken({ id,username:name });

     res.status(200).json({
      message: "Google login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
    });
    return;
  }
);

export const myProfile = TryCatch(async (req: authenticateRequest, res): Promise<void> => {
  const userId = req.user;
   if(!userId){
    res.status(404).json({message:"userId not provide"});
    return;
   }
  const user = await User.findById(userId);

  if (!user) {
    res.status(404).json({ message: "User not valid" });
    return;
  }
  
  const author = user._id;
const token = req.headers.authorization;
if(!token){
  res.json({message:"token not provide"});
  return;
}
  try {
    const { data } = await axios.get(
      `http://localhost:5002/api/v1/profile/my-blogs/${author}`,
      {
    headers: {
      Authorization: token
    }
  }
    );
   
    
  const blogs = Array.isArray(data.data) ? data.data : [];

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        bio: user.bio,
        facebook: user.facebook,
        linkedin: user.linkedin,
        instagram: user.instagram,
      },
      blogs: data?.data,
    });
  } catch (error: any) {
  console.error("Error fetching blogs:", error?.message);
  console.error("Full error object:", error?.response?.data || error);
  res.status(500).json({ message: "Error fetching blogs" });
}
});

export const getUserProfile = TryCatch(async (req,res) => {
  const userId = req.params.id;
 
  
  const profile = await User.findById(userId);
  if (!profile) {
     res.status(404).json({ message: "profile not found" });
     return
  }
  res.json(profile);
});

export const updateUserProfile = TryCatch(
  async (req: authenticateRequest, res):Promise<void> => {
    const userId  = req.user;
     if (!userId) {
      res.status(401).json({ message: "Unauthorized - Invalid user ID" });
      return;
    }
 
    const { name, instagram, facebook, linkedin, bio} = req.body;
    const updateProfile = await User.findByIdAndUpdate(userId, {
      name,
      instagram,
      facebook,
      linkedin,
      bio,
    },{new:true});
     if (!updateProfile) {
       res.status(404).json({ message: "User not found" });
       return;
    }
     res.status(200).json({
      message:"User profile update successfully",
      updateProfile
    })
  }
  
);


 export const updateProfileImage =  TryCatch(async(req:authenticateRequest,res):Promise<void>=>{
  const userId = req.user
console.log(userId);

  
  const file = req.file;
  
  if(!file){
  res.status(400).json({message:"no file to upload"})
  return
  }
  const fileBuffer = getBuffer(file);

if (!fileBuffer || !fileBuffer.content) {
  res.status(400).json({ message: 'Failed to generate buffer' });
  return;
}

const cloud = await cloudinary.uploader.upload(fileBuffer.content, {
  folder: 'blogs',
});

  const user = await User.findByIdAndUpdate(userId,{
    image:cloud.secure_url
  },{new:true})
  res.json({message:"profile pic upload successfully",
    user
  })
})



