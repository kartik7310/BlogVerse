'use client';

import React, { useEffect, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import Link from 'next/link';
import { useGoogleLogin } from '@react-oauth/google';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import axios from "axios";
import { useAppContext } from '../context/appContext';
import Loading from '@/components/Loading';
import { redirect ,useRouter} from 'next/navigation'


interface User {
  email: string;
  password: string;
}

const Login = () => {
  const router = useRouter()
  const {isAuth, setIsAuth, loading, setLoading } = useAppContext();

  
   if(isAuth) return redirect("/home")
  const [user, setUser] = useState<User>({
    email: "",
    password: ""
  });

  const googleResponse = async (authResult: any) => {
    try {
      const result = await axios.post(
        "http://localhost:8080/api/v1/user/google-login",
        {
          code: authResult.code,
        },
        {
          withCredentials: true,
        }
      );

      Cookies.set("token", result.data.token, {
        expires: 1,
        path: "/",
      });

      setIsAuth(true);
      toast.success(result.data.message || "Logged in successfully!");
    } catch (error: any) {
      toast.error(`Login failed: ${error?.response?.data?.message || error.message}`);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: googleResponse,
    onError: googleResponse,
    flow: "auth-code",
  });

  const manualLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user.email || !user.password) {
      toast.error("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:8080/api/v1/user/login",
        user,
        {
          withCredentials: true,
        }
      );

      Cookies.set("token", response.data.token, {
        expires: 1,
        path: "/",
      });

      setIsAuth(true);
      toast.success(response.data.message || "Logged in successfully!");
    } catch (error: any) {
      toast.error(`Login failed: ${error?.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({...prevUser,
      [name]: value,
    }));
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="flex items-center justify-center min-h-screen bg-white mt-8  px-4">
      <div className="w-full sm:max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-xl h-[72vh] flex flex-col justify-between">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-6">Log In</h2>

          <form className="space-y-4" onSubmit={manualLogin}>
            <div>
              <label className="block text-sm font-semibold ">Email</label>
              <input
                type="email"
                name="email"
                placeholder="example@email.com"
                value={user.email}
                onChange={handleInputChange}
                className="w-full py-2 px-2 mt-2 rounded-md border border-gray-300 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold ">Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={user.password}
                onChange={handleInputChange}
                className="w-full py-2 px-2 mt-2 rounded-md border border-gray-300 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
            >
              Log In
            </button>

            <Link href="/signup" className="block -mt-3 text-sm text-center">
              Haven't an account? <span className="text-blue-600">Signup</span>
            </Link>
          </form>
        </div>

        <div className='mt-2'>
          <button
            onClick={() => googleLogin()}
            type="button"
            className="w-full flex items-center justify-center gap-2 border border-gray-600 py-2 rounded-lg hover:bg-gray-300 cursor-pointer transition duration-200"
          >
            <FcGoogle className="text-xl" />
            <span className="text-sm sm:text-base text-gray-600 font-bold cursor-pointer ">Login with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
