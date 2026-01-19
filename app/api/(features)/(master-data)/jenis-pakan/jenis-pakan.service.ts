import { prisma } from "@/app/api/db/prisma";
import { requireRole } from "@/app/api/shared/utils/auth-guard";
import { NotFoundError, ValidationError } from "@/app/api/shared/utils/errors";
import type { CreateJenisPakanInput, UpdateJenisPakanInput } from "./jenis-pakan.validation";

export class JenisPakanService {
  static async getAll() {
    return prisma.jenisPakan.findMany({
      where: { isActive: true },
      orderBy: { nama: "asc" },
    });
  }

  static async getById(id: string) {
    const jenisPakan = await prisma.jenisPakan.findUnique({ where: { id } });
    if (!jenisPakan) {
      throw new NotFoundError("Jenis pakan tidak ditemukan");
    }
    return jenisPakan;
  }

  static async create(data: CreateJenisPakanInput) {
    const userId = await requireRole(["super_user", "staff"]);
    
    const existing = await prisma.jenisPakan.findUnique({ where: { kode: data.kode } });
    if (existing) {
      throw new ValidationError("Kode pakan sudah digunakan");
    }

    return prisma.jenisPakan.create({
      data: {
        ...data,
        createdBy: userId,
      },
    });
  }

  static async update(id: string, data: UpdateJenisPakanInput) {
    const userId = await requireRole(["super_user", "staff"]);
    
    const existing = await prisma.jenisPakan.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError("Jenis pakan tidak ditemukan");
    }

    if (data.kode && data.kode !== existing.kode) {
      const duplicate = await prisma.jenisPakan.findUnique({ where: { kode: data.kode } });
      if (duplicate) {
        throw new ValidationError("Kode pakan sudah digunakan");
      }
    }

    return prisma.jenisPakan.update({
      where: { id },
      data: {
        ...data,
        updatedBy: userId,
      },
    });
  }

  static async delete(id: string) {
    await requireRole(["super_user"]);
    
    const existing = await prisma.jenisPakan.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError("Jenis pakan tidak ditemukan");
    }

    return prisma.jenisPakan.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
