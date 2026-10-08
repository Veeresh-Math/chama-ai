"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import { Mail, Lock, ArrowRight, CheckCircle, AlertCircle, Zap, Shield, KeyRound } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [remaining, setRemaining] = useState(60);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" }
      );

      gsap.fromTo(
        ".form-step",
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
    }, cardRef);

    return () => ctx.revert();
  }, []);

  const validateEmail = (value: string) => {
    if (!value.trim()) return "Email address is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateEmail(email);
    if (error) {
      setErrors(error);
      return;
    }

    setErrors("");
    setIsSubmitting(true);

    // Simulate API call to send reset email
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSuccess(true);
    setRemaining(60);

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    if (resendDisabled) return;
    await handleEmailSubmit({ preventDefault: () => {} } as React.FormEvent);
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
            <h1 className="text-3xl font-bold mb-2">Reset your password</h1>
            <p className="text-gray-400">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between max-w-xs mx-auto">
              <div
                className={`flex-1 h-1 rounded-full transition-colors ${
                  success ? "bg-paypalBlue" : "bg-white/10"
                }`}
              />
              <div
                className={`flex-1 mx-4 h-1 rounded-full transition-colors ${
                  success ? "bg-green-500" : "bg-white/10"
                }`}
              />
            </div>
            <div className="flex justify-between max-w-xs mx-auto mt-2 text-xs">
              <span
                className={`transition-colors ${
                  success ? "text-paypalBlue font-medium" : "text-gray-500"
                }`}
              >
                1. Enter Email
              </span>
              <span
                className={`transition-colors ${
                  success ? "text-green-500" : "text-gray-500"
                }`}
              >
                2. Verify Code
              </span>
            </div>
          </div>

          {!success ? (
            <form onSubmit={handleEmailSubmit} className="space-y-5" noValidate>
              <div className="form-step">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-paypalBlue/20 to-electricViolet/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Mail size={32} className="text-paypalBlue" />
                  </div>
                </div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2 text-center">
                  Enter your email address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors) setErrors("");
                    }}
                    className={`w-full px-4 py-3.5 pl-12 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-paypalBlue transition-all ${
                      errors ? "border-red-500" : "border-white/10"
                    }`}
                    placeholder="you@example.com"
                    disabled={isSubmitting}
                  />
                  <Mail
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                </div>
                {errors && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1 justify-center">
                    <AlertCircle size={14} /> {errors}
                  </p>
                )}
              </div>

              <p className="form-step text-sm text-gray-400 text-center">
                We'll send you a secure 6-digit code to verify your identity before
                resetting your password.
              </p>

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
                    Sending code...
                  </>
                ) : (
                  <>
                    Send Reset Code
                    <ArrowRight size={20} className="inline-block ml-2" />
                  </>
                )}
              </button>

              <p className="form-step text-center text-sm text-gray-400 mt-4">
                Remember your password?{" "}
                <Link
                  href="/login"
                  className="text-paypalBlue font-medium hover:underline"
                >
                  Sign in instead
                </Link>
              </p>
            </form>
          ) : (
            <div className="text-center form-step space-y-6 py-6">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={40} className="text-green-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Check your email</h3>
                <p className="text-gray-400">
                  We've sent a 6-digit verification code to{" "}
                  <span className="text-white font-medium">{email}</span>
                </p>
              </div>
              <p className="text-sm text-gray-500">
                Didn't receive the email?{" "}
                <button
                  onClick={handleResend}
                  disabled={resendDisabled}
                  className={`font-medium ${
                    resendDisabled
                      ? "text-gray-500 cursor-not-allowed"
                      : "text-paypalBlue hover:underline"
                  }`}
                >
                  {resendDisabled ? `Resend in ${remaining}s` : "Resend"}
                </button>
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
              >
                <ArrowRight size={16} className="rotate-180" />
                Back to sign in
              </Link>
            </div>
          )}

          <div className="mt-8">
            <div className="flex items-center gap-4 text-xs text-gray-500 justify-center">
              <div className="flex items-center gap-1">
                <Shield size={12} />
                <span>Encrypted & secure</span>
              </div>
              <div className="flex items-center gap-1">
                <KeyRound size={12} />
                <span>Never share your code</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
