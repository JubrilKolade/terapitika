'use client';

import { PageHeader } from '@/components/shared/PageHeader';
import { GlassCard } from '@/components/shared/GlassCard';
import { FileText } from 'lucide-react';

const SupportDocsPage = () => {
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
        <PageHeader
          title="Help center"
          subtitle="Documentation for common questions and workflows."
          icon={FileText}
        />

        <GlassCard gradient>
          <p className="text-sm text-gray-300">
            This will evolve into a full documentation hub with step‑by‑step guides
            for clients and therapists. For now, start with the FAQ or open a
            ticket if something is unclear.
          </p>
        </GlassCard>
      </div>
    </div>
  );
};

export default SupportDocsPage;

