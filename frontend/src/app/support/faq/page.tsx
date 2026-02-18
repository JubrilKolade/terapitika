'use client';

import { PageHeader } from '@/components/shared/PageHeader';
import { GlassCard } from '@/components/shared/GlassCard';
import { HelpCircle } from 'lucide-react';

const faqItems = [
  {
    question: 'How does Terapitika work?',
    answer:
      'You can start with AI chat at any time and book sessions with licensed therapists for deeper work. Your history and insights stay synced across both.',
  },
  {
    question: 'Is this a replacement for emergency services?',
    answer:
      'No. If you are in crisis or considering self-harm, contact local emergency services or your national crisis hotline immediately.',
  },
  {
    question: 'Can I switch therapists?',
    answer:
      'Yes. You can book with new therapists and switch at any time. Your preferences and summaries travel with you.',
  },
  {
    question: 'How is my privacy protected?',
    answer:
      'We use encryption in transit and at rest, strict access controls, and audit logging. Only your care team can see your data.',
  },
];

const SupportFAQPage = () => {
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

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <PageHeader
          title="Frequently Asked Questions"
          subtitle="Find quick answers about using Terapitika."
          icon={HelpCircle}
        />

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <GlassCard key={index} gradient delay={index * 0.05}>
              <h3 className="text-lg font-semibold mb-2">{item.question}</h3>
              <p className="text-sm text-gray-400">{item.answer}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupportFAQPage;

