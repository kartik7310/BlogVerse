"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const blog_1 = require("../Controllers/blog");
const auth_1 = require("../Middleware/auth");
router.get("/blog/all", blog_1.getAllBlogs);
router.get("/blog/:id", blog_1.singleBlog);
router.get("/blog/recommendedBlogs/:id", blog_1.getRecommendedBlogs);
router.get("/blog/comment/fetch/:id", blog_1.getAllComments);
router.post("/blog/comment/:blogId", auth_1.auth, blog_1.addComment);
router.delete("/blog/comment/delete/:commentId", auth_1.auth, blog_1.deleteComment);
router.get("/blog/saved/blog", auth_1.auth, blog_1.getSavedBlog);
router.post("/blog/save/:blogId", auth_1.auth, blog_1.savedBlogs);
exports.default = router;
