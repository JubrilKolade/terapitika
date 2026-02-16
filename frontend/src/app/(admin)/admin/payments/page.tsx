'use client';

import { PageHeader } from '@/components/shared/PageHeader';
import { GlassCard } from '@/components/shared/GlassCard';
import { CreditCard, DollarSign, Download, Search, Filter, ArrowUpRight, ArrowDownRight, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function AdminPaymentsPage() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="space-y-8">
            <PageHeader
                title="Payment Management"
                subtitle="Manage transactions, therapist payouts, and platform revenue"
                icon={DollarSign}
                actions={
                    <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                        <Download className="w-4 h-4 mr-2" />
                        Download Report
                    </Button>
                }
            />

            {/* Financial Overview */}
            <div className="grid md:grid-cols-3 gap-6">
                <GlassCard gradient>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-xl bg-green-500/20 text-green-400">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <span className="flex items-center text-green-400 text-sm">
                            <ArrowUpRight className="w-4 h-4 mr-1" />
                            +15.3%
                        </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-1">Total Revenue (MTD)</p>
                    <p className="text-3xl font-bold">$284,590.00</p>
                </GlassCard>

                <GlassCard gradient>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <span className="flex items-center text-green-400 text-sm">
                            <ArrowUpRight className="w-4 h-4 mr-1" />
                            +8.2%
                        </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-1">Therapist Payouts (MTD)</p>
                    <p className="text-3xl font-bold">$212,450.00</p>
                </GlassCard>

                <GlassCard gradient>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-xl bg-therapy-500/20 text-therapy-400">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <span className="flex items-center text-green-400 text-sm">
                            <ArrowUpRight className="w-4 h-4 mr-1" />
                            +12.5%
                        </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-1">Platform Commission (MTD)</p>
                    <p className="text-3xl font-bold">$72,140.00</p>
                </GlassCard>
            </div>

            {/* Transactions Table */}
            <GlassCard gradient>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by ID, user, or therapist..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-therapy-500"
                        />
                    </div>
                    <Button variant="outline" className="border-white/10 hover:bg-white/10">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10 text-left">
                                <th className="px-4 py-3 text-sm font-semibold text-gray-400">Transaction ID</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-400">Client</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-400">Therapist</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-400">Amount</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-400">Status</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-400">Date</th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-4 py-4 font-mono text-xs text-therapy-400">{tx.id}</td>
                                    <td className="px-4 py-4 text-sm">{tx.client}</td>
                                    <td className="px-4 py-4 text-sm">{tx.therapist}</td>
                                    <td className="px-4 py-4 font-semibold">${tx.amount.toFixed(2)}</td>
                                    <td className="px-4 py-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${tx.status === 'Completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-400">{tx.date}</td>
                                    <td className="px-4 py-4 text-right">
                                        <button className="p-2 hover:bg-white/10 rounded-lg">
                                            <MoreVertical className="w-4 h-4 text-gray-400" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    );
}

const transactions = [
    { id: 'TX-94820', client: 'Sarah Johnson', therapist: 'Dr. Michael Chen', amount: 150.00, status: 'Completed', date: '2024-02-20' },
    { id: 'TX-94821', client: 'Mark Wilson', therapist: 'Dr. Lisa Park', amount: 120.00, status: 'Completed', date: '2024-02-20' },
    { id: 'TX-94822', client: 'Emily Stone', therapist: 'Dr. Elena Rossi', amount: 150.00, status: 'Pending', date: '2024-02-19' },
    { id: 'TX-94823', client: 'James Miller', therapist: 'Dr. David Kim', amount: 100.00, status: 'Completed', date: '2024-02-19' },
    { id: 'TX-94824', client: 'Anna Lee', therapist: 'Dr. Michael Chen', amount: 150.00, status: 'Completed', date: '2024-02-18' },
];
