import { prisma } from "@/app/api/db/prisma";
import { requireRole, getCurrentUser } from "@/app/api/shared/utils/auth-guard";
import { NotFoundError, ValidationError } from "@/app/api/shared/utils/errors";
import { hashPassword, verifyPassword } from "@/app/api/shared/utils/password";

import type { CreateUserInput, ChangePasswordInput } from "./users.validation";

const DEFAULT_PASSWORD = "alex1s";

export class UsersService {
  static async getAll() {
    return prisma.user.findMany({
      orderBy: { username: "asc" },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  static async create(data: CreateUserInput) {
    await requireRole(["super_user"]);
    const existing = await prisma.user.findUnique({ where: { username: data.username } });
    if (existing) {
      throw new ValidationError("Username sudah digunakan");
    }

    const hashedPassword = await hashPassword(DEFAULT_PASSWORD);

    return prisma.user.create({
      data: {
        username: data.username,
        name: data.name,
        password: hashedPassword,
        role: data.role,
        isActive: data.isActive,
      },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  static async changePassword(data: ChangePasswordInput) {
    const currentUser = await getCurrentUser();
    const user = await prisma.user.findUnique({ where: { id: currentUser.id } });
    if (!user) {
      throw new NotFoundError("User tidak ditemukan");
    }

    const isValid = await verifyPassword(data.oldPassword, user.password);
    if (!isValid) {
      throw new ValidationError("Password lama tidak sesuai");
    }

    const hashedPassword = await hashPassword(data.newPassword);
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { password: hashedPassword },
    });

    return { message: "Password berhasil diubah" };
  }

  static async delete(id: string) {
    await requireRole(["super_user"]);
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError("User tidak ditemukan");
    }
    return prisma.user.delete({
      where: { id },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
