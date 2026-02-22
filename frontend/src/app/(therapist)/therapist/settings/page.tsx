'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Bell,
  Shield,
  Globe,
  Calendar,
  Moon,
  Phone,
  Video,
  MessageSquare,
  Loader2,
  Save,
} from 'lucide-react';
import { apiHelpers } from '@/lib/api';
import toast from 'react-hot-toast';

const TherapistSettingsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await apiHelpers.therapistPortal.getSettings();
        setSettings(response.data.data);
      } catch (error) {
        console.error('Failed to fetch settings:', error);
        toast.error('Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleToggle = (key: string) => {
    setSettings((prev: any) => ({
      ...prev,
      communication: {
        ...prev.communication,
        [key]: !prev.communication[key],
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await apiHelpers.therapistPortal.updateSettings(settings);
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

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
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-white">Settings</h1>
            <p className="text-gray-400">
              Configure how you work with clients, notifications, and security.
            </p>
          </div>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 shadow-lg shadow-therapy-500/20 px-8"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl border-none">
            <CardHeader>
              <CardTitle className="text-white">Communication modes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'video', label: 'Video sessions', icon: Video },
                { key: 'voice', label: 'Voice sessions', icon: Phone },
                { key: 'chat', label: 'Chat sessions', icon: MessageSquare },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-therapy-500/30 transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2.5 rounded-xl bg-white/5 text-gray-400">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-white">{item.label}</span>
                  </div>
                  <Switch
                    checked={settings?.communication?.[item.key] ?? true}
                    onCheckedChange={() => handleToggle(item.key)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl border-none">
            <CardHeader>
              <CardTitle className="text-white">Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Default session length', value: settings?.preferences?.sessionLength || '50 minutes', icon: Calendar },
                { label: 'Time zone', value: settings?.preferences?.timezone || 'System detected', icon: Globe },
                { label: 'Theme', value: settings?.preferences?.theme || 'Dark', icon: Moon },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-therapy-500/30 transition-all cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2.5 rounded-xl bg-white/5 text-gray-300">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-white">{item.label}</span>
                  </div>
                  <span className="text-xs text-gray-400 font-mono tracking-wider">{item.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl border-none">
          <CardHeader>
            <CardTitle className="text-white">Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Two-factor authentication', value: 'Disabled', icon: Shield },
              { label: 'Security alerts', value: 'Email', icon: Bell },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-therapy-500/30 transition-all"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2.5 rounded-xl bg-white/5 text-gray-300">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-white">{item.label}</span>
                </div>
                <Button size="sm" variant="ghost" className="text-therapy-400 hover:text-therapy-300 hover:bg-white/5 font-bold uppercase tracking-widest text-[10px]">
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

