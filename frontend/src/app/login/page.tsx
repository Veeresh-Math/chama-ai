"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import { Mail, Lock, User, Eye, EyeOff, CheckCircle, AlertCircle, Zap, Globe, Shield, Users, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDemoMode, setShowDemoMode] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" }
      );

      gsap.fromTo(
        ".form-field",
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.3,
          ease: "power3.out",
        }
      );

      gsap.fromTo(
        ".submit-btn",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.8, ease: "power3.out" }
      );

      gsap.fromTo(
        ".auth-options",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.9, ease: "power3.out" }
      );
    }, cardRef);

    return () => ctx.revert();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // For demo purposes, if using demo credentials, go to dashboard
    if (formData.email === "demo@paypalaihub.com" && formData.password === "demo123") {
      setIsSubmitting(false);
      router.push("/dashboard");
    } else {
      // In a real app, this would be an actual API call
      // For now, we'll just show a generic error after delay
      setIsSubmitting(false);
      setErrors({ email: "Invalid email or password" });
    }
  };

  const handleGoogleSignIn = () => {
    // Would trigger Google OAuth flow
    alert("Google Sign-In would trigger OAuth flow in production");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6 py-12" ref={formRef}>
      <div className="w-full max-w-md">
        <div className="glass-card p-8 md:p-10 rounded-3xl" ref={cardRef}>
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-paypalBlue to-electricViolet rounded-2xl flex items-center justify-center">
                <Zap size={20} className="text-white" />
              </div>
            </Link>
            <h1 className="text-3xl font-bold mb-2">Sign in to your account</h1>
            <p className="text-gray-400">Access your communities, contracts, and AI copilot</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="form-field">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3.5 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-paypalBlue transition-all ${
                    errors.email ? "border-red-500" : "border-white/10"
                  }`}
                  placeholder="you@example.com"
                  disabled={isSubmitting}
                  autoComplete="username"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.email}
                </p>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-3.5 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-paypalBlue transition-all ${
                    errors.password ? "border-red-500" : "border-white/10"
                  }`}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="submit-btn w-full py-3.5 bg-gradient-to-r from-paypalBlue to-electricViolet rounded-xl font-semibold text-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={20} className="inline-block ml-2" />
                </>
              )}
            </button>

            <p className="auth-options text-center text-sm text-gray-400 mt-6">
              Or continue with
            </p>
            <div className="flex justify-center mt-4 space-x-3">
              <button
                onClick={handleGoogleSignIn}
                className="w-12 h-12 bg-white/10 border rounded-xl flex items-center justify-center hover:bg-white/20 transition-all text-gray-300 hover:text-white"
              >
                <Users size={24} />
              </button>
              <button
                onClick={() => setShowDemoMode(true)}
                className="w-12 h-12 bg-white/10 border rounded-xl flex items-center justify-center hover:bg-white/20 transition-all text-gray-300 hover:text-white"
              >
                <Globe size={24} className="text-paypalBlue" />
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="border-t border-white/10 pt-6">
              <p className="text-center text-sm text-gray-400">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="text-paypalBlue font-medium hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-gray-500">
            <p>Demo credentials: demo@paypalaihub.com / demo123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
