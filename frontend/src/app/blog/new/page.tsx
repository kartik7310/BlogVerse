
"use client";

import React, { useMemo, useRef, useState } from "react";
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

import Cookies from "js-cookie";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw } from "lucide-react";
import dynamic from "next/dynamic";
import {  authorServiceUrl, Blog } from "@/app/context/appContext";
import toast from "react-hot-toast";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export const blogCategory = ["Travel", "Education", "Technology", "Health", "Finance"];

const AddBlog = () => {
  const editor = useRef(null);

  /* ─── Local state ─────────────────────────────── */
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiTitle, setAiTitle] = useState(false);
  const [aiDescription, setAiDescription] = useState(false);
  const [aiBlogLoading, setAiBlogLoading] = useState(false);

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

  /* ─── Handlers ────────────────────────────────── */
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

    try {
      setLoading(true);
      const token = Cookies.get("token");
      const { data } = await axios.post(
        `${authorServiceUrl}/api/v1/blog/new`,
        fd,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(data.message ?? "Blog created!");
      setFormData({
        title: "",
        description: "",
        category: "",
        image: null,
        blogContent: "",
      });
      setContent("");

    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTitleWithAi = async () => {
    if (!formData.title) return;
    try {
      setAiTitle(true);
      const { data } = await axios.post(
        `${authorServiceUrl}/api/v1/ai/title`,
        { text: formData.title }
      );
      setFormData({ ...formData, title: data.title ?? data });
    } catch (err) {
      toast.error("Error while fetching AI-generated title");
      console.error(err);
    } finally {
      setAiTitle(false);
    }
  };

  const aiDescriptionResponse = async () => {
    if (!formData.title) return;
    try {
      setAiDescription(true);
      const { data } = await axios.post(
        `${authorServiceUrl}/api/v1/ai/description`,
        { title: formData.title, description: formData.description }
      );
      setFormData({ ...formData, description: data.description ?? data });
    } catch (err) {
      toast.error("Problem while fetching description from AI");
      console.error(err);
    } finally {
      setAiDescription(false);
    }
  };

  const aiBlogResponse = async () => {
    if (!formData.blogContent) return;
    try {
      setAiBlogLoading(true);
      const { data } = await axios.post(
        `${authorServiceUrl}/api/v1/ai/blog`,
        { blog: formData.blogContent }
      );
      const html = data.html ?? data;
      setContent(html);
      setFormData({ ...formData, blogContent: html });
    } catch (err) {
      toast.error("Problem while fetching blog content from AI");
      console.error(err);
    } finally {
      setAiBlogLoading(false);
    }
  };

  /* ─── Editor config ───────────────────────────── */
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Start typing…",
    }),
    []
  );

  /* ─── JSX ─────────────────────────────────────── */
  return (
    <div className="mt-15 mx-auto max-w-4xl p-6">
      <Card>
        <CardHeader>
          <h2 className="text-center text-2xl font-bold">Add Blog</h2>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleForm} className="space-y-6">
            {/* Title */}
            <div>
              <Label>Title</Label>
              <div className="mt-1 flex items-center gap-2">
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter blog title"
                  className={aiTitle ? "animate-pulse placeholder:opacity-60" : ""}
                  required
                />
                {formData.title && (
                  <Button type="button" onClick={handleTitleWithAi} disabled={aiTitle}>
                    <RefreshCw className={aiTitle ? "animate-spin" : ""} />
                  </Button>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <Label>Description</Label>
              <div className="mt-1 flex items-center gap-2">
                <Input
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter blog description"
                  className={aiDescription ? "animate-pulse placeholder:opacity-60" : ""}
                  required
                />
                {formData.title && (
                  <Button
                    type="button"
                    onClick={aiDescriptionResponse}
                    disabled={aiDescription}
                  >
                    <RefreshCw className={aiDescription ? "animate-spin" : ""} />
                  </Button>
                )}
              </div>
            </div>

            {/* Category */}
            <div>
              <Label>Category</Label>
              <Select
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={formData.category || "Select category"} />
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

            {/* Image */}
            <div>
              <Label>Upload Image</Label>
              <Input type="file" accept="image/*" onChange={handleFileChange} />
            </div>

            {/* Blog Content */}
            <div>
              <Label>Blog Content</Label>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Type or paste your blog here. You can use rich-text formatting.
                </p>
                <Button
                  type="button"
                  size="sm"
                  onClick={aiBlogResponse}
                  disabled={aiBlogLoading}
                >
                  <RefreshCw size={16} className={aiBlogLoading ? "animate-spin" : ""} />
                  <span className="ml-2">Fix Grammar</span>
                </Button>
              </div>

              <JoditEditor
                ref={editor}
                value={content}
                config={config}
                tabIndex={1}
                onBlur={(html) => {
                  setContent(html);
                  setFormData({ ...formData, blogContent: html });
                }}
              />
            </div>

            {/* Submit */}
            <Button className="w-full mt-3" disabled={loading} type="submit">
              {loading ? "Submitting…" : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddBlog;
