"use client";
import { useEffect } from "react";
import BlogCard from "@/components/BlogCard";
import Loading from "@/components/Loading";
import { useAppContext } from "../context/appContext";
import {  useRouter } from 'next/navigation';
import React from "react";

const SavedBlogs = () => {
  const router = useRouter()
  const { blog, savedBlogs, loading,isAuth } = useAppContext();
console.log("first blog",savedBlogs);

  
useEffect(() => {
     if (!isAuth && !loading) {
       router.push("/login"); 
     }
   }, [isAuth, router,loading]);
  if (loading) return <Loading />;

  if (!blog || !savedBlogs) {
    return <p className="mt-18 text-center text-xl text-gray-500">No Saved blog yet</p>;
  }

  const userSavedBlogs = blog.filter((b) =>
    savedBlogs.some((s) => s.blogid === b.id.toString())
  );
    console.log("savedBlogs here",userSavedBlogs);
    
  return (
    <section className="w-full mx-auto mt-16">
      <h1 className="text-3xl font-bold mb-6 text-center">📚 Your Saved Blogs</h1>

      {userSavedBlogs.length > 0 ? (
        <div className="flex gap-3 flex-wrap ml-7">
          {userSavedBlogs.map((blog) => (
            <BlogCard
              key={blog.id}
              id={blog.id}
              image={blog.image}
              category={blog.category}
              title={blog.title}
              description={blog.description}
              createdat={blog.createdat}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600 mt-10">
          <p className="text-lg">You haven’t saved any blogs yet.</p>
          <p className="text-sm">Start exploring and save your favorites!</p>
        </div>
      )}
    </section>
  );
};

export default SavedBlogs;
