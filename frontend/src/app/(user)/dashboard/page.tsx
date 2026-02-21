'use client';

import { useState, useEffect } from 'react';
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
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/authstore';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { apiHelpers } from '@/lib/api';

interface DashboardStats {
  totalSessions: number;
  hoursCompleted: number;
  moodScore: number;
  achievements: number;
}

interface UpcomingSession {
  id: string;
  therapist?: { firstName: string; lastName: string };
  therapistId: string;
  type: string;
  scheduledStart: string;
  duration: number;
}

export default function Dashboard() {
  const { user } = useAuthStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([]);
  const [moodData, setMoodData] = useState<number[]>([5, 5, 5, 5, 5, 5, 5]);
  const [goals, setGoals] = useState<Array<{ title: string; progress: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, bookingsRes, moodRes] = await Promise.allSettled([
          apiHelpers.users.getStats(),
          apiHelpers.bookings.getMine(),
          apiHelpers.analytics.getMoodTrends(),
        ]);

        if (statsRes.status === 'fulfilled') {
          const s = statsRes.value.data.data;
          setStats({
            totalSessions: s?.totalSessions || 0,
            hoursCompleted: s?.hoursCompleted || 0,
            moodScore: s?.moodScore || 0,
            achievements: s?.achievements || 0,
          });
          if (s?.goals) setGoals(s.goals);
        }

        if (bookingsRes.status === 'fulfilled') {
          const b = bookingsRes.value.data.data;
          const sessions = b?.data || b || [];
          const upcoming = sessions
            .filter((s: any) => s.status === 'SCHEDULED' || s.status === 'CONFIRMED')
            .slice(0, 3);
          setUpcomingSessions(upcoming);
        }

        if (moodRes.status === 'fulfilled') {
          const m = moodRes.value.data.data;
          if (Array.isArray(m) && m.length > 0) {
            setMoodData(m.slice(-7).map((entry: any) => entry.mood || 5));
          }
        }
      } catch {
        // Fail silently — show defaults
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatSessionTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    let dateLabel: string;
    if (d.toDateString() === now.toDateString()) dateLabel = 'Today';
    else if (d.toDateString() === tomorrow.toDateString()) dateLabel = 'Tomorrow';
    else dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return { dateLabel, time };
  };

  const getTherapistName = (session: UpcomingSession) =>
    session.therapist
      ? `${session.therapist.firstName} ${session.therapist.lastName}`
      : `Therapist`;

  const statCards = [
    {
      icon: Activity,
      label: 'Total Sessions',
      value: String(stats?.totalSessions || 0),
      change: '+12',
      gradient: 'from-therapy-500 to-therapy-600',
    },
    {
      icon: Clock,
      label: 'Hours Talked',
      value: String(stats?.hoursCompleted || 0),
      change: '+8',
      gradient: 'from-calm-500 to-calm-600',
    },
    {
      icon: TrendingUp,
      label: 'Mood Score',
      value: String(stats?.moodScore || 0),
      change: '+5',
      gradient: 'from-green-500 to-green-600',
    },
    {
      icon: Award,
      label: 'Achievements',
      value: String(stats?.achievements || 0),
      change: '+3',
      gradient: 'from-yellow-500 to-yellow-600',
    },
  ];

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
          {statCards.map((stat, i) => (
            <Card key={i} className="bg-white/5 border-white/10 backdrop-blur-xl group hover:border-therapy-500/50 transition-all overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-therapy-500/5 to-calm-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  {!loading && (
                    <div className="flex items-center space-x-1 text-green-400 text-sm">
                      <TrendingUp className="w-4 h-4" />
                      <span>{stat.change}%</span>
                    </div>
                  )}
                </div>
                <div className="text-3xl font-bold mb-1 text-white">
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : stat.value}
                </div>
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
              {loading ? (
                <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-therapy-400" /></div>
              ) : upcomingSessions.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No upcoming sessions. Book one to get started!</p>
              ) : (
                upcomingSessions.map((session) => {
                  const { dateLabel, time } = formatSessionTime(session.scheduledStart);
                  return (
                    <div
                      key={session.id}
                      className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-therapy-500/50 transition-all cursor-pointer group/item"
                    >
                      <div className="flex items-center justify-between text-white">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-therapy-400 to-calm-400 flex items-center justify-center font-semibold">
                            {getTherapistName(session).charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold group-hover/item:text-therapy-400 transition-colors">
                              {getTherapistName(session)}
                            </div>
                            <div className="text-sm text-gray-400">{session.type?.replace(/_/g, ' ')}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">{time}</div>
                          <div className="text-xs text-gray-400">{dateLabel}</div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
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
              {goals.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No active goals. Set one to track your progress!</p>
              ) : (
                goals.map((goal, i) => (
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
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

const quickActions = [
  { icon: Brain, label: 'AI Chat', href: '/chat?type=ai', gradient: 'from-therapy-500 to-therapy-600' },
  { icon: Video, label: 'Video Session', href: '/bookings?type=video', gradient: 'from-calm-500 to-calm-600' },
  { icon: MessageSquare, label: 'Message Therapist', href: '/chat', gradient: 'from-blue-500 to-blue-600' },
  { icon: Calendar, label: 'Book Appointment', href: '/bookings', gradient: 'from-purple-500 to-purple-600' },
];
