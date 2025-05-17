import cloudinary from "../config/Cloudinary.js";
import { sql } from "../config/db.js";
import { blogSchema } from "../utils/BlogSchema.js";
import getBuffer from "../utils/dataUri.js";
import TryCatch from "../utils/TryCatch.js";
export const createBlog = TryCatch(async (req, res) => {
    /* ------------------------------------------------------------------ *
     * 1.  Validate body ------------------------------------------------- */
    const parsed = blogSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            message: 'Invalid input',
            errors: parsed.error.flatten().fieldErrors,
        });
    }
    const { title, description, blogContent, category } = parsed.data;
    /* ------------------------------------------------------------------ *
     * 2.  Validate file -------------------------------------------------- */
    if (!req.file) {
        return res.status(400).json({ message: 'No file to upload' });
    }
    const fileBuffer = getBuffer(req.file);
    if (!fileBuffer?.content) {
        return res.status(400).json({ message: 'Failed to generate buffer' });
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
    return res.status(201).json({
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
        return res.status(404).json({ message: "No blog with this id" });
    }
    const blog = blogs[0];
    /* 2. Authorisation check ---------------------------------------------- */
    if (blog.author !== userId) {
        return res.status(409).json({ message: "You can't update this blog" });
    }
    let imageFile = blog.image;
    if (req.file) {
        // assuming you use multer memoryStorage
        const fileBuffer = getBuffer(req.file);
        if (!fileBuffer?.content) {
            return res.status(400).json({ message: "Failed to generate buffer" });
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
    return res.status(200).json({
        message: "Blog updated successfully",
        blog: updatedBlog,
    });
});
export const deleteBlog = TryCatch(async (req, res) => {
    const { id } = req.params;
    const userId = req.user;
    const blogs = await sql `SELECT * FROM blogs WHERE id = ${id}`;
    if (blogs.length === 0) {
        return res.status(404).json({ message: "No blog with this id" });
    }
    const blog = blogs[0];
    if (blog.author !== userId) {
        return res.status(409).json({ message: "You can't delete this blog" });
    }
    await sql `DELETE FROM savedBlogs WHERE blogId  = ${id}`;
    await sql `DELETE FROM comments WHERE blogId = ${id}`;
    await sql `DELETE FROM blogs WHERE id = ${id}`;
    return res.status(200).json({ message: 'blog deleted successfully' });
});
