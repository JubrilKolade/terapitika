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
  Loader2,
} from 'lucide-react';
import { apiHelpers } from '@/lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    title: '',
    email: '',
    phone: '',
    licenseNumber: '',
    licenseState: '',
    licenseExpiry: '',
    specializations: '',
    languages: '',
    hourlyRate: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContinue = async () => {
    if (activeStep < 3) {
      setActiveStep((prev) => prev + 1);
    } else {
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await apiHelpers.therapistPortal.submitApplication(formData);
      toast.success('Application submitted successfully!');
      router.push('/therapist/dashboard');
    } catch (error: any) {
      console.error('Failed to submit application:', error);
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

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
                className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 ${step.id <= activeStep
                    ? 'bg-gradient-to-r from-therapy-500 to-calm-500 border-transparent text-white shadow-lg shadow-therapy-500/20'
                    : 'border-white/20 text-gray-400'
                  }`}
              >
                {step.id}
              </div>
              {step.id < steps.length && (
                <div className={`flex-1 h-px mx-2 transition-colors duration-300 ${step.id < activeStep ? 'bg-therapy-500' : 'bg-white/10'}`} />
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
            <div className="hidden md:flex items-center space-x-2 text-xs text-gray-400 text-right">
              <ShieldCheck className="w-4 h-4 text-therapy-400" />
              <span>Review time: 1–2 days</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="min-h-[200px]">
              {activeStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First name" className="bg-white/5 border-white/10" />
                    <Input name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last name" className="bg-white/5 border-white/10" />
                  </div>
                  <Input name="title" value={formData.title} onChange={handleInputChange} placeholder="Professional title (e.g. LMFT, Psychologist)" className="bg-white/5 border-white/10" />
                  <Input name="email" value={formData.email} onChange={handleInputChange} placeholder="Contact email" type="email" className="bg-white/5 border-white/10" />
                  <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone number" className="bg-white/5 border-white/10" />
                </motion.div>
              )}
              {activeStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input name="licenseNumber" value={formData.licenseNumber} onChange={handleInputChange} placeholder="License number" className="bg-white/5 border-white/10" />
                    <Input name="licenseState" value={formData.licenseState} onChange={handleInputChange} placeholder="Issuing state" className="bg-white/5 border-white/10" />
                  </div>
                  <Input name="licenseExpiry" value={formData.licenseExpiry} onChange={handleInputChange} placeholder="License expiration date (MM/YYYY)" className="bg-white/5 border-white/10" />
                  <div className="border border-dashed border-white/20 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400 gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-therapy-500/10 rounded-xl">
                        <FileText className="w-6 h-6 text-therapy-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Upload license documentation</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          PDF, PNG, or JPG up to 10MB.
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/5">
                      Choose file
                    </Button>
                  </div>
                </motion.div>
              )}
              {activeStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <Input name="specializations" value={formData.specializations} onChange={handleInputChange} placeholder="Specialties (comma separated: anxiety, couples, kids)" className="bg-white/5 border-white/10" />
                  <Input name="languages" value={formData.languages} onChange={handleInputChange} placeholder="Languages you speak (comma separated)" className="bg-white/5 border-white/10" />
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input name="hourlyRate" value={formData.hourlyRate} onChange={handleInputChange} placeholder="Hourly rate (USD)" className="bg-white/5 border-white/10 pl-8" />
                  </div>
                </motion.div>
              )}
            </div>

            <div className="flex items-center justify-between mt-10">
              <Button
                variant="ghost"
                disabled={activeStep === 1 || isSubmitting}
                className="text-gray-400 hover:text-white hover:bg-white/5"
                onClick={() => setActiveStep((step) => Math.max(1, step - 1))}
              >
                Back
              </Button>
              <Button
                disabled={isSubmitting}
                className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 shadow-lg shadow-therapy-500/20 px-8"
                onClick={handleContinue}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    {activeStep === 3 ? 'Submit application' : 'Continue'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TherapistRegisterPage;

