'use client';

import Link from 'next/link';
import Image from 'next/image';
import AuthDropdown from './AuthDropdown';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-gradient-to-r from-blue-900/95 to-indigo-900/95 backdrop-blur-md shadow-lg' 
        : 'bg-gradient-to-r from-blue-600 to-indigo-600'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center space-x-2 group"
            >
              <div className="relative w-10 h-10 transition-transform duration-300 group-hover:scale-110">
                <Image 
                  src="/logo-resume.svg" 
                  alt="Logo" 
                  fill 
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-bold text-white 
                transition-all duration-300 group-hover:text-blue-200">
                AI Resume Analyzer
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link 
              href="/" 
              className="relative text-white/90 hover:text-white px-3 py-2 text-base font-medium 
                transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-0.5 
                after:w-0 after:bg-white after:transition-all after:duration-300 
                hover:after:w-full"
            >
              Home
            </Link>
            <Link 
              href="/dashboard" 
              className="relative text-white/90 hover:text-white px-3 py-2 text-base font-medium 
                transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-0.5 
                after:w-0 after:bg-white after:transition-all after:duration-300 
                hover:after:w-full"
            >
              Dashboard
            </Link>
            <Link 
              href="/about" 
              className="relative text-white/90 hover:text-white px-3 py-2 text-base font-medium 
                transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-0.5 
                after:w-0 after:bg-white after:transition-all after:duration-300 
                hover:after:w-full"
            >
              About Us
            </Link>
            <Link 
              href="/contact" 
              className="relative text-white/90 hover:text-white px-3 py-2 text-base font-medium 
                transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-0.5 
                after:w-0 after:bg-white after:transition-all after:duration-300 
                hover:after:w-full"
            >
              Contact Us
            </Link>
            <div className="ml-4">
              <AuthDropdown />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 