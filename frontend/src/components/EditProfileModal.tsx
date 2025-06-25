
'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { useAppContext, userServiceUrl } from '@/app/context/appContext';

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
      `${userServiceUrl}/api/v1/user/profile/${id}`,
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
