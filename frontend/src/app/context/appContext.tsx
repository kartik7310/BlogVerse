"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";


/* ─────────────────────────────
   1. API-endpoint constants
   ───────────────────────────── */
export const userServiceUrl = process.env.NEXT_PUBLIC_USER_SERVICE;
export const blogServiceUrl = process.env.NEXT_PUBLIC_BLOG_SERVICE;
export const authorServiceUrl = process.env.NEXT_PUBLIC_AUTHOR_SERVICE;

export interface User {
  _id: string;
  name: string;
  email: string;
  image: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  bio?: string;
  password?: string; // server never returns
  provider: "manual" | "google";
}

//blog shape
export interface Blog {
  id: string;
  title: string;
  description: string;
  blogContent: string;
  image: string;
  category: string;
  author: string;
  createdat: string;
}

//savedBlog shape
export interface SavedBlogType {
  id: string;
  userId: string;
  blogId: string;
  createat: string;
}

//  3. Context shape

interface AppContextType {
  userData: User | null;
  isAuth: boolean;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
  setUserData: React.Dispatch<React.SetStateAction<User | null>>;
  refetchUser: () => Promise<void>;
  logout: () => void;
  blog: Blog[] | null;
  blogLoading: boolean;
  fetchBlogs: any;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  savedBlogs: SavedBlogType[] | null;
  getSavedBlog: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

/* ─────────────────────────────
   4. Provider component
   ───────────────────────────── */
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  /** Fetch the current user using the JWT stored in cookies. */
  const fetchUser = useCallback(async () => {
    setLoading(true);
    const token = Cookies.get("token");

    if (!token) {
      setUserData(null);
      setIsAuth(false);
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.get<User>(
        `${userServiceUrl}/api/v1/user/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      console.log("after fetch user data with blogs",data);
      
      setUserData(data);
      setIsAuth(true);
    } catch (err) {
      console.error("[AppContext] fetchUser failed", err);
      Cookies.remove("token");
      setUserData(null);
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  }, []);

  //fetch blogs
  const [blogLoading, setBlogLoading] = useState(false);
  const [blog, setBlogs] = useState<Blog[] | null>(null);
  const [category, setCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBlogs = async () => {
    try {
      setBlogLoading(true);
      const response = await axios.get<Blog[]>(
        `${blogServiceUrl}/api/v1/blog/all?searchQuery=${searchQuery}&category=${category}`
      );
      setBlogs(response?.data?.blog);
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setBlogLoading(false);
    }
  };

  const [savedBlogs, setSavedBlogs] = useState<SavedBlogType[] | null>(null);

  async function getSavedBlog() {
    try {
      const token = Cookies.get("token");
      const { data } = await axios.get(
        `${blogServiceUrl}/api/v1/blog/saved/blog`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSavedBlogs(data);
    } catch (error) {
      console.log(error);
    }
  }

  /** Clear token & context state. */
  const logout = () => {
    Cookies.remove("token");
    setUserData(null);
    setIsAuth(false);
  };

  useEffect(() => {
    fetchUser();
    getSavedBlog();
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [category, searchQuery]);

  const contextValue = React.useMemo<AppContextType>(
    () => ({
      userData,
      setUserData,
      isAuth,
      loading,
      setLoading,
      setIsAuth,
      refetchUser: fetchUser,
      fetchBlogs,
      logout,
      blog,
      blogLoading,
      searchQuery,
      setSearchQuery,
      setCategory,
      savedBlogs,
      getSavedBlog,
    }),
    [
      userData,
      isAuth,
      loading,
      fetchUser,
      blog,
      searchQuery,
      category,
      getSavedBlog,
    ]
  );

  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}
    >
      <AppContext.Provider value={contextValue}>
        {children}
        <Toaster position="top-center" />
      </AppContext.Provider>
    </GoogleOAuthProvider>
  );
};

/* ─────────────────────────────
   5. Consumer hook
   ───────────────────────────── */
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("useAppContext must be used within <AppProvider>");
  return context;
};
