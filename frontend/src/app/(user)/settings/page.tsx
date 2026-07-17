'use client';

import { useState, useEffect } from 'react';
import { Settings, Bell, Shield, Eye, Smartphone, LogOut, Moon, Globe, HelpCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/store/authstore';
import { apiHelpers } from '@/lib/api';

interface UserPrefs {
    language: string;
    theme: string;
    pushNotifications: boolean;
    smsAlerts: boolean;
    profileVisibility: string;
    twoFactorAuth: boolean;
}

const defaultPrefs: UserPrefs = {
    language: 'English (US)',
    theme: 'Dark Mode',
    pushNotifications: true,
    smsAlerts: false,
    profileVisibility: 'Therapists Only',
    twoFactorAuth: false,
};

export default function SettingsPage() {
    const { logout } = useAuthStore();
    const [prefs, setPrefs] = useState<UserPrefs>(defaultPrefs);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchPrefs = async () => {
            try {
                setLoading(true);
                const response = await apiHelpers.users.getSettings();
                const data = response.data.data;
                if (data) {
                    setPrefs({
                        language: data.preferences?.language || defaultPrefs.language,
                        theme: data.preferences?.theme === 'dark' ? 'Dark Mode' : data.preferences?.theme === 'light' ? 'Light Mode' : defaultPrefs.theme,
                        pushNotifications: data.notifications?.push ?? defaultPrefs.pushNotifications,
                        smsAlerts: data.notifications?.sms ?? defaultPrefs.smsAlerts,
                        profileVisibility: data.privacy?.profileVisibility || defaultPrefs.profileVisibility,
                        twoFactorAuth: data.privacy?.twoFactorAuth ?? defaultPrefs.twoFactorAuth,
                    });
                }
            } catch {
                // Use defaults
            } finally {
                setLoading(false);
            }
        };
        fetchPrefs();
    }, []);

    const updateSetting = async (key: keyof UserPrefs, value: any) => {
        const newPrefs = { ...prefs, [key]: value };
        setPrefs(newPrefs);
        try {
            setSaving(true);
            await apiHelpers.users.updateSettings({
                preferences: {
                    language: newPrefs.language,
                    theme: newPrefs.theme === 'Dark Mode' ? 'dark' : 'light',
                },
                notifications: {
                    push: newPrefs.pushNotifications,
                    sms: newPrefs.smsAlerts,
                },
                privacy: {
                    profileVisibility: newPrefs.profileVisibility,
                    twoFactorAuth: newPrefs.twoFactorAuth,
                },
            });
        } catch {
            // Revert on failure
            setPrefs(prefs);
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        logout();
        window.location.href = '/login';
    };

    const settingsSections = [
        {
            title: 'General',
            items: [
                { icon: Globe, label: 'Language', value: prefs.language, key: 'language' as const },
                { icon: Moon, label: 'Appearance', value: prefs.theme, key: 'theme' as const },
                { icon: HelpCircle, label: 'Support & Help', value: null, key: null },
            ],
        },
        {
            title: 'Notifications',
            items: [
                { icon: Bell, label: 'Push Notifications', value: prefs.pushNotifications ? 'Enabled' : 'Disabled', key: 'pushNotifications' as keyof UserPrefs },
                { icon: Smartphone, label: 'SMS Alerts', value: prefs.smsAlerts ? 'Enabled' : 'Disabled', key: 'smsAlerts' as keyof UserPrefs },
            ],
        },
        {
            title: 'Privacy & Security',
            items: [
                { icon: Eye, label: 'Profile Visibility', value: prefs.profileVisibility, key: 'profileVisibility' as const },
                { icon: Shield, label: 'Two-Factor Auth', value: prefs.twoFactorAuth ? 'On' : 'Off', key: 'twoFactorAuth' as keyof UserPrefs },
            ],
        },
    ];

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-therapy-400" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2 text-white">Settings</h1>
                    <p className="text-gray-400">Manage your account preferences and platform configuration</p>
                </div>

                <div className="space-y-6">
                    {settingsSections.map((section, idx) => (
                        <div key={idx} className="space-y-4">
                            <h2 className="text-xs text-gray-400 uppercase font-bold tracking-widest px-1">{section.title}</h2>
                            <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
                                <CardContent className="p-0 divide-y divide-white/5">
                                    {section.items.map((item, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer group"
                                            onClick={() => {
                                                if (!item.key) return;
                                                if (item.key === 'pushNotifications' || item.key === 'smsAlerts' || item.key === 'twoFactorAuth') {
                                                    updateSetting(item.key, !prefs[item.key]);
                                                }
                                            }}
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="p-2 bg-white/5 rounded-lg text-gray-400 group-hover:text-therapy-400 transition-colors">
                                                    <item.icon size={20} />
                                                </div>
                                                <span className="text-white font-medium">{item.label}</span>
                                            </div>
                                            <div className="flex items-center text-gray-400 text-sm">
                                                {item.value && <span className="mr-3">{item.value}</span>}
                                                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    ))}

                    <Card className="bg-red-500/5 border-red-500/20 backdrop-blur-xl mt-12">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-white font-bold">Sign out of all devices</h3>
                                <p className="text-gray-400 text-sm">Log out from all current sessions on other browsers</p>
                            </div>
                            <Button
                                variant="ghost"
                                className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                onClick={handleLogout}
                            >
                                <LogOut size={20} className="mr-2" />
                                Logout
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
