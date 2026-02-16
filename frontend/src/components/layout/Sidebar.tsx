'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain,
    LayoutDashboard,
    Calendar,
    MessageSquare,
    Video,
    Settings,
    Bell,
    LogOut,
    ChevronLeft,
    ChevronRight,
    User,
    Users,
    Shield,
    CreditCard,
    Menu,
    X,
    UserCheck,
    AlertTriangle,
    DollarSign,
    Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authstore';
import { cn } from '@/lib/utils';

interface NavItem {
    label: string;
    href: string;
    icon: React.ElementType;
}

const userNavItems: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Bookings', href: '/bookings', icon: Calendar },
    { label: 'Sessions', href: '/sessions', icon: Video },
    { label: 'Chat', href: '/chat', icon: MessageSquare },
    { label: 'Profile', href: '/profile', icon: User },
    { label: 'Settings', href: '/settings', icon: Settings },
];

const therapistNavItems: NavItem[] = [
    { label: 'Dashboard', href: '/therapist/dashboard', icon: LayoutDashboard },
    { label: 'Schedule', href: '/therapist/schedule', icon: Calendar },
    { label: 'Clients', href: '/therapist/clients', icon: User },
    { label: 'Sessions', href: '/therapist/sessions', icon: Video },
    { label: 'Earnings', href: '/therapist/earnings', icon: CreditCard },
    { label: 'Settings', href: '/therapist/settings', icon: Settings },
];

const adminNavItems: NavItem[] = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Therapists', href: '/admin/therapists', icon: UserCheck },
    { label: 'Crisis Logs', href: '/admin/crisis-logs', icon: AlertTriangle },
    { label: 'Sessions', href: '/admin/sessions', icon: Video },
    { label: 'Payments', href: '/admin/payments', icon: DollarSign },
    { label: 'Support', href: '/admin/support', icon: MessageSquare },
    { label: 'Analytics', href: '/admin/analytics', icon: Activity },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export function Sidebar({ type = 'user' }: { type?: 'user' | 'therapist' | 'admin' }) {
    const pathname = usePathname();
    const { user, logout } = useAuthStore();
    const [collapsed, setCollapsed] = useState(false);

    const items = type === 'user' ? userNavItems : type === 'therapist' ? therapistNavItems : adminNavItems;

    return (
        <aside
            className={cn(
                "hidden md:flex flex-col h-screen sticky top-0 border-r border-white/10 bg-[#0A0A0F]/80 backdrop-blur-xl transition-all duration-300",
                collapsed ? "w-20" : "w-64"
            )}
        >
            <div className="p-6 flex items-center justify-between">
                {!collapsed && (
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="relative w-8 h-8 bg-gradient-to-br from-therapy-500 to-calm-600 rounded-lg flex items-center justify-center">
                            <Brain className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-display font-bold">Terapitika</span>
                    </Link>
                )}
                {collapsed && (
                    <div className="w-8 h-8 bg-gradient-to-br from-therapy-500 to-calm-600 rounded-lg flex items-center justify-center mx-auto">
                        <Brain className="w-5 h-5 text-white" />
                    </div>
                )}
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href}>
                            <div
                                className={cn(
                                    "flex items-center p-3 rounded-xl transition-all group relative",
                                    isActive
                                        ? "bg-therapy-500/20 text-therapy-400"
                                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <item.icon className={cn("w-5 h-5", collapsed ? "mx-auto" : "mr-3")} />
                                {!collapsed && <span className="font-medium">{item.label}</span>}
                                {isActive && (
                                    <motion.div
                                        layoutId="active-pill"
                                        className="absolute left-0 w-1 h-6 bg-therapy-500 rounded-r-full"
                                    />
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/10 flex flex-col items-center">
                <Button
                    variant="ghost"
                    size="icon"
                    className="mt-auto mb-4 hover:bg-white/10"
                    onClick={() => logout()}
                >
                    <LogOut className="w-5 h-5 text-red-400" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-gray-400 hover:text-white"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    {collapsed ? <ChevronRight size={20} className="mx-auto" /> : (
                        <>
                            <ChevronLeft size={20} className="mr-3" />
                            <span>Collapse Sidebar</span>
                        </>
                    )}
                </Button>
            </div>
        </aside>
    );
}
