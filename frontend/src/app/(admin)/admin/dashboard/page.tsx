'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { GlassCard } from '@/components/shared/GlassCard';
import {
  Users,
  UserCheck,
  AlertTriangle,
  DollarSign,
  Activity,
  TrendingUp,
  Calendar,
  MessageSquare,
  Shield,
  Clock,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { apiHelpers } from '@/lib/api';

interface DashboardAnalytics {
  totalUsers: number;
  activeTherapists: number;
  monthlyRevenue: number;
  crisisAlerts: number;
  userGrowth: string;
  therapistGrowth: string;
  revenueGrowth: string;
  crisisChange: string;
  recentActivity: Array<{
    type: string;
    title: string;
    description: string;
    time: string;
  }>;
  systemHealth: Array<{
    name: string;
    status: string;
    uptime: string;
    responseTime: string;
  }>;
}

const activityIcons: Record<string, any> = {
  user_registration: Users,
  therapist_verified: UserCheck,
  crisis_resolved: AlertTriangle,
  payment_received: DollarSign,
  default: Activity,
};

const activityColors: Record<string, string> = {
  user_registration: 'from-therapy-500 to-therapy-600',
  therapist_verified: 'from-calm-500 to-calm-600',
  crisis_resolved: 'from-green-500 to-green-600',
  payment_received: 'from-blue-500 to-blue-600',
  default: 'from-gray-500 to-gray-600',
};

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await apiHelpers.admin.getDashboard();
        setAnalytics(response.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-therapy-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <AlertTriangle className="w-12 h-12 text-red-400" />
        <p className="text-gray-400">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  const stats = [
    {
      icon: Users,
      label: 'Total Users',
      value: analytics?.totalUsers?.toLocaleString() || '0',
      change: analytics?.userGrowth || '+0%',
      trend: 'up' as const,
      gradient: 'from-therapy-500 to-therapy-600',
    },
    {
      icon: UserCheck,
      label: 'Active Therapists',
      value: analytics?.activeTherapists?.toLocaleString() || '0',
      change: analytics?.therapistGrowth || '+0',
      trend: 'up' as const,
      gradient: 'from-calm-500 to-calm-600',
    },
    {
      icon: DollarSign,
      label: 'Monthly Revenue',
      value: `$${(analytics?.monthlyRevenue || 0).toLocaleString()}`,
      change: analytics?.revenueGrowth || '+0%',
      trend: 'up' as const,
      gradient: 'from-green-500 to-green-600',
    },
    {
      icon: AlertTriangle,
      label: 'Crisis Alerts',
      value: String(analytics?.crisisAlerts || 0),
      change: analytics?.crisisChange || '0',
      trend: 'down' as const,
      gradient: 'from-red-500 to-red-600',
    },
  ];

  const recentActivity = (analytics?.recentActivity || []).map((a) => ({
    ...a,
    icon: activityIcons[a.type] || activityIcons.default,
    color: activityColors[a.type] || activityColors.default,
  }));

  const systemHealth = analytics?.systemHealth || [];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin Dashboard"
        subtitle="Platform overview and management"
        icon={Shield}
        gradient
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <GlassCard className="lg:col-span-2" gradient>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Activity className="w-6 h-6 text-therapy-400" />
              <h2 className="text-xl font-bold">Recent Activity</h2>
            </div>
            <Button size="sm" variant="ghost">View All</Button>
          </div>
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No recent activity</p>
            ) : (
              recentActivity.map((activity, i) => (
                <div key={i} className="flex items-start space-x-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${activity.color} flex items-center justify-center flex-shrink-0`}>
                    <activity.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-gray-400">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </GlassCard>

        {/* Quick Actions */}
        <GlassCard gradient>
          <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {quickActions.map((action, i) => (
              <Link key={i} href={action.href}>
                <button className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left flex items-center justify-between group">
                  <div className="flex items-center space-x-3">
                    <action.icon className="w-5 h-5 text-therapy-400" />
                    <span>{action.label}</span>
                  </div>
                  <TrendingUp className="w-4 h-4 text-gray-400 group-hover:text-therapy-400 group-hover:translate-x-1 transition-all" />
                </button>
              </Link>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* System Health */}
      <div className="grid md:grid-cols-3 gap-6">
        {systemHealth.map((system, i) => (
          <GlassCard key={i} gradient delay={i * 0.1}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{system.name}</h3>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${system.status === 'healthy'
                ? 'bg-green-500/20 text-green-400'
                : system.status === 'warning'
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-red-500/20 text-red-400'
                }`}>
                {system.status.toUpperCase()}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Uptime</span>
                <span className="font-semibold">{system.uptime}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Response Time</span>
                <span className="font-semibold">{system.responseTime}</span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

const quickActions = [
  { icon: Users, label: 'Manage Users', href: '/admin/users' },
  { icon: UserCheck, label: 'Verify Therapists', href: '/admin/therapists' },
  { icon: AlertTriangle, label: 'Crisis Alerts', href: '/admin/crisis-logs' },
  { icon: Calendar, label: 'View Sessions', href: '/admin/sessions' },
  { icon: DollarSign, label: 'Payment Reports', href: '/admin/payments' },
  { icon: MessageSquare, label: 'Support Tickets', href: '/admin/support' },
];
