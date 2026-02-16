'use client';

import { motion } from 'framer-motion';
import { Settings, Bell, Shield, Eye, Smartphone, LogOut, Moon, Globe, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const settingsSections = [
    {
        title: 'General',
        items: [
            { icon: Globe, label: 'Language', value: 'English (US)' },
            { icon: Moon, label: 'Appearance', value: 'Dark Mode' },
            { icon: HelpCircle, label: 'Support & Help', value: null },
        ]
    },
    {
        title: 'Notifications',
        items: [
            { icon: Bell, label: 'Push Notifications', value: 'Enabled' },
            { icon: Smartphone, label: 'SMS Alerts', value: 'Disabled' },
        ]
    },
    {
        title: 'Privacy & Security',
        items: [
            { icon: Eye, label: 'Profile Visibility', value: 'Therapists Only' },
            { icon: Shield, label: 'Two-Factor Auth', value: 'Off' },
        ]
    }
];

export default function SettingsPage() {
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
                                        <div key={i} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer group">
                                            <div className="flex items-center space-x-4">
                                                <div className="p-2 bg-white/5 rounded-lg text-gray-400 group-hover:text-therapy-400 transition-colors">
                                                    <item.icon size={20} />
                                                </div>
                                                <span className="text-white font-medium">{item.label}</span>
                                            </div>
                                            <div className="flex items-center text-gray-400 text-sm">
                                                {item.value && <span className="mr-3">{item.value}</span>}
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <HelpCircle size={16} />
                                                </Button>
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
                            <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
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
