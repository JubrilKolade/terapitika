'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { GlassCard } from '@/components/shared/GlassCard';
import { StatCard } from '@/components/shared/StatCard';
import { Activity, TrendingUp, Users, Calendar, Clock, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';
import { apiHelpers } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminAnalyticsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await apiHelpers.admin.getDashboard();
                setData(response.data.data);
            } catch (error) {
                console.error('Failed to fetch analytics:', error);
                toast.error('Failed to load analytics data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-therapy-500" />
            </div>
        );
    }

    const { stats, charts, popularSpecializations, retention } = data || {};

    return (
        <div className="space-y-8">
            <PageHeader
                title="Platform Analytics"
                subtitle="Detailed insights into platform performance and user engagement"
                icon={Activity}
                gradient
            />

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={Users}
                    label="Active Users"
                    value={stats?.activeUsers?.value || '0'}
                    change={stats?.activeUsers?.change || '0%'}
                    trend={stats?.activeUsers?.trend || 'up'}
                    gradient="from-therapy-500 to-therapy-600"
                />
                <StatCard
                    icon={Calendar}
                    label="Sessions (MTD)"
                    value={stats?.sessionsMTD?.value || '0'}
                    change={stats?.sessionsMTD?.change || '0%'}
                    trend={stats?.sessionsMTD?.trend || 'up'}
                    gradient="from-calm-500 to-calm-600"
                />
                <StatCard
                    icon={Clock}
                    label="Avg. Session length"
                    value={stats?.avgSessionLength?.value || '0m'}
                    change={stats?.avgSessionLength?.change || '0%'}
                    trend={stats?.avgSessionLength?.trend || 'up'}
                    gradient="from-blue-500 to-blue-600"
                />
                <StatCard
                    icon={TrendingUp}
                    label="Conversion Rate"
                    value={stats?.conversionRate?.value || '0%'}
                    change={stats?.conversionRate?.change || '0%'}
                    trend={stats?.conversionRate?.trend || 'up'}
                    gradient="from-indigo-500 to-indigo-600"
                />
            </div>

            {/* Charts Placeholder/Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                <GlassCard gradient>
                    <h3 className="text-xl font-bold mb-6">User Acquisition</h3>
                    <div className="h-64 flex items-center justify-center bg-white/5 rounded-xl border border-white/10">
                        <p className="text-gray-500 italic">User Growth Chart Area</p>
                    </div>
                </GlassCard>

                <GlassCard gradient>
                    <h3 className="text-xl font-bold mb-6">Session Volume</h3>
                    <div className="h-64 flex items-center justify-center bg-white/5 rounded-xl border border-white/10">
                        <p className="text-gray-500 italic">Session Trends Chart Area</p>
                    </div>
                </GlassCard>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <GlassCard className="lg:col-span-2" gradient>
                    <h3 className="text-xl font-bold mb-6">Popular Specializations</h3>
                    <div className="space-y-4">
                        {(popularSpecializations || defaultSpecializations).map((spec: any, i: number) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>{spec.name}</span>
                                    <span className="text-gray-400">{spec.count} sessions</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-therapy-500 to-calm-500"
                                        style={{ width: `${spec.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>

                <GlassCard gradient>
                    <h3 className="text-xl font-bold mb-6">User Retention</h3>
                    <div className="space-y-6">
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <p className="text-sm text-gray-400 mb-1">New Users (7d)</p>
                            <div className="flex items-center justify-between">
                                <span className="text-2xl font-bold">{retention?.newUsers?.value || '0'}</span>
                                <span className={`flex items-center text-sm ${retention?.newUsers?.trend === 'down' ? 'text-red-400' : 'text-green-400'}`}>
                                    {retention?.newUsers?.trend === 'down' ? <ArrowDownRight className="w-4 h-4 mr-1" /> : <ArrowUpRight className="w-4 h-4 mr-1" />}
                                    {retention?.newUsers?.change || '0%'}
                                </span>
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <p className="text-sm text-gray-400 mb-1">Repeat Booking Rate</p>
                            <div className="flex items-center justify-between">
                                <span className="text-2xl font-bold">{retention?.repeatBookingRate?.value || '0%'}</span>
                                <span className={`flex items-center text-sm ${retention?.repeatBookingRate?.trend === 'down' ? 'text-red-400' : 'text-green-400'}`}>
                                    {retention?.repeatBookingRate?.trend === 'down' ? <ArrowDownRight className="w-4 h-4 mr-1" /> : <ArrowUpRight className="w-4 h-4 mr-1" />}
                                    {retention?.repeatBookingRate?.change || '0%'}
                                </span>
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <p className="text-sm text-gray-400 mb-1">Churn Rate</p>
                            <div className="flex items-center justify-between">
                                <span className="text-2xl font-bold">{retention?.churnRate?.value || '0%'}</span>
                                <span className={`flex items-center text-sm ${retention?.churnRate?.trend === 'up' ? 'text-red-400' : 'text-green-400'}`}>
                                    {retention?.churnRate?.trend === 'up' ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                                    {retention?.churnRate?.change || '0%'}
                                </span>
                            </div>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}

const defaultSpecializations = [
    { name: 'Anxiety & Stress', count: 0, percentage: 0 },
    { name: 'Depression Management', count: 0, percentage: 0 },
    { name: 'Relationship Counseling', count: 0, percentage: 0 },
    { name: 'Trauma & PTSD', count: 0, percentage: 0 },
    { name: 'Personal Growth', count: 0, percentage: 0 },
];
