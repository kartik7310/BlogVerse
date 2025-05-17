"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const blog_1 = require("../Controllers/blog");
router.get("/blog/all", blog_1.getAllBlogs);
router.get("/blog/:id", blog_1.singleBlog);
router.get("/blog/recommendedBlogs/:id", blog_1.getRecommendedBlogs);
exports.default = router;
