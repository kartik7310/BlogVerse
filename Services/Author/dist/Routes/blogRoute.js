import express from "express";
import { aiDescriptionResponse, aiTitleResponse, aiBlogResponse, createBlog, deleteBlog, 
// getAllBlogs,
// getRecommendedBlogs,
updateBlog, } from "../Controllers/blog.js";
import { auth } from "../Middlewares/isAuth.js";
import uploadFile from "../Middlewares/multer.js";
const router = express.Router();
router.post("/blog/new", auth, uploadFile, createBlog);
router.put("/blog/update/:id", auth, uploadFile, updateBlog);
router.delete("/blog/:id", auth, deleteBlog);
router.post("/ai/title", aiTitleResponse);
router.post("/ai/description", aiDescriptionResponse);
router.post("/ai/blog", aiBlogResponse);
export default router;
