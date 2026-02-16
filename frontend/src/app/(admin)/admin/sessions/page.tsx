'use client';

import { PageHeader } from '@/components/shared/PageHeader';
import { GlassCard } from '@/components/shared/GlassCard';
import { Video, Calendar, Clock, User, MessageSquare, Search, Filter, MoreVertical, Play, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function AdminSessionsPage() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="space-y-8">
            <PageHeader
                title="Session Management"
                subtitle="Monitor active sessions and review past session logs"
                icon={Video}
                gradient
            />

            {/* Session Stats */}
            <div className="grid md:grid-cols-3 gap-6">
                <GlassCard gradient>
                    <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-xl bg-green-500/20 text-green-400">
                            <Play className="w-6 h-6 animate-pulse" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Active Now</p>
                            <p className="text-2xl font-bold">14 Sessions</p>
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
                            <p className="text-2xl font-bold">86 Sessions</p>
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
                            <p className="text-2xl font-bold">94.2%</p>
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
                            <Filter className="w-4 h-4 mr-2" />
                            Filter
                        </Button>
                    </div>
                </div>

                <div className="space-y-4">
                    {activeSessions.map((session) => (
                        <div key={session.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between group hover:bg-white/10 transition-all">
                            <div className="flex items-center space-x-4">
                                <div className="flex -space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-therapy-500 border-2 border-[#12121A] flex items-center justify-center font-bold text-xs ring-2 ring-therapy-500/20">
                                        C
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-calm-500 border-2 border-[#12121A] flex items-center justify-center font-bold text-xs ring-2 ring-calm-500/20">
                                        T
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm">{session.client} & {session.therapist}</h3>
                                    <div className="flex items-center space-x-3 text-xs text-gray-400 mt-1">
                                        <span className="flex items-center">
                                            <Clock className="w-3 h-3 mr-1" />
                                            Started {session.startedAt}
                                        </span>
                                        <span className="flex items-center">
                                            <Info className="w-3 h-3 mr-1" />
                                            ID: {session.id}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="text-right mr-4">
                                    <div className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[10px] uppercase font-bold tracking-wider">
                                        Live
                                    </div>
                                    <p className="text-[10px] text-gray-500 mt-1">{session.participants} participants</p>
                                </div>
                                <Button size="sm" variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity border-white/10">
                                    Monitor
                                </Button>
                                <button className="p-2 hover:bg-white/10 rounded-lg">
                                    <MoreVertical className="w-4 h-4 text-gray-400" />
                                </button>
                            </div>
                        </div>
                    ))}
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
                            {recentSessions.map((session) => (
                                <tr key={session.id} className="hover:bg-white/5 transition-colors text-sm">
                                    <td className="px-4 py-4">{session.date}</td>
                                    <td className="px-4 py-4">{session.client}</td>
                                    <td className="px-4 py-4">{session.therapist}</td>
                                    <td className="px-4 py-4 text-gray-400">{session.duration}</td>
                                    <td className="px-4 py-4">
                                        <button className="flex items-center text-xs text-therapy-400 hover:text-therapy-300">
                                            <MessageSquare className="w-3 h-3 mr-1" />
                                            View Summary
                                        </button>
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <Button variant="ghost" size="sm">Details</Button>
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

const activeSessions = [
    { id: 'SES-001', client: 'Alice Freeman', therapist: 'Dr. Michael Chen', startedAt: '12 mins ago', participants: 2 },
    { id: 'SES-002', client: 'Robert Pattinson', therapist: 'Dr. Lisa Park', startedAt: '45 mins ago', participants: 2 },
    { id: 'SES-003', client: 'Emma Watson', therapist: 'Dr. Elena Rossi', startedAt: '5 mins ago', participants: 2 },
];

const recentSessions = [
    { id: 'SES-998', client: 'John Wick', therapist: 'Dr. David Kim', date: '2024-02-20', duration: '52m' },
    { id: 'SES-997', client: 'Bruce Wayne', therapist: 'Dr. Michael Chen', date: '2024-02-20', duration: '48m' },
    { id: 'SES-996', client: 'Peter Parker', therapist: 'Dr. Anna Muller', date: '2024-02-19', duration: '55m' },
    { id: 'SES-995', client: 'Tony Stark', therapist: 'Dr. Elena Rossi', date: '2024-02-19', duration: '45m' },
];
