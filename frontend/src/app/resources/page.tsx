'use client';

import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { motion } from 'framer-motion';
import { BookOpen, Video, FileText } from 'lucide-react';

const resources = [
  {
    icon: BookOpen,
    title: 'Guides',
    items: ['Getting started with Terapitika', 'Working with a therapist online'],
  },
  {
    icon: Video,
    title: 'Short videos',
    items: ['Grounding in 60 seconds', 'How to prepare for session one'],
  },
  {
    icon: FileText,
    title: 'Templates',
    items: ['Session reflection worksheet', 'Weekly mood journal'],
  },
];

const ResourcesPage = () => {
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

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-12">
        <section className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-display font-bold">
            Resources for your mental health journey
          </h1>
          <p className="text-sm text-gray-400 max-w-3xl">
            Articles, worksheets, and tools that complement your work with
            therapists and the AI companion.
          </p>
        </section>

        <section className="grid md:grid-cols-3 gap-8">
          {resources.map((group, index) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-therapy-500 to-calm-500 flex items-center justify-center">
                <group.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-white">{group.title}</h3>
              <ul className="space-y-1 text-sm text-gray-300">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ResourcesPage;

