'use client';

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import BlogCard from "@/components/BlogCard";
import { useAppContext } from '../context/appContext';
import { Suspense } from "react";
const Page = () => {
  const {isAuth,blog,loading} = useAppContext();
  
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="flex mt-16 bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <div className="fixed z-30">
        <Sidebar open={isOpen} setOpen={setIsOpen} />
      </div>

      {/* Main content */}
     
   
      <main className="w-full h-full mt-8 p-4 md:ml-64 flex flex-wrap justify-center">
       
        {blog && blog.length > 0 ? (
          blog?.map((blog: any) => (
            <Suspense fallback="loading...">
              <BlogCard
             loading={loading}
              id={blog.id}
              title={blog.title}
              image={blog.image}
              description={blog.description}
              blogcontent={blog.blogcontent}
              category={blog.category}
              createdat={blog.createdat}
             
            />
            </Suspense>
          ))
        ) : (
          <p className="text-gray-500 text-center w-full">No blogs yet.</p>
        )}
      </main>
    </div>
  );
};

export default Page;
