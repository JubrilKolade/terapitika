'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { GlassCard } from '@/components/shared/GlassCard';
import { LifeBuoy, Search, Filter, MessageSquare, Clock, CheckCircle2, AlertCircle, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiHelpers } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminSupportPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await apiHelpers.support.getTickets();
                setData(response.data.data);
            } catch (error) {
                console.error('Failed to fetch tickets:', error);
                toast.error('Failed to load support tickets');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTickets();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-therapy-500" />
            </div>
        );
    }

    const { stats, tickets } = data || {};

    return (
        <div className="space-y-8">
            <PageHeader
                title="Support Center"
                subtitle="Manage user inquiries, technical issues, and platform support tickets"
                icon={LifeBuoy}
                gradient
            />

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <StatSmall
                    icon={MessageSquare}
                    label="Total Tickets"
                    value={stats?.total || '0'}
                    color="text-blue-400"
                    bg="bg-blue-500/10"
                />
                <StatSmall
                    icon={Clock}
                    label="Open"
                    value={stats?.open || '0'}
                    color="text-yellow-400"
                    bg="bg-yellow-500/10"
                />
                <StatSmall
                    icon={AlertCircle}
                    label="Urgent"
                    value={stats?.urgent || '0'}
                    color="text-red-400"
                    bg="bg-red-500/10"
                />
                <StatSmall
                    icon={CheckCircle2}
                    label="Resolved"
                    value={stats?.resolved || '0'}
                    color="text-green-400"
                    bg="bg-green-500/10"
                />
            </div>

            <GlassCard gradient>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by User, Subject, or Ticket ID..."
                            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-therapy-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" className="border-white/10">
                            <Filter className="w-4 h-4 mr-2" />
                            Filter
                        </Button>
                        <Button size="sm" className="bg-therapy-500 hover:bg-therapy-600">Export CSV</Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10 text-left text-sm font-semibold text-gray-400">
                                <th className="px-4 py-3">ID</th>
                                <th className="px-4 py-3">Subject</th>
                                <th className="px-4 py-3">User</th>
                                <th className="px-4 py-3">Priority</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Last Activity</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {tickets?.length > 0 ? (
                                tickets.map((ticket: any) => (
                                    <tr key={ticket.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-4 py-4 text-sm font-mono text-gray-400">#{ticket.id.slice(0, 8)}</td>
                                        <td className="px-4 py-4">
                                            <div>
                                                <p className="font-medium">{ticket.subject}</p>
                                                <p className="text-xs text-gray-500">{ticket.category}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm">{ticket.userName || ticket.userEmail}</td>
                                        <td className="px-4 py-4">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${ticket.priority === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                {ticket.priority}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center space-x-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${ticket.status === 'Open' ? 'bg-yellow-400 animate-pulse' : 'bg-gray-500'}`} />
                                                <span className="text-sm">{ticket.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-400">{ticket.lastActivity || new Date(ticket.updatedAt).toLocaleDateString()}</td>
                                        <td className="px-4 py-4 text-right">
                                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                Reply
                                                <ExternalLink className="w-3 h-3 ml-2" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500 italic">
                                        No support tickets found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    );
}

function StatSmall({ icon: Icon, label, value, color, bg }: { icon: any, label: string, value: string, color: string, bg: string }) {
    return (
        <GlassCard className="!p-4" gradient>
            <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${bg} ${color}`}>
                    <Icon className="w-4 h-4" />
                </div>
                <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
                    <p className={`text-xl font-bold ${color}`}>{value}</p>
                </div>
            </div>
        </GlassCard>
    );
}

const tickets = [
    { id: 'TKT-1029', subject: 'Error during payment processing', lastMessage: 'The application froze when I clicked "Pay Now"...', user: 'Sarah Blake', priority: 'High', status: 'Open', category: 'Billing', updatedAt: '12 mins ago' },
    { id: 'TKT-1028', subject: 'How to export session logs?', lastMessage: 'I need to download my session history for insurance purposes.', user: 'Michael Scott', priority: 'Low', status: 'Open', category: 'General', updatedAt: '1 hour ago' },
    { id: 'TKT-1027', subject: 'Therapist verification delay', lastMessage: 'I uploaded my certificates 3 days ago and haven\'t heard back...', user: 'Dr. Jane Smith', priority: 'Medium', status: 'Open', category: 'Account', updatedAt: '3 hours ago' },
    { id: 'TKT-1026', subject: 'Forgot my recovery phrase', lastMessage: 'I can\'t access my old wallet for session payments.', user: 'David Goggins', priority: 'High', status: 'Closed', category: 'Security', updatedAt: 'Yesterday' },
];
