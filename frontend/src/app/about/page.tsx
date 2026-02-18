'use client';

import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { motion } from 'framer-motion';
import { HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react';

const AboutPage = () => {
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

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-16">
        <section className="space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-display font-bold"
          >
            Built at the intersection of{' '}
            <span className="bg-gradient-to-r from-therapy-400 to-calm-400 bg-clip-text text-transparent">
              human care
            </span>{' '}
            and AI.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-400 max-w-3xl"
          >
            Terapitika was created to make high‑quality mental health support more
            accessible, more continuous, and more human. We combine licensed
            therapists with an AI companion that never gets tired of listening.
          </motion.p>
        </section>

        <section className="grid md:grid-cols-3 gap-8">
          <ValueCard
            icon={HeartHandshake}
            title="Therapy first"
            description="AI helps, but never replaces your clinician. We design every feature to strengthen the relationship between client and therapist."
          />
          <ValueCard
            icon={ShieldCheck}
            title="Safety by design"
            description="Crisis detection, audit logging, and encryption are foundational. We treat personal data like it belongs to someone you love."
          />
          <ValueCard
            icon={Sparkles}
            title="Thoughtful AI"
            description="Our AI assistant is tuned for empathy, boundaries, and evidence‑based suggestions, with clear guardrails and transparency."
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">What we are building</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            We imagine a world where checking in with your mental health is as
            normal as checking your messages. A world where support is available
            when things feel heavy at 2 A.M., not just during office hours. And a
            world where clinicians can focus on humans, not paperwork.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            Terapitika gives clients a single place to track their progress, talk
            to their therapist, and lean on AI between sessions. For therapists, it
            provides a modern workspace with summaries, risk signals, and easier
            scheduling so they can spend more time in session, less time in admin.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

const ValueCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof HeartHandshake;
  title: string;
  description: string;
}) => {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-3">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-therapy-500 to-calm-500 flex items-center justify-center">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
};

export default AboutPage;

