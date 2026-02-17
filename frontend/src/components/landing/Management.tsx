'use client';

import { Activity, Zap, Brain, Globe as GlobeIcon } from 'lucide-react';
import { ChatMockup } from '@/components/mockups/ChatMockup';
import { TranscriptMockup, MailMockup } from '@/components/mockups/VisualMockups';
import { EarningsMockup } from '@/components/mockups/StatsMockup';

export function Management() {
    return (
        <section className="relative py-32 px-4">
            <div className="max-w-7xl mx-auto space-y-32">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h2 className="text-5xl md:text-6xl font-display font-bold">
                        AI agent management for <br />
                        <span className="bg-gradient-to-r from-therapy-400 to-calm-400 bg-clip-text text-transparent">continuous improvement</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Effortlessly manage and improve your AI agent's performance, ensuring it gets better with every interaction.
                    </p>
                </div>

                {[
                    {
                        label: "MEASURE",
                        title: "Pinpoint opportunities to improve your AI agent",
                        desc: "Gain clear insights into your automated conversations—pinpointing where your AI agent delivered relevant, accurate, and secure responses.",
                        mockup: <EarningsMockup className="w-full" />,
                        icon: Activity
                    },
                    {
                        label: "TEST",
                        title: "Preview your AI agent in action",
                        desc: "Test your AI agent with simulated conversations to refine and optimize its performance, ensuring it improves consistently over time.",
                        mockup: <ChatMockup className="w-full" messages={[
                            { role: 'user', text: 'How do you handle crisis situations?', delay: 0 },
                            { role: 'ai', text: 'I am trained to identify distress signals and immediately provide professional helpline resources while maintaining a calm, supportive tone.', delay: 1 }
                        ]} />,
                        icon: Zap,
                        reverse: true
                    },
                    {
                        label: "COACH",
                        title: "Continuously improve over time",
                        desc: "Coach your AI agent to follow specific rules, guidance, and multi-step processes. Have peace of mind that your AI agent will continuously learn.",
                        mockup: <TranscriptMockup className="w-full" />,
                        icon: Brain
                    },
                    {
                        label: "EXTEND",
                        title: "Automate across channels and languages",
                        desc: "Effortlessly connect with your users in over 50 languages, reaching them on their preferred channels—whether messaging, voice, or email.",
                        mockup: <MailMockup className="w-full" />,
                        icon: GlobeIcon,
                        reverse: true
                    }
                ].map((s, i) => (
                    <div key={i} className={`flex flex-col ${s.reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-16 lg:gap-32`}>
                        <div className="flex-1 space-y-6">
                            <div className="flex items-center space-x-2 text-therapy-400 font-bold text-xs tracking-widest uppercase">
                                <s.icon size={14} />
                                <span>{s.label}</span>
                            </div>
                            <h3 className="text-3xl md:text-4xl font-display font-bold leading-tight">{s.title}</h3>
                            <p className="text-gray-400 text-lg leading-relaxed">{s.desc}</p>
                        </div>
                        <div className="flex-1 w-full max-w-lg">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-therapy-500/10 to-calm-500/10 rounded-3xl blur-2xl group-hover:blur-3xl transition-all" />
                                <div className="relative p-2 rounded-3xl border border-white/5 bg-white/[0.01]">
                                    {s.mockup}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
