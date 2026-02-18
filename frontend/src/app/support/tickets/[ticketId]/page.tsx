'use client';

import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/shared/PageHeader';
import { GlassCard } from '@/components/shared/GlassCard';
import { Button } from '@/components/ui/button';
import { HeadphonesIcon, ArrowLeft, Clock, MessageSquare } from 'lucide-react';
import Link from 'next/link';

const SupportTicketDetailPage = () => {
  const params = useParams();
  const ticketId = params.ticketId as string;

  const ticket = {
    id: ticketId,
    subject: 'Sample ticket subject',
    status: 'open',
    priority: 'high',
    lastUpdated: '2 hours ago',
  };

  const messages = [
    {
      id: '1',
      sender: 'you',
      content:
        'I am unable to connect to my scheduled video session. It keeps disconnecting after a few seconds.',
      timeAgo: '2 hours ago',
    },
    {
      id: '2',
      sender: 'support',
      content:
        'Thanks for reaching out. We are looking into this and may ask for some connection details.',
      timeAgo: '1 hour ago',
    },
  ];

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

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="flex items-center justify-between mb-4">
          <Link href="/support/tickets">
            <Button variant="ghost" className="text-gray-300 hover:bg-white/5">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to tickets
            </Button>
          </Link>
        </div>

        <PageHeader
          title={ticket.subject}
          subtitle={`Ticket #${ticket.id}`}
          icon={HeadphonesIcon}
        />

        <GlassCard gradient>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex items-center space-x-3 text-xs text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Last updated {ticket.lastUpdated}</span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="px-2 py-1 rounded-full bg-therapy-500/20 text-therapy-200">
                Open
              </span>
              <span className="px-2 py-1 rounded-full bg-red-500/20 text-red-200">
                High priority
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className="p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <MessageSquare className="w-3 h-3" />
                    <span>
                      {message.sender === 'you' ? 'You' : 'Support team'}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {message.timeAgo}
                  </span>
                </div>
                <p className="text-sm text-gray-200 whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2">
            <label className="text-xs text-gray-400">
              Add a reply to this ticket
            </label>
            <textarea
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-lg text-sm text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-therapy-500"
              placeholder="Share more details or respond to our last message."
            />
            <div className="flex justify-end mt-2">
              <Button className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600">
                Send reply
              </Button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default SupportTicketDetailPage;

