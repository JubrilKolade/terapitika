'use client';

import { motion } from 'framer-motion';
import { Mail, Clock } from 'lucide-react';

export function TranscriptMockup({ className }: { className?: string }) {
    const lines = [
        "Analyzing user emotional state...",
        "Detected: Mild Anxiety, Stress.",
        "Suggested: Deep breathing exercise.",
        "Connecting to calming soundscape...",
    ];

    return (
        <div className={`w-80 rounded-2xl bg-[#0A0A0F]/80 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl ${className}`}>
            <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between bg-white/5">
                <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-therapy-400" />
                    <span className="text-xs font-medium text-gray-400">Analysis Feed</span>
                </div>
            </div>
            <div className="p-4 space-y-3 font-mono text-[10px]">
                {lines.map((line, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.5 }}
                        className="flex items-start space-x-3 text-gray-400"
                    >
                        <span className="text-therapy-500/50">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}]</span>
                        <span className={i === 2 ? 'text-therapy-300' : ''}>{line}</span>
                    </motion.div>
                ))}
                <motion.div
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-1.5 h-3 bg-therapy-500/50"
                />
            </div>
        </div>
    );
}

export function MailMockup({ className }: { className?: string }) {
    return (
        <div className={`w-80 rounded-2xl bg-[#0A0A0F]/80 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl ${className}`}>
            <div className="px-4 py-3 border-b border-white/5 flex items-center space-x-2 bg-white/5">
                <Mail className="w-3.5 h-3.5 text-calm-400" />
                <span className="text-xs font-medium text-gray-400">Subject: Session Link</span>
            </div>
            <div className="p-4 space-y-3">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-therapy-500 to-calm-600 flex items-center justify-center text-[10px] font-bold">T</div>
                    <div>
                        <div className="text-[11px] font-semibold text-gray-200">Terapitika Team</div>
                        <div className="text-[9px] text-gray-500">to alex@user.com</div>
                    </div>
                </div>
                <div className="space-y-2 pt-2">
                    <div className="h-2 w-full bg-white/5 rounded" />
                    <div className="h-2 w-3/4 bg-white/5 rounded" />
                    <div className="h-8 w-full bg-therapy-500/20 border border-therapy-500/30 rounded-lg flex items-center justify-center text-[10px] text-therapy-300 font-medium">
                        Join Session
                    </div>
                </div>
            </div>
        </div>
    );
}
