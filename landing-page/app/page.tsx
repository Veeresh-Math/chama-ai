import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, Globe, Users, CreditCard, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen text-white font-sans selection:bg-paypalBlue/30 bg-[#050505]">
      {/* --- NAV --- */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 py-6 backdrop-blur-md bg-black/20 border-b border-white/5">
        <div className="text-xl font-bold tracking-tight flex items-center gap-2">
          <div className="w-7 h-7 bg-paypalBlue rounded flex items-center justify-center font-black text-[10px] text-white">AI</div>
          <span>Chama<span className="text-blue-400">AI</span></span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
          <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
          <a href="#features" className="hover:text-white transition-colors">Tools</a>
          <a href="#impact" className="hover:text-white transition-colors">Impact</a>
        </div>
        <button className="px-4 py-2 bg-white text-black rounded-full text-xs font-bold hover:bg-gray-200 transition-all">
          Open Hub
        </button>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-40 pb-24 px-8 flex flex-col items-center text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-paypalBlue/10 rounded-full blur-[120px] -z-10" />

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-8">
            Payments that trigger <br />
            <span className="text-blue-400">themselves.</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            ChamaAI uses autonomous agents to verify milestones, check community trust, and send PayPal payouts. No manual invoices, no chasing clients, no waiting for approval.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-paypalBlue text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition-all">
              Try the Demo <ArrowRight size={20} />
            </button>
            <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-colors">
              View Github
            </button>
          </div>
        </motion.div>
      </section>

      {/* --- BENTO GRID FEATURES --- */}
      <section id="features" className="py-24 px-8 max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-4">Built for autonomous finance</h2>
          <p className="text-gray-400">Tools to handle money movement without manual intervention.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Feature */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="md:col-span-2 bg-white/[0.03] border border-white/10 p-8 rounded-3xl flex flex-col justify-between h-[400px] relative overflow-hidden group"
          >
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-paypalBlue/10 rounded-full blur-3xl group-hover:bg-paypalBlue/20 transition-all" />
            <div>
              <div className="w-10 h-10 bg-paypalBlue rounded-lg flex items-center justify-center mb-6 text-white">
                <Users size={20} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Community Savings Circles</h3>
              <p className="text-gray-400 text-lg max-w-md leading-relaxed">
                We digitize the Chama experience. AI agents track contribution history to generate trust scores, automating payouts to members who meet community requirements.
              </p>
            </div>
            <div className="flex gap-3">
              <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-400 border border-white/10">Automated Payouts</span>
              <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-400 border border-white/10">Social Credit</span>
            </div>
          </motion.div>

          {/* Gig Feature */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white/[0.03] border border-white/10 p-8 rounded-3xl flex flex-col justify-between h-[400px] relative overflow-hidden group"
          >
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
            <div>
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mb-6 text-white">
                <Zap size={20} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Gig Worker Escrow</h3>
              <p className="text-gray-400 leading-relaxed">
                AI agents track project milestones. When the work is verified, the payment is released from escrow to your PayPal account instantly.
              </p>
            </div>
            <div className="text-blue-400 font-mono text-sm font-medium">
              Verified &rarr; Paid
            </div>
          </motion.div>

          {/* Agent Council */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white/[0.03] border border-white/10 p-8 rounded-3xl flex flex-col justify-between h-[300px]"
          >
            <div>
              <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center mb-6 text-white">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-xl font-bold mb-4">The Agent Council</h3>
              <p className="text-gray-400 leading-relaxed">
                Three independent agents—Trust, Compliance, and Treasury—must all confirm a transaction before money moves.
              </p>
            </div>
          </motion.div>

          {/* PYUSD */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white/[0.03] border border-white/10 p-8 rounded-3xl flex flex-col justify-between h-[300px]"
          >
            <div>
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mb-6 text-white">
                <CreditCard size={20} />
              </div>
              <h3 className="text-xl font-bold mb-4">PYUSD Stablecoin</h3>
              <p className="text-gray-400 leading-relaxed">
                Using PayPal USD to ensure zero-volatility for community vaults and instant global settlement.
              </p>
            </div>
          </motion.div>

          {/* Financial Inclusion */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white/[0.03] border border-white/10 p-8 rounded-3xl flex flex-col justify-between h-[300px] bg-gradient-to-br from-blue-900/20 to-transparent"
          >
            <div>
              <div className="w-10 h-10 bg-white text-black rounded-lg flex items-center justify-center mb-6 font-bold">
                <Globe size={20} />
              </div>
              <h3 className="text-xl font-bold mb-4">Financial Inclusion</h3>
              <p className="text-gray-400 leading-relaxed">
                Giving the unbanked access to capital by turning community reliability into a verifiable financial asset.
              </p>
            </div>
          </motion.div>
        </div}
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-32 px-8 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-900/10 rounded-full blur-[150px] -z-10" />
        <h2 className="text-4xl font-bold mb-8 tracking-tight">Ready to automate your <br /> community finance?</h2>
        <button className="px-10 py-5 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-transform">
          Get Started
        </button>
      </section>

      <footer className="py-10 px-8 border-t border-white/10 text-center text-gray-500 text-xs">
        © 2026 ChamaAI. Built for the PayPal AI Hackathon.
      </footer}
    </main>
  );
}
