'use client';

import { motion } from 'framer-motion';
import { Users, Search, Filter, MessageSquare, Video, MoreHorizontal, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Input } from '@/components/ui/input';

const clients = [
    { id: 1, name: 'Sarah Mitchell', status: 'Active', nextSession: 'Feb 17, 2:00 PM', totalSessions: 12, image: 'S' },
    { id: 2, name: 'James Wilson', status: 'Active', nextSession: 'Feb 19, 10:00 AM', totalSessions: 4, image: 'J' },
    { id: 3, name: 'Emily Chen', status: 'On Break', nextSession: 'TBD', totalSessions: 28, image: 'E' },
    { id: 4, name: 'Michael Brown', status: 'Active', nextSession: 'Feb 21, 4:00 PM', totalSessions: 6, image: 'M' },
];

export default function ClientsPage() {
    return (
        <DashboardLayout type="therapist">
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">My Clients</h1>
                        <p className="text-gray-400">Manage your patient list and clinical records</p>
                    </div>
                    <Button className="bg-gradient-to-r from-therapy-500 to-calm-500 shadow-lg shadow-therapy-500/50">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add New Client
                    </Button>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search clients..."
                            className="pl-10 bg-white/5 border-white/10 text-white focus:ring-therapy-500/50"
                        />
                    </div>
                    <Button variant="outline" className="border-white/10 text-white whitespace-nowrap">
                        <Filter className="mr-2 h-4 w-4" />
                        Active Only
                    </Button>
                </div>

                <div className="grid gap-4">
                    {clients.map((client) => (
                        <Card key={client.id} className="bg-white/5 border-white/10 backdrop-blur-xl hover:border-therapy-500/50 transition-all group overflow-hidden border-none cursor-pointer">
                            <CardContent className="p-6 relative text-white border-white/10 border rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center space-x-4">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-therapy-400 to-calm-400 flex items-center justify-center text-xl font-bold">
                                        {client.image}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white group-hover:text-therapy-400 transition-colors">{client.name}</h3>
                                        <div className="flex items-center space-x-2 text-sm">
                                            <span className={client.status === 'Active' ? 'text-green-400' : 'text-yellow-400'}>
                                                {client.status}
                                            </span>
                                            <span className="text-gray-600">•</span>
                                            <span className="text-gray-400">{client.totalSessions} total sessions</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-row md:flex-col lg:flex-row items-center gap-8 md:gap-2 lg:gap-8 flex-1 justify-center">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-400 uppercase font-bold text-center md:text-left">Next Session</span>
                                        <span className="text-white">{client.nextSession}</span>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Button variant="ghost" size="icon" className="hover:bg-white/10">
                                        <MessageSquare className="w-4 h-4 text-therapy-400" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="hover:bg-white/10">
                                        <Video className="w-4 h-4 text-calm-400" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="hover:bg-white/10">
                                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                                    </Button>
                                    <Button className="bg-white/5 border border-white/10 hover:bg-white/10 text-white ml-2">
                                        View Records
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
