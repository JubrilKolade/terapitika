'use client';

export function FAQ() {
    return (
        <section className="relative py-32 px-4 bg-[#0A0A0F]">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h2 className="text-4xl md:text-5xl font-display font-bold">
                        Got questions? <br />
                        <span className="text-therapy-400">we&apos;ve got answers</span>
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Everything you need to know about Terapitika and our AI-powered wellness approach.
                    </p>
                </div>

                <div className="space-y-4">
                    {[
                        {
                            q: "What is your mission?",
                            a: "Our mission is to democratize mental health support by combining licensed human expertise with 24/7 accessible AI companions, ensuring nobody has to navigate their journey alone."
                        },
                        {
                            q: "How does your AI technology improve mental wellness?",
                            a: "Our AI uses advanced natural language processing to provide immediate empathetic support, track emotional trends, and offer clinically-vetted coping strategies in real-time, freeing up human therapists for deeper clinical work."
                        },
                        {
                            q: "Is your AI capable of handling complex emotional inquiries?",
                            a: "While our AI is highly sophisticated and empathetic, it is trained to recognize crisis signals. In such cases, it immediately provides emergency resources and can facilitate priority connections to licensed professionals."
                        },
                        {
                            q: "Can I integrate Terapitika with my existing health tracking apps?",
                            a: "Yes, Terapitika supports secure integrations with major health platforms, allowing your AI companion to have a holistic view of your wellness data (with your explicit permission)."
                        },
                        {
                            q: "How do you ensure user data privacy and security?",
                            a: "Privacy is our bedrock. All conversations are end-to-end encrypted, and we strictly adhere to HIPAA and GDPR standards. Your data is never sold and is only used to personalize your wellness experience."
                        }
                    ].map((faq, i) => (
                        <details key={i} className="group p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all">
                            <summary className="flex items-center justify-between list-none cursor-pointer">
                                <span className="text-lg font-semibold pr-8">{faq.q}</span>
                                <div className="relative w-6 h-6 flex items-center justify-center">
                                    <div className="w-5 h-0.5 bg-gray-500 rounded-full" />
                                    <div className="absolute w-5 h-0.5 bg-gray-500 rounded-full rotate-90 group-open:rotate-0 transition-transform duration-300" />
                                </div>
                            </summary>
                            <div className="mt-4 text-gray-400 leading-relaxed text-sm group-open:animate-in group-open:fade-in group-open:slide-in-from-top-2">
                                {faq.a}
                            </div>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}
