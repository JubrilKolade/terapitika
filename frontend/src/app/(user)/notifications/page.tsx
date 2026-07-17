'use client';

import { useState, useEffect } from 'react';
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
  Loader2,
} from 'lucide-react';
import { apiHelpers } from '@/lib/api';

type NotificationCategory = 'all' | 'sessions' | 'billing' | 'product';

interface ApiNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

const mapCategory = (type: string): NotificationCategory => {
  if (type.includes('SESSION') || type.includes('THERAPIST')) return 'sessions';
  if (type.includes('PAYMENT') || type.includes('BILLING')) return 'billing';
  return 'product';
};

const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} minutes ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

const NotificationsPage = () => {
  const [category, setCategory] = useState<NotificationCategory>('all');
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await apiHelpers.notifications.getAll();
        const data = response.data.data;
        setNotifications(data?.data || data || []);
      } catch {
        // Fail silently
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const filtered = notifications.filter((n) =>
    category === 'all' ? true : mapCategory(n.type) === category
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = async () => {
    try {
      setActionLoading(true);
      await apiHelpers.notifications.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      // Fail silently
    } finally {
      setActionLoading(false);
    }
  };

  const clearAll = async () => {
    try {
      setActionLoading(true);
      await Promise.all(notifications.map((n) => apiHelpers.notifications.delete(n.id)));
      setNotifications([]);
    } catch {
      // Fail silently
    } finally {
      setActionLoading(false);
    }
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
              disabled={actionLoading}
            >
              {actionLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
              Mark all as read
            </Button>
            <Button
              variant="ghost"
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              onClick={clearAll}
              disabled={actionLoading}
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
            {loading ? (
              <div className="py-12 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-therapy-400" />
              </div>
            ) : filtered.length === 0 ? (
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
                {filtered.map((notification) => {
                  const cat = mapCategory(notification.type);
                  return (
                    <div
                      key={notification.id}
                      className={`flex items-start justify-between p-4 rounded-xl border transition-all cursor-pointer ${!notification.read
                          ? 'bg-white/10 border-therapy-500/40'
                          : 'bg-white/5 border-white/10 hover:border-therapy-500/40'
                        }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="mt-1">
                          {cat === 'sessions' && (
                            <Calendar className="w-4 h-4 text-therapy-400" />
                          )}
                          {cat === 'billing' && (
                            <AlertTriangle className="w-4 h-4 text-yellow-400" />
                          )}
                          {cat === 'product' && (
                            <MessageSquare className="w-4 h-4 text-calm-400" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-white">
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <span className="w-2 h-2 rounded-full bg-therapy-400" />
                            )}
                          </div>
                          <p className="text-sm text-gray-400 mt-1">
                            {notification.message}
                          </p>
                          <div className="text-xs text-gray-500 mt-2">
                            {timeAgo(notification.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;
