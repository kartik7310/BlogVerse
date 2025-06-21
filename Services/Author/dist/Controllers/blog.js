import dotenv from "dotenv";
dotenv.config();
import cloudinary from "../config/Cloudinary.js";
import { sql } from "../config/db.js";
import { blogSchema } from "../utils/BlogSchema.js";
import getBuffer from "../utils/dataUri.js";
import TryCatch from "../utils/TryCatch.js";
import { GoogleGenAI } from '@google/genai';
import { GoogleGenerativeAI } from "@google/generative-ai";
const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
export const createBlog = TryCatch(async (req, res) => {
    /* ------------------------------------------------------------------ *
     * 1.  Validate body ------------------------------------------------- */
    const parsed = blogSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({
            message: 'Invalid input',
            errors: parsed.error.flatten().fieldErrors,
        });
        return;
    }
    const { title, description, blogContent, category } = parsed.data;
    /* ------------------------------------------------------------------ *
     * 2.  Validate file -------------------------------------------------- */
    if (!req.file) {
        res.status(400).json({ message: 'No file to upload' });
        return;
    }
    const fileBuffer = getBuffer(req.file);
    if (!fileBuffer?.content) {
        res.status(400).json({ message: 'Failed to generate buffer' });
        return;
    }
    /* ------------------------------------------------------------------ *
     * 3.  Upload image --------------------------------------------------- */
    const { secure_url: imageUrl } = await cloudinary.uploader.upload(fileBuffer.content, { folder: 'blogs' });
    /* ------------------------------------------------------------------ *
     * 4.  Insert blog row  --------------------------------------------- */
    // ensure the order of VALUES matches the column list exactly!
    const blog = await sql `
    INSERT INTO blogs
      (title, description, category, blogContent, author, image)
    VALUES
      (${title}, ${description}, ${category}, ${blogContent}, ${req.user}, ${imageUrl})
    RETURNING *
  `;
    /* ------------------------------------------------------------------ *
     * 5.  Respond -------------------------------------------------------- */
    res.status(201).json({
        message: 'Blog created successfully',
        blog,
    });
});
export const updateBlog = TryCatch(async (req, res) => {
    const { id } = req.params;
    const userId = req.user;
    const { title, description, blogContent, category } = req.body;
    /* 1. Fetch the blog ---------------------------------------------------- */
    const blogs = await sql `
    SELECT * FROM blogs WHERE id = ${id}
  `;
    if (blogs.length === 0) {
        res.status(404).json({ message: "No blog with this id" });
        return;
    }
    const blog = blogs[0];
    /* 2. Authorisation check ---------------------------------------------- */
    if (blog.author !== userId) {
        res.status(409).json({ message: "You can't update this blog" });
        return;
    }
    let imageFile = blog.image;
    if (req.file) {
        // assuming you use multer memoryStorage
        const fileBuffer = getBuffer(req.file);
        if (!fileBuffer?.content) {
            res.status(400).json({ message: "Failed to generate buffer" });
            return;
        }
        const cloud = await cloudinary.uploader.upload(fileBuffer.content, {
            folder: "blogs",
        });
        imageFile = cloud.secure_url;
    }
    /* 4. Run the UPDATE ---------------------------------------------------- */
    const updatedBlog = await sql `
    UPDATE blogs SET
      title        = ${title ?? blog.title},
      description  = ${description ?? blog.description},
      ${category !== undefined ? sql `category     = ${category},` : sql ``}
      blogContent = ${blogContent ?? blog.blogContent},
      image        = ${imageFile}
    WHERE id = ${id}
    RETURNING *
  `;
    res.status(200).json({
        message: "Blog updated successfully",
        blog: updatedBlog,
    });
});
export const deleteBlog = TryCatch(async (req, res) => {
    const { id } = req.params;
    const userId = req.user;
    const blogs = await sql `SELECT * FROM blogs WHERE id = ${id}`;
    if (blogs.length === 0) {
        res.status(404).json({ message: "No blog with this id" });
        return;
    }
    const blog = blogs[0];
    if (blog.author !== userId) {
        res.status(409).json({ message: "You can't delete this blog" });
        return;
    }
    await sql `DELETE FROM savedBlogs WHERE blogId  = ${id}`;
    await sql `DELETE FROM comments WHERE blogId = ${id}`;
    await sql `DELETE FROM blogs WHERE id = ${id}`;
    res.status(200).json({ message: 'blog deleted successfully' });
    return;
});
export const aiTitleResponse = TryCatch(async (req, res) => {
    const { text } = req.body;
    const prompt = `Correct the grammar of the following blog title and return only the corrected title without any additional text, formatting, or symbols: "${text}"`;
    let result;
    const ai = new GoogleGenAI({
        apiKey: GEMINI_API_KEY,
    });
    async function main() {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });
        let rawtext = response.text;
        if (!rawtext) {
            res.status(400).json({
                message: "Something went wrong",
            });
            return;
        }
        result = rawtext
            .replace(/\*\*/g, "")
            .replace(/[\r\n]+/g, "")
            .replace(/[*_`~]/g, "")
            .trim();
    }
    await main();
    res.json(result);
});
export const aiDescriptionResponse = TryCatch(async (req, res) => {
    const { title, description } = req.body;
    const prompt = description === ""
        ? `Generate only one short blog description based on this 
title: "${title}". Your response must be only one sentence, strictly under 30 words, with no options, no greetings, and 
no extra text. Do not explain. Do not say 'here is'. Just return the description only.`
        : `Fix the grammar in the 
following blog description and return only the corrected sentence. Do not add anything else: "${description}"`;
    let result;
    const ai = new GoogleGenAI({
        apiKey: GEMINI_API_KEY,
    });
    async function main() {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });
        let rawtext = response.text;
        if (!rawtext) {
            res.status(400).json({
                message: "Something went wrong",
            });
            return;
        }
        result = rawtext
            .replace(/\*\*/g, "")
            .replace(/[\r\n]+/g, "")
            .replace(/[*_`~]/g, "")
            .trim();
    }
    await main();
    res.json(result);
});
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
export const aiBlogResponse = TryCatch(async (req, res) => {
    const { blog } = req.body;
    if (typeof blog !== "string" || blog.trim() === "") {
        res.status(400).json({ message: "Please provide blog HTML" });
        return;
    }
    const prompt = `
You will act as a grammar-correction engine.
The user will send rich HTML (from Jodit).
Correct grammar, punctuation and spelling ONLY — do NOT rewrite or add ideas.
Keep every HTML tag, inline style, <img> tag, <br>, etc. intact.
Return the full corrected HTML string, and nothing else.
`;
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent({
        contents: [
            {
                role: "user",
                parts: [{ text: `${prompt}\n\n${blog}` }],
            },
        ],
    });
    const reply = await result.response;
    const rawHtml = reply.text();
    const cleanedHtml = rawHtml
        .replace(/^\s*```html?\s*/i, "")
        .replace(/```$/, "")
        .trim();
    res.status(200).json({ html: cleanedHtml });
    return;
});
