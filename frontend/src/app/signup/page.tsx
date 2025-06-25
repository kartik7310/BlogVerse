'use client';

import React, { useState } from 'react';
import { redirect, useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';
import { useAppContext,userServiceUrl } from '../context/appContext';

interface UserPayload {
  name: string;
  email: string;
  password: string;
}

const Signup = () => {
  const router = useRouter();
  const{isAuth} = useAppContext()
  if(isAuth){
    return redirect("/home")
  }
  const [user, setUser] = useState<UserPayload>({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  // 1. --- form state
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  // 2. --- API helper (could live in /lib/api.ts)
  const register = async (payload: UserPayload) =>
    axios.post(
      `${userServiceUrl}/api/v1/user/register`,
      payload,
      { withCredentials: true }
    );

  // 3. --- handler
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, password } = user;
    if (!name || !email || !password) return toast.error('All fields are required');

    try {
      setLoading(true);
      const { data } = await register(user);
      toast.success(data.message || 'Registered successfully');
      router.push('/login');              // <-- redirect
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err.message ||
        'Something went wrong, please try again';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 mt-8">
      <div className="h-[80vh] w-full max-w-md rounded-2xl  p-8 shadow-xl sm:h-[85vh]">
        <h2 className="mb-6 text-center text-4xl font-bold">Create Account</h2>

        {/* ---------- form ---------- */}
        <form onSubmit={onSubmit} className="space-y-4">
          {['name', 'email', 'password'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-semibold capitalize">
                {field}
              </label>
              <input
                type={field === 'password' ? 'password' : field}
                name={field}
                value={(user as any)[field]}
                onChange={onChange}
                placeholder={
                  field === 'name'
                    ? 'John Doe'
                    : field === 'email'
                    ? 'john@example.com'
                    : '••••••••'
                }
                className="w-full py-2 px-2 mt-2 rounded-md border border-gray-300 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400" 
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-2 font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            {loading ? 'Creating account…' : 'Sign Up'}
          </button>

          <p className="pt-1 text-center text-sm -mt-3">
            Have an account?{' '}
            <Link href="/login" className="text-blue-500 hover:underline ">
              Login
            </Link>
          </p>
        </form>

        {/* ---------- Google button (stub) ---------- */}
        <button
          type="button"
          disabled
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-600 py-2 transition hover:bg-gray-300 cursor-pointer "
        >
          <FcGoogle className="text-xl" />
          <span className="text-sm">Sign up with Google</span>
        </button>
      </div>
    </div>
  );
};

export default Signup;
