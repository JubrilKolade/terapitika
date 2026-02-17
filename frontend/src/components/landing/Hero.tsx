'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatMockup } from '@/components/mockups/ChatMockup';
import { TranscriptMockup, MailMockup } from '@/components/mockups/VisualMockups';
import RotatingEarth from '@/components/mockups/rotating-earth';

export function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <motion.div className="text-center space-y-8">
                    <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30 pointer-events-none">
                        <RotatingEarth width={900} height={900} className="scale-125" />
                    </div>

                    {/* Floating Mockups */}
                    <div className="absolute inset-0 pointer-events-none z-10 hidden xl:block">
                        <motion.div
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="absolute left-[5%] top-[25%]"
                        >
                            <ChatMockup className="scale-90 rotate-[-2deg]" />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7, duration: 1 }}
                            className="absolute right-[5%] top-[35%]"
                        >
                            <TranscriptMockup className="scale-90 rotate-[2deg]" />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9, duration: 1 }}
                            className="absolute left-[15%] bottom-[15%]"
                        >
                            <MailMockup className="scale-75 rotate-[5deg]" />
                        </motion.div>
                    </div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-6xl sm:text-7xl lg:text-8xl font-display font-bold leading-tight"
                    >
                        <span className="block">Mental Health</span>
                        <span className="block bg-gradient-to-r from-therapy-400 via-calm-400 to-therapy-400 bg-clip-text text-transparent">
                            Reimagined
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
                    >
                        Experience the future of therapy. Connect with licensed professionals
                        or chat with our AI companion. Available 24/7, always private.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link href="/register">
                            <Button size="lg" className="group bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 text-white px-8 py-6 text-lg shadow-2xl shadow-therapy-500/50">
                                <span className="flex items-center">
                                    Start Free Chat
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Button>
                        </Link>
                        <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg backdrop-blur-xl">
                            <Play className="mr-2 w-5 h-5" />
                            Watch Demo
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-16"
                    >
                        {[
                            { value: '10K+', label: 'Active Users' },
                            { value: '500+', label: 'Therapists' },
                            { value: '24/7', label: 'AI Support' },
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="text-3xl sm:text-4xl font-display font-bold bg-gradient-to-r from-therapy-400 to-calm-400 bg-clip-text text-transparent">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
