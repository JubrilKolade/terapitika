'use client';

import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { motion } from 'framer-motion';
import { PenSquare } from 'lucide-react';

const posts = [
  {
    title: 'When to seek therapy, AI support, or both',
    tag: 'Education',
    readingTime: '6 min read',
  },
  {
    title: 'Designing safe AI for mental health',
    tag: 'Product',
    readingTime: '8 min read',
  },
  {
    title: 'Preparing for your first online session',
    tag: 'Guides',
    readingTime: '5 min read',
  },
];

const BlogPage = () => {
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

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-10">
        <section className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-display font-bold">
            Insights from the Terapitika team
          </h1>
          <p className="text-sm text-gray-400 max-w-3xl">
            Thoughts on mental health, product design, and using AI responsibly in
            care.
          </p>
        </section>

        <section className="space-y-4">
          {posts.map((post, index) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-start justify-between gap-4"
            >
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-therapy-500 to-calm-500 flex items-center justify-center">
                  <PenSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-white mb-1">{post.title}</h2>
                  <p className="text-xs text-gray-400">
                    {post.tag} • {post.readingTime}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPage;

