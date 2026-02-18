'use client';

import Link from 'next/link';
import { Brain } from 'lucide-react';

export function Footer() {
    return (
        <footer className="relative pt-24 pb-12 px-6 border-t border-white/5 bg-[#0A0A0F]">
            <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8">
                <div className="col-span-2 space-y-6">
                    <Link href="/" className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-therapy-500 to-calm-600 rounded-xl flex items-center justify-center">
                            <Brain className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-display font-bold tracking-tight">Terapitika</span>
                    </Link>
                    <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                        We are an AI wellness company on a mission to make professional support accessible and extraordinary for everyone.
                    </p>
                    <div className="flex space-x-4">
                        {['facebook', 'instagram', 'twitter', 'youtube'].map((s) => (
                            <div key={s} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer transition-all">
                                <div className="w-4 h-4 bg-current rounded-sm opacity-50" />
                            </div>
                        ))}
                    </div>
                </div>

                {[
                    {
                        title: 'Products',
                        links: [
                            { label: 'AI Companion', href: '/how-it-works' },
                            { label: 'Human Therapy', href: '/therapists' },
                            { label: 'Crisis Support', href: '/resources' },
                            { label: 'Group Sessions', href: '/resources' },
                        ],
                    },
                    {
                        title: 'Industries',
                        links: [
                            { label: 'Individual', href: '/how-it-works' },
                            { label: 'Corporate', href: '/resources' },
                            { label: 'Education', href: '/resources' },
                            { label: 'Healthcare', href: '/resources' },
                        ],
                    },
                    {
                        title: 'Resources',
                        links: [
                            { label: 'Blog', href: '/blog' },
                            { label: 'Coping Tools', href: '/resources' },
                            { label: 'Documentation', href: '/support/docs' },
                            { label: 'Community', href: '/resources' },
                        ],
                    },
                    {
                        title: 'Platform',
                        links: [
                            { label: 'Integration', href: '/how-it-works' },
                            { label: 'Verification', href: '/about' },
                            { label: 'Mission', href: '/about' },
                            { label: 'Pricing', href: '/pricing' },
                        ],
                    },
                ].map((col, i) => (
                    <div key={i} className="space-y-6">
                        <h4 className="text-xs font-bold tracking-widest uppercase text-white/90">{col.title}</h4>
                        <ul className="space-y-4">
                            {col.links.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-gray-500 hover:text-white text-sm transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-gray-600 text-[10px] tracking-widest font-medium uppercase">
                    © 2026 Terapitika. All rights reserved.
                </div>
                <div className="flex space-x-8">
                    <Link href="/legal/terms-of-service" className="text-gray-600 hover:text-white text-[10px] tracking-widest font-medium uppercase transition-colors">Terms of Service</Link>
                    <Link href="/legal/privacy-policy" className="text-gray-600 hover:text-white text-[10px] tracking-widest font-medium uppercase transition-colors">Privacy Policy</Link>
                </div>
            </div>
        </footer>
    );
}
