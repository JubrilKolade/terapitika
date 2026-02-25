'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function CTA() {
    return (
        <>
            {/* Discovery Section (Footer-ish CTA) */}
            <section className="relative py-32 px-4 text-center border-t border-white/5">
                <div className="max-w-4xl mx-auto space-y-8">
                    <h2 className="text-5xl md:text-6xl font-display font-bold">
                        Discover the power <br />
                        of AI for <span className="text-therapy-400">mental wellness</span>
                    </h2>
                    <div className="pt-8">
                        <Button className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-10 h-14 rounded-full font-display font-bold transition-all shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                            PLATFORM OVERVIEW
                        </Button>
                    </div>
                </div>
            </section>

            {/* Final CTA Card */}
            <section className="relative py-32 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative p-12 rounded-3xl bg-gradient-to-br from-therapy-500/20 to-calm-500/20 border border-white/10 backdrop-blur-xl"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-therapy-500/10 to-calm-500/10 rounded-3xl blur-2xl" />
                        <div className="relative">
                            <h2 className="text-5xl font-display font-bold mb-6">
                                Ready to Transform Your
                                <span className="block bg-gradient-to-r from-therapy-400 to-calm-400 bg-clip-text text-transparent">
                                    Mental Health?
                                </span>
                            </h2>
                            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                                Join thousands improving their mental wellness with Terapitika
                            </p>
                            <Link href="/register">
                                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-6 text-lg shadow-2xl">
                                    Get Started Free
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Consultation / Newsletter Section */}
            <section className="relative py-32 px-4 text-center border-t border-white/5">
                <div className="max-w-4xl mx-auto space-y-12">
                    <h2 className="text-5xl md:text-6xl font-display font-bold">
                        Let&apos;s talk—book <br />
                        <span className="text-calm-400">a free consultation!</span>
                    </h2>

                    <div className="max-w-md mx-auto relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-full blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
                        <div className="relative flex p-1 rounded-full bg-[#0A0A0F] border border-white/10">
                            <input
                                type="email"
                                placeholder="Enter your email—we'll contact you later..."
                                className="flex-1 bg-transparent px-6 py-3 text-sm focus:outline-none placeholder-gray-600"
                            />
                            <button className="bg-gradient-to-r from-therapy-500 to-calm-500 text-white text-xs font-bold px-8 rounded-full hover:scale-105 transition-transform active:scale-95">
                                SUBMIT
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
