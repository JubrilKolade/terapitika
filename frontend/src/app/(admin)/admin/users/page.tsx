'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { GlassCard } from '@/components/shared/GlassCard';
import { EmptyState } from '@/components/shared/EmptyState';
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  Mail,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
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
            title="User Management"
            subtitle="Manage all platform users"
            icon={Users}
            actions={
              <Button className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600">
                Export Users
              </Button>
            }
          />

          {/* Filters */}
          <GlassCard className="mb-6" gradient>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-therapy-500"
                />
              </div>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-therapy-500"
              >
                <option value="all">All Roles</option>
                <option value="client">Clients</option>
                <option value="therapist">Therapists</option>
                <option value="admin">Admins</option>
              </select>
              <Button variant="outline" className="border-white/10 hover:bg-white/10">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </GlassCard>

          {/* Users Table */}
          <GlassCard gradient>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">User</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Role</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Joined</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-400">Sessions</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, i) => (
                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-therapy-400 to-calm-400 flex items-center justify-center text-white font-semibold">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-400 flex items-center space-x-2">
                              <Mail className="w-3 h-3" />
                              <span>{user.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'admin'
                            ? 'bg-red-500/20 text-red-400'
                            : user.role === 'therapist'
                            ? 'bg-calm-500/20 text-calm-400'
                            : 'bg-therapy-500/20 text-therapy-400'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.status === 'active'
                            ? 'bg-green-500/20 text-green-400'
                            : user.status === 'suspended'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-400">{user.joined}</td>
                      <td className="px-4 py-4 text-sm font-semibold">{user.sessions}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <Ban className="w-4 h-4 text-yellow-400" />
                          </button>
                          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
              <p className="text-sm text-gray-400">Showing 1-10 of 12,458 users</p>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline" className="border-white/10">Previous</Button>
                <Button size="sm" variant="outline" className="border-white/10 bg-therapy-500/20 text-therapy-400">1</Button>
                <Button size="sm" variant="outline" className="border-white/10">2</Button>
                <Button size="sm" variant="outline" className="border-white/10">3</Button>
                <Button size="sm" variant="outline" className="border-white/10">Next</Button>
              </div>
            </div>
          </GlassCard>
        </main>
      </div>
    </div>
  );
}

const users = [
  {
    id: '1',
    name: 'Sarah Mitchell',
    email: 'sarah.m@example.com',
    role: 'client',
    status: 'active',
    joined: 'Jan 15, 2024',
    sessions: 12,
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    email: 'dr.chen@example.com',
    role: 'therapist',
    status: 'active',
    joined: 'Dec 5, 2023',
    sessions: 156,
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.r@example.com',
    role: 'client',
    status: 'active',
    joined: 'Feb 20, 2024',
    sessions: 8,
  },
  {
    id: '4',
    name: 'James Wilson',
    email: 'james.w@example.com',
    role: 'admin',
    status: 'active',
    joined: 'Nov 1, 2023',
    sessions: 0,
  },
  {
    id: '5',
    name: 'Lisa Park',
    email: 'lisa.p@example.com',
    role: 'therapist',
    status: 'active',
    joined: 'Jan 10, 2024',
    sessions: 89,
  },
];