"use client";
import { Blog } from "@/app/context/appContext";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useState, useEffect } from "react";
import BlogCard from "./BlogCard";

type RecomandedBlogProps = {
  blogId: number;
};

const RecomandedBlog:React.FC<RecomandedBlogProps>= ({ blogId }: { blogId: Number }) => {
  const [recomandedBlogs, setRecomandedBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    async function fetchRecomandedBlogs() {
      try {
        const token = Cookies.get("token");
        const { data } = await axios.get<Blog>(
          `http://localhost:5002/api/v1/blog/recommendedBlogs/${blogId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        setRecomandedBlogs(data.blogs);
      } catch (error: any) {
        console.error("Failed to fetch recommended blogs:", error.message);
      }
    }
    fetchRecomandedBlogs()
  }, [blogId]);

 console.log("recomanded blogs",recomandedBlogs);
 
  return (
    <div className="w-full mt-10 p-4 bg-gray-50 rounded-lg shadow-sm">
      <h3 className="text-xl font-bold text-gray-700 mb-4 border-b-2 border-indigo-500 pb-2">
        Recommended Blogs
      </h3>

      {recomandedBlogs.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {recomandedBlogs.map((blog) => (
            <BlogCard
              key={blog.id}
              loading={false}
              id={blog.id}
              title={blog.title}
              image={blog.image}
              description={blog.description}
              blogcontent={blog.blogcontent}
              category={blog.category}
              createdat={blog.createdat}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm italic">No recommendations available.</p>
      )}
    </div>
  );
};

export default RecomandedBlog;
