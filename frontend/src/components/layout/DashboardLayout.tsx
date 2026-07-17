'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { Bell, Settings, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authstore';
import { motion } from 'framer-motion';

export function DashboardLayout({
    children,
    type = 'user'
}: {
    children: React.ReactNode;
    type?: 'user' | 'therapist' | 'admin';
}) {
    const { user, logout } = useAuthStore();
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    const settingsPath =
        type === 'admin' ? '/admin/settings'
        : type === 'therapist' ? '/therapist/settings'
        : '/settings';

    return (
        <div className="flex min-h-screen bg-[#0A0A0F] text-white">
            {/* Background Grid */}
            <div className="fixed inset-0 opacity-10 pointer-events-none">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
              linear-gradient(to right, rgba(14, 165, 233, 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
            `,
                        backgroundSize: '40px 40px',
                    }}
                />
            </div>

            <Sidebar type={type} />

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 border-b border-white/10 backdrop-blur-xl bg-[#0A0A0F]/80 sticky top-0 z-50 px-8">
                    <div className="h-full flex justify-between items-center">
                        <div className="md:hidden">
                            {/* Mobile Menu Toggle placeholder */}
                        </div>

                        <div className="flex-1" />

                        <div className="flex items-center space-x-4">
                            <button className="relative p-2 hover:bg-white/5 rounded-lg transition-colors">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-therapy-500 rounded-full animate-pulse" />
                            </button>

                            <div className="h-8 w-px bg-white/10 mx-2" />

                            <div className="flex items-center space-x-3">
                                <div className="text-right hidden sm:block">
                                    <div className="text-sm font-semibold">{user?.firstName} {user?.lastName}</div>
                                    <div className="text-xs text-gray-400 capitalize">{user?.role || type}</div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-therapy-400 to-calm-400 flex items-center justify-center font-bold">
                                    {user?.firstName?.charAt(0)}
                                </div>
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => window.location.href = settingsPath}
                                className="relative hover:bg-white/10"
                            >
                                <Settings className="w-5 h-5" />
                            </Button>

                            <button
                                onClick={logout}
                                className="p-2 hover:bg-white/5 rounded-lg transition-colors text-red-400"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-8">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
