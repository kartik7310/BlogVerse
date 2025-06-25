"use client";

import React, { useEffect, useState } from "react";
import { useParams, notFound, useRouter } from "next/navigation";
import {
 authorServiceUrl,
  Blog,
  blogServiceUrl,
  useAppContext,
  User,
} from "@/app/context/appContext";
import axios from "axios";
import Cookies from "js-cookie";
import Loading from "@/components/Loading";
import { Bookmark, BookmarkCheckIcon, BookOpen, Edit, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import toast from "react-hot-toast";

interface Comment {
  userId: string;
  username: string;
  comment: string;
  createdat: string;
}
const Page = () => {
  const router = useRouter();
  const { isAuth, userData, fetchBlogs } = useAppContext();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [author, setAuthor] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const  [save,setSaved] = useState(false)
  const { id } = useParams();

  const fetchSingleBlog = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${blogServiceUrl}/api/v1/blog/${id}`
      );
      setBlog(data?.blog?.blog);
      setAuthor(data?.blog?.author);
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const { data } = await axios.get(
        `${blogServiceUrl}/api/v1/blog/comment/fetch/${id}`
      );
      setComments(data);
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchSingleBlog();
      fetchComments();
    }
  }, [id]);

  if (loading || !blog || !author) {
    return <Loading />;
  }

  const handleDeleteBLog = async () => {
    try {
      confirm("are you sure to delete this");
      const token = Cookies.get("token");
      await axios.delete(`${authorServiceUrl}/api/v1/blog/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Blog deleted successfully");
      router.push("/dashboard");
      fetchBlogs();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Something went wrong");
      console.error(err);
    }
  };

  const handleComment = async () => {
    try {
      const token = Cookies.get("token");
      const { data } = await axios.post(
        `${blogServiceUrl}/api/v1/blog/comment/${id}`,
        { comment: newComment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Comment added");
      setNewComment("");
      fetchComments();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Something went wrong");
      console.error(err);
    }
  };

   const deleteComment = async (id: string) => {
    if (confirm("Are you sure you want to delete this comment")) {
      try {
       
        const token = Cookies.get("token");
        const { data } = await axios.delete(
          `${blogServiceUrl}/api/v1/blog/comment/delete/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success(data?.message);
        fetchComments();
      } catch (error:any) {
        toast.error("Problem while deleting comment");
        console.log(error.message);
      } 
    }
  };


async function handleSavedBlog() {
  try {
    // setLoading(true)
    const token = Cookies.get("token");
    const {data} = await axios.post(`${blogServiceUrl}/api/v1/blog/save/${id}`,{},{
       headers: { Authorization: `Bearer ${token}` },
    })
    toast.success(data?.message)
    setSaved(!save)
  } catch (err:any) {
    toast.error(err?.response?.data?.message ?? "Something went wrong");
      console.error(err);
  }
}
  return (
    <div className="max-w-4xl mx-auto px-6 md:px-12 py-12 font-sans text-gray-800">
      <article className="bg-white shadow-md rounded-2xl overflow-hidden">
        <img
          src={blog.image}
          alt="Blog Cover"
          className="w-full max-h-[500px] object-contain mx-auto rounded-t-2xl"
        />

        <div className="p-6 md:p-12 space-y-10 leading-loose tracking-wide">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex gap-2 items-center">
              <BookOpen className="text-gray-500 mt-1" />
              <span className="text-gray-500">Read time: ~5 min</span>
            </div>
            <span className="inline-block bg-blue-100 text-blue-700 text-sm px-4 py-1 rounded-full font-medium">
              {blog.category}
            </span>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-bold leading-tight tracking-tight">
              {blog.title}
            </h1>
            <p className="text-lg text-gray-600">{blog.description}</p>
          </div>

          <div
            className="prose lg:prose-xl max-w-none prose-img:rounded-xl prose-img:mx-auto prose-a:text-blue-600 prose-a:underline prose-h1:text-4xl prose-h2:text-3xl prose-p:leading-loose break-words whitespace-normal"
            dangerouslySetInnerHTML={{ __html: blog.blogcontent }}
          />

          <div className="flex items-center gap-4 mt-10">
            <img
              src={author.image}
              alt={author.name}
              className="w-12 h-12 rounded-full object-cover border"
            />
            <div>
              <Link
                href={`/user/${author._id}`}
                className="text-lg font-semibold"
              >
                {author.name}
              </Link>
              <p className="text-sm text-gray-500">
                {new Date(blog?.createdat).toDateString()}
              </p>
            </div>
            <div className="-ml-6">
              {isAuth && (
                <Button variant={"ghost"} className="mx-5" size={"lg"} onClick={handleSavedBlog}>
                 {save?<BookmarkCheckIcon/>: <Bookmark />}
                </Button>
              )}
              {blog?.author === userData?._id && (
                <>
                  <Button
                    size={"sm"}
                    onClick={() => router.push(`/blog/edit/${id}`)}
                  >
                    <Edit />
                  </Button>
                  <Button
                    size={"sm"}
                    variant={"destructive"}
                    className="mx-2"
                    onClick={handleDeleteBLog}
                  >
                    <Trash2Icon />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </article>

      <div className="mt-5">
        {isAuth && (
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold">Leave a comment</h3>
            </CardHeader>
            <CardContent>
              <label htmlFor="comment" className="block mb-2">
                Your Comment
              </label>
              <textarea
                id="comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Type your comment here"
                className="my-2 w-full border rounded-md p-2"
              />
              <Button
                className="cursor-pointer"
                onClick={handleComment}
                disabled={loading}
              >
                Post Comment
              </Button>
              <div className="mt-4 space-y-4">
                <div className="text-xl font-semibold text-gray-800 mt-2 ">
                  All Comments
                </div>
                {comments.map((comm, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 border-b pb-2"
                  >
                    {/* Avatar with first letter of username */}
                    <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center font-semibold text-blue-700 uppercase">
                      {comm?.username?.charAt(0)}
                    </div>

                    {/* Comment content */}
                    <div>
                      <div className="text-md font-semibold text-gray-800 flex gap-5">
                        {comm?.username}
                        <span className="text-xs text-gray-500 mt-1 font-normal">
                          {new Date(comm?.createdat).toDateString()}
                        </span>
                        {comm?.userid === userData?._id && (
                          
                            <Button
                              size={"sm"}
                              variant={"destructive"}
                              className="mx-2"
                              onClick={()=>deleteComment(comm?.id)}
                            >
                              <Trash2Icon className="w-1 h-1"  />
                            </Button>
                       
                        )}
                      </div>

                      <p className="text-gray-600 mt-1">{comm?.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Page;
