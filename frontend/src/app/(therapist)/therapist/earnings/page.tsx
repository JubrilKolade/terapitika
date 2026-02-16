'use client';

import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Calendar, CreditCard, ArrowDownRight, ArrowUpRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const transactions = [
    { id: 1, client: 'Sarah Mitchell', amount: 150.00, date: 'Feb 16, 2024', status: 'Paid', type: 'Session' },
    { id: 2, client: 'James Wilson', amount: 150.00, date: 'Feb 15, 2024', status: 'Pending', type: 'Session' },
    { id: 3, client: 'Michael Brown', amount: 150.00, date: 'Feb 14, 2024', status: 'Paid', type: 'Session' },
    { id: 4, client: 'Weekly Payout', amount: -2450.00, date: 'Feb 12, 2024', status: 'Completed', type: 'Withdrawal' },
];

export default function EarningsPage() {
    return (
        <DashboardLayout type="therapist">
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Earnings</h1>
                        <p className="text-gray-400">Track your revenue, payouts, and financial performance</p>
                    </div>
                    <Button className="bg-gradient-to-r from-therapy-500 to-calm-500 shadow-lg shadow-therapy-500/50">
                        <Download className="mr-2 h-4 w-4" />
                        Download Report
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: 'Total Revenue', value: '$12,450.00', icon: DollarSign, trend: '+12% from last month', color: 'therapy' },
                        { label: 'Available for Payout', value: '$840.00', icon: CreditCard, trend: 'Next payout in 2 days', color: 'calm' },
                        { label: 'Average Per Session', value: '$145.00', icon: TrendingUp, trend: 'Steady growth', color: 'green' },
                    ].map((stat, i) => (
                        <Card key={i} className="bg-white/5 border-white/10 backdrop-blur-xl border-none">
                            <CardContent className="p-6 relative text-white border-white/10 border rounded-2xl">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-xl bg-${stat.color}-500/20 text-${stat.color}-400`}>
                                        <stat.icon size={24} />
                                    </div>
                                </div>
                                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                                <div className="text-sm text-gray-400">{stat.label}</div>
                                <div className="mt-4 pt-4 border-t border-white/5 text-xs text-gray-500">
                                    {stat.trend}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card className="bg-white/5 border-white/10 backdrop-blur-xl text-white border-none">
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="p-4 text-xs text-gray-400 uppercase font-bold">Transaction</th>
                                        <th className="p-4 text-xs text-gray-400 uppercase font-bold">Date</th>
                                        <th className="p-4 text-xs text-gray-400 uppercase font-bold">Amount</th>
                                        <th className="p-4 text-xs text-gray-400 uppercase font-bold">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {transactions.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`p-2 rounded-lg ${tx.amount > 0 ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                        {tx.amount > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{tx.client}</div>
                                                        <div className="text-xs text-gray-400">{tx.type}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-gray-400">{tx.date}</td>
                                            <td className={`p-4 font-bold ${tx.amount > 0 ? 'text-white' : 'text-blue-400'}`}>
                                                {tx.amount > 0 ? `+ $${tx.amount.toFixed(2)}` : `- $${Math.abs(tx.amount).toFixed(2)}`}
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${tx.status === 'Paid' || tx.status === 'Completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                                                    }`}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
