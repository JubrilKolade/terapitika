'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { GlassCard } from '@/components/shared/GlassCard';
import { AlertTriangle, Shield, Clock, User, MessageCircle, ExternalLink, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiHelpers } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminCrisisLogsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const fetchCrisisLogs = async () => {
            try {
                const response = await apiHelpers.admin.getCrisisLogs();
                setData(response.data.data);
            } catch (error) {
                console.error('Failed to fetch crisis logs:', error);
                toast.error('Failed to load crisis logs');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCrisisLogs();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-therapy-500" />
            </div>
        );
    }

    const { stats, alerts } = data || {};

    return (
        <div className="space-y-8">
            <PageHeader
                title="Crisis Monitoring"
                subtitle="Monitor system-flagged high-risk interactions and crisis alerts"
                icon={AlertTriangle}
                gradient
            />

            {/* Overview Cards */}
            <div className="grid md:grid-cols-3 gap-6">
                <GlassCard className="border-red-500/30" gradient>
                    <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-xl bg-red-500/20 text-red-400">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Active Alerts</p>
                            <p className="text-2xl font-bold text-red-400">{stats?.activeAlerts || '0'}</p>
                        </div>
                    </div>
                </GlassCard>
                <GlassCard className="border-yellow-500/30" gradient>
                    <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-xl bg-yellow-500/20 text-yellow-400">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Pending Review</p>
                            <p className="text-2xl font-bold text-yellow-400">{stats?.pendingReview || '0'}</p>
                        </div>
                    </div>
                </GlassCard>
                <GlassCard className="border-green-500/30" gradient>
                    <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-xl bg-green-500/20 text-green-400">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Resolved Today</p>
                            <p className="text-2xl font-bold text-green-400">{stats?.resolvedToday || '0'}</p>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Alerts Table */}
            <GlassCard gradient>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Recent Alerts</h2>
                    <Button variant="outline" size="sm" className="border-white/10">Filter by Priority</Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Priority</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">User</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Trigger</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Type</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Timestamp</th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-400">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {alerts?.length > 0 ? (
                                alerts.map((alert: any) => (
                                    <tr key={alert.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-4">
                                            <span className={`px-2 py-1 rounded-md mb-2 text-[10px] font-bold uppercase tracking-wider ${alert.priority === 'Critical'
                                                ? 'bg-red-500 text-white'
                                                : alert.priority === 'High'
                                                    ? 'bg-orange-500/20 text-orange-400'
                                                    : 'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                {alert.priority}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                                    <User className="w-4 h-4 text-gray-400" />
                                                </div>
                                                <span className="font-medium">{alert.userName || alert.user}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center space-x-2 text-sm text-red-400">
                                                <MessageCircle className="w-4 h-4" />
                                                <span>{alert.trigger}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-400">{alert.type}</td>
                                        <td className="px-4 py-4 text-sm text-gray-400">{alert.time || new Date(alert.createdAt).toLocaleString()}</td>
                                        <td className="px-4 py-4 text-right">
                                            <button className="text-therapy-400 hover:text-therapy-300 font-medium text-sm flex items-center ml-auto transition-colors">
                                                Investigate
                                                <ChevronRight className="w-4 h-4 ml-1" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500 italic">
                                        No active alerts found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>

            {/* Safety Protocols */}
            <div className="grid lg:grid-cols-2 gap-6">
                <GlassCard gradient>
                    <h3 className="text-lg font-bold mb-4">Safety Protocols</h3>
                    <div className="space-y-2">
                        <ProtocolItem title="Immediate Suicide Risk" status="Active" color="bg-red-500" />
                        <ProtocolItem title="Self-Harm Indicators" status="Active" color="bg-orange-500" />
                        <ProtocolItem title="Domestic Violence Signs" status="Active" color="bg-yellow-500" />
                    </div>
                    <Button variant="ghost" className="w-full mt-4 text-gray-400 hover:text-white">
                        Manage Protocols <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                </GlassCard>

                <GlassCard gradient>
                    <h3 className="text-lg font-bold mb-4">Support Team on Standby</h3>
                    <div className="flex flex-wrap gap-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center space-x-2 p-2 rounded-lg bg-white/5 border border-white/10">
                                <div className="w-8 h-8 rounded-full bg-therapy-500/20 flex items-center justify-center text-therapy-400 font-bold text-xs">
                                    S{i}
                                </div>
                                <div className="text-xs">
                                    <p className="font-medium text-white">Support Specialist {i}</p>
                                    <p className="text-green-400">Available</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button className="w-full mt-6 bg-therapy-500/20 text-therapy-400 hover:bg-therapy-500/30">
                        Emergency Broadcast
                    </Button>
                </GlassCard>
            </div>
        </div>
    );
}

function ProtocolItem({ title, status, color }: { title: string; status: string; color: string }) {
    return (
        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${color}`} />
                <span className="text-sm font-medium">{title}</span>
            </div>
            <span className="text-xs text-gray-500">{status}</span>
        </div>
    );
}
