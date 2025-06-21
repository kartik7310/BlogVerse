'use client';

import React from 'react';

const Loading = () => {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center bg-gradient-to-br from-white to-gray-300 text-gray-900 animate-fadeIn">
      {/* SVG Spinner with Gradient */}
      <div className="relative w-16 h-16">
        <svg
          className="animate-spin absolute inset-0 w-full h-full text-blue-700"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          role="status"
          aria-label="Loading spinner"
        >
          <circle
            className="opacity-20"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-80"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      </div>

      {/* Loading Text */}
      <p className="mt-6 text-xl font-semibold tracking-wide text-center">
        Please wait while we prepare everything for you...
      </p>
    </div>
  );
};

export default Loading;
