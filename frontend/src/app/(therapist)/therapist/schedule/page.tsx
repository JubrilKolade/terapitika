'use client';

import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const timeSlots = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
];

const appointments = [
    { time: '09:00 AM', client: 'Sarah Mitchell', type: 'Video', status: 'Confirmed' },
    { time: '11:00 AM', client: 'James Wilson', type: 'Chat', status: 'Confirmed' },
    { time: '02:00 PM', client: 'Emily Chen', type: 'Video', status: 'Confirmed' },
    { time: '04:00 PM', client: 'Michael Brown', type: 'Voice', status: 'Requested' },
];

export default function SchedulePage() {
    return (
        <DashboardLayout type="therapist">
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Schedule</h1>
                        <p className="text-gray-400">Manage your availability and upcoming appointments</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" className="border-white/10 text-white">
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
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="font-bold">February 2024</span>
                                    <div className="flex space-x-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400"><ChevronLeft size={16} /></Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400"><ChevronRight size={16} /></Button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="text-gray-500 font-bold">{d}</div>)}
                                </div>
                                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                                    {Array.from({ length: 29 }, (_, i) => (
                                        <div key={i} className={`p-2 rounded-lg cursor-pointer transition-colors ${i + 1 === 17 ? 'bg-therapy-500 text-white' : 'hover:bg-white/10 text-gray-400'}`}>
                                            {i + 1}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/5 border-white/10 backdrop-blur-xl border-none">
                            <CardHeader><CardTitle className="text-sm">Today's Summary</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400 text-sm">Appointments</span>
                                    <span className="font-bold">6</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400 text-sm">Available Hours</span>
                                    <span className="font-bold text-green-400">4.5h</span>
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
                                        <h2 className="text-xl font-bold">Monday, Feb 17</h2>
                                        <Button variant="ghost" size="sm" className="text-therapy-400">Go to Today</Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-white/5">
                                    {timeSlots.map((time) => {
                                        const appt = appointments.find(a => a.time === time);
                                        return (
                                            <div key={time} className="flex group min-h-[80px]">
                                                <div className="w-24 p-4 text-xs text-gray-500 font-medium border-r border-white/5 flex-shrink-0">
                                                    {time}
                                                </div>
                                                <div className="flex-1 p-2">
                                                    {appt ? (
                                                        <div className={`h-full p-4 rounded-xl border ${appt.status === 'Requested' ? 'bg-blue-500/10 border-blue-500/20' : 'bg-therapy-500/10 border-therapy-500/20'} relative group/appt cursor-pointer transition-all hover:translate-x-1`}>
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <div className="font-bold text-white">{appt.client}</div>
                                                                    <div className="text-xs text-gray-400 flex items-center mt-1">
                                                                        <Clock size={12} className="mr-1" />
                                                                        50 min • {appt.type} Session
                                                                    </div>
                                                                </div>
                                                                <div className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${appt.status === 'Requested' ? 'text-blue-400' : 'text-therapy-400'}`}>
                                                                    {appt.status}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="h-full rounded-xl border border-dashed border-white/5 group-hover:bg-white/2 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
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
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
