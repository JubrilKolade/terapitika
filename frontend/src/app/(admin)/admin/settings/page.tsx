'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { GlassCard } from '@/components/shared/GlassCard';
import { Settings, Shield, Bell, Database, Globe, Lock, Save, RefreshCcw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiHelpers } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [settings, setSettings] = useState<any>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await apiHelpers.admin.getSettings();
                setSettings(response.data.data);
            } catch (error) {
                console.error('Failed to fetch settings:', error);
                toast.error('Failed to load settings');
                // Use default settings as fallback
                setSettings(defaultSettings);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await apiHelpers.admin.updateSettings(settings);
            toast.success('Settings saved successfully');
        } catch (error) {
            console.error('Failed to save settings:', error);
            toast.error('Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    };

    const updateSetting = (key: string, value: any) => {
        setSettings({ ...settings, [key]: value });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-therapy-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <PageHeader
                title="Platform Settings"
                subtitle="Configure system-wide parameters, security policies, and integrations"
                icon={Settings}
                actions={
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
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
                                enabled={settings?.security?.enforce2FA}
                                onChange={(val) => updateSetting('security', { ...settings.security, enforce2FA: val })}
                            />
                            <ToggleSetting
                                title="Session Timeout"
                                description="Automatically logout inactive admin sessions after 30 minutes"
                                enabled={settings?.security?.sessionTimeout}
                                onChange={(val) => updateSetting('security', { ...settings.security, sessionTimeout: val })}
                            />
                            <ToggleSetting
                                title="IP Whitelisting"
                                description="Restrict admin access to specific IP ranges"
                                enabled={settings?.security?.ipWhitelisting}
                                onChange={(val) => updateSetting('security', { ...settings.security, ipWhitelisting: val })}
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
                                        value={settings?.system?.platformName || ''}
                                        onChange={(e) => updateSetting('system', { ...settings.system, platformName: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-therapy-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Support Email</label>
                                    <input
                                        type="email"
                                        value={settings?.system?.supportEmail || ''}
                                        onChange={(e) => updateSetting('system', { ...settings.system, supportEmail: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-therapy-500"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Custom System Message (Maintenance)</label>
                                <textarea
                                    rows={3}
                                    value={settings?.system?.maintenanceMessage || ''}
                                    onChange={(e) => updateSetting('system', { ...settings.system, maintenanceMessage: e.target.value })}
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

function ToggleSetting({ title, description, enabled = false, onChange }: { title: string, description: string, enabled?: boolean, onChange: (val: boolean) => void }) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-gray-400">{description}</p>
            </div>
            <button
                onClick={() => onChange(!enabled)}
                className={`w-12 h-6 rounded-full transition-colors relative ${enabled ? 'bg-therapy-500' : 'bg-white/10'}`}
            >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${enabled ? 'left-7' : 'left-1'}`} />
            </button>
        </div>
    );
}

const defaultSettings = {
    security: {
        enforce2FA: true,
        sessionTimeout: true,
        ipWhitelisting: false,
    },
    system: {
        platformName: 'Terapitika Portal',
        supportEmail: 'support@terapitika.com',
        maintenanceMessage: '',
    }
};
