import TryCatch from "../utils/TryCatch";
import axios from "axios";
import {sql} from "../config/db"
import dotenv from "dotenv"
import { redisClient } from "../server";

dotenv.config()
export const getAllBlogs = TryCatch(async(req:authenticateRequest,res)=>{

  let blogs;
  const {searchQuery,category} = req.query;
  console.log(searchQuery);
  console.log(category);
  
  const cacheKey = `blogs ${searchQuery}:${category}`
  const cached = await redisClient.get(cacheKey)
  if(cached){
    console.log("data serving from redis");
    res.json({blog:JSON.parse(cached)})
    return ;
  }
  if(searchQuery && category){
    blogs =  await sql `SELECT * FROM blogs WHERE (title ILIKE ${"%" +searchQuery} OR description ILIKE ${"%" +searchQuery})
    AND category = ${category} ORDER BY createdAt DESC;
    `;
  }else if(searchQuery){
     blogs = await sql `SELECT * FROM blogs WHERE (title ILIKE ${"%" +searchQuery}) OR description ILIKE ${"%" +searchQuery} ORDER BY createdAt DESC `
  }else if(category){
     blogs = await sql `SELECT * FROM blogs WHERE category = ${category} ORDER BY createdAt DESC `
  }
  else{
    blogs = await sql `SELECT * FROM blogs ORDER BY createdAt DESC`
  }

  if(blogs.length===0){
    return res.status(404).json({message:"blogs not found "})
  }

  console.log("serving data from redis");
  
 await redisClient.set(cacheKey,JSON.stringify(blogs),{EX:3000})
  return res.status(200).json({message:"blogs fetch successfully",blog:blogs})
})


export const singleBlog = TryCatch(async(req:authenticateRequest,res)=>{
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
    return res.status(404).json({message:"blog not exist"})
  }
  const data = await axios.get(`${process.env.USER_SERVICE }/${blogs[0].author}`)

  const response ={ blog:blogs[0],author:data.data}
  await redisClient.set(cacheKey,JSON.stringify(response))
  
  return res.status(200).json({response})
})

export const getRecommendedBlogs = TryCatch(async (req, res) => {
  const { id } = req.params;
  const cacheKey = `blog:recommended:${id}`;

 
  let cached;
  try {
    cached = await redisClient.get(cacheKey);
  } catch (err) {
    console.warn("Redis unavailable, falling back to DB");
  }

  if (cached) {
    return res.json({ message: "From cache", blogs: JSON.parse(cached) });
  }

  // DB fetch will still work even if Redis is down
  const blogs = await sql`SELECT * FROM blogs WHERE id != ${id}`;
  res.json({ message: "From DB", blogs });
});
