'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Plus, Filter, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { apiHelpers } from '@/lib/api';
import toast from 'react-hot-toast';

const timeSlots = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
];

export default function SchedulePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [appointments, setAppointments] = useState<any[]>([]);
    const [availability, setAvailability] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const dateStr = selectedDate.toISOString().split('T')[0];
                const [sessionsRes, availabilityRes] = await Promise.all([
                    apiHelpers.sessions.getMine({ date: dateStr, role: 'therapist' }),
                    apiHelpers.therapistPortal.getAvailability({ date: dateStr })
                ]);

                setAppointments(sessionsRes.data.data || []);
                setAvailability(availabilityRes.data.data);
            } catch (error) {
                console.error('Failed to fetch schedule:', error);
                toast.error('Failed to load schedule');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [selectedDate]);

    const formatTime = (date: string) => {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <DashboardLayout type="therapist">
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Schedule</h1>
                        <p className="text-gray-400">Manage your availability and upcoming appointments</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
                            <Filter className="mr-2 h-4 w-4" />
                            Settings
                        </Button>
                        <Button className="bg-gradient-to-r from-therapy-500 to-calm-500 shadow-lg shadow-therapy-500/50">
                            <Plus className="mr-2 h-4 w-4" />
                            Set Unavailability
                        </Button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Calendar Mini View */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="bg-white/5 border-white/10 backdrop-blur-xl border-none">
                            <CardContent className="p-4 text-white">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="font-bold">
                                        {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                    </span>
                                    <div className="flex space-x-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-gray-400 hover:text-white"
                                            onClick={() => {
                                                const d = new Date(selectedDate);
                                                d.setMonth(d.getMonth() - 1);
                                                setSelectedDate(d);
                                            }}
                                        >
                                            <ChevronLeft size={16} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-gray-400 hover:text-white"
                                            onClick={() => {
                                                const d = new Date(selectedDate);
                                                d.setMonth(d.getMonth() + 1);
                                                setSelectedDate(d);
                                            }}
                                        >
                                            <ChevronRight size={16} />
                                        </Button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="text-gray-500 font-bold">{d}</div>)}
                                </div>
                                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                                    {/* Simplified Calendar Generation */}
                                    {Array.from({ length: 31 }, (_, i) => (
                                        <div
                                            key={i}
                                            onClick={() => {
                                                const d = new Date(selectedDate);
                                                d.setDate(i + 1);
                                                setSelectedDate(d);
                                            }}
                                            className={`p-2 rounded-lg cursor-pointer transition-colors ${i + 1 === selectedDate.getDate()
                                                    ? 'bg-therapy-500 text-white shadow-lg shadow-therapy-500/30'
                                                    : 'hover:bg-white/10 text-gray-400'
                                                }`}
                                        >
                                            {i + 1}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/5 border-white/10 backdrop-blur-xl border-none">
                            <CardHeader><CardTitle className="text-sm text-white">Daily Summary</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400 text-sm">Appointments</span>
                                    <span className="font-bold text-white">{appointments.length}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400 text-sm">Available Hours</span>
                                    <span className="font-bold text-green-400">{availability?.totalHours || '--'}h</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Time Grid */}
                    <div className="lg:col-span-3">
                        <Card className="bg-white/5 border-white/10 backdrop-blur-xl border-none overflow-hidden">
                            <CardHeader className="border-b border-white/5 bg-white/2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <h2 className="text-xl font-bold text-white">
                                            {selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'short', day: 'numeric' })}
                                        </h2>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-therapy-400 hover:text-therapy-300"
                                            onClick={() => setSelectedDate(new Date())}
                                        >
                                            Go to Today
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0 min-h-[500px] relative">
                                {isLoading ? (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-10">
                                        <Loader2 className="w-8 h-8 animate-spin text-therapy-500" />
                                    </div>
                                ) : null}
                                <div className="divide-y divide-white/5">
                                    {timeSlots.map((time) => {
                                        // Simple match for demonstration; in reality, we'd check actual session times
                                        const appt = appointments.find(a => formatTime(a.startTime).includes(time.split(' ')[0]));
                                        return (
                                            <div key={time} className="flex group min-h-[100px]">
                                                <div className="w-28 p-4 text-xs text-gray-500 font-medium border-r border-white/5 flex-shrink-0">
                                                    {time}
                                                </div>
                                                <div className="flex-1 p-3">
                                                    {appt ? (
                                                        <motion.div
                                                            initial={{ opacity: 0, x: 20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            className={`h-full p-4 rounded-xl border ${appt.status === 'Requested' ? 'bg-blue-500/10 border-blue-500/20' : 'bg-therapy-500/10 border-therapy-500/20'} relative group/appt cursor-pointer transition-all hover:translate-x-1 hover:border-therapy-500/40`}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <div className="font-bold text-white text-lg">{appt.userName || 'Anonymous Client'}</div>
                                                                    <div className="text-xs text-gray-400 flex items-center mt-2">
                                                                        <Clock size={14} className="mr-2" />
                                                                        {appt.duration || 50} min • {appt.type || 'Video'} Session
                                                                    </div>
                                                                </div>
                                                                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${appt.status === 'Requested' ? 'bg-blue-500/20 text-blue-400' : 'bg-therapy-500/20 text-therapy-400'}`}>
                                                                    {appt.status}
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    ) : (
                                                        <div className="h-full rounded-xl border border-dashed border-white/5 group-hover:bg-white/2 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-white">
                                                                <Plus size={16} className="mr-2" />
                                                                Add Session
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                {appointments.length === 0 && !isLoading && (
                                    <div className="p-20 text-center text-gray-500 italic">
                                        No appointments scheduled for this day.
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
