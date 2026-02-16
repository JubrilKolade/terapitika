'use client';

import { PageHeader } from '@/components/shared/PageHeader';
import { GlassCard } from '@/components/shared/GlassCard';
import { Settings, Shield, Bell, Database, Globe, Lock, Save, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminSettingsPage() {
    return (
        <div className="space-y-8">
            <PageHeader
                title="Platform Settings"
                subtitle="Configure system-wide parameters, security policies, and integrations"
                icon={Settings}
                actions={
                    <Button className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600">
                        <Save className="w-4 h-4 mr-2" />
                        Save All Changes
                    </Button>
                }
            />

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Navigation Tabs (Sidebar style) */}
                <div className="space-y-2">
                    <SettingsTab icon={Shield} label="Security & Compliance" active />
                    <SettingsTab icon={Bell} label="Notifications & Alerts" />
                    <SettingsTab icon={Database} label="Data Management" />
                    <SettingsTab icon={Globe} label="Region & Regionality" />
                    <SettingsTab icon={Lock} label="Access Control" />
                    <SettingsTab icon={RefreshCcw} label="System Updates" />
                </div>

                {/* Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    <GlassCard gradient>
                        <h3 className="text-xl font-bold mb-6">Security Policies</h3>
                        <div className="space-y-6">
                            <ToggleSetting
                                title="Two-Factor Authentication"
                                description="Enforce 2FA for all administrative accounts"
                                enabled
                            />
                            <ToggleSetting
                                title="Session Timeout"
                                description="Automatically logout inactive admin sessions after 30 minutes"
                                enabled
                            />
                            <ToggleSetting
                                title="IP Whitelisting"
                                description="Restrict admin access to specific IP ranges"
                            />
                        </div>
                    </GlassCard>

                    <GlassCard gradient>
                        <h3 className="text-xl font-bold mb-6">System Configuration</h3>
                        <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Platform Name</label>
                                    <input
                                        type="text"
                                        defaultValue="Terapitika Portal"
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-therapy-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Support Email</label>
                                    <input
                                        type="email"
                                        defaultValue="support@terapitika.com"
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-therapy-500"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Custom System Message (Maintenance)</label>
                                <textarea
                                    rows={3}
                                    placeholder="System is undergoing maintenance..."
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-therapy-500"
                                />
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard gradient className="border-red-500/20">
                        <h3 className="text-xl font-bold text-red-400 mb-6">Danger Zone</h3>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                            <div>
                                <p className="font-semibold">Clear System Cache</p>
                                <p className="text-sm text-gray-400">This will force all users to re-fetch static assets</p>
                            </div>
                            <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                                Execute
                            </Button>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}

function SettingsTab({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
    return (
        <button className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-therapy-500/20 text-therapy-400 border border-therapy-500/30' : 'hover:bg-white/5 text-gray-400'
            }`}>
            <Icon className="w-5 h-5" />
            <span className="font-medium">{label}</span>
        </button>
    );
}

function ToggleSetting({ title, description, enabled = false }: { title: string, description: string, enabled?: boolean }) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-gray-400">{description}</p>
            </div>
            <button className={`w-12 h-6 rounded-full transition-colors relative ${enabled ? 'bg-therapy-500' : 'bg-white/10'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${enabled ? 'left-7' : 'left-1'}`} />
            </button>
        </div>
    );
}
