import TryCatch from "../utils/TryCatch";
import axios from "axios";
import {sql} from "../config/db"
import dotenv from "dotenv"
import { redisClient } from "../server";
import { authenticateRequest } from "../Middleware/auth";

dotenv.config()
export const getAllBlogs = TryCatch(async(req,res):Promise<void>=>{

  const {searchQuery,category} = req.query;
  
  const cacheKey = `blogs:${searchQuery}:${category}`
  const cached = await redisClient.get(cacheKey)
  if(cached){
    console.log("data serving from redis");
    res.json({blog:JSON.parse(cached)})
    return ;
  }
  let blogs;

  if (searchQuery && category) {
    blogs = await sql`SELECT * FROM blogs WHERE (title ILIKE ${
      "%" + searchQuery + "%"
    } OR description ILIKE ${
      "%" + searchQuery + "%"
    }) AND category = ${category} ORDER BY createdAt DESC`;
  } else if (searchQuery) {
    blogs = await sql`SELECT * FROM blogs WHERE (title ILIKE ${
      "%" + searchQuery + "%"
    } OR description ILIKE ${"%" + searchQuery + "%"}) ORDER BY createdAt DESC`;
  } else if (category) {
    blogs =
      await sql`SELECT * FROM blogs WHERE category=${category} ORDER BY createdAt DESC`;
  } else {
    blogs = await sql`SELECT * FROM blogs ORDER BY createdAt DESC`;
  }

  
  if(blogs.length===0){
     res.status(404).json({message:"blog not exist"})
     return;
  }

  
 await redisClient.set(cacheKey,JSON.stringify(blogs),{EX:300})
   res.status(200).json({message:"blogs fetch successfully",blog:blogs});
   return;

})


export const singleBlog = TryCatch(async(req,res):Promise<void>=>{
  const {id} =  req.params;
const cacheKey = `blog:${id}`
const cached = await redisClient.get(cacheKey)
if(cached){
    console.log("data serving from redis");
    res.json({blog:JSON.parse(cached)})
    return ;
  }
  const blogs = await sql `SELECT * FROM blogs WHERE id = ${id}`;
  if(blogs.length==0){
     res.status(404).json({message:"blog not exist"});
     return;

  }
  const data = await axios.get(`${process.env.USER_SERVICE }/${blogs[0].author}`)

  const response ={ blog:blogs[0],author:data.data}
  await redisClient.set(cacheKey,JSON.stringify(response))
  
   res.status(200).json({response});
   return;
})

export const getUserBlogs = TryCatch(async(req:authenticateRequest,res):Promise<void>=>{
  const {author}= req.params;  
   if(!author){
    res.status(404).json({message:"author not exist"});
    return;
   }
   const blogs = await sql `SELECT * FROM blogs WHERE author=${author}`;
   res.json({message:"blog fetch success",data:blogs});
   return;
   
})

export const addComment = TryCatch(async(req:authenticateRequest,res):Promise<void>=>{

  const {blogId} = req.params;
  const userId = req.user;
  const userName = req.name;
 
  const {comment} = req.body;
  if(!comment){
    res.status(400).json({message:"data is empty"})
  }
  const data = await sql `INSERT INTO comments (comment,userId,userName,blogId) VALUES (${comment},${userId},${userName},${blogId}) RETURNING *`;
  if(!data){
   res.status(500).json({message:"error during comment"});
   return;
  }
  res.status(200).json({success:true,message:"comment create success",data});
  return;
})

export const getAllComments = TryCatch(async (req, res):Promise<void> => {
  const { id } = req.params;

  const comments =
    await sql`SELECT * FROM comments WHERE blogId = ${id} ORDER BY createdAt DESC`;

  res.json(comments);
});

export const deleteComment = TryCatch(async (req: authenticateRequest, res):Promise<void> => {
  const { commentId } = req.params;
  const userId = req.user; // Adjust depending on how user ID is stored

  if (!commentId) {
     res.status(400).json({ message: "Comment ID not provided" });
     return;
  }

  // Fetch the comment
  const  rows  = await sql`SELECT * FROM comments WHERE id = ${commentId}`;

  
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
  const result = await sql`DELETE FROM comments WHERE id = ${commentId}`;

   res.status(200).json({
    success: true,
    message: "Comment deleted successfully",
  });
  return;
});


export const getRecommendedBlogs = TryCatch(async (req, res):Promise<void> => {
  const { id } = req.params;
  const cacheKey = `blog:recommended:${id}`;

 
  let cached;
  try {
    cached = await redisClient.get(cacheKey);
  } catch (err) {
    console.warn("Redis unavailable, falling back to DB");
  }

  if (cached) {
     res.json({ message: "From cache", blogs: JSON.parse(cached) });
     return;
  }

  // DB fetch will still work even if Redis is down
  const blogs = await sql`SELECT * FROM blogs WHERE id != ${id}`;
  res.json({ message: "From DB", blogs });
});

export const savedBlogs = TryCatch(async(req:authenticateRequest,res):Promise<void>=>{
 const {blogId} = req.params;
 const userId = req.user;
if(!blogId ||!userId){
  res.status(400).json({message:"blogId or userId is messing"})
}
const existingBlog = await sql `SELECT * FROM savedBlogs WHERE userId = ${userId} AND blogId = ${blogId}`;


if(existingBlog.length==0){
  await sql `INSERT INTO savedBlogs (blogId,userId) VALUES (${blogId} ,${userId})`;
   res.status(200).json({message:"Blog saved"});
   return;
}else{
   await sql `DELETE FROM savedBlogs WHERE userId =${userId} AND blogId =${blogId}`;
      res.status(200).json({message:"Blog remove from saved"});
      return;
}

})

export const getSavedBlog = TryCatch(async (req:authenticateRequest, res):Promise<void> => {
  const userId = req.user
  console.log("user is type of",typeof(userId));
  
  if(!userId){
     res.status(400).json({message:"userId not provide"});
     return;
  }
  const blogs = await sql`SELECT * FROM savedBlogs WHERE userId = ${userId} `;

  res.json(blogs);
});
