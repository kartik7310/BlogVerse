import express from "express";
import { createBlog } from "../Controllers/blog.js";
import { auth } from "../Middlewares/isAuth.js";
import uploadFile from "../Middlewares/multer.js";
const router = express.Router();
router.post("/blog/new", auth, uploadFile, createBlog);
export default router;
