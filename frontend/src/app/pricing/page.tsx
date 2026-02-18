'use client';

import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: '$0',
    period: 'forever',
    description: 'Try AI support and the platform without commitment.',
    features: [
      'AI chat with limited messages',
      'Guest sessions',
      'Basic mood check‑ins',
    ],
    cta: 'Start for free',
    highlighted: false,
  },
  {
    name: 'Essential',
    price: '$49',
    period: 'month',
    description: 'For individuals who want consistent support.',
    features: [
      'Unlimited AI chat',
      '2 therapist sessions per month',
      'Full analytics and trends',
      'Priority support',
    ],
    cta: 'Get Essential',
    highlighted: true,
  },
  {
    name: 'Premium Care',
    price: '$89',
    period: 'month',
    description: 'For deeper, ongoing therapeutic work.',
    features: [
      'Unlimited AI chat',
      '4 therapist sessions per month',
      'Advanced insights and goals',
      'Crisis‑aware monitoring',
    ],
    cta: 'Get Premium',
    highlighted: false,
  },
];

const PricingPage = () => {
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

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-12">
        <section className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-display font-bold">
            Simple pricing for{' '}
            <span className="bg-gradient-to-r from-therapy-400 to-calm-400 bg-clip-text text-transparent">
              modern care.
            </span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm">
            No hidden fees. Cancel anytime. Choose the level of support that
            matches where you are today.
          </p>
        </section>

        <section className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`bg-white/5 border-white/10 backdrop-blur-xl flex flex-col ${
                plan.highlighted ? 'ring-2 ring-therapy-500/60 scale-105' : ''
              }`}
            >
              <CardHeader>
                <CardTitle className="text-white">{plan.name}</CardTitle>
                <p className="text-xs text-gray-400 mt-1">{plan.description}</p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-3xl font-bold text-white">
                    {plan.price}
                    <span className="text-sm text-gray-400 font-normal">
                      {plan.price === '$0' ? '' : `/${plan.period}`}
                    </span>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-gray-300">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-therapy-400" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  className={`mt-4 w-full ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PricingPage;

