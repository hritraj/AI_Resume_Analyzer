"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('All fields are required.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      
      if (res.ok) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify({
          username: data.username,
          email: data.email
        }));
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        setError(data.message || 'Sign in failed.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600">
      <div className="w-full max-w-md px-4">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-xl">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Welcome Back</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium
              hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              transition-all duration-300 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link 
              href="/signup" 
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
} 