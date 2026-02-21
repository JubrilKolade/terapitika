'use client';

import { useState } from 'react';
import { Mail, Camera, Shield, CreditCard, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/store/authstore';
import { apiHelpers } from '@/lib/api';

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await apiHelpers.users.updateProfile({ firstName, lastName, phone });
      updateUser(response.data.data);
      setEditing(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to permanently delete your account? This cannot be undone.')) return;
    try {
      await apiHelpers.users.deleteAccount();
      window.location.href = '/login';
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete account');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Profile Settings</h1>
          <p className="text-gray-400">Manage your personal information and account preferences</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Sidebar / Photo */}
          <Card className="md:col-span-1 bg-white/5 border-white/10 backdrop-blur-xl h-fit">
            <CardContent className="p-6 text-center">
              <div className="relative inline-block mb-4 group">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-therapy-400 to-calm-400 flex items-center justify-center text-4xl font-bold">
                  {user?.firstName?.charAt(0)}
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-therapy-500 rounded-full text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={16} />
                </button>
              </div>
              <h3 className="text-xl font-bold text-white">{user?.firstName} {user?.lastName}</h3>
              <p className="text-gray-400 text-sm capitalize">{user?.role || 'Member'}</p>

              <div className="mt-8 space-y-2">
                <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5">
                  View Public Profile
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Personal Information</CardTitle>
                {!editing && (
                  <Button size="sm" variant="outline" className="border-white/10 text-white" onClick={() => setEditing(true)}>
                    Edit
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 uppercase font-bold">First Name</label>
                    {editing ? (
                      <input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-therapy-500"
                      />
                    ) : (
                      <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-white">{user?.firstName}</div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 uppercase font-bold">Last Name</label>
                    {editing ? (
                      <input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-therapy-500"
                      />
                    ) : (
                      <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-white">{user?.lastName}</div>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 uppercase font-bold">Email Address</label>
                  <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-white flex items-center">
                    <Mail size={16} className="mr-3 text-therapy-400" />
                    {user?.email}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 uppercase font-bold">Phone</label>
                  {editing ? (
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter phone number"
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-therapy-500"
                    />
                  ) : (
                    <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-white">{user?.phone || 'Not set'}</div>
                  )}
                </div>
                {editing ? (
                  <div className="flex space-x-3">
                    <Button
                      className="bg-gradient-to-r from-therapy-500 to-calm-500"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                      Save Changes
                    </Button>
                    <Button variant="outline" className="border-white/10 text-white" onClick={() => { setEditing(false); setFirstName(user?.firstName || ''); setLastName(user?.lastName || ''); setPhone(user?.phone || ''); }}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button className="bg-gradient-to-r from-therapy-500 to-calm-500" onClick={() => setEditing(true)}>
                    Update Profile
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Security & Privacy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-therapy-500/20 rounded-lg text-therapy-400">
                      <Shield size={20} />
                    </div>
                    <div>
                      <div className="text-white font-medium">Two-Factor Authentication</div>
                      <div className="text-sm text-gray-400">Add an extra layer of security</div>
                    </div>
                  </div>
                  <Button variant="outline" className="border-white/10 text-white">Enable</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <div className="text-white font-medium">Payment Method</div>
                      <div className="text-sm text-gray-400">Manage your subscription</div>
                    </div>
                  </div>
                  <Button variant="outline" className="border-white/10 text-white">Manage</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
