'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(14, 165, 233, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="fixed top-20 left-20 w-96 h-96 bg-therapy-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 right-20 w-96 h-96 bg-calm-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PageHeader
            title="Admin Dashboard"
            subtitle="Platform overview and management"
            icon={Shield}
            gradient
          />

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Users}
              label="Total Users"
              value="12,458"
              change="+8.2%"
              trend="up"
              gradient="from-therapy-500 to-therapy-600"
            />
            <StatCard
              icon={UserCheck}
              label="Active Therapists"
              value="342"
              change="+12"
              trend="up"
              gradient="from-calm-500 to-calm-600"
            />
            <StatCard
              icon={DollarSign}
              label="Monthly Revenue"
              value="$284,590"
              change="+15.3%"
              trend="up"
              gradient="from-green-500 to-green-600"
            />
            <StatCard
              icon={AlertTriangle}
              label="Crisis Alerts"
              value="3"
              change="-2"
              trend="down"
              gradient="from-red-500 to-red-600"
            />
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
                {recentActivity.map((activity, i) => (
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
                ))}
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
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            {systemHealth.map((system, i) => (
              <GlassCard key={i} gradient delay={i * 0.1}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{system.name}</h3>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    system.status === 'healthy' 
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
        </main>
      </div>
    </div>
  );
}

const recentActivity = [
  {
    icon: Users,
    title: 'New User Registration',
    description: 'Sarah Johnson signed up as a client',
    time: '2 minutes ago',
    color: 'from-therapy-500 to-therapy-600',
  },
  {
    icon: UserCheck,
    title: 'Therapist Verified',
    description: 'Dr. Michael Chen completed verification',
    time: '15 minutes ago',
    color: 'from-calm-500 to-calm-600',
  },
  {
    icon: AlertTriangle,
    title: 'Crisis Alert Resolved',
    description: 'Alert #1234 marked as resolved',
    time: '1 hour ago',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: DollarSign,
    title: 'Payment Received',
    description: 'Session payment of $150 processed',
    time: '2 hours ago',
    color: 'from-blue-500 to-blue-600',
  },
];

const quickActions = [
  { icon: Users, label: 'Manage Users', href: '/admin/users' },
  { icon: UserCheck, label: 'Verify Therapists', href: '/admin/therapists' },
  { icon: AlertTriangle, label: 'Crisis Alerts', href: '/admin/crisis-alerts' },
  { icon: Calendar, label: 'View Sessions', href: '/admin/sessions' },
  { icon: DollarSign, label: 'Payment Reports', href: '/admin/payments' },
  { icon: MessageSquare, label: 'Support Tickets', href: '/admin/support' },
];

const systemHealth = [
  {
    name: 'API Server',
    status: 'healthy',
    uptime: '99.98%',
    responseTime: '45ms',
  },
  {
    name: 'Database',
    status: 'healthy',
    uptime: '99.99%',
    responseTime: '12ms',
  },
  {
    name: 'WebSocket',
    status: 'warning',
    uptime: '98.5%',
    responseTime: '150ms',
  },
];