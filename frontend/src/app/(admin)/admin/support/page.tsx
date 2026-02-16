'use client';

import { PageHeader } from '@/components/shared/PageHeader';
import { GlassCard } from '@/components/shared/GlassCard';
import { MessageSquare, Search, Filter, MessageCircle, Clock, User, CheckCircle, Reply } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function AdminSupportPage() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="space-y-8">
            <PageHeader
                title="Support Tickets"
                subtitle="Manage user inquiries, technical issues, and platform support"
                icon={MessageSquare}
                actions={
                    <Button className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600">
                        Open New Ticket
                    </Button>
                }
            />

            {/* Ticket Stats */}
            <div className="grid md:grid-cols-4 gap-6">
                <StatSmall label="Total Open" value="24" color="text-therapy-400" />
                <StatSmall label="Assigned to Me" value="08" color="text-calm-400" />
                <StatSmall label="High Priority" value="05" color="text-red-400" />
                <StatSmall label="Avg Response" value="2.4h" color="text-blue-400" />
            </div>

            {/* Tickets Table */}
            <GlassCard gradient>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by ticket ID, user, or subject..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-therapy-500"
                        />
                    </div>
                    <Button variant="outline" className="border-white/10 hover:bg-white/10">
                        <Filter className="w-4 h-4 mr-2" />
                        Priority
                    </Button>
                </div>

                <div className="space-y-4">
                    {tickets.map((ticket) => (
                        <div key={ticket.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start space-x-4">
                                    <div className={`p-2 rounded-lg ${ticket.priority === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                                        }`}>
                                        <MessageCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-xs font-mono text-gray-500">{ticket.id}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${ticket.priority === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                                                }`}>
                                                {ticket.priority} Priority
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold mt-1">{ticket.subject}</h3>
                                        <p className="text-sm text-gray-400 line-clamp-1">{ticket.lastMessage}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${ticket.status === 'Open' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                                        }`}>
                                        {ticket.status}
                                    </span>
                                    <p className="text-xs text-gray-500 mt-2 flex items-center justify-end">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {ticket.updatedAt}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">
                                            {ticket.user.charAt(0)}
                                        </div>
                                        <span className="text-xs text-gray-400">{ticket.user}</span>
                                    </div>
                                    <span className="text-xs text-gray-600">|</span>
                                    <span className="text-xs text-gray-400">{ticket.category}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button size="sm" variant="ghost" className="text-xs hover:bg-white/5">
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Resolve
                                    </Button>
                                    <Button size="sm" className="text-xs bg-therapy-500/20 text-therapy-400 hover:bg-therapy-500/30">
                                        <Reply className="w-4 h-4 mr-2" />
                                        Reply
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    );
}

function StatSmall({ label, value, color }: { label: string, value: string, color: string }) {
    return (
        <GlassCard gradient className="py-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </GlassCard>
    );
}

const tickets = [
    { id: 'TKT-1029', subject: 'Error during payment processing', lastMessage: 'The application froze when I clicked "Pay Now"...', user: 'Sarah Blake', priority: 'High', status: 'Open', category: 'Billing', updatedAt: '12 mins ago' },
    { id: 'TKT-1028', subject: 'How to export session logs?', lastMessage: 'I need to download my session history for insurance purposes.', user: 'Michael Scott', priority: 'Low', status: 'Open', category: 'General', updatedAt: '1 hour ago' },
    { id: 'TKT-1027', subject: 'Therapist verification delay', lastMessage: 'I uploaded my certificates 3 days ago and haven\'t heard back...', user: 'Dr. Jane Smith', priority: 'Medium', status: 'Open', category: 'Account', updatedAt: '3 hours ago' },
    { id: 'TKT-1026', subject: 'Forgot my recovery phrase', lastMessage: 'I can\'t access my old wallet for session payments.', user: 'David Goggins', priority: 'High', status: 'Closed', category: 'Security', updatedAt: 'Yesterday' },
];
