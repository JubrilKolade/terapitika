'use client';

import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <div className="fixed inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(14, 165, 233, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <Navbar />

      <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-6">
        <h1 className="text-3xl sm:text-4xl font-display font-bold mb-2">
          Terms of service
        </h1>
        <p className="text-xs text-gray-500">Last updated: Placeholder date</p>
        <p className="text-sm text-gray-400">
          These terms describe how you may use Terapitika and what you can expect
          from us in return. Replace this placeholder text with the final terms
          drafted by your legal team.
        </p>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfServicePage;

