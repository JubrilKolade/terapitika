'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calendar, Clock, Video, Phone, MessageSquare, Filter } from 'lucide-react';
import Link from 'next/link';

const sessions = [
  {
    id: '1',
    client: 'Sarah Mitchell',
    status: 'upcoming',
    mode: 'Video',
    date: 'Today',
    time: '3:00 PM',
    duration: '50 min',
  },
  {
    id: '2',
    client: 'James Wilson',
    status: 'completed',
    mode: 'Chat',
    date: 'Yesterday',
    time: '11:00 AM',
    duration: '50 min',
  },
  {
    id: '3',
    client: 'Emily Chen',
    status: 'upcoming',
    mode: 'Voice',
    date: 'Tomorrow',
    time: '9:30 AM',
    duration: '50 min',
  },
];

const TherapistSessionsPage = () => {
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
            <Button variant="outline" className="border-white/10 text-white">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Link href="/therapist/schedule">
              <Button className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600">
                Manage availability
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <SessionList filter="upcoming" />
          </TabsContent>
          <TabsContent value="completed">
            <SessionList filter="completed" />
          </TabsContent>
          <TabsContent value="all">
            <SessionList filter="all" />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

const SessionList = ({ filter }: { filter: 'upcoming' | 'completed' | 'all' }) => {
  const items =
    filter === 'all'
      ? sessions
      : sessions.filter((session) => session.status === filter);

  if (items.length === 0) {
    return (
      <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
        <CardContent className="py-12 text-center text-gray-400">
          No sessions in this view yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-white">Session list</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((session) => (
          <div
            key={session.id}
            className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-therapy-500/40 transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-therapy-400 to-calm-400 flex items-center justify-center font-semibold">
                {session.client.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-white">{session.client}</div>
                <div className="flex items-center text-xs text-gray-400 space-x-2">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {session.date}, {session.time}
                  </span>
                  <span>•</span>
                  <Clock className="w-3 h-3" />
                  <span>{session.duration}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  session.mode === 'Video'
                    ? 'bg-therapy-500/20 text-therapy-300'
                    : session.mode === 'Voice'
                    ? 'bg-calm-500/20 text-calm-300'
                    : 'bg-blue-500/20 text-blue-300'
                }`}
              >
                {session.mode}
              </span>
              <Link href={`/therapist/session/${session.id}`}>
                <Button size="sm" className="bg-gradient-to-r from-therapy-500 to-calm-500">
                  Join
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TherapistSessionsPage;

