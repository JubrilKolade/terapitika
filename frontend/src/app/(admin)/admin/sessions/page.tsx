'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { GlassCard } from '@/components/shared/GlassCard';
import {
    Video, Calendar, Clock, MessageSquare, Search, Filter, MoreVertical,
    Play, Info, Loader2, AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiHelpers } from '@/lib/api';

interface SessionItem {
    id: string;
    client?: { firstName: string; lastName: string };
    therapist?: { firstName: string; lastName: string };
    clientId: string;
    therapistId: string;
    status: string;
    type: string;
    scheduledStart: string;
    actualStart?: string;
    duration: number;
    createdAt: string;
}

export default function AdminSessionsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [sessions, setSessions] = useState<SessionItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState({ active: 0, scheduled: 0, completionRate: '0%' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [dashRes, sessionsRes] = await Promise.all([
                    apiHelpers.admin.getDashboard(),
                    apiHelpers.sessions.getMine({ limit: 50 }),
                ]);
                const dashData = dashRes.data.data;
                setStats({
                    active: dashData?.activeSessions || 0,
                    scheduled: dashData?.scheduledToday || 0,
                    completionRate: dashData?.completionRate || '0%',
                });
                const sessData = sessionsRes.data.data;
                setSessions(sessData?.data || sessData || []);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to load sessions');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const activeSessions = sessions.filter((s) => s.status === 'IN_PROGRESS');
    const recentSessions = sessions.filter((s) => s.status === 'COMPLETED').slice(0, 10);

    const getTimeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins} mins ago`;
        return `${Math.floor(mins / 60)}h ago`;
    };

    const getClientName = (s: SessionItem) =>
        s.client ? `${s.client.firstName} ${s.client.lastName}` : `User ${s.clientId?.slice(-4)}`;
    const getTherapistName = (s: SessionItem) =>
        s.therapist ? `${s.therapist.firstName} ${s.therapist.lastName}` : `Therapist ${s.therapistId?.slice(-4)}`;

    if (loading) {
        return (
            <div className="space-y-8">
                <PageHeader title="Session Management" subtitle="Monitor active sessions and review past session logs" icon={Video} gradient />
                <div className="flex items-center justify-center min-h-[40vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-therapy-400" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-8">
                <PageHeader title="Session Management" subtitle="Monitor active sessions and review past session logs" icon={Video} gradient />
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
            <PageHeader title="Session Management" subtitle="Monitor active sessions and review past session logs" icon={Video} gradient />

            {/* Session Stats */}
            <div className="grid md:grid-cols-3 gap-6">
                <GlassCard gradient>
                    <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-xl bg-green-500/20 text-green-400">
                            <Play className="w-6 h-6 animate-pulse" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Active Now</p>
                            <p className="text-2xl font-bold">{stats.active} Sessions</p>
                        </div>
                    </div>
                </GlassCard>
                <GlassCard gradient>
                    <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Scheduled Today</p>
                            <p className="text-2xl font-bold">{stats.scheduled} Sessions</p>
                        </div>
                    </div>
                </GlassCard>
                <GlassCard gradient>
                    <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-xl bg-orange-500/20 text-orange-400">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Completion Rate</p>
                            <p className="text-2xl font-bold">{stats.completionRate}</p>
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Active Sessions List */}
            <GlassCard gradient>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Active Sessions</h2>
                    <div className="flex items-center space-x-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-therapy-500 w-64"
                            />
                        </div>
                        <Button variant="outline" size="sm" className="border-white/10">
                            <Filter className="w-4 h-4 mr-2" /> Filter
                        </Button>
                    </div>
                </div>

                <div className="space-y-4">
                    {activeSessions.length === 0 ? (
                        <p className="text-gray-400 text-center py-8">No active sessions</p>
                    ) : (
                        activeSessions.map((session) => (
                            <div key={session.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between group hover:bg-white/10 transition-all">
                                <div className="flex items-center space-x-4">
                                    <div className="flex -space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-therapy-500 border-2 border-[#12121A] flex items-center justify-center font-bold text-xs ring-2 ring-therapy-500/20">C</div>
                                        <div className="w-10 h-10 rounded-full bg-calm-500 border-2 border-[#12121A] flex items-center justify-center font-bold text-xs ring-2 ring-calm-500/20">T</div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm">{getClientName(session)} & {getTherapistName(session)}</h3>
                                        <div className="flex items-center space-x-3 text-xs text-gray-400 mt-1">
                                            <span className="flex items-center"><Clock className="w-3 h-3 mr-1" />Started {getTimeAgo(session.actualStart || session.scheduledStart)}</span>
                                            <span className="flex items-center"><Info className="w-3 h-3 mr-1" />ID: {session.id.slice(-8)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="text-right mr-4">
                                        <div className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[10px] uppercase font-bold tracking-wider">Live</div>
                                        <p className="text-[10px] text-gray-500 mt-1">2 participants</p>
                                    </div>
                                    <Button size="sm" variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity border-white/10">Monitor</Button>
                                    <button className="p-2 hover:bg-white/10 rounded-lg"><MoreVertical className="w-4 h-4 text-gray-400" /></button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </GlassCard>

            {/* Recent Sessions History */}
            <GlassCard gradient>
                <h2 className="text-xl font-bold mb-6">Recent History</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10 text-left">
                                <th className="px-4 py-3 text-sm font-semibold text-gray-400">Date</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-400">Client</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-400">Therapist</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-400">Duration</th>
                                <th className="px-4 py-3 text-sm font-semibold text-gray-400">Log</th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-400">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {recentSessions.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-8 text-gray-400">No recent sessions</td></tr>
                            ) : (
                                recentSessions.map((session) => (
                                    <tr key={session.id} className="hover:bg-white/5 transition-colors text-sm">
                                        <td className="px-4 py-4">{new Date(session.scheduledStart).toLocaleDateString()}</td>
                                        <td className="px-4 py-4">{getClientName(session)}</td>
                                        <td className="px-4 py-4">{getTherapistName(session)}</td>
                                        <td className="px-4 py-4 text-gray-400">{session.duration}m</td>
                                        <td className="px-4 py-4">
                                            <button className="flex items-center text-xs text-therapy-400 hover:text-therapy-300">
                                                <MessageSquare className="w-3 h-3 mr-1" /> View Summary
                                            </button>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <Button variant="ghost" size="sm">Details</Button>
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
