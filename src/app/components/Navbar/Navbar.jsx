"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-green-800 via-cyan-700 to-blue-800 shadow-lg lg:max-w-[1200px] mx-auto my-6  rounded-lg p-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-white font-bold text-lg">
              Pi Foundation
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-6 flex text-lg items-center space-x-2">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/about">About</NavLink>
              <NavLink href="/photos">Photos</NavLink>
              <NavLink href="/events">Events</NavLink>
              <NavLink href="/donate">Donate</NavLink>
              <NavLink href="/contact">Contact</NavLink>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-1 rounded-md text-white hover:text-white hover:bg-opacity-30 hover:bg-white focus:outline-none"
            >
              <svg
                className={`${isOpen ? "hidden" : "block"} h-5 w-5`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isOpen ? "block" : "hidden"} h-5 w-5`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-2 space-y-1 sm:px-3">
          <MobileNavLink href="/">Home</MobileNavLink>
          <MobileNavLink href="/about">About</MobileNavLink>
          <MobileNavLink href="/photos">Photos</MobileNavLink>
          <MobileNavLink href="/events">Events</MobileNavLink>
          <MobileNavLink href="/donate">Donate</MobileNavLink>
          <MobileNavLink href="/contact">Contact</MobileNavLink>
        </div>
      </div>
    </nav>
  );
}

// Reusable NavLink component for desktop
function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="px-2 py-1 rounded-md text-xl font-medium text-white hover:bg-opacity-30 hover:bg-white hover:text-slate-950 transition duration-300"
    >
      {children}
    </Link>
  );
}

// Reusable NavLink component for mobile
function MobileNavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="block px-3 py-1 rounded-md text-sm font-medium text-white hover:bg-opacity-30 hover:bg-white"
    >
      {children}
    </Link>
  );
}
