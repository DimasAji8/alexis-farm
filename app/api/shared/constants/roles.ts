export const USER_ROLES = ["super_user", "manager", "staff"] as const;

export type UserRole = (typeof USER_ROLES)[number];
