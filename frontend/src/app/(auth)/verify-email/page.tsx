'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Brain, CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authstore';

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const verifyEmail = useAuthStore((state) => state.verifyEmail);
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [errorHeader, setErrorHeader] = useState('Verification Failed');
    const [errorMessage, setErrorMessage] = useState('The verification link is invalid or has expired.');

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            setStatus('error');
            setErrorMessage('Verification token is missing.');
            return;
        }

        const performVerification = async () => {
            try {
                await verifyEmail(token);
                setStatus('success');
            } catch (err: any) {
                setStatus('error');
                setErrorMessage(err.response?.data?.message || 'The verification link is invalid or has expired.');
            }
        };

        performVerification();
    }, [searchParams, verifyEmail]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 p-8 shadow-2xl text-center"
        >
            {status === 'loading' && (
                <div className="py-12">
                    <Loader2 className="w-16 h-16 text-therapy-400 animate-spin mx-auto mb-6" />
                    <h1 className="text-3xl font-bold text-white mb-2">Verifying...</h1>
                    <p className="text-gray-400">Please wait while we confirm your email address.</p>
                </div>
            )}

            {status === 'success' && (
                <div className="py-12">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Email Verified</h1>
                    <p className="text-gray-400 mb-8">
                        Your email has been successfully verified. You now have full access to Terapitika.
                    </p>
                    <Link href="/dashboard">
                        <Button className="w-full bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600">
                            Go to Dashboard
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            )}

            {status === 'error' && (
                <div className="py-12">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XCircle className="w-10 h-10 text-red-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">{errorHeader}</h1>
                    <p className="text-gray-400 mb-8">{errorMessage}</p>
                    <div className="space-y-4">
                        <Link href="/register">
                            <Button className="w-full bg-white/10 hover:bg-white/20 border-white/10 text-white">
                                Register Again
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button variant="ghost" className="w-full text-therapy-400 hover:text-therapy-300">
                                Back to Login
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </motion.div>
    );
}

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#0A0A0F] via-[#1a1a2e] to-[#0A0A0F]">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute top-0 left-0 w-96 h-96 bg-therapy-500/30 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 10, repeat: Infinity, delay: 1 }}
                    className="absolute bottom-0 right-0 w-96 h-96 bg-calm-500/30 rounded-full blur-3xl"
                />
            </div>

            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <Link href="/" className="flex items-center justify-center space-x-3 mb-8 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                            <div className="relative w-14 h-14 bg-gradient-to-br from-therapy-500 to-calm-600 rounded-2xl flex items-center justify-center">
                                <Brain className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <span className="text-3xl font-display font-bold text-white">
                            Terapitika
                        </span>
                    </Link>

                    <Suspense fallback={
                        <div className="relative backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 p-8 shadow-2xl text-center py-12">
                            <Loader2 className="w-16 h-16 text-therapy-400 animate-spin mx-auto mb-6" />
                            <h1 className="text-3xl font-bold text-white mb-2">Loading...</h1>
                        </div>
                    }>
                        <VerifyEmailContent />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
