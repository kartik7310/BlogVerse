"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { userServiceUrl, User } from "@/app/context/appContext";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { useParams } from "next/navigation";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Loading from "@/components/Loading";

const UserProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const params = useParams();
  const id = params?.id?.toString(); // ⬅️ safer parsing

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data } = await axios.get(`${userServiceUrl}/api/v1/user/${id}`);
        setUser(data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    }

    if (id) fetchUser();
  }, [id]);

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-xl shadow-lg border rounded-2xl p-6">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">Profile</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center space-y-4">
          <Avatar className="w-28 h-28 border-4 border-gray-200 shadow-md">
            <AvatarImage src={user.image} alt="profile" />
            <AvatarFallback>
              {user.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="w-full space-y-2 text-center">
            <label className="font-medium">Name</label>
            <p>{user.name}</p>
          </div>

          {user.bio && (
            <div className="w-full space-y-2 text-center">
              <label className="font-medium">Bio</label>
              <p>{user.bio}</p>
            </div>
          )}

          <div className="flex gap-4 mt-3">
            {user.instagram && (
              <a
                href={user.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="text-pink-500 w-6 h-6 hover:scale-110 transition-transform" />
              </a>
            )}
            {user.facebook && (
              <a
                href={user.facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="text-blue-500 w-6 h-6 hover:scale-110 transition-transform" />
              </a>
            )}
            {user.linkedin && (
              <a
                href={user.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="text-blue-700 w-6 h-6 hover:scale-110 transition-transform" />
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfilePage;
