"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { useAppContext, userServiceUrl } from "../context/appContext";
import { FaUpload, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import Loading from "@/components/Loading";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import EditProfileModal from "@/components/EditProfileModal";
import { useRouter } from "next/navigation";
import BlogCard from "@/components/BlogCard";

const ProfileCard: React.FC = () => {
  const router = useRouter();
  const { userData, loading, isAuth, setLoading, logout, setUserData } =
    useAppContext();
  const author = userData?.user
 const blogs = userData?.blogs
  console.log(author);
  
    
  useEffect(() => {
    if (!isAuth && !loading) {
      router.push("/login");
    }
  }, [isAuth, router, loading]);

  const [image, setImage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const triggerFileSelect = () => {
    inputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const token = Cookies.get("token");

      const { data } = await axios.post(
        `${userServiceUrl}/api/v1/user/profile/update/pic`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.image) {
        setUserData((prev: any) =>
          prev ? { ...prev, image: data.image } : prev
        );
      }

      if (data.token) {
        Cookies.set("token", data.token, {
          expires: 5,
          secure: true,
          path: "/",
        });
      }

      toast.success("Profile picture updated");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("user logout success");
    router.push("/login");
  };

  const handleSaveProfile = (updatedData: any) => {
    setUserData((prev: any) => ({ ...prev, ...updatedData }));
    toast.success("Profile updated");
    // TODO: optionally call API here to persist updates
  };
  if (loading) return <Loading />;

  return (
   <div className="flex flex-col lg:flex-row w-full mt-14 gap-10 px-5">
  {/* Profile Section */}
  <div className="flex flex-col items-center lg:items-start lg:max-w-xs shadow-lg border-r-4 border-indigo-500 h-full w-full bg-white rounded-xl p-6">

    <h2 className="mb-5 text-2xl font-bold text-gray-700 ">Profile</h2>

    {/* Profile Image & Upload */}
    <div className="relative">
      <img
        src={image || author?.image || "/placeholder-avatar.png"}
        alt="Profile"
        className="h-36 w-36 rounded-full border border-gray-300 object-cover"
      />
      <button
        onClick={triggerFileSelect}
        className="absolute bottom-0 right-0 rounded-full bg-indigo-600 p-2 hover:bg-indigo-700"
        title="Upload new image"
        type="button"
      >
        <FaUpload className="text-white text-sm" />
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
    </div>

    {/* User Info */}
    <div className="flex flex-col items-center lg:items-start gap-2 mt-4">
      <h2 className="text-xl font-semibold text-gray-800">{author?.name}</h2>
      <p className="text-sm font-medium text-gray-500">{author?.email}</p>
      {author?.bio && (
        <p className="text-center lg:text-left text-gray-500 text-sm mt-2">{author?.bio}</p>
      )}
    </div>

    {/* Social Media Icons */}
    <div className="mt-4 flex space-x-4 text-gray-600">
      {author?.github && (
        <a href={author.github} target="_blank" rel="noopener noreferrer" className="hover:text-black">
          <FaGithub size={20} />
        </a>
      )}
      {author?.linkedin && (
        <a href={author.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-700">
          <FaLinkedin size={20} />
        </a>
      )}
      {author?.twitter && (
        <a href={author.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
          <FaTwitter size={20} />
        </a>
      )}
    </div>

    {/* Action Buttons */}
    <div className="flex flex-wrap justify-start mt-6 gap-3 w-full">
      <button
        onClick={handleLogout}
        className="flex-1 rounded-lg bg-indigo-500 px-4 py-2 text-sm text-white shadow hover:bg-indigo-600"
      >
        Logout
      </button>
      <button
        onClick={() => router.push("/blog/new")}
        className="flex-1 rounded-lg bg-indigo-500 px-4 py-2 text-sm text-white shadow hover:bg-indigo-600"
      >
        Add Blog
      </button>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex-1 rounded-lg bg-gray-200 px-4 py-2 text-sm text-black shadow hover:bg-gray-300"
      >
        Edit
      </button>
    </div>

    <EditProfileModal
      isOpen={isModalOpen}
      initialData={userData || {}}
      onClose={() => setIsModalOpen(false)}
      onSave={handleSaveProfile}
    />
  </div>

  {/* Blogs Section */}
  <div className="flex-1 min-h-[200px] mt-14 lg:mt-0">
   <h3 className="text-xl font-bold text-gray-700 mb-4 mt-4 border-b-2 border-gray-300 pb-2 w-full">Your Blogs</h3>
    <div className="flex flex-wrap gap-6">
      {blogs && blogs.length > 0 ? (
        blogs.map((blog: any) => (
          <Suspense key={blog.id} fallback={<p className="text-gray-400">Loading blog...</p>}>
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
    </div>
  </div>
</div>

  );
};

export default ProfileCard;
