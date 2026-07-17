'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CreditCard,
  CheckCircle2,
  Zap,
  ArrowRight,
  Shield,
  Clock,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { apiHelpers } from '@/lib/api';

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  popular: boolean;
  features: string[];
}

interface Subscription {
  planId: string;
  status: string;
  renewalDate?: string;
}

interface Usage {
  sessionsUsed: number;
  sessionsLimit: number | string;
  aiMessages: number;
  crisisFlags: number;
}

const fallbackPlans: Plan[] = [
  {
    id: 'free',
    name: 'Starter',
    price: '$0',
    period: 'forever',
    description: 'Explore Terapitika with limited AI sessions and basic features.',
    popular: false,
    features: [
      'AI chat, 10 messages per month',
      'Access to guest sessions',
      'Basic mood tracking',
    ],
  },
  {
    id: 'basic',
    name: 'Essential',
    price: '$49',
    period: 'month',
    description: 'For individuals who want consistent support and human sessions.',
    popular: true,
    features: [
      'Unlimited AI chat',
      '2 human sessions per month',
      'Full mood analytics',
      'Priority support',
    ],
  },
  {
    id: 'premium',
    name: 'Premium Care',
    price: '$89',
    period: 'month',
    description: 'For intensive care plans and deep therapeutic work.',
    popular: false,
    features: [
      'Unlimited AI chat',
      '4 human sessions per month',
      'Personalized goals and insights',
      'Crisis-aware monitoring',
    ],
  },
];

const SubscriptionPage = () => {
  const [plans, setPlans] = useState<Plan[]>(fallbackPlans);
  const [currentSub, setCurrentSub] = useState<Subscription | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [plansRes, subRes, usageRes] = await Promise.allSettled([
          apiHelpers.subscriptions.getPlans(),
          apiHelpers.subscriptions.getMine(),
          apiHelpers.subscriptions.getUsage(),
        ]);

        if (plansRes.status === 'fulfilled') {
          const data = plansRes.value.data.data;
          if (Array.isArray(data) && data.length > 0) setPlans(data);
        }

        if (subRes.status === 'fulfilled') {
          setCurrentSub(subRes.value.data.data);
        }

        if (usageRes.status === 'fulfilled') {
          setUsage(usageRes.value.data.data);
        }
      } catch {
        // Use fallback data
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const currentPlanId = currentSub?.planId || 'basic';
  const currentPlan = plans.find((p) => p.id === currentPlanId) || plans[1];

  const handleUpgrade = async (planId: string) => {
    if (planId === currentPlanId) return;
    try {
      setActionLoading(true);
      await apiHelpers.subscriptions.upgrade(planId);
      setCurrentSub((prev) => prev ? { ...prev, planId } : { planId, status: 'active' });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to change plan');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel your subscription?')) return;
    try {
      setActionLoading(true);
      await apiHelpers.subscriptions.cancel();
      setCurrentSub((prev) => prev ? { ...prev, status: 'cancelled' } : null);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to cancel subscription');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-therapy-400" />
        </div>
      </DashboardLayout>
    );
  }

  const sessionsUsed = usage?.sessionsUsed || 0;
  const sessionsLimit = typeof usage?.sessionsLimit === 'number' ? usage.sessionsLimit : 2;
  const sessionsPercent = sessionsLimit > 0 ? Math.round((sessionsUsed / sessionsLimit) * 100) : 0;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-white">Subscription</h1>
            <p className="text-gray-400">
              Manage your plan, billing details, and session limits.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="border-white/10 text-white">
              <CreditCard className="w-4 h-4 mr-2" />
              Update payment method
            </Button>
            <Button className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600">
              <Shield className="w-4 h-4 mr-2" />
              Billing history
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-3 text-white">
                  <Zap className="w-5 h-5 text-therapy-400" />
                  <span>Current plan</span>
                </CardTitle>
                <p className="text-sm text-gray-400 mt-2">
                  You are currently subscribed to the {currentPlan.name} plan.
                </p>
              </div>
              <Badge className={`${currentSub?.status === 'cancelled' ? 'bg-red-500/20 text-red-300 border-red-500/40' : 'bg-therapy-500/20 text-therapy-300 border border-therapy-500/40'}`}>
                {currentSub?.status === 'cancelled' ? 'Cancelled' : 'Active'}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-4xl font-bold text-white">
                    {currentPlan.price}
                    <span className="text-base text-gray-400 font-normal">
                      /{currentPlan.period}
                    </span>
                  </div>
                  <p className="text-gray-400 mt-1">{currentPlan.description}</p>
                </div>
                {currentSub?.renewalDate && (
                  <div className="text-right text-sm text-gray-400 space-y-1">
                    <div className="flex items-center justify-end space-x-2">
                      <Clock className="w-4 h-4 text-therapy-400" />
                      <span>Renews on {new Date(currentSub.renewalDate).toLocaleDateString()}</span>
                    </div>
                    <p>Next charge: {currentPlan.price}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center text-xs text-gray-400 space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-therapy-400" />
                  <span>
                    Cancel anytime. No long term contracts or hidden fees.
                  </span>
                </div>
                <Button
                  variant="outline"
                  className="border-red-500/40 text-red-400"
                  onClick={handleCancel}
                  disabled={actionLoading || currentSub?.status === 'cancelled'}
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Cancel subscription
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">Usage overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Sessions this month</span>
                  <span className="text-white font-medium">{sessionsUsed} of {sessionsLimit} used</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-therapy-500 to-calm-500" style={{ width: `${sessionsPercent}%` }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">AI conversations</span>
                  <span className="text-white font-medium">{usage?.aiMessages || 0} this week</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-calm-500 to-therapy-500" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Crisis flags detected</span>
                  <span className="text-white font-medium">{usage?.crisisFlags || 0} this month</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-500 to-rose-500" style={{ width: `${usage?.crisisFlags ? 10 : 0}%` }} />
                </div>
              </div>
              <Button variant="ghost" className="w-full justify-between text-sm text-gray-300 hover:bg-white/5">
                View detailed analytics
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Change plan</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`bg-white/5 border-white/10 backdrop-blur-xl flex flex-col ${plan.id === currentPlanId ? 'ring-2 ring-therapy-500/60' : ''
                  }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">{plan.name}</CardTitle>
                      <p className="text-xs text-gray-400 mt-1">{plan.description}</p>
                    </div>
                    {plan.popular && (
                      <Badge className="bg-gradient-to-r from-therapy-500 to-calm-500 text-xs">
                        Most popular
                      </Badge>
                    )}
                  </div>
                  <div className="mt-4">
                    <div className="text-3xl font-bold text-white">
                      {plan.price}
                      <span className="text-sm text-gray-400 font-normal">
                        {plan.price === '$0' ? '' : `/${plan.period}`}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                  <ul className="space-y-2 text-sm text-gray-300">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-therapy-400" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`mt-4 w-full ${plan.id === currentPlanId
                        ? 'bg-white/10 text-white hover:bg-white/20'
                        : 'bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600'
                      }`}
                    variant={plan.id === currentPlanId ? 'outline' : 'default'}
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={actionLoading || plan.id === currentPlanId}
                  >
                    {plan.id === currentPlanId ? 'Current plan' : 'Upgrade to this plan'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionPage;
