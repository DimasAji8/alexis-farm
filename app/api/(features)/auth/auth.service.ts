import { prisma } from "@/app/api/db/prisma";
import { hashPassword, verifyPassword } from "@/app/api/shared/utils/password";

import type { AuthUser } from "./auth.types";
import type { LoginInput, RegisterInput } from "./auth.validation";

export class AuthService {
  static async findByUsername(username: string) {
    return prisma.user.findUnique({ where: { username } });
  }

  static toAuthUser(user: AuthUser): AuthUser {
    return {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
    };
  }

  static async verifyCredentials(credentials: LoginInput): Promise<AuthUser> {
    const username = credentials.username.trim().toLowerCase();
    const user = await this.findByUsername(username);

    if (!user) {
      throw new Error("User tidak ditemukan");
    }

    if (!user.isActive) {
      throw new Error("Akun tidak aktif, hubungi admin");
    }

    const isValid = await verifyPassword(credentials.password, user.password);

    if (!isValid) {
      throw new Error("Password salah");
    }

    return this.toAuthUser(user);
  }

  static async register(data: RegisterInput): Promise<AuthUser> {
    const username = data.username.trim().toLowerCase();
    const existing = await this.findByUsername(username);

    if (existing) {
      throw new Error("Username sudah digunakan");
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        username,
        name: data.name.trim(),
        password: hashedPassword,
        role: data.role,
        isActive: data.isActive,
      },
    });

    return this.toAuthUser(user);
  }
}
