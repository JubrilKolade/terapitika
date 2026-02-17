'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Brain, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-0 w-full z-50 bg-[#0A0A0F]/60 backdrop-blur-2xl border-b border-white/5"
        >
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-center h-20">
                    {/* Logo Left */}
                    <Link href="/" className="flex items-center space-x-3 group min-w-[200px]">
                        <div className="w-10 h-10 bg-gradient-to-br from-therapy-500 to-calm-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Brain className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-display font-bold tracking-tight text-white/90">
                            Terapitika
                        </span>
                    </Link>

                    {/* Menu Center */}
                    <div className="hidden lg:flex items-center bg-white/5 border border-white/5 rounded-full px-2 py-1">
                        {['Home', 'Platform', 'Therapists', 'Resources', 'Pricing'].map((item) => (
                            <Link
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                className="px-5 py-2 text-[13px] font-medium text-gray-400 hover:text-white transition-colors uppercase tracking-wider"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>

                    {/* Actions Right */}
                    <div className="hidden lg:flex items-center justify-end space-x-4 min-w-[200px]">
                        <Link href="/login" className="text-[13px] font-bold text-gray-400 hover:text-white tracking-widest uppercase transition-colors">
                            SIGN IN
                        </Link>
                        <Link href="/register">
                            <Button className="bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg text-[11px] font-bold tracking-widest uppercase px-6 h-10">
                                Join Now
                            </Button>
                        </Link>
                    </div>

                    <button
                        className="lg:hidden p-2 text-white/50 hover:text-white transition-colors"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <motion.div
                initial={{ opacity: 0, x: '100%' }}
                animate={{ opacity: mobileMenuOpen ? 1 : 0, x: mobileMenuOpen ? 0 : '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-0 z-[60] bg-[#0A0A0F]/95 backdrop-blur-2xl lg:hidden"
            >
                <div className="flex flex-col h-full p-8">
                    <div className="flex justify-between items-center mb-12">
                        <Link href="/" className="flex items-center space-x-3" onClick={() => setMobileMenuOpen(false)}>
                            <div className="w-10 h-10 bg-gradient-to-br from-therapy-500 to-calm-600 rounded-xl flex items-center justify-center">
                                <Brain className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-display font-bold">Terapitika</span>
                        </Link>
                        <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-white/50 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex flex-col space-y-6">
                        {['Home', 'Platform', 'Therapists', 'Resources', 'Pricing'].map((item) => (
                            <Link
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-2xl font-display font-bold text-gray-400 hover:text-white transition-colors"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>

                    <div className="mt-auto space-y-4">
                        <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block text-center py-4 rounded-xl border border-white/10 font-bold text-gray-400">
                            SIGN IN
                        </Link>
                        <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="block text-center py-4 rounded-xl bg-gradient-to-r from-therapy-500 to-calm-500 font-bold text-white">
                            JOIN NOW
                        </Link>
                    </div>
                </div>
            </motion.div>
        </motion.nav>
    );
}
