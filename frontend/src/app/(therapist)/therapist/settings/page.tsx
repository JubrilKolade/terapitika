'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Bell,
  Shield,
  Globe,
  Calendar,
  Moon,
  Phone,
  Video,
  MessageSquare,
} from 'lucide-react';

const TherapistSettingsPage = () => {
  const communicationOptions = [
    { icon: Video, label: 'Video sessions', value: 'Enabled' },
    { icon: Phone, label: 'Voice sessions', value: 'Enabled' },
    { icon: MessageSquare, label: 'Chat sessions', value: 'Enabled' },
  ];

  const preferences = [
    { icon: Calendar, label: 'Default session length', value: '50 minutes' },
    { icon: Globe, label: 'Time zone', value: 'System detected' },
    { icon: Moon, label: 'Theme', value: 'Dark' },
  ];

  const security = [
    { icon: Shield, label: 'Two-factor authentication', value: 'Disabled' },
    { icon: Bell, label: 'Security alerts', value: 'Email' },
  ];

  return (
    <DashboardLayout type="therapist">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-white">Settings</h1>
          <p className="text-gray-400">
            Configure how you work with clients, notifications, and security.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">Communication modes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {communicationOptions.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:border-therapy-500/40 cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-white/5 text-gray-300">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm text-white">{item.label}</span>
                  </div>
                  <span className="text-xs text-gray-400">{item.value}</span>
                </div>
              ))}
              <Button variant="outline" className="mt-2 w-full border-white/10 text-white">
                Manage availability
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {preferences.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:border-therapy-500/40 cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-white/5 text-gray-300">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm text-white">{item.label}</span>
                  </div>
                  <span className="text-xs text-gray-400">{item.value}</span>
                </div>
              ))}
              <Button variant="outline" className="mt-2 w-full border-white/10 text-white">
                Edit preferences
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {security.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:border-therapy-500/40 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-white/5 text-gray-300">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-white">{item.label}</span>
                </div>
                <Button size="sm" variant="ghost" className="text-therapy-300 hover:bg-white/10">
                  {item.value}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TherapistSettingsPage;

