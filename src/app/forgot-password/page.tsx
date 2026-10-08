import React from 'react';
import { Link } from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold">Forgot Password</h1>
      <Link href="/forgot-password" className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
        Reset Password
      </Link>
    </div>
  );
}