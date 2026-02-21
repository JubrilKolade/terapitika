'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { GlassCard } from '@/components/shared/GlassCard';
import { EmptyState } from '@/components/shared/EmptyState';
import {
  Users,
  Search,
  Filter,
  Edit,
  Trash2,
  Ban,
  Mail,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiHelpers } from '@/lib/api';

interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  totalSessions?: number;
}

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params: any = { page };
      if (selectedRole !== 'all') params.role = selectedRole.toUpperCase();
      if (searchQuery) params.search = searchQuery;
      const response = await apiHelpers.admin.getUsers(params);
      const data = response.data.data;
      setUsers(data.data || data.users || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, selectedRole, searchQuery]);

  useEffect(() => {
    const debounce = setTimeout(() => fetchUsers(), 300);
    return () => clearTimeout(debounce);
  }, [fetchUsers]);

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      setActionLoading(id);
      await apiHelpers.admin.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSuspendUser = async (id: string) => {
    try {
      setActionLoading(id);
      await apiHelpers.admin.updateUser(id, { status: 'suspended' });
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: 'suspended' } : u))
      );
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to suspend user');
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-8">
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
      <GlassCard gradient>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-therapy-500"
            />
          </div>
          <select
            value={selectedRole}
            onChange={(e) => { setSelectedRole(e.target.value); setPage(1); }}
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
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-therapy-400" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <AlertTriangle className="w-12 h-12 text-red-400" />
            <p className="text-gray-400">{error}</p>
            <Button onClick={fetchUsers}>Retry</Button>
          </div>
        ) : users.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No users found"
            description="No users match your current filters."
          />
        ) : (
          <>
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
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-therapy-400 to-calm-400 flex items-center justify-center text-white font-semibold">
                            {(user.firstName || '?').charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{user.firstName} {user.lastName}</div>
                            <div className="text-sm text-gray-400 flex items-center space-x-2">
                              <Mail className="w-3 h-3" />
                              <span>{user.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'ADMIN' ? 'bg-red-500/20 text-red-400'
                            : user.role === 'THERAPIST' ? 'bg-calm-500/20 text-calm-400'
                              : 'bg-therapy-500/20 text-therapy-400'
                          }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.status === 'active' ? 'bg-green-500/20 text-green-400'
                            : user.status === 'suspended' ? 'bg-red-500/20 text-red-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-400">{formatDate(user.createdAt)}</td>
                      <td className="px-4 py-4 text-sm font-semibold">{user.totalSessions ?? 0}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end space-x-2">
                          {actionLoading === user.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Edit">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                title="Suspend"
                                onClick={() => handleSuspendUser(user.id)}
                              >
                                <Ban className="w-4 h-4 text-yellow-400" />
                              </button>
                              <button
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                title="Delete"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
              <p className="text-sm text-gray-400">
                Showing {(page - 1) * 20 + 1}-{Math.min(page * 20, total)} of {total.toLocaleString()} users
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/10"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                  <Button
                    key={p}
                    size="sm"
                    variant="outline"
                    className={`border-white/10 ${p === page ? 'bg-therapy-500/20 text-therapy-400' : ''}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Button>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/10"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </GlassCard>
    </div>
  );
}
