"use client";
import { Menu, SquareDashed, X } from "lucide-react";
import { blogCategory } from "@/app/blog/new/page";
import { useAppContext } from "@/app/context/appContext";
import { useEffect, useState } from "react";

type SidebarProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const { searchQuery, setSearchQuery, setCategory } = useAppContext();
  const [localSearch ,setLocalSearch] = useState(searchQuery)
  useEffect(()=>{
    const debounce = setTimeout(()=>{
   setSearchQuery(localSearch)
    },1000);
    return()=>clearTimeout(debounce)
  },[localSearch])
  return (
    <>
      {/* Mobile Top Navbar */}
      <div className="bg-white md:hidden flex items-center justify-between px-4 py-3">
        <button onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-100 transform transition-transform duration-300 z-40 border-r border-4 ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:h-screen`}
      >
        <div className="p-2 text-xl text-gray-500 border-gray-700 hidden md:block">
          Search
        </div>
        <nav className="flex flex-col p-4 gap-3">
          <input
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            type="text"
            placeholder="Search your desired blog"
            className="py-2 px-2 rounded-md border border-gray-300 -mt-3"
          />

          <div>
            <h2 className="text-gray-700">Categories</h2>
          </div>
          {blogCategory?.map((category, index) => (
            <button
              onClick={() => setCategory(category)}
              key={index}
              className="hover:bg-gray-300 px-3 py-2 rounded flex gap-1 text-gray-700"
            >
              <SquareDashed /> {category}
            </button>
          ))}
        </nav>
      </div>

      {/* Overlay for mobile */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-white mt-16 bg-opacity-50 md:hidden z-30"
        />
      )}
    </>
  );
}
