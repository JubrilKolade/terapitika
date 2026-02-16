'use client';

import { PageHeader } from '@/components/shared/PageHeader';
import { GlassCard } from '@/components/shared/GlassCard';
import { UserCheck, Search, Filter, Mail, CheckCircle, Clock, MoreVertical, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function AdminTherapistsPage() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="space-y-8">
            <PageHeader
                title="Therapist Management"
                subtitle="Review applications and manage active therapists"
                icon={UserCheck}
                actions={
                    <Button className="bg-gradient-to-r from-calm-500 to-therapy-500 hover:from-calm-600 hover:to-therapy-600">
                        Export List
                    </Button>
                }
            />

            {/* Verification Queue */}
            <GlassCard gradient>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-calm-400" />
                        <span>Verification Queue</span>
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-calm-500/20 text-calm-400 text-xs">
                            4 Pending
                        </span>
                    </h2>
                </div>
                <div className="space-y-4">
                    {pendingTherapists.map((therapist) => (
                        <div key={therapist.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-calm-400 to-therapy-400 flex items-center justify-center text-lg font-bold">
                                    {therapist.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-semibold">{therapist.name}</h3>
                                    <p className="text-sm text-gray-400">{therapist.specialization}</p>
                                    <p className="text-xs text-gray-500 mt-1">Applied {therapist.appliedDate}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button size="sm" variant="outline" className="border-white/10 hover:bg-green-500/20 hover:text-green-400">
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Approve
                                </Button>
                                <Button size="sm" variant="outline" className="border-white/10 hover:bg-red-500/20 hover:text-red-400">
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Reject
                                </Button>
                                <Button size="sm" variant="ghost">View Docs</Button>
                            </div>
                        </div>
                    ))}
                </div>
            </GlassCard>

            {/* Active Therapists List */}
            <GlassCard gradient>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search active therapists..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-therapy-500"
                        />
                    </div>
                    <Button variant="outline" className="border-white/10 hover:bg-white/10">
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                    </Button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeTherapists.map((therapist) => (
                        <div key={therapist.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 group hover:bg-white/10 transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-therapy-400 to-calm-400 flex items-center justify-center text-xl font-bold">
                                    {therapist.name.charAt(4)}
                                </div>
                                <button className="p-2 hover:bg-white/10 rounded-lg">
                                    <MoreVertical className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                            <h3 className="text-lg font-bold">{therapist.name}</h3>
                            <p className="text-sm text-therapy-400 mb-4">{therapist.specialization}</p>

                            <div className="space-y-2 mb-6">
                                <div className="flex justify-between text-sm text-gray-400">
                                    <span>Rating</span>
                                    <span className="text-white font-semibold">{therapist.rating} ⭐</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-400">
                                    <span>Patients</span>
                                    <span className="text-white font-semibold">{therapist.patients}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-400">
                                    <span>Sessions</span>
                                    <span className="text-white font-semibold">{therapist.sessions}</span>
                                </div>
                            </div>

                            <div className="flex space-x-2">
                                <Button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10">
                                    Profile
                                </Button>
                                <Button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10">
                                    Sessions
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    );
}

const pendingTherapists = [
    { id: '1', name: 'Dr. Sarah Connor', specialization: 'PTSD & Trauma', appliedDate: '2 days ago' },
    { id: '2', name: 'Dr. James Howlett', specialization: 'Anger Management', appliedDate: '3 days ago' },
    { id: '3', name: 'Dr. Jean Grey', specialization: 'Stress & Anxiety', appliedDate: '5 days ago' },
    { id: '4', name: 'Dr. Charles Xavier', specialization: 'Child Psychology', appliedDate: '1 week ago' },
];

const activeTherapists = [
    { id: '5', name: 'Dr. Michael Chen', specialization: 'Cognitive Behavioral Therapy', rating: 4.9, patients: 24, sessions: 156 },
    { id: '6', name: 'Dr. Lisa Park', specialization: 'Family Counseling', rating: 4.8, patients: 18, sessions: 89 },
    { id: '7', name: 'Dr. Elena Rossi', specialization: 'Relationship Therapy', rating: 4.9, patients: 22, sessions: 112 },
    { id: '8', name: 'Dr. David Kim', specialization: 'Depression Specialist', rating: 4.7, patients: 15, sessions: 67 },
    { id: '9', name: 'Dr. Anna Muller', specialization: 'Workplace Stress', rating: 4.8, patients: 20, sessions: 94 },
];
