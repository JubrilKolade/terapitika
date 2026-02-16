'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { GlassCard } from '@/components/shared/GlassCard';
import { EmptyState } from '@/components/shared/EmptyState';
import {
  HeadphonesIcon,
  Plus,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('');

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
            title="Help & Support"
            subtitle="Get help from our support team"
            icon={HeadphonesIcon}
            actions={
              <Button className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600">
                <Plus className="w-4 h-4 mr-2" />
                New Ticket
              </Button>
            }
          />

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Quick Help Cards */}
            {quickHelpItems.map((item, i) => (
              <GlassCard key={i} gradient delay={i * 0.1}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{item.description}</p>
                <Link href={item.href}>
                  <Button variant="ghost" className="w-full justify-between hover:bg-white/10">
                    {item.action}
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </GlassCard>
            ))}
          </div>

          {/* Support Tickets */}
          <GlassCard gradient>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Your Tickets</h3>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tickets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-therapy-500"
                  />
                </div>
                <Button size="sm" variant="outline" className="border-white/10">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {tickets.map((ticket, i) => (
                <Link key={ticket.id} href={`/support/tickets/${ticket.id}`}>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-therapy-500/50 hover:bg-white/10 transition-all cursor-pointer group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold group-hover:text-therapy-400 transition-colors">
                            {ticket.subject}
                          </h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            ticket.status === 'open'
                              ? 'bg-therapy-500/20 text-therapy-400'
                              : ticket.status === 'in-progress'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : ticket.status === 'resolved'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {ticket.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">{ticket.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 rounded ${
                          ticket.priority === 'high'
                            ? 'bg-red-500/20 text-red-400'
                            : ticket.priority === 'medium'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {ticket.priority} priority
                        </span>
                        <span>#{ticket.id}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3 h-3" />
                        <span>{ticket.lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </GlassCard>

          {/* FAQ Section */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-6">Frequently Asked Questions</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {faqs.map((faq, i) => (
                <GlassCard key={i} gradient delay={i * 0.05}>
                  <h4 className="font-semibold mb-2">{faq.question}</h4>
                  <p className="text-sm text-gray-400">{faq.answer}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

const quickHelpItems = [
  {
    icon: MessageSquare,
    title: 'Live Chat',
    description: 'Chat with our support team in real-time',
    action: 'Start Chat',
    href: '/support/chat',
    gradient: 'from-therapy-500 to-therapy-600',
  },
  {
    icon: HeadphonesIcon,
    title: 'Call Support',
    description: 'Speak with a support representative',
    action: 'Call Now',
    href: '/support/call',
    gradient: 'from-calm-500 to-calm-600',
  },
  {
    icon: MessageSquare,
    title: 'Documentation',
    description: 'Browse our help articles and guides',
    action: 'View Docs',
    href: '/support/docs',
    gradient: 'from-blue-500 to-blue-600',
  },
];

const tickets = [
  {
    id: '1234',
    subject: 'Cannot connect to video session',
    description: 'I\'m having trouble connecting to my scheduled video session.',
    status: 'open',
    priority: 'high',
    lastUpdated: '2 hours ago',
  },
  {
    id: '1233',
    subject: 'Payment not processing',
    description: 'My credit card keeps getting declined.',
    status: 'in-progress',
    priority: 'medium',
    lastUpdated: '1 day ago',
  },
  {
    id: '1232',
    subject: 'How to reschedule appointment',
    description: 'Need help rescheduling my appointment for next week.',
    status: 'resolved',
    priority: 'low',
    lastUpdated: '3 days ago',
  },
];

const faqs = [
  {
    question: 'How do I schedule my first session?',
    answer: 'Go to the Therapists page, select a therapist, and click "Book Now" to schedule your first session.',
  },
  {
    question: 'Can I cancel or reschedule?',
    answer: 'Yes, you can cancel or reschedule up to 24 hours before your session without any charges.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. We are HIPAA compliant and use end-to-end encryption for all communications.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, debit cards, and HSA/FSA cards.',
  },
];
