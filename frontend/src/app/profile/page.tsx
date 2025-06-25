"use client";

import React, { useRef, useState } from "react";
import { useAppContext, userServiceUrl } from "../context/appContext";
import { FaUpload, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import Loading from "@/components/Loading";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import EditProfileModal from "@/components/EditProfileModal";
import {redirect,useRouter} from "next/navigation";

const ProfileCard: React.FC = () => {
  const router = useRouter()
  const { userData, loading, setLoading,logout,setUserData } = useAppContext();
  if(!userData) router.push("/login")
  
  const [image, setImage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const triggerFileSelect = () => {
    inputRef.current?.click();
  };

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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

  const handleLogout = ()=>{
    logout()
toast.success("user logout success")
 router.push("/login")
  }

   const handleSaveProfile = (updatedData: any) => {
    setUserData((prev: any) => ({ ...prev, ...updatedData }));
    toast.success("Profile updated");
    // TODO: optionally call API here to persist updates
  };
  if (loading) return <Loading />;

  return (
    <div className="mx-auto mt-20 max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
      <div className="flex flex-col items-center">
        <h2 className="mb-5 text-2xl font-bold text-gray-700">Profile</h2>

        {/* Profile Image & Upload */}
        <div className="relative">
          <img
            src={image || userData?.image || "/placeholder-avatar.png"}
            alt="Profile"
            className="h-32 w-32 rounded-full border border-gray-300 object-cover"
          />
          <button
            onClick={triggerFileSelect}
            className="absolute bottom-0 right-0 rounded-full bg-indigo-600 p-2 hover:bg-indigo-700"
            title="Upload new image"
            type="button"
          >
            <FaUpload className="text-xs text-white" />
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
        <h2 className="mt-4 text-xl font-semibold text-gray-800">{userData?.name}</h2>
        <p className="text-sm font-bold text-gray-500">{userData?.email}</p>

        {/* Optional Name Input */}
        <div className="m-5 w-full">
          <input
            type="text"
            placeholder="Name"
            className="w-full rounded border px-2 py-1"
            defaultValue={userData?.name}
          />
        </div>

        {/* Bio */}
        {userData?.bio && (
          <div className="text-center text-gray-500 m-2">{userData.bio}</div>
        )}

        {/* Social Media Icons */}
        <div className="mt-4 flex space-x-4 text-gray-600">
          <a
            href="https://github.com/kartik7310"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black"
          >
            <FaGithub size={20} />
          </a>
          <a
            href="https://linkedin.com/in/your-username"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-700"
          >
            <FaLinkedin size={20} />
          </a>
          <a
            href="https://twitter.com/your-username"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500"
          >
            <FaTwitter size={20} />
          </a>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-around mt-6">
        <button onClick={handleLogout}
        className="rounded-lg bg-indigo-500 px-4 py-2 text-sm text-white shadow hover:bg-indigo-600">
          Logout
        </button>
        <button 
       onClick={()=>router.push("/blog/new")}
         className="rounded-lg bg-indigo-500 px-4 py-2 text-sm text-white shadow hover:bg-indigo-600">
          Add Blog
        </button>
        <button onClick={() => setIsModalOpen(true)} className="rounded-lg  px-4 py-2 text-sm text-black shadow  hover:bg-gray-200">
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
    
  );
};

export default ProfileCard;
