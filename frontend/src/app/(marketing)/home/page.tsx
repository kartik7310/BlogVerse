'use client';
import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';
import { useAppContext } from '../../context/appContext';
import Loading from '@/components/Loading';

const HomePage = () => {
  const{loading} = useAppContext()
  return (
  <>
  {loading?<Loading/>:  <div className="min-h-screen mt-8 bg-white text-gray-900 px-6 py-16 flex flex-col justify-center items-center">
      {/* Hero Section */}
      <section className="text-center mb-20">
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-4">
          Welcome to <span className="text-blue-600">BlogVerse</span>
        </h1>
        <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto mt-2">
          Discover stories, share insights, and join a global creative community.
        </p>
        <Link href="/login">
          <button className="mt-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full flex items-center gap-2 transition">
            Get Started <FaArrowRight />
          </button>
        </Link>
      </section>

      {/* Features */}
      <section className="grid sm:grid-cols-3 gap-6 max-w-6xl w-full mt-6">
        {[
          {
            title: 'Write & Share',
            desc: 'Craft your thoughts and publish instantly for the world to see.',
          },
          {
            title: 'Connect & Grow',
            desc: 'Engage with other writers, creators, and curious minds.',
          },
          {
            title: 'Explore & Learn',
            desc: 'Read from diverse perspectives across a wide range of topics.',
          },
        ].map((feature, idx) => (
          <div
            key={idx}
            className="bg-gray-100 rounded-xl p-6 shadow hover:shadow-blue-200 transition"
          >
            <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
            <p className="text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* Call to Action */}
      <section className="mt-20 text-center max-w-2xl">
        <h2 className="text-3xl font-bold mb-4">Ready to tell your story?</h2>
        <p className="text-gray-600 mb-6">
          Join thousands of bloggers sharing knowledge, opinions, and creativity with the world.
        </p>
        <Link href="/login">
          <button className="bg-blue-600 text-white hover:bg-blue-700 cursor-pointer font-semibold px-6 py-3 rounded-lg transition">
            Join Now
          </button>
        </Link>
      </section>
    </div>}
  </>
  );
};

export default HomePage;
