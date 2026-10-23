'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, AlertCircle, CheckCircle2, Loader2, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

type LogEntry = {
  agent: string;
  verdict: string;
  reason: string;
  status: 'complete' | 'final';
};

type CouncilTerminalProps = {
  streamUrl: string;
  onComplete: (result: 'approved' | 'rejected') => void;
  onClose: () => void;
};

export default function CouncilTerminal({ streamUrl, onComplete, onClose }: CouncilTerminalProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const startStreaming = async () => {
      try {
        const response = await fetch(streamUrl);
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) return;

        let buffer = '';
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          
          // Keep the last incomplete line in the buffer
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.replace('data: ', '');
              try {
                const entry = JSON.parse(data);
                setLogs((prev) => [...prev, entry]);
                if (entry.status === 'final') {
                  setIsProcessing(false);
                  const result = entry.verdict === 'CONSENSUS' ? 'approved' : 'rejected';
                  setTimeout(() => onComplete(result), 1500);
                }
              } catch (e) {
                console.error('Error parsing council stream', e);
              }
            }
          }
        }
      } catch (err) {
        console.error('Council stream error', err);
        setIsProcessing(false);
      }
    };

    startStreaming();
  }, [streamUrl, onComplete]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
    >
      <div className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        {/* Terminal Header */}
        <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Terminal size={18} className="text-paypalBlue" />
            <span className="text-sm font-bold tracking-widest uppercase text-white/70">Agent Council Deliberation</span>
          </div>
          <button 
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Terminal Body */}
        <div 
          ref={scrollRef}
          className="p-6 h-[450px] overflow-y-auto font-mono text-sm space-y-4 bg-black/50"
        >
          {logs.length === 0 && isProcessing && (
            <div className="flex flex-col items-center justify-center h-full text-white/30 space-y-4">
              <Loader2 className="animate-spin" size={32} />
              <p className="animate-pulse">Initializing Agent Council...</p>
            </div>
          )}

          <AnimatePresence>
            {logs.map((log, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "p-4 rounded-2xl border transition-all duration-500",
                  log.agent === 'Council' 
                    ? "bg-white/10 border-white/20 text-white" 
                    : "bg-white/5 border-white/5 text-white/70"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      log.agent === 'Council' ? "bg-white" : "bg-paypalBlue"
                    )} />
                    <span className="font-bold uppercase text-[11px] tracking-wider opacity-50">{log.agent} Agent</span>
                  </div>
                  <div className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full",
                    log.verdict === 'APPROVE' || log.verdict === 'CONSENSUS' 
                      ? "bg-emerald-500/20 text-emerald-400" 
                      : "bg-red-500/20 text-red-400"
                  )}>
                    {log.verdict}
                  </div>
                </div>
                <p className="leading-relaxed">{log.reason}</p>
              </motion.div>
            ))}
          </AnimatePresence>

          {isProcessing && (
            <div className="flex items-center gap-2 text-white/30 italic text-xs">
              <span className="w-1 h-4 bg-paypalBlue animate-bounce" />
              Agent is thinking...
            </div>
          )}
        </div>

        {/* Terminal Footer */}
        <div className="px-6 py-4 bg-white/5 border-t border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-2 text-[11px] text-white/40">
            <ShieldCheck size={14} />
            <span>Encrypted Consensus Path</span>
          </div>
          {!isProcessing && (
            <div className={cn(
              "flex items-center gap-2 text-xs font-bold",
              logs[logs.length-1]?.verdict === 'CONSENSUS' ? "text-emerald-400" : "text-red-400"
            )}>
              {logs[logs.length-1]?.verdict === 'CONSENSUS' ? (
                <><CheckCircle2 size={14} /> APPROVED</>
              ) : (
                <><AlertCircle size={14} /> REJECTED</>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
