import { z } from "zod";

import { USER_ROLES } from "@/app/api/shared/constants/roles";

export const createUserSchema = z.object({
  username: z
    .string()
    .min(3, "Username minimal 3 karakter")
    .max(50, "Username maksimal 50 karakter")
    .regex(/^[a-z0-9_.-]+$/, "Gunakan huruf kecil, angka, titik, garis bawah, atau minus")
    .toLowerCase(),
  name: z.string().min(3, "Nama minimal 3 karakter").max(100, "Nama maksimal 100 karakter"),
  role: z.enum(USER_ROLES).default("staff"),
  isActive: z.boolean().default(true),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Password lama wajib diisi"),
  newPassword: z.string().min(6, "Password baru minimal 6 karakter"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
