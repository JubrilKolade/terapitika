'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calendar, Clock, Filter, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { apiHelpers } from '@/lib/api';
import toast from 'react-hot-toast';

const TherapistSessionsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await apiHelpers.sessions.getMine({ role: 'therapist' });
        setSessions(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
        toast.error('Failed to load sessions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout type="therapist">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-therapy-500" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout type="therapist">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-white">Sessions</h1>
            <p className="text-gray-400">
              View upcoming, in-progress, and past sessions with your clients.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Link href="/therapist/schedule">
              <Button className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 shadow-lg shadow-therapy-500/20">
                Manage availability
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10 text-white">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <SessionList items={sessions.filter(s => s.status === 'upcoming' || s.status === 'confirmed')} filter="upcoming" />
          </TabsContent>
          <TabsContent value="completed">
            <SessionList items={sessions.filter(s => s.status === 'completed')} filter="completed" />
          </TabsContent>
          <TabsContent value="all">
            <SessionList items={sessions} filter="all" />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

const SessionList = ({ items, filter }: { items: any[], filter: 'upcoming' | 'completed' | 'all' }) => {
  if (items.length === 0) {
    return (
      <Card className="bg-white/5 border-white/10 backdrop-blur-xl border-none">
        <CardContent className="py-20 text-center text-gray-500 italic">
          No {filter !== 'all' ? filter : ''} sessions found.
        </CardContent>
      </Card>
    );
  }

  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return {
      date: d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
      time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-xl border-none">
      <CardHeader>
        <CardTitle className="text-white">Session History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((session) => {
          const { date, time } = formatDateTime(session.startTime);
          return (
            <div
              key={session.id}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-therapy-500/40 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-therapy-400 to-calm-400 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                  {session.userName?.charAt(0) || 'C'}
                </div>
                <div>
                  <div className="font-bold text-white text-lg">{session.userName || 'Anonymous Client'}</div>
                  <div className="flex items-center text-xs text-gray-400 space-x-3 mt-1">
                    <div className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1.5 text-therapy-400" />
                      <span>{date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1.5 text-calm-400" />
                      <span>{time}</span>
                    </div>
                    <span>•</span>
                    <span>{session.duration || 50} min</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${session.mode === 'Video'
                      ? 'bg-therapy-500/20 text-therapy-300'
                      : session.mode === 'Voice'
                        ? 'bg-calm-500/20 text-calm-300'
                        : 'bg-blue-500/20 text-blue-300'
                    }`}
                >
                  {session.mode || 'Video'}
                </span>
                <Link href={`/therapist/session/${session.id}`}>
                  <Button size="sm" className="bg-gradient-to-r from-therapy-500 to-calm-500 shadow-lg shadow-therapy-500/20 px-6">
                    {session.status === 'upcoming' || session.status === 'confirmed' ? 'Join' : 'View Details'}
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default TherapistSessionsPage;

