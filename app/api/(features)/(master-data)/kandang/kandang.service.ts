import { prisma } from "@/app/api/db/prisma";

import { requireAuth, requireRole } from "@/app/api/shared/utils/auth-guard";
import { NotFoundError, ValidationError } from "@/app/api/shared/utils/errors";

import type { CreateKandangInput, UpdateKandangInput } from "./kandang.validation";

export class KandangService {
  static async getAll() {
    return prisma.kandang.findMany({
      orderBy: { kode: "asc" },
    });
  }

  static async getById(id: string) {
    const kandang = await prisma.kandang.findUnique({ where: { id } });
    if (!kandang) {
      throw new NotFoundError("Kandang tidak ditemukan");
    }
    return kandang;
  }

  static async getByKode(kode: string) {
    return prisma.kandang.findUnique({ where: { kode } });
  }

  static async create(data: CreateKandangInput) {
    await requireRole(["super_user", "staff"]);
    const existing = await this.getByKode(data.kode);
    if (existing) {
      throw new ValidationError("Kode kandang sudah digunakan");
    }

    return prisma.kandang.create({
      data: {
        ...data,
        jumlahAyam: 0,
      },
    });
  }

  static async update(id: string, data: UpdateKandangInput) {
    await requireRole(["super_user", "staff"]);
    await this.getById(id);

    if (data.kode) {
      const duplicate = await prisma.kandang.findFirst({
        where: {
          kode: data.kode,
          NOT: { id },
        },
      });
      if (duplicate) {
        throw new Error("Kode kandang sudah digunakan");
      }
    }

    return prisma.kandang.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    await requireRole(["super_user", "staff"]);
    await this.getById(id);
    return prisma.kandang.delete({ where: { id } });
  }
}
