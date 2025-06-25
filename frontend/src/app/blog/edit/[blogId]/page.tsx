"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import dynamic from "next/dynamic";
import { authorServiceUrl, blogServiceUrl, useAppContext } from "@/app/context/appContext";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export const blogCategory = ["Travel", "Education", "Technology", "Health", "Finance"];

const EditBlog = () => {
  const {fetchBlogs} = useAppContext()
  const router = useRouter()
  const editor = useRef(null);
  const { blogId } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    category: string;
    image: File | null;
    blogContent: string;
  }>({
    title: "",
    description: "",
    category: "",
    image: null,
    blogContent: "",
  });
const[existingImage,setExistingImage] = useState(null)
  /* ─── Fetch Blog ───────────────────────────── */
  const fetchSingleBlog = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${blogServiceUrl}/api/v1/blog/${blogId}`);
      const blog = data?.blog?.blog;

      setFormData({
        title: blog.title || "",
        description: blog.description || "",
        category: blog.category || "",
        image: null,
        blogContent: blog.blogcontent || "",
      });
      setExistingImage(blog.image)
    } catch (error: any) {
      console.error("Error fetching blog:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (blogId) fetchSingleBlog();
  }, [blogId]);

  /* ─── Handlers ───────────────────────────── */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, image: e.target.files?.[0] ?? null });

  const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("title", formData.title);
    fd.append("description", formData.description);
    fd.append("category", formData.category);
    fd.append("blogContent", formData.blogContent);
    if (formData.image) fd.append("file", formData.image);

    // TODO: send update request
    console.log("Submitting FormData", fd);
  };

  /* ─── Editor config ───────────────────────────── */
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Start typing…",
    }),
    []
  );
const BlogUpdate = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const token = Cookies.get("token");
    setLoading(true);

    const fd = new FormData();
    fd.append("title", formData.title);
    fd.append("description", formData.description);
    fd.append("category", formData.category);
    fd.append("blogContent", formData.blogContent);
    if (formData.image) {
      fd.append("file", formData.image);
    }

    const { data } = await axios.put(
      `${authorServiceUrl}/api/v1/blog/update/${blogId}`,
      fd,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    toast.success(data?.message ?? "Blog updated successfully");

    setFormData({
      title: "",
      description: "",
      category: "",
      image: null,
      blogContent: "",
    });

    fetchBlogs();
    router.push(`/blog/${blogId}`);
  } catch (err: any) {
    toast.error(err?.response?.data?.message ?? "Something went wrong");
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  /* ─── JSX ─────────────────────────────────────── */
  return (
    <div className="mt-15 mx-auto max-w-4xl p-6">
      <Card>
        <CardHeader>
          <h2 className="text-center text-2xl font-bold">Edit Blog</h2>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleForm} className="space-y-6">
            <div>
              <Label>Title</Label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter blog title"
                required
              />
            </div>

            <div>
              <Label>Description</Label>
              <Input
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter blog description"
                required
              />
            </div>

            <div>
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {blogCategory.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Upload Image</Label>
              {existingImage && !formData.image &&(
                <img src={existingImage} alt="existingImage" className="w-40 h-40 object-cover rounded m-2" />
              )}

              
              <Input type="file" accept="image/*" onChange={handleFileChange} className="" />
            </div>

            <div>
              <Label>Blog Content</Label>
              <JoditEditor
                ref={editor}
                value={formData.blogContent}
                config={config}
                tabIndex={1}
                onBlur={(html) => {
                  setFormData({ ...formData, blogContent: html });
                }}
              />
            </div>

            <Button className="w-full mt-3" disabled={loading} type="submit" onClick={BlogUpdate}>
              {loading ? "Submitting…" : "Update Blog"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditBlog;
