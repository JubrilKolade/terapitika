'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { UserRole } from '@/types';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard allowedRoles={[UserRole.ADMIN]}>
            <DashboardLayout type="admin">
                {children}
            </DashboardLayout>
        </AuthGuard>
    );
}
