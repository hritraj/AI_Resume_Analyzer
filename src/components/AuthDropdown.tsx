import { useState, useRef } from 'react';
import Link from 'next/link';

export default function AuthDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      className="relative" 
      ref={dropdownRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className="flex items-center gap-2 px-4 py-2 text-white/90 hover:text-white 
          transition-all duration-300 rounded-lg hover:bg-white/10 group"
      >
        <span className="font-medium">Sign In / Sign Up</span>
        <svg
          className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} 
            group-hover:text-white`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50
          transform origin-top-right transition-all duration-300 ease-out
          animate-in fade-in slide-in-from-top-2">
          <Link
            href="/signin"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 
              transition-all duration-300 group"
          >
            <svg
              className="w-5 h-5 mr-2 text-gray-400 group-hover:text-blue-600 transition-colors duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            Sign In
          </Link>
          <Link
            href="/signup"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 
              transition-all duration-300 group"
          >
            <svg
              className="w-5 h-5 mr-2 text-gray-400 group-hover:text-blue-600 transition-colors duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            Sign Up
          </Link>
        </div>
      )}
    </div>
  );
} 