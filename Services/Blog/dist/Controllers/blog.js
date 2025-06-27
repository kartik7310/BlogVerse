"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSavedBlog = exports.savedBlogs = exports.getRecommendedBlogs = exports.deleteComment = exports.getAllComments = exports.addComment = exports.getUserBlogs = exports.singleBlog = exports.getAllBlogs = void 0;
const TryCatch_1 = __importDefault(require("../utils/TryCatch"));
const axios_1 = __importDefault(require("axios"));
const db_1 = require("../config/db");
const dotenv_1 = __importDefault(require("dotenv"));
const server_1 = require("../server");
dotenv_1.default.config();
exports.getAllBlogs = (0, TryCatch_1.default)(async (req, res) => {
    const { searchQuery, category } = req.query;
    const cacheKey = `blogs:${searchQuery}:${category}`;
    const cached = await server_1.redisClient.get(cacheKey);
    if (cached) {
        console.log("data serving from redis");
        res.json({ blog: JSON.parse(cached) });
        return;
    }
    let blogs;
    if (searchQuery && category) {
        blogs = await (0, db_1.sql) `SELECT * FROM blogs WHERE (title ILIKE ${"%" + searchQuery + "%"} OR description ILIKE ${"%" + searchQuery + "%"}) AND category = ${category} ORDER BY createdAt DESC`;
    }
    else if (searchQuery) {
        blogs = await (0, db_1.sql) `SELECT * FROM blogs WHERE (title ILIKE ${"%" + searchQuery + "%"} OR description ILIKE ${"%" + searchQuery + "%"}) ORDER BY createdAt DESC`;
    }
    else if (category) {
        blogs =
            await (0, db_1.sql) `SELECT * FROM blogs WHERE category=${category} ORDER BY createdAt DESC`;
    }
    else {
        blogs = await (0, db_1.sql) `SELECT * FROM blogs ORDER BY createdAt DESC`;
    }
    if (blogs.length === 0) {
        res.status(404).json({ message: "blog not exist" });
        return;
    }
    await server_1.redisClient.set(cacheKey, JSON.stringify(blogs), { EX: 300 });
    res.status(200).json({ message: "blogs fetch successfully", blog: blogs });
    return;
});
exports.singleBlog = (0, TryCatch_1.default)(async (req, res) => {
    const { id } = req.params;
    const cacheKey = `blog:${id}`;
    const cached = await server_1.redisClient.get(cacheKey);
    if (cached) {
        console.log("data serving from redis");
        res.json({ blog: JSON.parse(cached) });
        return;
    }
    const blogs = await (0, db_1.sql) `SELECT * FROM blogs WHERE id = ${id}`;
    if (blogs.length == 0) {
        res.status(404).json({ message: "blog not exist" });
        return;
    }
    const data = await axios_1.default.get(`${process.env.USER_SERVICE}/${blogs[0].author}`);
    const response = { blog: blogs[0], author: data.data };
    await server_1.redisClient.set(cacheKey, JSON.stringify(response));
    res.status(200).json({ response });
    return;
});
exports.getUserBlogs = (0, TryCatch_1.default)(async (req, res) => {
    const { author } = req.params;
    if (!author) {
        res.status(404).json({ message: "author not exist" });
        return;
    }
    const blogs = await (0, db_1.sql) `SELECT * FROM blogs WHERE author=${author}`;
    res.json({ message: "blog fetch success", data: blogs });
    return;
});
exports.addComment = (0, TryCatch_1.default)(async (req, res) => {
    const { blogId } = req.params;
    const userId = req.user;
    const userName = req.name;
    const { comment } = req.body;
    if (!comment) {
        res.status(400).json({ message: "data is empty" });
    }
    const data = await (0, db_1.sql) `INSERT INTO comments (comment,userId,userName,blogId) VALUES (${comment},${userId},${userName},${blogId}) RETURNING *`;
    if (!data) {
        res.status(500).json({ message: "error during comment" });
        return;
    }
    res.status(200).json({ success: true, message: "comment create success", data });
    return;
});
exports.getAllComments = (0, TryCatch_1.default)(async (req, res) => {
    const { id } = req.params;
    const comments = await (0, db_1.sql) `SELECT * FROM comments WHERE blogId = ${id} ORDER BY createdAt DESC`;
    res.json(comments);
});
exports.deleteComment = (0, TryCatch_1.default)(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user; // Adjust depending on how user ID is stored
    if (!commentId) {
        res.status(400).json({ message: "Comment ID not provided" });
        return;
    }
    // Fetch the comment
    const rows = await (0, db_1.sql) `SELECT * FROM comments WHERE id = ${commentId}`;
    const comment = rows[0];
    if (!comment) {
        res.status(404).json({ message: "Comment not found" });
        return;
    }
    if (comment.userid !== userId) {
        res.status(403).json({ message: "You are not allowed to delete this comment" });
        return;
    }
    // Delete the comment
    const result = await (0, db_1.sql) `DELETE FROM comments WHERE id = ${commentId}`;
    res.status(200).json({
        success: true,
        message: "Comment deleted successfully",
    });
    return;
});
exports.getRecommendedBlogs = (0, TryCatch_1.default)(async (req, res) => {
    const { id } = req.params;
    const cacheKey = `blog:recommended:${id}`;
    let cached;
    try {
        cached = await server_1.redisClient.get(cacheKey);
    }
    catch (err) {
        console.warn("Redis unavailable, falling back to DB");
    }
    if (cached) {
        res.json({ message: "From cache", blogs: JSON.parse(cached) });
        return;
    }
    // DB fetch will still work even if Redis is down
    const blogs = await (0, db_1.sql) `SELECT * FROM blogs WHERE id != ${id}`;
    res.json({ message: "From DB", blogs });
});
exports.savedBlogs = (0, TryCatch_1.default)(async (req, res) => {
    const { blogId } = req.params;
    const userId = req.user;
    if (!blogId || !userId) {
        res.status(400).json({ message: "blogId or userId is messing" });
    }
    const existingBlog = await (0, db_1.sql) `SELECT * FROM savedBlogs WHERE userId = ${userId} AND blogId = ${blogId}`;
    if (existingBlog.length == 0) {
        await (0, db_1.sql) `INSERT INTO savedBlogs (blogId,userId) VALUES (${blogId} ,${userId})`;
        res.status(200).json({ message: "Blog saved" });
        return;
    }
    else {
        await (0, db_1.sql) `DELETE FROM savedBlogs WHERE userId =${userId} AND blogId =${blogId}`;
        res.status(200).json({ message: "Blog remove from saved" });
        return;
    }
});
exports.getSavedBlog = (0, TryCatch_1.default)(async (req, res) => {
    const userId = req.user;
    console.log("user is type of", typeof (userId));
    if (!userId) {
        res.status(400).json({ message: "userId not provide" });
        return;
    }
    const blogs = await (0, db_1.sql) `SELECT * FROM savedBlogs WHERE userId = ${userId} `;
    res.json(blogs);
});
