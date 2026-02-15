'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Activity,
  Calendar,
  MessageSquare,
  Video,
  TrendingUp,
  Clock,
  Heart,
  Zap,
  Users,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  Plus,
  Target,
  Award,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {/* Animated Grid Background */}
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

      {/* Glow Effects */}
      <div className="fixed top-20 left-20 w-96 h-96 bg-therapy-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 right-20 w-96 h-96 bg-calm-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-xl bg-[#0A0A0F]/80 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-xl blur-md group-hover:blur-lg transition-all" />
                  <div className="relative w-10 h-10 bg-gradient-to-br from-therapy-500 to-calm-600 rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                </div>
                <span className="text-xl font-display font-bold">Terapitika</span>
              </Link>

              {/* Time & Date */}
              <div className="hidden md:flex flex-col items-end">
                <div className="text-sm text-gray-400">
                  {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="text-2xl font-mono font-bold bg-gradient-to-r from-therapy-400 to-calm-400 bg-clip-text text-transparent">
                  {currentTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </div>
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-4">
                <button className="relative p-2 hover:bg-white/5 rounded-lg transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-therapy-500 rounded-full animate-pulse" />
                </button>
                <Link href="/settings">
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
              Welcome back, <span className="bg-gradient-to-r from-therapy-400 to-calm-400 bg-clip-text text-transparent">{user?.firstName}</span>
            </h1>
            <p className="text-gray-400">Here's your mental health dashboard</p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, i) => (
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
                    <div className="flex items-center space-x-1 text-green-400 text-sm">
                      <TrendingUp className="w-4 h-4" />
                      <span>{stat.change}%</span>
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
            {/* Upcoming Sessions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-therapy-500/5 to-calm-500/5 rounded-2xl blur-xl" />
              <div className="relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-6 h-6 text-therapy-400" />
                    <h2 className="text-xl font-bold">Upcoming Sessions</h2>
                  </div>
                  <Link href="/booking">
                    <Button size="sm" className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600">
                      <Plus className="w-4 h-4 mr-1" />
                      Book New
                    </Button>
                  </Link>
                </div>

                <div className="space-y-4">
                  {upcomingSessions.map((session, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-therapy-500/50 transition-all cursor-pointer group/item"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-therapy-400 to-calm-400 flex items-center justify-center text-white font-semibold">
                            {session.therapist.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold group-hover/item:text-therapy-400 transition-colors">
                              {session.therapist}
                            </div>
                            <div className="text-sm text-gray-400">{session.type}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">{session.time}</div>
                          <div className="text-xs text-gray-400">{session.date}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-calm-500/5 to-therapy-500/5 rounded-2xl blur-xl" />
              <div className="relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
                <div className="space-y-3">
                  {quickActions.map((action, i) => (
                    <Link key={i} href={action.href}>
                      <button className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:border-therapy-500/50 hover:bg-white/10 transition-all flex items-center justify-between group/action">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.gradient} flex items-center justify-center`}>
                            <action.icon className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-medium">{action.label}</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover/action:text-therapy-400 group-hover/action:translate-x-1 transition-all" />
                      </button>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Additional Sections */}
          <div className="grid lg:grid-cols-2 gap-6 mt-6">
            {/* Mood Tracker */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-therapy-500/5 to-calm-500/5 rounded-2xl blur-xl" />
              <div className="relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Heart className="w-6 h-6 text-therapy-400" />
                    <h2 className="text-xl font-bold">Mood Trends</h2>
                  </div>
                  <Button size="sm" variant="ghost">View All</Button>
                </div>
                <div className="h-48 flex items-end justify-between space-x-2">
                  {moodData.map((value, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-gradient-to-t from-therapy-500 to-calm-500 rounded-t-lg transition-all hover:from-therapy-400 hover:to-calm-400"
                        style={{ height: `${value * 10}%` }}
                      />
                      <div className="text-xs text-gray-500 mt-2">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Goals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-calm-500/5 to-therapy-500/5 rounded-2xl blur-xl" />
              <div className="relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Target className="w-6 h-6 text-calm-400" />
                    <h2 className="text-xl font-bold">Active Goals</h2>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  {goals.map((goal, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{goal.title}</span>
                        <span className="text-sm text-therapy-400">{goal.progress}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-therapy-500 to-calm-500 transition-all"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}

const stats = [
  {
    icon: Activity,
    label: 'Total Sessions',
    value: '24',
    change: '+12',
    gradient: 'from-therapy-500 to-therapy-600',
  },
  {
    icon: Clock,
    label: 'Hours Talked',
    value: '18.5',
    change: '+8',
    gradient: 'from-calm-500 to-calm-600',
  },
  {
    icon: TrendingUp,
    label: 'Mood Score',
    value: '8.2',
    change: '+5',
    gradient: 'from-green-500 to-green-600',
  },
  {
    icon: Award,
    label: 'Achievements',
    value: '12',
    change: '+3',
    gradient: 'from-yellow-500 to-yellow-600',
  },
];

const quickActions = [
  {
    icon: Brain,
    label: 'AI Chat',
    href: '/chat?type=ai',
    gradient: 'from-therapy-500 to-therapy-600',
  },
  {
    icon: Video,
    label: 'Video Session',
    href: '/booking?type=video',
    gradient: 'from-calm-500 to-calm-600',
  },
  {
    icon: MessageSquare,
    label: 'Message Therapist',
    href: '/chat',
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    icon: Calendar,
    label: 'Book Appointment',
    href: '/booking',
    gradient: 'from-purple-500 to-purple-600',
  },
];

const upcomingSessions = [
  {
    therapist: 'Dr. Sarah Johnson',
    type: 'Video Session',
    date: 'Today',
    time: '2:00 PM',
  },
  {
    therapist: 'Dr. Michael Chen',
    type: 'Chat Session',
    date: 'Tomorrow',
    time: '10:00 AM',
  },
  {
    therapist: 'Dr. Emily Rodriguez',
    type: 'Voice Call',
    date: 'Feb 20',
    time: '4:00 PM',
  },
];

const moodData = [7, 8, 6, 9, 8, 7, 9];

const goals = [
  { title: 'Practice daily meditation', progress: 75 },
  { title: 'Improve sleep quality', progress: 60 },
  { title: 'Reduce anxiety levels', progress: 85 },
];