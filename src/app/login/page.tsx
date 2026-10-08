import React from 'react';
import { Link } from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold">Login</h1>
      <Link href="/login" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Log In
      </Link>
    </div>
  );
}