'use client';

import { motion } from 'framer-motion';

interface ChatMockupProps {
    className?: string;
    messages?: { role: 'ai' | 'user'; text: string; delay?: number }[];
}

export function ChatMockup({ className, messages = [
    { role: 'ai', text: 'Hi Andrew, welcome back! How can I assist you today?', delay: 0 },
    { role: 'user', text: "I'd like to update my subscription.", delay: 1 },
] }: ChatMockupProps) {
    return (
        <div className={`w-80 rounded-2xl bg-[#0A0A0F]/80 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl ${className}`}>
            <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between bg-white/5">
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs font-medium text-gray-400">AI Agent</span>
                </div>
                <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                </div>
            </div>
            <div className="p-4 space-y-4">
                {messages.map((msg, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: msg.role === 'ai' ? -10 : 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: msg.delay || 0 }}
                        className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}
                    >
                        <div className={`max-w-[80%] rounded-xl px-3 py-2 text-[11px] leading-relaxed ${msg.role === 'ai'
                                ? 'bg-white/5 text-gray-300 rounded-tl-none border border-white/5'
                                : 'bg-therapy-500/20 text-therapy-300 rounded-tr-none border border-therapy-500/20'
                            }`}>
                            {msg.text}
                        </div>
                    </motion.div>
                ))}
                <div className="pt-2 flex items-center space-x-2">
                    <div className="flex-1 h-7 rounded-lg bg-white/5 border border-white/5" />
                    <div className="w-7 h-7 rounded-lg bg-therapy-500/20 border border-therapy-500/20" />
                </div>
            </div>
        </div>
    );
}
