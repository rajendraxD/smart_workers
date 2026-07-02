// Central catalog of permissions and default role definitions.
export const PERMISSIONS = {
  USER_CREATE: 'user.create',
  USER_VIEW: 'user.view',
  USER_EDIT: 'user.edit',
  USER_DELETE: 'user.delete',
  ROLE_MANAGE: 'role.manage',
  AUDIT_VIEW: 'audit.view',
  DASHBOARD_VIEW: 'dashboard.view',
};

export const ALL_PERMISSIONS = Object.values(PERMISSIONS);

export const ROLES = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  USER: 'User',
};

export const DEFAULT_ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: ALL_PERMISSIONS,
  [ROLES.ADMIN]: [
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.USER_EDIT,
    PERMISSIONS.AUDIT_VIEW,
    PERMISSIONS.DASHBOARD_VIEW,
  ],
  [ROLES.USER]: [],
};

// System roles cannot be deleted or renamed.
export const SYSTEM_ROLES = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.USER];
