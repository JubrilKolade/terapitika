'use client';

import { PageHeader } from '@/components/shared/PageHeader';
import { GlassCard } from '@/components/shared/GlassCard';
import { PhoneCall } from 'lucide-react';

const SupportCallPage = () => {
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
          title="Call support"
          subtitle="Phone support details for Terapitika."
          icon={PhoneCall}
        />

        <GlassCard gradient>
          <p className="text-sm text-gray-300">
            Phone support is not yet available. When launched, this page will show
            your region-specific support number and operating hours.
          </p>
        </GlassCard>
      </div>
    </div>
  );
};

export default SupportCallPage;

