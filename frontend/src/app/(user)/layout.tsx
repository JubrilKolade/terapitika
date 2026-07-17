'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { UserRole } from '@/types';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={[UserRole.CLIENT, UserRole.ADMIN]}>
      {children}
    </AuthGuard>
  );
}
