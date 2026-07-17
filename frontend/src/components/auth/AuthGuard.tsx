'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authstore';
import { UserRole } from '@/types';
import { getDashboardPath } from '@/lib/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  loginPath?: string;
}

export function AuthGuard({
  children,
  allowedRoles,
  loginPath = '/login',
}: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true));
    if (useAuthStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    if (!isAuthenticated || !user) {
      router.replace(loginPath);
      return;
    }

    if (allowedRoles?.length && !allowedRoles.includes(String(user.role).toLowerCase() as UserRole)) {
      router.replace(getDashboardPath(user.role));
    }
  }, [hydrated, isAuthenticated, user, allowedRoles, loginPath, router]);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-therapy-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  if (allowedRoles?.length && !allowedRoles.includes(String(user.role).toLowerCase() as UserRole)) return null;

  return <>{children}</>;
}
