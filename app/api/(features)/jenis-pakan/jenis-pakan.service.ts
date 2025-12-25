import { prisma } from "@/app/api/db/prisma";

import type { CreateJenisPakanInput, UpdateJenisPakanInput } from "./jenis-pakan.validation";

export class JenisPakanService {
  static async getAll() {
    return prisma.jenisPakan.findMany({
      orderBy: { kode: "asc" },
    });
  }

  static async getById(id: string) {
    if (!id) {
      throw new Error("ID jenis pakan tidak valid");
    }
    const jenisPakan = await prisma.jenisPakan.findUnique({ where: { id } });
    if (!jenisPakan) {
      throw new Error("Jenis pakan tidak ditemukan");
    }
    return jenisPakan;
  }

  static async getByKode(kode: string) {
    return prisma.jenisPakan.findUnique({ where: { kode } });
  }

  static async create(data: CreateJenisPakanInput) {
    const existing = await this.getByKode(data.kode);
    if (existing) {
      throw new Error("Kode pakan sudah digunakan");
    }

    return prisma.jenisPakan.create({ data });
  }

  static async update(id: string, data: UpdateJenisPakanInput) {
    await this.getById(id);

    if (data.kode) {
      const duplicate = await prisma.jenisPakan.findFirst({
        where: {
          kode: data.kode,
          NOT: { id },
        },
      });
      if (duplicate) {
        throw new Error("Kode pakan sudah digunakan");
      }
    }

    return prisma.jenisPakan.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    await this.getById(id);
    return prisma.jenisPakan.delete({ where: { id } });
  }
}
