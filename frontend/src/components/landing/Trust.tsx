'use client';

import { Shield, Lock, Activity, Globe as GlobeIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Trust() {
    return (
        <>
            <section className="relative py-20 border-y border-white/5">
                <div className="max-w-7xl mx-auto px-4 overflow-hidden">
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
                        {['Google', 'YouTube', 'AIRBUS', 'slack', 'HubSpot', 'Deloitte'].map((brand) => (
                            <span key={brand} className="text-2xl font-bold tracking-tighter text-white/50">{brand}</span>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative py-32 px-4 border-t border-white/5 bg-[#0D0D15]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-display font-bold">
                            Battle-tested AI with <br />
                            <span className="text-therapy-400">enterprise-level rigor</span>
                        </h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            {
                                icon: Shield,
                                title: "HIPAA & GDPR Ready",
                                desc: "Compliance ready safeguards for sensitive wellness data with industry-leading security practices.",
                                active: false
                            },
                            {
                                icon: Lock,
                                title: "Built-in safety",
                                desc: "Every interaction strictly aligns with our clinically-vetted safety policies and ethical guidelines.",
                                active: true
                            },
                            {
                                icon: Activity,
                                title: "High standards",
                                desc: "Full data lifecycle protection ensuring comprehensive privacy and regulatory compliance at every stage.",
                                active: false
                            },
                            {
                                icon: GlobeIcon,
                                title: "Massive Scale",
                                desc: "Optimized to manage millions of concurrent interactions without compromising on sub-second latency.",
                                active: false
                            }
                        ].map((item, i) => (
                            <div key={i} className={`p-8 rounded-2xl border transition-all duration-500 ${item.active
                                ? 'bg-therapy-500/10 border-therapy-500/50 shadow-[0_0_30px_rgba(14,165,233,0.1)]'
                                : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                                }`}>
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-6 ${item.active ? 'bg-therapy-500 text-white' : 'bg-white/5 text-gray-400'
                                    }`}>
                                    <item.icon size={20} />
                                </div>
                                <h3 className="text-lg font-bold mb-3 font-display">{item.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button className="bg-therapy-500 hover:bg-therapy-600 text-white px-8 h-12">Book a Demo</Button>
                        <Link href="/how-it-works">
                            <Button
                                variant="ghost"
                                className="text-gray-400 hover:text-white px-8 h-12 hover:bg-white/5"
                            >
                                Learn More
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
