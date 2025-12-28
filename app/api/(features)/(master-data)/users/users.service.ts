import { prisma } from "@/app/api/db/prisma";
import { requireRole } from "@/app/api/shared/utils/auth-guard";
import { NotFoundError, ValidationError } from "@/app/api/shared/utils/errors";
import { hashPassword } from "@/app/api/shared/utils/password";

import type { CreateUserInput } from "./users.validation";

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

    const hashedPassword = await hashPassword(data.password);

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
