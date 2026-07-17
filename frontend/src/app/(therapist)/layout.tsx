'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { UserRole } from '@/types';

export default function TherapistLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={[UserRole.THERAPIST, UserRole.ADMIN]}>
      {children}
    </AuthGuard>
  );
}
