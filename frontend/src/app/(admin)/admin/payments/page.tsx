'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { GlassCard } from '@/components/shared/GlassCard';
import {
    CreditCard, DollarSign, Download, Search, Filter, ArrowUpRight,
    MoreVertical, Loader2, AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiHelpers } from '@/lib/api';

interface Transaction {
    id: string;
    userId: string;
    amount: number;
    currency: string;
    status: string;
    description: string;
    createdAt: string;
    user?: { firstName: string; lastName: string };
    session?: { therapist?: { firstName: string; lastName: string } };
}

interface RevenueStats {
    totalRevenue: number;
    therapistPayouts: number;
    platformCommission: number;
    revenueGrowth: string;
    payoutGrowth: string;
    commissionGrowth: string;
}

export default function AdminPaymentsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [revenueStats, setRevenueStats] = useState<RevenueStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [dashRes, paymentsRes] = await Promise.all([
                    apiHelpers.admin.getDashboard(),
                    apiHelpers.payments.getAll(),
                ]);
                const dashData = dashRes.data.data;
                setRevenueStats({
                    totalRevenue: dashData?.monthlyRevenue || 0,
                    therapistPayouts: dashData?.therapistPayouts || 0,
                    platformCommission: dashData?.platformCommission || 0,
                    revenueGrowth: dashData?.revenueGrowth || '+0%',
                    payoutGrowth: dashData?.payoutGrowth || '+0%',
                    commissionGrowth: dashData?.commissionGrowth || '+0%',
                });
                const payData = paymentsRes.data.data;
                setTransactions(payData?.data || payData || []);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to load payment data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredTx = transactions.filter((tx) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            tx.id.toLowerCase().includes(q) ||
            tx.user?.firstName?.toLowerCase().includes(q) ||
            tx.user?.lastName?.toLowerCase().includes(q) ||
            tx.description?.toLowerCase().includes(q)
        );
    });

    if (loading) {
        return (
            <div className="space-y-8">
                <PageHeader title="Payment Management" subtitle="Manage transactions, therapist payouts, and platform revenue" icon={DollarSign} />
                <div className="flex items-center justify-center min-h-[40vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-therapy-400" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-8">
                <PageHeader title="Payment Management" subtitle="Manage transactions, therapist payouts, and platform revenue" icon={DollarSign} />
                <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
                    <AlertTriangle className="w-12 h-12 text-red-400" />
                    <p className="text-gray-400">{error}</p>
                    <Button onClick={() => window.location.reload()}>Retry</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <PageHeader
                title="Payment Management"
                subtitle="Manage transactions, therapist payouts, and platform revenue"
                icon={DollarSign}
                actions={
                    <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                        <Download className="w-4 h-4 mr-2" /> Download Report
                    </Button>
                }
            />

            {/* Financial Overview */}
            <div className="grid md:grid-cols-3 gap-6">
                <GlassCard gradient>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-xl bg-green-500/20 text-green-400"><DollarSign className="w-6 h-6" /></div>
                        <span className="flex items-center text-green-400 text-sm"><ArrowUpRight className="w-4 h-4 mr-1" />{revenueStats?.revenueGrowth}</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-1">Total Revenue (MTD)</p>
                    <p className="text-3xl font-bold">${(revenueStats?.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </GlassCard>
                <GlassCard gradient>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400"><CreditCard className="w-6 h-6" /></div>
                        <span className="flex items-center text-green-400 text-sm"><ArrowUpRight className="w-4 h-4 mr-1" />{revenueStats?.payoutGrowth}</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-1">Therapist Payouts (MTD)</p>
                    <p className="text-3xl font-bold">${(revenueStats?.therapistPayouts || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </GlassCard>
                <GlassCard gradient>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-xl bg-therapy-500/20 text-therapy-400"><DollarSign className="w-6 h-6" /></div>
                        <span className="flex items-center text-green-400 text-sm"><ArrowUpRight className="w-4 h-4 mr-1" />{revenueStats?.commissionGrowth}</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-1">Platform Commission (MTD)</p>
                    <p className="text-3xl font-bold">${(revenueStats?.platformCommission || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
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
                        <Filter className="w-4 h-4 mr-2" /> Filter
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10 text-left">
                                <th className="px-4 py-3 text-sm font-semibold text-gray-400">Transaction ID</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-400">Client</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-400">Amount</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-400">Status</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-400">Date</th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredTx.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-8 text-gray-400">No transactions found</td></tr>
                            ) : (
                                filteredTx.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-4 font-mono text-xs text-therapy-400">{tx.id.slice(-8).toUpperCase()}</td>
                                        <td className="px-4 py-4 text-sm">{tx.user ? `${tx.user.firstName} ${tx.user.lastName}` : tx.userId?.slice(-6)}</td>
                                        <td className="px-4 py-4 font-semibold">${(tx.amount / 100).toFixed(2)}</td>
                                        <td className="px-4 py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${tx.status === 'SUCCEEDED' ? 'bg-green-500/20 text-green-400'
                                                    : tx.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400'
                                                        : 'bg-red-500/20 text-red-400'
                                                }`}>{tx.status}</span>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-400">{new Date(tx.createdAt).toLocaleDateString()}</td>
                                        <td className="px-4 py-4 text-right">
                                            <button className="p-2 hover:bg-white/10 rounded-lg"><MoreVertical className="w-4 h-4 text-gray-400" /></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    );
}
