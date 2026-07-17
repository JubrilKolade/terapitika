'use client';

import Link from 'next/link';
import { Brain } from 'lucide-react';

export function Footer() {
    return (
        <footer className="relative pt-24 pb-12 px-6 border-t border-white/5 bg-[#0A0A0F]">
            <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8">
                {/* Logo & Info */}
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

                {/* Links Columns */}
                {[
                    {
                        title: "Products",
                        links: ["AI Companion", "Human Therapy", "Crisis Support", "Group Sessions"]
                    },
                    {
                        title: "Industries",
                        links: ["Individual", "Corporate", "Education", "Healthcare"]
                    },
                    {
                        title: "Resources",
                        links: ["Blog", "Coping Tools", "Documentation", "Community"]
                    },
                    {
                        title: "Platform",
                        links: ["Integration", "Verification", "Mission", "Pricing"]
                    }
                ].map((col, i) => (
                    <div key={i} className="space-y-6">
                        <h4 className="text-xs font-bold tracking-widest uppercase text-white/90">{col.title}</h4>
                        <ul className="space-y-4">
                            {col.links.map((link) => (
                                <li key={link}>
                                    <Link href="#" className="text-gray-500 hover:text-white text-sm transition-colors">{link}</Link>
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
                    <Link href="#" className="text-gray-600 hover:text-white text-[10px] tracking-widest font-medium uppercase transition-colors">Terms of Service</Link>
                    <Link href="#" className="text-gray-600 hover:text-white text-[10px] tracking-widest font-medium uppercase transition-colors">Privacy Policy</Link>
                </div>
            </div>
        </footer>
    );
}
