'use client'

import Image from 'next/image'
import Link from 'next/link'
import { CircleUserRound, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAppContext } from '@/app/context/appContext'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { isAuth } = useAppContext()
  console.log("user is here",isAuth);
  
  // Close mobile menu after navigation
  const handleNavigate = () => setOpen(false)

  return (
    <nav className="fixed inset-x-0 top-0 z-20 border-b border-gray-200 bg-white text-gray-900 shadow-sm">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/home" onClick={handleNavigate} className="flex items-center gap-2">
          <Image
            src="https://flowbite.com/docs/images/logo.svg"
            width={32}
            height={32}
            alt="TrendUI logo"
            priority
          />
          <span className="text-2xl font-bold text-blue-500">BlogVerse</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4 md:order-2">
          {isAuth ? (
            <Link href="/profile" onClick={handleNavigate} aria-label="Profile">
              <CircleUserRound className="h-8 w-8 text-gray-800 transition-colors hover:text-indigo-500" />
            </Link>
          ) : (
            <Link href="/login" onClick={handleNavigate}>
              <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:border-indigo-500 hover:text-indigo-500">
                Sign In
              </button>
            </Link>
          )}

          {/* Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            aria-controls="primary-navigation"
            aria-expanded={open}
            aria-label="Toggle navigation menu"
            className="md:hidden"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Menu items */}
        <ul
          id="primary-navigation"
          className={`${
            open ? 'flex' : 'hidden'
          } absolute left-0 right-0 top-full flex-col bg-white p-4 md:static md:flex md:flex-row md:items-center md:gap-8 md:p-0`}
        >
          {[
            { href: '/home', label: 'Home' },
            { href: '/about', label: 'About' },
            { href: '/savedBlog', label: 'Saved Blogs' },
          ].map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={handleNavigate}
                className="block rounded px-3 py-2 font-medium text-gray-800 transition-colors duration-200 hover:text-indigo-500"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
