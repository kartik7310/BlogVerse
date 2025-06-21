'use client';
import React from 'react';
import { FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { useAppContext } from '../../context/appContext';
import Loading from '@/components/Loading';

const AboutUs = () => {
  const{loading} = useAppContext()
  return (
 <>
 {loading?<Loading/>:   <div className="min-h-screen mt-8 bg-white text-gray-900 px-6 py-16">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            About <span className="text-blue-600">BlogVerse</span>
          </h1>
          <p className="text-gray-600 text-lg sm:text-xl max-w-3xl mx-auto">
            BlogVerse is a modern blog platform focused on creativity, curiosity, and connection. We publish thoughtful content for thinkers, makers, and dreamers.
          </p>
        </section>

        {/* Mission & Vision */}
        <section className="grid sm:grid-cols-2 gap-8 mb-16">
          <div className="bg-gray-100 rounded-2xl p-6 shadow hover:shadow-blue-200 transition">
            <h2 className="text-2xl font-bold mb-2">Our Mission</h2>
            <p className="text-gray-600">
              To foster a global space where writers, thinkers, and creatives express themselves and make meaningful impact through words.
            </p>
          </div>
          <div className="bg-gray-100 rounded-2xl p-6 shadow hover:shadow-blue-200 transition">
            <h2 className="text-2xl font-bold mb-2">Our Vision</h2>
            <p className="text-gray-600">
              Empower a new generation of digital storytellers and connect the world through compelling content and community.
            </p>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-center mb-8">Meet the Team</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { name: 'Aarav Sharma', role: 'Founder & Writer' },
              { name: 'Zoya Khan', role: 'Community Lead' },
              { name: 'Rishi Patel', role: 'UI/UX Designer' },
            ].map((member, index) => (
              <div
                key={index}
                className="bg-gray-100 p-6 rounded-xl text-center shadow hover:shadow-blue-200 transition"
              >
                <div className="w-20 h-20 mx-auto mb-4 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  {member.name.split(' ')[0][0]}
                </div>
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Community Call to Action */}
        <section className="bg-blue-50 py-10 px-6 rounded-2xl shadow-inner text-center">
          <h3 className="text-2xl font-bold text-blue-800 mb-3">Join Our Creative Community</h3>
          <p className="text-gray-700 mb-6 max-w-xl mx-auto">
            Whether you're a writer, reader, or collaborator — you're welcome. Together, we build a better internet, one blog at a time.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition">
            Get Started
          </button>
        </section>

        {/* Social Links */}
        <footer className="mt-16 border-t border-gray-200 pt-8 text-center">
          <p className="text-gray-500 mb-4">Follow us on</p>
          <div className="flex justify-center gap-6 text-xl text-gray-500">
            <a href="#" className="hover:text-blue-500"><FaTwitter /></a>
            <a href="#" className="hover:text-pink-500"><FaInstagram /></a>
            <a href="#" className="hover:text-blue-700"><FaLinkedin /></a>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            &copy; {new Date().getFullYear()} BlogVerse. All rights reserved.
          </p>
        </footer>
      </div>
    </div>}
 </>
  );
};

export default AboutUs;
