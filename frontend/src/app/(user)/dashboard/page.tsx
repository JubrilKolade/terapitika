'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Calendar,
  Video,
  TrendingUp,
  Clock,
  Heart,
  Plus,
  Target,
  Award,
  ChevronRight,
  Brain,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/authstore';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function Dashboard() {
  const { user } = useAuthStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, <span className="bg-gradient-to-r from-therapy-400 to-calm-400 bg-clip-text text-transparent">{user?.firstName}</span>
            </h1>
            <p className="text-gray-400">Here's your mental health dashboard for {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="hidden md:block text-right">
            <div className="text-2xl font-mono font-bold bg-gradient-to-r from-therapy-400 to-calm-400 bg-clip-text text-transparent">
              {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Card key={i} className="bg-white/5 border-white/10 backdrop-blur-xl group hover:border-therapy-500/50 transition-all overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-therapy-500/5 to-calm-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-1 text-green-400 text-sm">
                    <TrendingUp className="w-4 h-4" />
                    <span>{stat.change}%</span>
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1 text-white">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Upcoming Sessions */}
          <Card className="lg:col-span-2 bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-3 text-white">
                <Calendar className="w-6 h-6 text-therapy-400" />
                <span>Upcoming Sessions</span>
              </CardTitle>
              <Link href="/bookings">
                <Button size="sm" className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600">
                  <Plus className="w-4 h-4 mr-1" />
                  Book New
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingSessions.map((session, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-therapy-500/50 transition-all cursor-pointer group/item"
                >
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-therapy-400 to-calm-400 flex items-center justify-center font-semibold">
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
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl text-white">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, i) => (
                <Link key={i} href={action.href}>
                  <button className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:border-therapy-500/50 hover:bg-white/10 transition-all flex items-center justify-between group/action text-white">
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
            </CardContent>
          </Card>
        </div>

        {/* Bottom Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Mood Tracker */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl text-white">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-3">
                <Heart className="w-6 h-6 text-therapy-400" />
                <span>Mood Trends</span>
              </CardTitle>
              <Button size="sm" variant="ghost">View All</Button>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          {/* Goals */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl text-white">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-3">
                <Target className="w-6 h-6 text-calm-400" />
                <span>Active Goals</span>
              </CardTitle>
              <Button size="sm" variant="ghost">
                <Plus className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {goals.map((goal, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{goal.title}</span>
                    <span className="text-sm text-therapy-400">{goal.progress}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-therapy-500 to-calm-500 transition-all"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
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
    href: '/bookings?type=video',
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
    href: '/bookings',
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
