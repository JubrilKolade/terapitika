'use client';

import { PageHeader } from '@/components/shared/PageHeader';
import { GlassCard } from '@/components/shared/GlassCard';
import { StatCard } from '@/components/shared/StatCard';
import { Activity, TrendingUp, Users, Calendar, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function AdminAnalyticsPage() {
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
                    value="8,422"
                    change="+5.4%"
                    trend="up"
                    gradient="from-therapy-500 to-therapy-600"
                />
                <StatCard
                    icon={Calendar}
                    label="Sessions (MTD)"
                    value="1,248"
                    change="+12.2%"
                    trend="up"
                    gradient="from-calm-500 to-calm-600"
                />
                <StatCard
                    icon={Clock}
                    label="Avg. Session length"
                    value="48m"
                    change="-2.1%"
                    trend="down"
                    gradient="from-blue-500 to-blue-600"
                />
                <StatCard
                    icon={TrendingUp}
                    label="Conversion Rate"
                    value="3.2%"
                    change="+0.8%"
                    trend="up"
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
                        {popularSpecializations.map((spec, i) => (
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
                                <span className="text-2xl font-bold">1,458</span>
                                <span className="flex items-center text-green-400 text-sm">
                                    <ArrowUpRight className="w-4 h-4 mr-1" />
                                    +12%
                                </span>
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <p className="text-sm text-gray-400 mb-1">Repeat Booking Rate</p>
                            <div className="flex items-center justify-between">
                                <span className="text-2xl font-bold">64.2%</span>
                                <span className="flex items-center text-green-400 text-sm">
                                    <ArrowUpRight className="w-4 h-4 mr-1" />
                                    +5%
                                </span>
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <p className="text-sm text-gray-400 mb-1">Churn Rate</p>
                            <div className="flex items-center justify-between">
                                <span className="text-2xl font-bold">2.4%</span>
                                <span className="flex items-center text-red-400 text-sm">
                                    <ArrowDownRight className="w-4 h-4 mr-1" />
                                    +0.2%
                                </span>
                            </div>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}

const popularSpecializations = [
    { name: 'Anxiety & Stress', count: 458, percentage: 85 },
    { name: 'Depression Management', count: 342, percentage: 72 },
    { name: 'Relationship Counseling', count: 284, percentage: 65 },
    { name: 'Trauma & PTSD', count: 196, percentage: 45 },
    { name: 'Personal Growth', count: 124, percentage: 32 },
];
