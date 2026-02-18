'use client';

import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { motion } from 'framer-motion';
import { StepForward, Brain, Video, CalendarCheck } from 'lucide-react';

const HowItWorksPage = () => {
  const steps = [
    {
      icon: Brain,
      title: 'Start with AI',
      description:
        'Begin with our AI companion to share what is on your mind, anytime. It listens, reflects, and surfaces patterns.',
    },
    {
      icon: CalendarCheck,
      title: 'Book a therapist',
      description:
        'Browse licensed professionals by specialization, schedule, and approach. Book sessions that fit your life.',
    },
    {
      icon: Video,
      title: 'Meet in your format',
      description:
        'Connect over secure video, voice, or chat. Your therapist sees AI summaries and mood trends to get context quickly.',
    },
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

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-16">
        <section className="space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-display font-bold"
          >
            How Terapitika works
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-400 max-w-3xl"
          >
            A continuous support loop between you, your therapist, and an AI
            companion tuned for care.
          </motion.p>
        </section>

        <section className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-therapy-500 to-calm-500 flex items-center justify-center">
                <step.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-white">{step.title}</h3>
              <p className="text-sm text-gray-400">{step.description}</p>
            </motion.div>
          ))}
        </section>

        <section className="grid md:grid-cols-2 gap-10 items-start">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Designed around your journey</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your sessions, AI chats, and mood check‑ins all feed into the same
              secure record. This helps you and your therapist see trends over time
              and decide where to focus next.
            </p>
            <p className="text-sm text-gray-400 leading-relaxed">
              You are always in control of who sees what. AI never replaces your
              therapist, but it makes it easier to stay supported between sessions.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-3">
            <div className="flex items-center space-x-3">
              <StepForward className="w-5 h-5 text-therapy-400" />
              <h3 className="font-semibold text-white">A simple three‑step flow</h3>
            </div>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
              <li>Create an account or try the guest AI chat.</li>
              <li>Share what is going on and let AI summarize patterns.</li>
              <li>Book a therapist to go deeper together.</li>
            </ol>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HowItWorksPage;

