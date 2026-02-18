'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { GlassCard } from '@/components/shared/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HeadphonesIcon, Send, AlertTriangle } from 'lucide-react';

const NewTicketPage = () => {
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('technical');
  const [description, setDescription] = useState('');

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

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <PageHeader
          title="New support ticket"
          subtitle="Tell us what you need help with and we will respond shortly."
          icon={HeadphonesIcon}
        />

        <GlassCard gradient>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Subject</label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of your issue"
                className="bg-white/5 border-white/10 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-md text-sm px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-therapy-500"
              >
                <option value="technical">Technical issue</option>
                <option value="billing">Billing</option>
                <option value="sessions">Sessions and bookings</option>
                <option value="account">Account</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what happened, including any error messages or steps to reproduce."
                rows={6}
                className="w-full bg-white/5 border border-white/10 rounded-md text-sm text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-therapy-500"
              />
            </div>
            <div className="flex items-start space-x-2 text-xs text-gray-400">
              <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
              <p>
                If this is a clinical emergency or you are in immediate danger,
                contact local emergency services or your national crisis hotline.
                Support tickets are not monitored 24/7 for emergencies.
              </p>
            </div>
            <div className="flex justify-end">
              <Button className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600">
                <Send className="w-4 h-4 mr-2" />
                Submit ticket
              </Button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default NewTicketPage;
