import React, { useState } from "react";
import { motion } from "framer-motion";
import { Users, Zap, ShieldCheck, CreditCard, ArrowRight, Activity, Lock, Globe } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("community");

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-12 max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Control Hub</h1>
          <p className="text-gray-400">Agentic Commerce Management</p>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-medium flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Council Online
          </div>
          <Button variant="outline" size="sm">Settings</Button>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-12">
        <div className="bg-white/5 p-1 rounded-2xl border border-white/10 flex gap-1">
          {["community", "gig", "copilot", "analytics"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab ? "bg-paypalBlue text-white shadow-lg" : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <main className="max-w-7xl mx-auto">
        {activeTab === "community" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Add New Community */}
            <Card className="md:col-span-1 h-fit">
              <CardHeader>
                <CardTitle>New Community</CardTitle>
                <CardDescription>Establish a trust-based savings circle.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs text-gray-400">Community Name</label>
                  <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-paypalBlue transition-all" placeholder="e.g. Nairobi Tech Collective" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400">Contribution (USD)</label>
                  <input type="number" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-paypalBlue transition-all" placeholder="100" />
                </div>
                <Button className="w-full">Deploy Community</Button>
              </CardContent>
            </Card>

            {/* Active Communities */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Users size={20} className="text-paypalBlue" /> Active Circles
              </h3>
              {[1, 2].map((i) => (
                <motion.div key={i} whileHover={{ x: 5 }} className="glass-card p-6 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-lg">Community #{i}</h4>
                    <div className="flex gap-3 mt-1">
                      <span className="text-xs text-gray-400">Members: 12</span>
                      <span className="text-xs text-blue-400 font-medium">Trust Score: 88/100</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Pool Value</div>
                      <div className="text-xl font-bold">$1,200.00</div>
                    </div>
                    <Button variant="outline" size="sm">Distribute</Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "gig" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1 h-fit">
              <CardHeader>
                <CardTitle>New Contract</CardTitle>
                <CardDescription>Deploy milestone-based escrow.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm" placeholder="Job Title" />
                <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm" placeholder="Client Email" />
                <input type="number" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm" placeholder="Budget" />
                <Button className="w-full">Deploy Contract</Button>
              </CardContent>
            </Card>
            <div className="md:col-span-2 space-y-4">
               <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Zap size={20} className="text-blue-500" /> Active Gigs
              </h3>
              <div className="glass-card p-6">
                <div className="flex justify-between mb-6">
                  <h4 className="font-bold text-lg">UI/UX Redesign</h4>
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">In Progress</span>
                </div>
                <div className="space-y-3">
                  {["First Draft", "Client Review", "Final Handover"].map((m, idx) => (
                    <div key={m} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                      <span className="text-sm text-gray-300">{m}</span>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${idx < 1 ? "bg-green-500" : "bg-gray-600"}`} />
                        <span className="text-xs text-gray-500">{idx < 1 ? "Verified" : "Pending"}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-between items-center pt-6 border-t border-white/10">
                  <div className="text-sm text-gray-400">Total Budget: <span className="text-white font-bold">$2,500</span></div>
                  <Button variant="outline" size="sm">Force Payout</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "copilot" && (
          <div className="max-w-3xl mx-auto h-[600px] flex flex-col glass-card overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-white/5">
              <Activity size={20} className="text-paypalBlue" />
              <span className="font-bold">Financial Copilot</span>
              <span className="ml-auto text-[10px] text-gray-500 uppercase tracking-widest">Agentic Analysis Active</span>
            </div>
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
               <div className="flex gap-3">
                 <div className="w-8 h-8 bg-paypalBlue rounded-full flex items-center justify-center text-xs font-bold">AI</div>
                 <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none max-w-[80%] text-sm">
                   Hello. I've analyzed your treasury. Your gig income is up 12% this month. Would you like me to move $200 to your Community Savings pool?
                 </div>
               </div>
            </div>
            <div className="p-4 bg-white/5 border-t border-white/10">
              <div className="relative">
                <input className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-6 pr-12 text-sm focus:outline-none focus:border-paypalBlue transition-all" placeholder="Ask your copilot..." />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-paypalBlue rounded-full text-white">
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-paypalBlue/20 to-transparent">
              <CardHeader>
                <CardTitle className="text-sm text-gray-400">Total Volume</CardTitle>
                <div className="text-3xl font-bold">$42,500.00</div>
              </CardHeader>
            </Card>
            <Card className="bg-gradient-to-br from-electricViolet/20 to-transparent">
              <CardHeader>
                <CardTitle className="text-sm text-gray-400">Trust Average</CardTitle>
                <div className="text-3xl font-bold">84.2%</div>
              </CardHeader>
            </Card>
            <Card className="bg-gradient-to-br from-green-500/20 to-transparent">
              <CardHeader>
                <CardTitle className="text-sm text-gray-400">Settle Rate</CardTitle>
                <div className="text-3xl font-bold">98.1%</div>
              </CardHeader>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
