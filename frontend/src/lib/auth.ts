import { User, UserRole } from '@/types';

/** Map API user (snake_case) to frontend User (camelCase). */
export function normalizeUser(raw: Record<string, unknown> | null | undefined): User | null {
  if (!raw || typeof raw !== 'object' || !raw.id) return null;

  return {
    id: String(raw.id),
    email: String(raw.email ?? ''),
    firstName: String(raw.firstName ?? raw.first_name ?? ''),
    lastName: String(raw.lastName ?? raw.last_name ?? ''),
    role: String(raw.role ?? UserRole.CLIENT).toLowerCase() as UserRole,
    avatar: (raw.avatar ?? raw.profile_picture_url) as string | undefined,
    phone: (raw.phone as string | null) ?? undefined,
    dateOfBirth: (raw.dateOfBirth ?? raw.date_of_birth) as string | undefined,
    gender: raw.gender as User['gender'],
    timezone: (raw.timezone ?? (raw.preferences as Record<string, unknown>)?.timezone) as string | undefined,
    emailVerified: Boolean(raw.emailVerified ?? raw.is_verified ?? false),
    phoneVerified: Boolean(raw.phoneVerified ?? false),
    twoFactorEnabled: Boolean(raw.twoFactorEnabled ?? false),
    createdAt: String(raw.createdAt ?? raw.created_at ?? ''),
    updatedAt: String(raw.updatedAt ?? raw.updated_at ?? ''),
  };
}

export function getDashboardPath(role?: string): string {
  switch (role?.toLowerCase()) {
    case UserRole.ADMIN:
      return '/admin/dashboard';
    case UserRole.THERAPIST:
      return '/therapist/dashboard';
    case UserRole.CLIENT:
    default:
      return '/dashboard';
  }
}

export function hasRole(userRole: string | undefined, ...allowed: UserRole[]): boolean {
  if (!userRole) return false;
  return allowed.includes(userRole.toLowerCase() as UserRole);
}
