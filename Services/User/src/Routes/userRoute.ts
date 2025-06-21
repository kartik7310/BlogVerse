import express from "express";
import { register,googleLogin ,login, myProfile ,getUserProfile, updateUserProfile,updateProfileImage} from "../Controllers/user.js";
import { auth } from "../Middleware/auth.js";
import uploadFile from "../Config/multer.js";
const router = express.Router();

router.post("/register", register);       
router.post("/login", login);             
router.post("/google-login", googleLogin); 
router.get("/me",auth, myProfile);
router.post("/profile/update/pic",auth,uploadFile,updateProfileImage );
router.get("/:id",getUserProfile );
router.put("/profile/:userId",auth,updateUserProfile );

export default router;


