export const ROLES = ['super_admin', 'admin', 'content_manager', 'ai_manager', 'student'] as const;
export type Role = (typeof ROLES)[number];

export const STAFF_ROLES = ['super_admin', 'admin', 'content_manager', 'ai_manager'] as const satisfies readonly Role[];

export const PERMISSIONS = [
  'exams:read',
  'exams:write',
  'questions:read',
  'questions:write',
  'questions:review',
  'knowledge:write',
  'ai:manage',
  'students:read',
  'users:manage',
  'audit:read',
  'practice:use',
] as const;
export type Permission = (typeof PERMISSIONS)[number];

export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  super_admin: PERMISSIONS,
  admin: PERMISSIONS,
  content_manager: ['exams:read', 'exams:write', 'questions:read', 'questions:write', 'questions:review', 'knowledge:write'],
  ai_manager: ['exams:read', 'questions:read', 'questions:review', 'knowledge:write', 'ai:manage', 'audit:read'],
  student: ['exams:read', 'practice:use'],
};

/** Roles that only a super admin may grant. */
export const PRIVILEGED_ROLES: readonly Role[] = ['super_admin', 'admin'];

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}
