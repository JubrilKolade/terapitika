'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { GlassCard } from '@/components/shared/GlassCard';
import { Button } from '@/components/ui/button';
import { HeadphonesIcon, Plus, Search, Filter, Clock } from 'lucide-react';
import Link from 'next/link';

const seedTickets = [
  {
    id: '1234',
    subject: 'Cannot connect to video session',
    status: 'open',
    priority: 'high',
    lastUpdated: '2 hours ago',
  },
  {
    id: '1233',
    subject: 'Payment not processing',
    status: 'in-progress',
    priority: 'medium',
    lastUpdated: '1 day ago',
  },
  {
    id: '1232',
    subject: 'How to reschedule appointment',
    status: 'resolved',
    priority: 'low',
    lastUpdated: '3 days ago',
  },
];

const SupportTicketsPage = () => {
  const [search, setSearch] = useState('');

  const filtered = seedTickets.filter((ticket) =>
    ticket.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <div className="fixed inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(14, 165, 233, 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <PageHeader
          title="Support tickets"
          subtitle="Track your conversations with our support team."
          icon={HeadphonesIcon}
          actions={
            <Link href="/support/tickets/new">
              <Button className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600">
                <Plus className="w-4 h-4 mr-2" />
                New ticket
              </Button>
            </Link>
          }
        />

        <GlassCard gradient>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tickets..."
                className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-therapy-500"
              />
            </div>
            <Button
              size="sm"
              variant="outline"
              className="border-white/10 text-gray-200 hover:bg-white/5"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-sm">
                No tickets match your search.
              </div>
            ) : (
              filtered.map((ticket) => (
                <Link key={ticket.id} href={`/support/tickets/${ticket.id}`}>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-therapy-500/50 hover:bg-white/10 transition-all cursor-pointer flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-white">
                          {ticket.subject}
                        </h3>
                        <StatusPill status={ticket.status} />
                      </div>
                      <div className="mt-1 flex items-center space-x-3 text-xs text-gray-400">
                        <PriorityPill priority={ticket.priority} />
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{ticket.lastUpdated}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">#{ticket.id}</div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

const StatusPill = ({ status }: { status: string }) => {
  const base = 'px-2 py-1 rounded-full text-xs font-semibold';
  if (status === 'open') {
    return (
      <span className={`${base} bg-therapy-500/20 text-therapy-300`}>Open</span>
    );
  }
  if (status === 'in-progress') {
    return (
      <span className={`${base} bg-yellow-500/20 text-yellow-300`}>
        In progress
      </span>
    );
  }
  if (status === 'resolved') {
    return (
      <span className={`${base} bg-green-500/20 text-green-300`}>Resolved</span>
    );
  }
  return (
    <span className={`${base} bg-gray-500/20 text-gray-300`}>Unknown</span>
  );
};

const PriorityPill = ({ priority }: { priority: string }) => {
  const base = 'px-2 py-1 rounded text-xs';
  if (priority === 'high') {
    return (
      <span className={`${base} bg-red-500/20 text-red-300`}>High priority</span>
    );
  }
  if (priority === 'medium') {
    return (
      <span className={`${base} bg-yellow-500/20 text-yellow-300`}>
        Medium priority
      </span>
    );
  }
  return (
    <span className={`${base} bg-blue-500/20 text-blue-300`}>Low priority</span>
  );
};

export default SupportTicketsPage;

