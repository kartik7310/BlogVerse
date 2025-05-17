"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecommendedBlogs = exports.singleBlog = exports.getAllBlogs = void 0;
const TryCatch_1 = __importDefault(require("../utils/TryCatch"));
const axios_1 = __importDefault(require("axios"));
const db_1 = require("../config/db");
const dotenv_1 = __importDefault(require("dotenv"));
const server_1 = require("../server");
dotenv_1.default.config();
exports.getAllBlogs = (0, TryCatch_1.default)(async (req, res) => {
    let blogs;
    const { searchQuery, category } = req.query;
    console.log(searchQuery);
    console.log(category);
    const cacheKey = `blogs ${searchQuery}:${category}`;
    const cached = await server_1.redisClient.get(cacheKey);
    if (cached) {
        console.log("data serving from redis");
        res.json({ blog: JSON.parse(cached) });
        return;
    }
    if (searchQuery && category) {
        blogs = await (0, db_1.sql) `SELECT * FROM blogs WHERE (title ILIKE ${"%" + searchQuery} OR description ILIKE ${"%" + searchQuery})
    AND category = ${category} ORDER BY createdAt DESC;
    `;
    }
    else if (searchQuery) {
        blogs = await (0, db_1.sql) `SELECT * FROM blogs WHERE (title ILIKE ${"%" + searchQuery}) OR description ILIKE ${"%" + searchQuery} ORDER BY createdAt DESC `;
    }
    else if (category) {
        blogs = await (0, db_1.sql) `SELECT * FROM blogs WHERE category = ${category} ORDER BY createdAt DESC `;
    }
    else {
        blogs = await (0, db_1.sql) `SELECT * FROM blogs ORDER BY createdAt DESC`;
    }
    if (blogs.length === 0) {
        return res.status(404).json({ message: "blogs not found " });
    }
    console.log("serving data from redis");
    await server_1.redisClient.set(cacheKey, JSON.stringify(blogs), { EX: 3000 });
    return res.status(200).json({ message: "blogs fetch successfully", blog: blogs });
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
        return res.status(404).json({ message: "blog not exist" });
    }
    const data = await axios_1.default.get(`${process.env.USER_SERVICE}/${blogs[0].author}`);
    const response = { blog: blogs[0], author: data.data };
    await server_1.redisClient.set(cacheKey, JSON.stringify(response));
    return res.status(200).json({ response });
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
        return res.json({ message: "From cache", blogs: JSON.parse(cached) });
    }
    // DB fetch will still work even if Redis is down
    const blogs = await (0, db_1.sql) `SELECT * FROM blogs WHERE id != ${id}`;
    res.json({ message: "From DB", blogs });
});
