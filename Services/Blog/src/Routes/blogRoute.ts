import express from "express";
const router = express.Router();
import { addComment, getAllBlogs, getRecommendedBlogs,singleBlog, deleteComment, getUserBlogs,getAllComments, savedBlogs, getSavedBlog } from "../Controllers/blog";
import { auth } from "../Middleware/auth";
router.get("/blog/all",getAllBlogs)
router.get("/blog/:id",singleBlog)
router.get("/blog/recommendedBlogs/:id",getRecommendedBlogs)
router.get("/profile/my-blogs/:author",auth,getUserBlogs)

router.get("/blog/comment/fetch/:id",getAllComments)
router.post("/blog/comment/:blogId",auth,addComment)
router.delete("/blog/comment/delete/:commentId",auth,deleteComment);

router.get("/blog/saved/blog",auth,getSavedBlog)
router.post("/blog/save/:blogId",auth,savedBlogs)
export default router;