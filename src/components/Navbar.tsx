'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 text-2xl font-bold text-gray-800 hover:scale-105 transition-transform duration-200">
              <Image src="/logo-resume.svg" alt="Logo" width={32} height={32} />
              <span>AI Resume Analyzer</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium hover:scale-110 transition-transform duration-200">
              Home
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium hover:scale-110 transition-transform duration-200">
              Dashboard
            </Link>
            <Link href="/signin" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium hover:scale-110 transition-transform duration-200">
              Sign In
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium hover:scale-110 transition-transform duration-200">
              About Us
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium hover:scale-110 transition-transform duration-200">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 