// components/SkeletonBlogCard.tsx
'use client';

import React from 'react';
import clsx from 'clsx';

const SkeletonBlogCard = () => {
  return (
    <div
      className={clsx(
        'animate-pulse bg-white rounded-xl overflow-hidden w-full sm:w-[45%] lg:w-[30%] m-2 max-w-sm max-h-[400px] border border-gray-200 shadow'
      )}
    >
      <div className="w-full h-36 bg-gray-300" />

      <div className="p-3 flex flex-col gap-2 h-[220px] justify-between">
        <div className="h-4 w-20 bg-gray-300 rounded-full" />
        <div className="h-5 w-3/4 bg-gray-300 rounded" />
        <div className="h-4 w-full bg-gray-300 rounded" />
        <div className="h-4 w-[90%] bg-gray-300 rounded" />

        <div className="h-3 w-full flex justify-between mt-2">
          <div className="h-3 w-24 bg-gray-300 rounded" />
          <div className="h-3 w-16 bg-gray-300 rounded" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonBlogCard;
