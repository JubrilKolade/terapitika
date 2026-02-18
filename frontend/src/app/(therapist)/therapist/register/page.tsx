'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  UserPlus,
  FileText,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Account details',
    description: 'Your basic contact details and professional title.',
  },
  {
    id: 2,
    title: 'Licensing and verification',
    description: 'License number, state, and documentation.',
  },
  {
    id: 3,
    title: 'Practice preferences',
    description: 'Availability, session types, and specialties.',
  },
];

const TherapistRegisterPage = () => {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <DashboardLayout type="therapist">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Become a therapist</h1>
            <p className="text-gray-400 text-sm">
              Join Terapitika and start accepting new clients in a few steps.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <CheckCircle2 className="w-4 h-4 text-therapy-400" />
            <span>HIPAA-ready workflow</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400">
          {steps.map((step) => (
            <div key={step.id} className="flex-1 flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                  step.id <= activeStep
                    ? 'bg-gradient-to-r from-therapy-500 to-calm-500 border-transparent text-white'
                    : 'border-white/20 text-gray-400'
                }`}
              >
                {step.id}
              </div>
              {step.id < steps.length && (
                <div className="flex-1 h-px bg-white/10 mx-2" />
              )}
            </div>
          ))}
        </div>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2 text-white">
                <UserPlus className="w-5 h-5 text-therapy-400" />
                <span>
                  {steps.find((s) => s.id === activeStep)?.title || 'Account details'}
                </span>
              </CardTitle>
              <p className="text-xs text-gray-400 mt-1">
                {steps.find((s) => s.id === activeStep)?.description}
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <ShieldCheck className="w-4 h-4 text-therapy-400" />
              <span>Average review time: 1–2 business days</span>
            </div>
          </CardHeader>
          <CardContent>
            {activeStep === 1 && <StepOne />}
            {activeStep === 2 && <StepTwo />}
            {activeStep === 3 && <StepThree />}

            <div className="flex items-center justify-between mt-8">
              <Button
                variant="ghost"
                disabled={activeStep === 1}
                className="text-gray-300 hover:bg-white/5"
                onClick={() => setActiveStep((step) => Math.max(1, step - 1))}
              >
                Back
              </Button>
              <Button
                className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600"
                onClick={() =>
                  setActiveStep((step) => (step === 3 ? 3 : step + 1))
                }
              >
                {activeStep === 3 ? 'Submit application' : 'Continue'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

const StepOne = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="grid md:grid-cols-2 gap-4">
        <Input placeholder="First name" className="bg-white/5 border-white/10" />
        <Input placeholder="Last name" className="bg-white/5 border-white/10" />
      </div>
      <Input placeholder="Professional title (e.g. LMFT, Psychologist)" className="bg-white/5 border-white/10" />
      <Input placeholder="Contact email" type="email" className="bg-white/5 border-white/10" />
      <Input placeholder="Phone number" className="bg-white/5 border-white/10" />
    </motion.div>
  );
};

const StepTwo = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="grid md:grid-cols-2 gap-4">
        <Input placeholder="License number" className="bg-white/5 border-white/10" />
        <Input placeholder="Issuing state" className="bg-white/5 border-white/10" />
      </div>
      <Input placeholder="License expiration date" className="bg-white/5 border-white/10" />
      <div className="border border-dashed border-white/20 rounded-xl p-4 flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center space-x-3">
          <FileText className="w-5 h-5 text-therapy-400" />
          <div>
            <p>Upload license documentation</p>
            <p className="text-xs text-gray-500">
              PDF, PNG, or JPG. Please hide any sensitive IDs.
            </p>
          </div>
        </div>
        <Button variant="outline" className="border-white/20 text-white">
          Choose file
        </Button>
      </div>
    </motion.div>
  );
};

const StepThree = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <Input placeholder="Primary specialization (e.g. anxiety, couples)" className="bg-white/5 border-white/10" />
      <Input placeholder="Languages you speak" className="bg-white/5 border-white/10" />
      <Input placeholder="Hourly rate (USD)" className="bg-white/5 border-white/10" />
    </motion.div>
  );
};

export default TherapistRegisterPage;

