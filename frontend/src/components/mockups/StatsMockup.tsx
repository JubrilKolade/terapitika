'use client';

import { motion } from 'framer-motion';
import { CreditCard, TrendingUp } from 'lucide-react';

export function EarningsMockup({ className }: { className?: string }) {
    return (
        <div className={`w-80 rounded-2xl bg-[#0A0A0F]/80 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl ${className}`}>
            <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-therapy-500 to-calm-600 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex items-center space-x-1 text-green-400 text-xs font-medium">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>+12.5%</span>
                    </div>
                </div>

                <div className="space-y-1 mb-6">
                    <div className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">Total Revenue</div>
                    <div className="text-2xl font-display font-bold text-white">$4,285.00</div>
                </div>

                <div className="space-y-3">
                    {[
                        { label: 'Platform Fees', value: '-$428.50', color: 'text-gray-500' },
                        { label: 'Net Payout', value: '$3,856.50', color: 'text-therapy-400' },
                    ].map((item, i) => (
                        <div key={i} className="flex justify-between items-center py-2 border-t border-white/5">
                            <span className="text-[10px] text-gray-400">{item.label}</span>
                            <span className={`text-[10px] font-bold ${item.color}`}>{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
