'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, Calendar, ArrowUpRight, Download, Loader2, CreditCard } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { apiHelpers } from '@/lib/api';
import toast from 'react-hot-toast';

export default function EarningsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const fetchEarnings = async () => {
            try {
                const response = await apiHelpers.therapistPortal.getEarnings();
                setData(response.data.data);
            } catch (error) {
                console.error('Failed to fetch earnings:', error);
                toast.error('Failed to load earnings data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchEarnings();
    }, []);

    if (isLoading) {
        return (
            <DashboardLayout type="therapist">
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 animate-spin text-therapy-500" />
                </div>
            </DashboardLayout>
        );
    }

    const { stats, transactions } = data || {};

    return (
        <DashboardLayout type="therapist">
            <div className="p-6 max-w-7xl mx-auto space-y-8 text-white">
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
                    <Card className="bg-white/5 border-white/10 backdrop-blur-xl border-none">
                        <CardContent className="p-6 relative text-white border-white/10 border rounded-2xl">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-xl bg-therapy-500/20 text-therapy-400">
                                    <DollarSign size={24} />
                                </div>
                            </div>
                            <div className="text-3xl font-bold mb-1">${stats?.totalRevenue || '0.00'}</div>
                            <div className="text-sm text-gray-400">Total Revenue</div>
                            <div className="mt-4 pt-4 border-t border-white/5 text-xs text-green-400 flex items-center">
                                <ArrowUpRight className="w-3 h-3 mr-1" />
                                {stats?.monthlyGrowth || '0%'} from last month
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/5 border-white/10 backdrop-blur-xl border-none">
                        <CardContent className="p-6 relative text-white border-white/10 border rounded-2xl">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-xl bg-calm-500/20 text-calm-400">
                                    <CreditCard size={24} />
                                </div>
                            </div>
                            <div className="text-3xl font-bold mb-1">${stats?.availableBalance || '0.00'}</div>
                            <div className="text-sm text-gray-400">Available for Payout</div>
                            <div className="mt-4 pt-4 border-t border-white/5 text-xs text-gray-500">
                                Next payout in {stats?.daysToPayout || '--'} days
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/5 border-white/10 backdrop-blur-xl border-none">
                        <CardContent className="p-6 relative text-white border-white/10 border rounded-2xl">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 rounded-xl bg-green-500/20 text-green-400">
                                    <TrendingUp size={24} />
                                </div>
                            </div>
                            <div className="text-3xl font-bold mb-1">${stats?.avgPerSession || '0.00'}</div>
                            <div className="text-sm text-gray-400">Average Per Session</div>
                            <div className="mt-4 pt-4 border-t border-white/5 text-xs text-gray-500">
                                Steady growth
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="bg-white/5 border-white/10 backdrop-blur-xl text-white border-none">
                    <CardContent className="p-0 border border-white/10 rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-white/10">
                            <h2 className="text-xl font-bold">Recent Transactions</h2>
                        </div>
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
                                    {transactions?.length > 0 ? (
                                        transactions.map((tx: any) => (
                                            <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className={`p-2 rounded-lg ${tx.amount > 0 ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                            {tx.amount > 0 ? <ArrowUpRight size={16} /> : <ArrowUpRight size={16} className="rotate-90" />}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium">{tx.client || tx.description}</div>
                                                            <div className="text-xs text-gray-400">{tx.type}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-sm text-gray-400">
                                                    {tx.date || new Date(tx.createdAt).toLocaleDateString()}
                                                </td>
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
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="p-10 text-center text-gray-500 italic">
                                                No transaction history yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}

const defaultStats = {
    totalRevenue: '0.00',
    availableBalance: '0.00',
    avgPerSession: '0.00',
    monthlyGrowth: '0%',
    daysToPayout: '--',
};
