'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { GlassCard } from '@/components/shared/GlassCard';
import {
    UserCheck, Search, Filter, CheckCircle, Clock, MoreVertical, XCircle,
    Loader2, AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiHelpers } from '@/lib/api';

interface TherapistItem {
    id: string;
    firstName: string;
    lastName: string;
    specializations: string[];
    rating: number;
    totalSessions: number;
    totalClients?: number;
    createdAt: string;
    verified: boolean;
}

export default function AdminTherapistsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [pending, setPending] = useState<TherapistItem[]>([]);
    const [active, setActive] = useState<TherapistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [pendingRes, activeRes] = await Promise.all([
                apiHelpers.admin.getPendingVerifications(),
                apiHelpers.therapists.getAll({ search: searchQuery || undefined }),
            ]);
            setPending(pendingRes.data.data?.data || pendingRes.data.data || []);
            setActive(activeRes.data.data?.data || activeRes.data.data || []);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load therapists');
        } finally {
            setLoading(false);
        }
    }, [searchQuery]);

    useEffect(() => {
        const debounce = setTimeout(() => fetchData(), 300);
        return () => clearTimeout(debounce);
    }, [fetchData]);

    const handleVerify = async (id: string, status: string) => {
        try {
            setActionLoading(id);
            await apiHelpers.admin.verifyTherapist(id, status);
            setPending((prev) => prev.filter((t) => t.id !== id));
            if (status === 'APPROVED') fetchData();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Action failed');
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="space-y-8">
                <PageHeader title="Therapist Management" subtitle="Review applications and manage active therapists" icon={UserCheck} />
                <div className="flex items-center justify-center min-h-[40vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-therapy-400" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-8">
                <PageHeader title="Therapist Management" subtitle="Review applications and manage active therapists" icon={UserCheck} />
                <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
                    <AlertTriangle className="w-12 h-12 text-red-400" />
                    <p className="text-gray-400">{error}</p>
                    <Button onClick={fetchData}>Retry</Button>
                </div>
            </div>
        );
    }

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
                            {pending.length} Pending
                        </span>
                    </h2>
                </div>
                <div className="space-y-4">
                    {pending.length === 0 ? (
                        <p className="text-gray-400 text-center py-8">No pending verifications</p>
                    ) : (
                        pending.map((therapist) => (
                            <div key={therapist.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-calm-400 to-therapy-400 flex items-center justify-center text-lg font-bold">
                                        {therapist.firstName?.charAt(0) || '?'}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{therapist.firstName} {therapist.lastName}</h3>
                                        <p className="text-sm text-gray-400">{therapist.specializations?.join(', ') || 'N/A'}</p>
                                        <p className="text-xs text-gray-500 mt-1">Applied {new Date(therapist.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {actionLoading === therapist.id ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <Button size="sm" variant="outline" className="border-white/10 hover:bg-green-500/20 hover:text-green-400"
                                                onClick={() => handleVerify(therapist.id, 'APPROVED')}>
                                                <CheckCircle className="w-4 h-4 mr-2" /> Approve
                                            </Button>
                                            <Button size="sm" variant="outline" className="border-white/10 hover:bg-red-500/20 hover:text-red-400"
                                                onClick={() => handleVerify(therapist.id, 'REJECTED')}>
                                                <XCircle className="w-4 h-4 mr-2" /> Reject
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
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
                        <Filter className="w-4 h-4 mr-2" /> Filters
                    </Button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {active.length === 0 ? (
                        <p className="col-span-full text-gray-400 text-center py-8">No therapists found</p>
                    ) : (
                        active.map((therapist) => (
                            <div key={therapist.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 group hover:bg-white/10 transition-all duration-300">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-therapy-400 to-calm-400 flex items-center justify-center text-xl font-bold">
                                        {therapist.firstName?.charAt(0) || '?'}
                                    </div>
                                    <button className="p-2 hover:bg-white/10 rounded-lg">
                                        <MoreVertical className="w-5 h-5 text-gray-400" />
                                    </button>
                                </div>
                                <h3 className="text-lg font-bold">{therapist.firstName} {therapist.lastName}</h3>
                                <p className="text-sm text-therapy-400 mb-4">{therapist.specializations?.join(', ') || 'N/A'}</p>
                                <div className="space-y-2 mb-6">
                                    <div className="flex justify-between text-sm text-gray-400">
                                        <span>Rating</span>
                                        <span className="text-white font-semibold">{therapist.rating || 'N/A'} ⭐</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-400">
                                        <span>Patients</span>
                                        <span className="text-white font-semibold">{therapist.totalClients || 0}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-400">
                                        <span>Sessions</span>
                                        <span className="text-white font-semibold">{therapist.totalSessions || 0}</span>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <Button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10">Profile</Button>
                                    <Button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10">Sessions</Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </GlassCard>
        </div>
    );
}
