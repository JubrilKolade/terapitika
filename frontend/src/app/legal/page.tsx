'use client';

import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import Link from 'next/link';

const LegalPage = () => {
  const links = [
    { href: '/legal/privacy-policy', label: 'Privacy policy' },
    { href: '/legal/terms-of-service', label: 'Terms of service' },
    { href: '/legal/hipaa-notice', label: 'HIPAA notice' },
  ];

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

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-10">
        <section className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-display font-bold">
            Legal and compliance
          </h1>
          <p className="text-sm text-gray-400">
            Learn how we handle your data, your rights as a user, and our
            responsibilities as a care platform.
          </p>
        </section>

        <section className="space-y-4">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-therapy-500/50 hover:bg-white/10 transition-colors cursor-pointer my-2">
                <p className="font-semibold text-white">{link.label}</p>
              </div>
            </Link>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LegalPage;

