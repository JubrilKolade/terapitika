'use client';

import { useState } from 'react';
import {
  Calendar,
  Users,
  DollarSign,
  Clock,
  Video,
  Star,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/authstore';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function TherapistDashboard() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <DashboardLayout type="therapist">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, <span className="bg-gradient-to-r from-therapy-400 to-calm-400 bg-clip-text text-transparent">Dr. {user?.lastName}</span>
          </h1>
          <p className="text-gray-400">Here's what's happening with your practice today</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {therapistStats.map((stat, i) => (
            <Card key={i} className="bg-white/5 border-white/10 backdrop-blur-xl group hover:border-therapy-500/50 transition-all overflow-hidden relative border-none">
              <div className="absolute inset-0 bg-gradient-to-br from-therapy-500/5 to-calm-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-6 relative text-white border-white/10 border rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`text-sm font-semibold ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.change}
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <Card className="lg:col-span-2 bg-white/5 border-white/10 backdrop-blur-xl text-white border-none">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-3">
                <Calendar className="w-6 h-6 text-therapy-400" />
                <span>Today's Schedule</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="ghost" className="hover:bg-white/10">
                  <Filter className="w-4 h-4" />
                </Button>
                <Link href="/therapist/schedule">
                  <Button size="sm" className="bg-gradient-to-r from-therapy-500 to-calm-500">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {todaySessions.map((session, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-therapy-500/50 transition-all cursor-pointer group/session"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-therapy-400 to-calm-400 flex items-center justify-center font-semibold">
                        {session.client.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold group-hover/session:text-therapy-400 transition-colors">
                          {session.client}
                        </div>
                        <div className="text-sm text-gray-400 flex items-center space-x-2">
                          <Clock className="w-3 h-3" />
                          <span>{session.time}</span>
                          <span>•</span>
                          <span>{session.duration}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${session.type === 'Video'
                          ? 'bg-therapy-500/20 text-therapy-400'
                          : session.type === 'Chat'
                            ? 'bg-calm-500/20 text-calm-400'
                            : 'bg-green-500/20 text-green-400'
                        }`}>
                        {session.type}
                      </div>
                      <Link href={`/therapist/session/${session.id}`}>
                        <Button size="sm" className="bg-gradient-to-r from-therapy-500 to-calm-500">
                          Start
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Stats Sidebar */}
          <div className="space-y-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl text-white">
              <CardHeader>
                <CardTitle className="text-lg">Active Clients</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {clientStats.map((stat, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">{stat.label}</span>
                    <span className="text-lg font-bold">{stat.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-xl text-white">
              <CardHeader>
                <CardTitle className="text-lg text-center">Your Rating</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-5xl font-bold mb-2">4.9</div>
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-400">Based on 127 reviews</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-xl text-white">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { label: 'View Clients', href: '/therapist/clients' },
                  { label: 'Manage Schedule', href: '/therapist/schedule' },
                  { label: 'View Earnings', href: '/therapist/earnings' },
                ].map((action, i) => (
                  <Link key={i} href={action.href}>
                    <button className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left flex items-center justify-between group">
                      <span>{action.label}</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-therapy-400" />
                    </button>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

const therapistStats = [
  {
    icon: Users,
    label: 'Active Clients',
    value: '32',
    change: '+4 this week',
    trend: 'up',
    gradient: 'from-therapy-500 to-therapy-600',
  },
  {
    icon: Calendar,
    label: "Today's Sessions",
    value: '6',
    change: '2 completed',
    trend: 'up',
    gradient: 'from-calm-500 to-calm-600',
  },
  {
    icon: DollarSign,
    label: 'This Month',
    value: '$8,450',
    change: '+15%',
    trend: 'up',
    gradient: 'from-green-500 to-green-600',
  },
  {
    icon: Clock,
    label: 'Hours This Week',
    value: '28.5',
    change: '+3.5',
    trend: 'up',
    gradient: 'from-blue-500 to-blue-600',
  },
];

const todaySessions = [
  { id: '1', client: 'Sarah Mitchell', time: '9:00 AM', duration: '50 min', type: 'Video' },
  { id: '2', client: 'James Wilson', time: '11:00 AM', duration: '50 min', type: 'Chat' },
  { id: '3', client: 'Emily Chen', time: '2:00 PM', duration: '50 min', type: 'Video' },
  { id: '4', client: 'Michael Brown', time: '4:00 PM', duration: '50 min', type: 'Voice' },
];

const clientStats = [
  { label: 'New This Week', value: '4' },
  { label: 'Ongoing', value: '28' },
  { label: 'Waitlist', value: '12' },
];
