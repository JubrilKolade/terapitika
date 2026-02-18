'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Bell,
  Check,
  AlertTriangle,
  Calendar,
  MessageSquare,
  Filter,
  Trash2,
  Clock,
} from 'lucide-react';

type NotificationCategory = 'all' | 'sessions' | 'billing' | 'product';

const initialNotifications = [
  {
    id: '1',
    title: 'Upcoming session with Dr. Rivera',
    description: 'Your session is scheduled for tomorrow at 3:00 PM.',
    category: 'sessions' as NotificationCategory,
    timeAgo: '2 hours ago',
    unread: true,
  },
  {
    id: '2',
    title: 'Payment receipt available',
    description: 'Your receipt for the last session has been generated.',
    category: 'billing' as NotificationCategory,
    timeAgo: '1 day ago',
    unread: false,
  },
  {
    id: '3',
    title: 'New coping strategies unlocked',
    description: 'Based on your recent mood logs, we have new suggestions.',
    category: 'product' as NotificationCategory,
    timeAgo: '3 days ago',
    unread: true,
  },
  {
    id: '4',
    title: 'Session summary ready',
    description: 'Your AI summary from the last conversation is now available.',
    category: 'sessions' as NotificationCategory,
    timeAgo: '5 days ago',
    unread: false,
  },
];

const NotificationsPage = () => {
  const [category, setCategory] = useState<NotificationCategory>('all');
  const [notifications, setNotifications] = useState(initialNotifications);

  const filtered = notifications.filter((n) =>
    category === 'all' ? true : n.category === category
  );

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-white">Notifications</h1>
            <p className="text-gray-400">
              Stay on top of your sessions, payments, and wellbeing updates.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              className="border-white/10 text-white"
              onClick={markAllAsRead}
            >
              <Check className="w-4 h-4 mr-2" />
              Mark all as read
            </Button>
            <Button
              variant="ghost"
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              onClick={clearAll}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear all
            </Button>
          </div>
        </div>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-therapy-500 to-calm-500 flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-white">Inbox</CardTitle>
                <p className="text-xs text-gray-400">
                  {unreadCount === 0
                    ? 'You are all caught up.'
                    : `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}.`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {(['all', 'sessions', 'billing', 'product'] as NotificationCategory[]).map(
                (cat) => (
                  <Button
                    key={cat}
                    size="sm"
                    variant={category === cat ? 'default' : 'outline'}
                    className={
                      category === cat
                        ? 'bg-gradient-to-r from-therapy-500 to-calm-500 border-none'
                        : 'border-white/10 text-gray-300 hover:bg-white/5'
                    }
                    onClick={() => setCategory(cat)}
                  >
                    {cat === 'all'
                      ? 'All'
                      : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Button>
                )
              )}
              <Button
                size="icon"
                variant="outline"
                className="border-white/10 text-gray-300 hover:bg-white/5"
              >
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {filtered.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-sm text-gray-400">
                  No notifications in this category yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                      notification.unread
                        ? 'bg-white/10 border-therapy-500/40'
                        : 'bg-white/5 border-white/10 hover:border-therapy-500/40'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">
                        {notification.category === 'sessions' && (
                          <Calendar className="w-4 h-4 text-therapy-400" />
                        )}
                        {notification.category === 'billing' && (
                          <AlertTriangle className="w-4 h-4 text-yellow-400" />
                        )}
                        {notification.category === 'product' && (
                          <MessageSquare className="w-4 h-4 text-calm-400" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-white">
                            {notification.title}
                          </h3>
                          {notification.unread && (
                            <span className="w-2 h-2 rounded-full bg-therapy-400" />
                          )}
                        </div>
                        <p className="text-sm text-gray-400 mt-1">
                          {notification.description}
                        </p>
                        <div className="text-xs text-gray-500 mt-2">
                          {notification.timeAgo}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;

