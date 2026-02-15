'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Users,
  DollarSign,
  Clock,
  MessageSquare,
  Video,
  TrendingUp,
  Star,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  Plus,
  Filter,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

export default function TherapistDashboard() {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(14, 165, 233, 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="fixed top-20 left-20 w-96 h-96 bg-therapy-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 right-20 w-96 h-96 bg-calm-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-xl bg-[#0A0A0F]/80 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-6">
                <h1 className="text-xl font-display font-bold">Therapist Portal</h1>
                <nav className="hidden md:flex space-x-1">
                  {['Overview', 'Clients', 'Schedule', 'Earnings'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab.toLowerCase())}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        activeTab === tab.toLowerCase()
                          ? 'bg-therapy-500/20 text-therapy-400'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="flex items-center space-x-4">
                <button className="relative p-2 hover:bg-white/5 rounded-lg transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-therapy-500 rounded-full animate-pulse" />
                </button>
                <Link href="/therapist/settings">
                  <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                    <Settings className="w-5 h-5" />
                  </button>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors text-red-400"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, <span className="bg-gradient-to-r from-therapy-400 to-calm-400 bg-clip-text text-transparent">Dr. {user?.lastName}</span>
            </h1>
            <p className="text-gray-400">Here's what's happening with your practice today</p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {therapistStats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-therapy-500/10 to-calm-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-therapy-500/50 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-semibold ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                        {stat.change}
                      </div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Today's Schedule */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-therapy-500/5 to-calm-500/5 rounded-2xl blur-xl" />
              <div className="relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-6 h-6 text-therapy-400" />
                    <h2 className="text-xl font-bold">Today's Schedule</h2>
                  </div>
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
                </div>

                <div className="space-y-4">
                  {todaySessions.map((session, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-therapy-500/50 transition-all cursor-pointer group/session"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-therapy-400 to-calm-400 flex items-center justify-center text-white font-semibold">
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
                          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            session.type === 'Video' 
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
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-6"
            >
              {/* Client Stats */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-calm-500/5 to-therapy-500/5 rounded-2xl blur-xl" />
                <div className="relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                  <h3 className="text-lg font-bold mb-4">Active Clients</h3>
                  <div className="space-y-3">
                    {clientStats.map((stat, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">{stat.label}</span>
                        <span className="text-lg font-bold">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-therapy-500/5 to-calm-500/5 rounded-2xl blur-xl" />
                <div className="relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                  <h3 className="text-lg font-bold mb-4">Your Rating</h3>
                  <div className="text-center">
                    <div className="text-5xl font-bold mb-2">4.9</div>
                    <div className="flex justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-400">Based on 127 reviews</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-calm-500/5 to-therapy-500/5 rounded-2xl blur-xl" />
                <div className="relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                  <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <Link href="/therapist/clients">
                      <button className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left flex items-center justify-between group">
                        <span>View Clients</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                    <Link href="/therapist/schedule">
                      <button className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left flex items-center justify-between group">
                        <span>Manage Schedule</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                    <Link href="/therapist/earnings">
                      <button className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left flex items-center justify-between group">
                        <span>View Earnings</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
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
  {
    id: '1',
    client: 'Sarah Mitchell',
    time: '9:00 AM',
    duration: '50 min',
    type: 'Video',
  },
  {
    id: '2',
    client: 'James Wilson',
    time: '11:00 AM',
    duration: '50 min',
    type: 'Chat',
  },
  {
    id: '3',
    client: 'Emily Chen',
    time: '2:00 PM',
    duration: '50 min',
    type: 'Video',
  },
  {
    id: '4',
    client: 'Michael Brown',
    time: '4:00 PM',
    duration: '50 min',
    type: 'Voice',
  },
];

const clientStats = [
  { label: 'New This Week', value: '4' },
  { label: 'Ongoing', value: '28' },
  { label: 'Waitlist', value: '12' },
];