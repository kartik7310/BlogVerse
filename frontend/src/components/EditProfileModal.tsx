// "use client";


// import { useAppContext } from "@/app/context/appContext";
// import React, { useState, useEffect } from "react";
// import toast from "react-hot-toast";
// import axios from "axios";
// interface EditProfileModalProps {
//   initialData: {
//     name?: string;
//     instagram?: string;
//     facebook?: string;
//     linkedin?: string;
//     bio?: string;
//   };
//   isOpen: boolean;
//   onClose: () => void;
//   onSave: (updatedData: {
//     name: string;
//     instagram: string;
//     facebook: string;
//     linkedin: string;
//     bio: string;
//   }) => void;
// }


// const EditProfileModal: React.FC<EditProfileModalProps> = ({
//   initialData,
//   isOpen,
//   onClose,
//   onSave,
// }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     instagram: "",
//     facebook: "",
//     linkedin: "",
//     bio: "",
//   });

//   useEffect(() => {
//     if (isOpen && initialData) {
//       setFormData({
//         name: initialData.name || "",
//         instagram: initialData.instagram || "",
//         facebook: initialData.facebook || "",
//         linkedin: initialData.linkedin || "",
//         bio: initialData.bio || "",
//       });
//     }
//   }, [isOpen, initialData]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };
// const{userData} = useAppContext()

 
//   const handleSubmit = async(userId:string) => {
    
    
//    if(formData.bio || formData.facebook || formData.instagram|| formData.linkedin || formData.name) {
//    const {data} = await axios.put(`{USER_SERVICE}//user/profile/${userId}`,formData,  { withCredentials: true }) 
//    }
//    toast.success("data upload success")
//     onSave(formData);
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 bg-opacity-50">
//       <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
//         <h3 className="text-lg font-bold mb-4 text-gray-700">Edit Profile</h3>

//         <input
//           type="text"
//           name="name"
//           placeholder="Name"
//           value={formData.name}
//           onChange={handleChange}
//           className="mb-3 w-full rounded border px-3 py-2"
//         />
//         <input
//           type="text"
//           name="instagram"
//           placeholder="Instagram URL"
//           value={formData.instagram}
//           onChange={handleChange}
//           className="mb-3 w-full rounded border px-3 py-2"
//         />
//         <input
//           type="text"
//           name="facebook"
//           placeholder="Facebook URL"
//           value={formData.facebook}
//           onChange={handleChange}
//           className="mb-3 w-full rounded border px-3 py-2"
//         />
//         <input
//           type="text"
//           name="linkedin"
//           placeholder="LinkedIn URL"
//           value={formData.linkedin}
//           onChange={handleChange}
//           className="mb-3 w-full rounded border px-3 py-2"
//         />
//         <textarea
//           name="bio"
//           placeholder="Bio"
//           value={formData.bio}
//           onChange={handleChange}
//           rows={4}
//           className="mb-3 w-full rounded border px-3 py-2"
//         />

//         <div className="flex justify-end space-x-3">
//           <button
//             onClick={onClose}
//             className="rounded bg-gray-300 px-4 py-2 text-sm"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={()=>handleSubmit(userData._id)}
//             className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
//           >
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditProfileModal;
'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { useAppContext, USER_SERVICE } from '@/app/context/appContext';

interface EditProfileModalProps {
  initialData: {
    name?: string;
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    bio?: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: {
    name: string;
    instagram: string;
    facebook: string;
    linkedin: string;
    bio: string;
  }) => void;
}

const emptyProfile = {
  name: '',
  instagram: '',
  facebook: '',
  linkedin: '',
  bio: '',
};

export default function EditProfileModal({
  initialData,
  isOpen,
  onClose,
  onSave,
}: EditProfileModalProps) {
  const { userData } = useAppContext();
  const [form, setForm] = useState(emptyProfile);
  const [loading, setLoading] = useState(false);

  /* ---------- populate when opened ---------- */
  useEffect(() => {
    if (isOpen) {
      setForm({
        name: initialData?.name || '',
        instagram: initialData?.instagram || '',
        facebook: initialData?.facebook || '',
        linkedin: initialData?.linkedin || '',
        bio: initialData?.bio || '',
      });
    }
  }, [isOpen, initialData]);

  /* ---------- helpers ---------- */
  const onField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const updateProfile = (
    id: string,
    payload: typeof emptyProfile,
    token: string,
  ) =>
    axios.put(
      `${USER_SERVICE}/api/v1/user/profile/${id}`,
      payload,
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      },
    );

  const onSubmit = async () => {
    const token = Cookies.get('token'); // <-- 1. safe, single parentheses
    if (!token) return toast.error('Session expired — please log in again');

    if (!userData?._id) return toast.error('Cannot find your user ID');

    // 2. Skip request when nothing changed
    const changed = Object.keys(form).some(
      (k) => (form as any)[k] !== (initialData as any)[k],
    );
    if (!changed) return toast.error('No changes detected');

    try {
      setLoading(true);
      await updateProfile(userData._id, form, token); // <-- 3. pass form + token
     
      onSave(form);
      onClose();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ??
          err.message ??
          'Unable to update profile',
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  /* ---------- modal ---------- */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-bold text-gray-700">Edit Profile</h3>

        {(['name', 'instagram', 'facebook', 'linkedin'] as const).map((f) => (
          <input
            key={f}
            name={f}
            type="text"
            placeholder={f === 'name' ? 'Name' : `${f} URL`}
            value={(form as any)[f]}
            onChange={onField}
            className="mb-3 w-full rounded border px-3 py-2 text-sm"
          />
        ))}

        <textarea
          name="bio"
          placeholder="Bio"
          rows={4}
          value={form.bio}
          onChange={onField}
          className="mb-3 w-full resize-none rounded border px-3 py-2 text-sm"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded bg-gray-300 px-4 py-2 text-sm hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={loading}
            className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
