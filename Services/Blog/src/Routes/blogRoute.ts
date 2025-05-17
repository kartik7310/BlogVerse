import express from "express";
const router = express.Router();
import { getAllBlogs, getRecommendedBlogs, singleBlog } from "../Controllers/blog";
router.get("/blog/all",getAllBlogs)
router.get("/blog/:id",singleBlog)
router.get("/blog/recommendedBlogs/:id",getRecommendedBlogs)
export default router;