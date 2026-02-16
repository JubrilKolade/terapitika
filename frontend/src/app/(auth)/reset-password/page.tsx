'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Brain, Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authstore';
import toast from 'react-hot-toast';

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const resetPassword = useAuthStore((state) => state.resetPassword);

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = searchParams.get('token');
        if (!token) {
            toast.error('Reset token is missing.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }

        if (formData.password.length < 8) {
            toast.error('Password must be at least 8 characters long.');
            return;
        }

        setIsLoading(true);
        try {
            await resetPassword(formData.password, token);
            setIsSuccess(true);
            toast.success('Password reset successfully!');
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to reset password. Link may be expired.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="relative backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 p-8 shadow-2xl text-center py-12">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-400" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Password Reset!</h1>
                <p className="text-gray-400 mb-8">
                    Your password has been changed. You will be redirected to login shortly.
                </p>
                <Link href="/login">
                    <Button className="w-full bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600">
                        Sign In Now
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="relative backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 p-8 shadow-2xl">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">New Password</h1>
                <p className="text-gray-400">Set a strong password for your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">New Password</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            placeholder="••••••••"
                            className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-therapy-500 backdrop-blur-xl transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Confirm New Password</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            required
                            placeholder="••••••••"
                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-therapy-500 backdrop-blur-xl transition-all"
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 disabled:opacity-50"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            Resetting...
                        </div>
                    ) : (
                        <span className="flex items-center justify-center">
                            Update Password
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </span>
                    )}
                </Button>
            </form>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#0A0A0F] via-[#1a1a2e] to-[#0A0A0F]">
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
                        <span className="text-3xl font-display font-bold text-white">Terapitika</span>
                    </Link>

                    <Suspense fallback={
                        <div className="relative backdrop-blur-2xl bg-white/10 rounded-3xl border border-white/20 p-8 shadow-2xl text-center py-12">
                            <Loader2 className="w-16 h-16 text-therapy-400 animate-spin mx-auto mb-6" />
                            <h1 className="text-3xl font-bold text-white mb-2">Loading...</h1>
                        </div>
                    }>
                        <ResetPasswordContent />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
