'use client';

import { motion } from 'framer-motion';
import { Video, MessageSquare, Mic, Shield, X, Maximize2, Settings, Send, Paperclip, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/authstore';
import Link from 'next/link';

export default function SessionRoom() {
    const { user } = useAuthStore();

    return (
        <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col">
            {/* Top Bar */}
            <header className="h-16 border-b border-white/10 backdrop-blur-xl bg-[#0A0A0F]/80 flex items-center justify-between px-6 z-50">
                <div className="flex items-center space-x-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon" className="hover:bg-white/10">
                            <X size={20} />
                        </Button>
                    </Link>
                    <div className="h-8 w-px bg-white/10 mx-2" />
                    <div>
                        <div className="font-bold flex items-center">
                            Session with <span className="text-therapy-400 ml-1">Dr. Sarah Johnson</span>
                            <Shield size={14} className="ml-2 text-green-400" />
                        </div>
                        <div className="text-xs text-gray-500 flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                            Encrypted Session (42:15 remaining)
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:bg-white/10"><Settings size={18} /></Button>
                    <Button className="bg-red-500 hover:bg-red-600 px-4 h-9">End Session</Button>
                </div>
            </header>

            {/* Main Session Area */}
            <main className="flex-1 flex overflow-hidden">
                {/* Video Feed */}
                <div className="flex-1 relative bg-black/40 flex items-center justify-center group">
                    <div className="absolute inset-0 bg-gradient-to-br from-therapy-500/5 to-calm-500/5" />

                    {/* Main Feed Placeholder */}
                    <div className="text-center space-y-4">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-therapy-400 to-calm-400 mx-auto flex items-center justify-center text-3xl font-bold shadow-2xl">
                            S
                        </div>
                        <div className="text-gray-400 font-medium">Waiting for Dr. Sarah Johnson to connect...</div>
                    </div>

                    {/* Self View */}
                    <div className="absolute bottom-6 right-6 w-48 h-32 rounded-xl bg-white/5 border border-white/20 backdrop-blur-xl overflow-hidden shadow-2xl">
                        <div className="w-full h-full flex items-center justify-center bg-white/5">
                            <div className="w-10 h-10 rounded-full bg-blue-500/50 flex items-center justify-center font-bold">
                                {user?.firstName?.charAt(0)}
                            </div>
                        </div>
                        <div className="absolute bottom-2 left-2 text-[10px] font-bold uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded">You</div>
                    </div>

                    {/* Controls Overlay */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-4 opacity-0 group-hover:opacity-100 transition-all">
                        <div className="flex items-center space-x-3 bg-white/5 border border-white/10 backdrop-blur-2xl p-2 rounded-2xl shadow-2xl">
                            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl bg-white/10 hover:bg-white/20"><Mic size={20} /></Button>
                            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl bg-therapy-500 text-white hover:bg-therapy-600"><Video size={20} /></Button>
                            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl bg-white/10 hover:bg-white/20"><Maximize2 size={20} /></Button>
                        </div>
                    </div>
                </div>

                {/* Chat Sidebar */}
                <div className="w-80 border-l border-white/10 bg-[#0A0A0F]/50 flex flex-col backdrop-blur-xl">
                    <div className="p-4 border-b border-white/10 font-bold flex items-center text-sm">
                        <MessageSquare size={16} className="mr-2 text-therapy-400" />
                        Session Chat
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-2 opacity-50">
                            <MessageSquare size={32} className="text-gray-600" />
                            <div className="text-sm text-gray-500">Messages will appear here</div>
                        </div>
                    </div>
                    <div className="p-4 bg-[#0A0A0F]/80">
                        <div className="relative">
                            <Input
                                placeholder="Type a message..."
                                className="bg-white/5 border-white/10 pr-20 h-11 text-sm focus:ring-therapy-500/30"
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-white"><Paperclip size={16} /></Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-therapy-400 hover:bg-therapy-500/20"><Send size={16} /></Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
