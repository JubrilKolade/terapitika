'use client';

import { ChatMockup } from '@/components/mockups/ChatMockup';
import { TranscriptMockup, MailMockup } from '@/components/mockups/VisualMockups';

export function Features() {
    return (
        <>
            {/* Hero-like Title for Features */}
            <section className="relative py-32 px-4 bg-[#0A0A0F]">
                <div className="max-w-7xl mx-auto text-center space-y-4">
                    <h2 className="text-5xl md:text-6xl font-display font-bold">
                        Experiences that give your <br />
                        <span className="bg-gradient-to-r from-therapy-400 to-calm-400 bg-clip-text text-transparent">
                            sanity life back
                        </span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Raise the standard for quality mental health support by delivering instant, proactive, personalized, and effortless support.
                    </p>
                </div>
            </section>

            {/* Split Features Section */}
            <section id="features" className="relative border-t border-white/10">
                <div className="max-w-7xl mx-auto grid md:grid-cols-3">
                    {[
                        {
                            title: "Proactive engagement",
                            desc: "Prevent issues before they arise with an AI agent that resolves problems at scale, ensuring every user feels supported.",
                            mockup: <ChatMockup className="w-full shadow-none border-none scale-90" />,
                            border: "md:border-r"
                        },
                        {
                            title: "Personalized interactions",
                            desc: "Transform every interaction into a unique and meaningful connection with AI that truly understands your needs.",
                            mockup: <TranscriptMockup className="w-full shadow-none border-none scale-90" />,
                            border: "md:border-r"
                        },
                        {
                            title: "Effortless support",
                            desc: "Deliver seamless mental wellness experiences with AI that makes every interaction frictionless for you.",
                            mockup: <MailMockup className="w-full shadow-none border-none scale-90" />
                        }
                    ].map((f, i) => (
                        <div key={i} className={`p-10 flex flex-col items-center text-center space-y-8 border-b border-white/5 ${f.border || ''} hover:bg-white/[0.02] transition-colors group`}>
                            <div className="h-64 flex items-center justify-center w-full">
                                {f.mockup}
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold font-display">{f.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}
