'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Brain,
  Sparkles,
  Shield,
  ArrowRight,
  Menu,
  X,
  Play,
  Star,
  Video,
  MessageSquare,
  Clock,
  Heart,
  Activity,
  Zap,
  Lock,
  Globe as GlobeIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatMockup } from '@/components/mockups/ChatMockup';
import { TranscriptMockup, MailMockup } from '@/components/mockups/VisualMockups';
import { EarningsMockup } from '@/components/mockups/StatsMockup';
import { Globe } from '@/components/mockups/Globe';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white overflow-hidden">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(14, 165, 233, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-therapy-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-calm-500/30 rounded-full blur-3xl"
        />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 w-full z-50 bg-[#0A0A0F]/60 backdrop-blur-2xl border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            {/* Logo Left */}
            <Link href="/" className="flex items-center space-x-3 group min-w-[200px]">
              <div className="w-10 h-10 bg-gradient-to-br from-therapy-500 to-calm-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-display font-bold tracking-tight text-white/90">
                Terapitika
              </span>
            </Link>

            {/* Menu Center */}
            <div className="hidden lg:flex items-center bg-white/5 border border-white/5 rounded-full px-2 py-1">
              {['Home', 'Platform', 'Therapists', 'Resources', 'Pricing'].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="px-5 py-2 text-[13px] font-medium text-gray-400 hover:text-white transition-colors uppercase tracking-wider"
                >
                  {item}
                </Link>
              ))}
            </div>

            {/* Actions Right */}
            <div className="hidden lg:flex items-center justify-end space-x-4 min-w-[200px]">
              <Link href="/login" className="text-[13px] font-bold text-gray-400 hover:text-white tracking-widest uppercase transition-colors">
                SIGN IN
              </Link>
              <Link href="/register">
                <Button className="bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg text-[11px] font-bold tracking-widest uppercase px-6 h-10">
                  Join Now
                </Button>
              </Link>
            </div>

            <button
              className="lg:hidden p-2 text-white/50 hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: mobileMenuOpen ? 1 : 0, x: mobileMenuOpen ? 0 : '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[60] bg-[#0A0A0F]/95 backdrop-blur-2xl lg:hidden"
        >
          <div className="flex flex-col h-full p-8">
            <div className="flex justify-between items-center mb-12">
              <Link href="/" className="flex items-center space-x-3" onClick={() => setMobileMenuOpen(false)}>
                <div className="w-10 h-10 bg-gradient-to-br from-therapy-500 to-calm-600 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-display font-bold">Terapitika</span>
              </Link>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-white/50 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-col space-y-6">
              {['Home', 'Platform', 'Therapists', 'Resources', 'Pricing'].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-display font-bold text-gray-400 hover:text-white transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>

            <div className="mt-auto space-y-4">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block text-center py-4 rounded-xl border border-white/10 font-bold text-gray-400">
                SIGN IN
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="block text-center py-4 rounded-xl bg-gradient-to-r from-therapy-500 to-calm-500 font-bold text-white">
                JOIN NOW
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div className="text-center space-y-8">
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl"
            >
              <Sparkles className="w-4 h-4 text-therapy-400" />
              <span className="text-sm text-gray-300">AI-Powered Mental Health Support</span>
              <div className="px-2 py-0.5 rounded-full bg-therapy-500/20 text-therapy-400 text-xs font-semibold">
                New
              </div>
            </motion.div> */}

            <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30 pointer-events-none">
              <Globe className="w-[800px] h-[800px]" />
            </div>

            {/* Floating Mockups */}
            <div className="absolute inset-0 pointer-events-none z-10 hidden xl:block">
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="absolute left-[5%] top-[25%]"
              >
                <ChatMockup className="scale-90 rotate-[-2deg]" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 1 }}
                className="absolute right-[5%] top-[35%]"
              >
                <TranscriptMockup className="scale-90 rotate-[2deg]" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 1 }}
                className="absolute left-[15%] bottom-[15%]"
              >
                <MailMockup className="scale-75 rotate-[5deg]" />
              </motion.div>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-6xl sm:text-7xl lg:text-8xl font-display font-bold leading-tight"
            >
              <span className="block">Mental Health</span>
              <span className="block bg-gradient-to-r from-therapy-400 via-calm-400 to-therapy-400 bg-clip-text text-transparent">
                Reimagined
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
            >
              Experience the future of therapy. Connect with licensed professionals
              or chat with our AI companion. Available 24/7, always private.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/auth/register">
                <Button size="lg" className="group bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 text-white px-8 py-6 text-lg shadow-2xl shadow-therapy-500/50">
                  <span className="flex items-center">
                    Start Free Chat
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg backdrop-blur-xl">
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-16"
            >
              {[
                { value: '10K+', label: 'Active Users' },
                { value: '500+', label: 'Therapists' },
                { value: '24/7', label: 'AI Support' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl sm:text-4xl font-display font-bold bg-gradient-to-r from-therapy-400 to-calm-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Logo Cloud / Trust Bar */}
      <section className="relative py-20 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 overflow-hidden">
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
            {['Google', 'YouTube', 'AIRBUS', 'slack', 'HubSpot', 'Deloitte'].map((brand) => (
              <span key={brand} className="text-2xl font-bold tracking-tighter text-white/50">{brand}</span>
            ))}
          </div>
        </div>
      </section>

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

      {/* Trust & Compliance Section */}
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
            <Button variant="ghost" className="text-gray-400 hover:text-white px-8 h-12">Learn More</Button>
          </div>
        </div>
      </section>

      {/* AI Management Section (Staggered) */}
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

      {/* Final CTA */}
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
              <Link href="/auth/register">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-6 text-lg shadow-2xl">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-32 px-4 bg-[#0A0A0F]">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-display font-bold">
              Got questions? <br />
              <span className="text-therapy-400">we've got answers</span>
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

      {/* Consultation / Newsletter Section */}
      <section className="relative py-32 px-4 text-center border-t border-white/5">
        <div className="max-w-4xl mx-auto space-y-12">
          <h2 className="text-5xl md:text-6xl font-display font-bold">
            Let's talk—book <br />
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

      {/* Footer */}
      <footer className="relative pt-24 pb-12 px-6 border-t border-white/5 bg-[#0A0A0F]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8">
          {/* Logo & Info */}
          <div className="col-span-2 space-y-6">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-therapy-500 to-calm-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-display font-bold tracking-tight">Terapitika</span>
            </Link>
            <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
              We are an AI wellness company on a mission to make professional support accessible and extraordinary for everyone.
            </p>
            <div className="flex space-x-4">
              {['facebook', 'instagram', 'twitter', 'youtube'].map((s) => (
                <div key={s} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer transition-all">
                  <div className="w-4 h-4 bg-current rounded-sm opacity-50" />
                </div>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {[
            {
              title: "Products",
              links: ["AI Companion", "Human Therapy", "Crisis Support", "Group Sessions"]
            },
            {
              title: "Industries",
              links: ["Individual", "Corporate", "Education", "Healthcare"]
            },
            {
              title: "Resources",
              links: ["Blog", "Coping Tools", "Documentation", "Community"]
            },
            {
              title: "Platform",
              links: ["Integration", "Verification", "Mission", "Pricing"]
            }
          ].map((col, i) => (
            <div key={i} className="space-y-6">
              <h4 className="text-xs font-bold tracking-widest uppercase text-white/90">{col.title}</h4>
              <ul className="space-y-4">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-gray-500 hover:text-white text-sm transition-colors">{link}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-600 text-[10px] tracking-widest font-medium uppercase">
            © 2026 Terapitika. All rights reserved.
          </div>
          <div className="flex space-x-8">
            <Link href="#" className="text-gray-600 hover:text-white text-[10px] tracking-widest font-medium uppercase transition-colors">Terms of Service</Link>
            <Link href="#" className="text-gray-600 hover:text-white text-[10px] tracking-widest font-medium uppercase transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: Brain,
    title: '24/7 AI Companion',
    description: 'Intelligent AI that understands you. Get support anytime, anywhere.',
  },
  {
    icon: Video,
    title: 'HD Video Sessions',
    description: 'Crystal-clear video calls with licensed therapists. Face-to-face from anywhere.',
  },
  {
    icon: MessageSquare,
    title: 'Secure Messaging',
    description: 'End-to-end encrypted chat. Your conversations are completely private.',
  },
  {
    icon: Shield,
    title: 'HIPAA Compliant',
    description: 'Enterprise-grade security. Your data is protected and encrypted.',
  },
  {
    icon: Clock,
    title: 'Flexible Scheduling',
    description: 'Book sessions that fit your life. Easy rescheduling with one tap.',
  },
  {
    icon: Heart,
    title: 'Progress Tracking',
    description: 'Visual insights into your journey. Track mood, goals, and growth.',
  },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer',
    content: 'Terapitika has been life-changing. The AI chat helped me through anxiety, and my therapist is incredible.',
  },
  {
    name: 'Marcus Johnson',
    role: 'Entrepreneur',
    content: 'The convenience is unmatched. I can access quality mental health support from anywhere, anytime.',
  },
  {
    name: 'Dr. Emily Rodriguez',
    role: 'Licensed Therapist',
    content: 'As a therapist, this platform makes it so easy to help my clients. The tools are excellent.',
  },
];
