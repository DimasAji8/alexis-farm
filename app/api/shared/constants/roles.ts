export const USER_ROLES = ["admin", "manager", "staff"] as const;

export type UserRole = (typeof USER_ROLES)[number];
