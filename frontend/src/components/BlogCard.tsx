'use client';

import React from 'react';
import DOMPurify from 'dompurify';
import { useRouter } from 'next/navigation';

import Loading from './Loading';
interface BlogCardProps {
  id: string;
  title: string;
  image: string;
  description: string;
  blogcontent: string;
  category: string;
  createdat: string;
  author?: string;
  loading:any;
}

const BlogCard: React.FC<BlogCardProps> = ({
  id,
  title,
  image,
  description,
  blogcontent,
  category,
  createdat,

  loading
}) => {
  const router = useRouter();

  const handleClick = (id: string) => {
    router.push(`/blog/${id}`);
  };

  if(loading) return <Loading/>
  return (
    
    <div
      onClick={() => handleClick(id)}
      className="cursor-pointer transition-transform duration-300 hover:scale-[1.01] hover:shadow-md bg-white rounded-xl overflow-hidden w-full sm:w-[45%] lg:w-[30%] m-2 max-w-sm max-h-[400px] border border-gray-200 shadow"
    >
      <img
        src={image}
        alt={title}
        className="w-full h-36 object-cover"
      />

      <div className="p-3 flex flex-col gap-1 h-[220px] justify-between">
        <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full w-fit uppercase tracking-wider">
          {category}
        </span>

        <h3 className="text-base font-semibold text-gray-800 line-clamp-1">
          {title}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-2">
          {description.slice(0,30)}...
        </p>

        <div
          className="text-sm text-gray-700 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blogcontent) }}
        />

        <div className="text-[10px] text-gray-500 mt-2 flex justify-between items-center">
        
          <span>{new Date(createdat).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
