import { prisma } from "@/app/api/db/prisma";
import { requireRole } from "@/app/api/shared/utils/auth-guard";
import type { CreatePemasukanInput, UpdatePemasukanInput } from "./pemasukan.validation";

export class PemasukanService {
  static async getAll() {
    return prisma.pemasukan.findMany({
      orderBy: { tanggal: "desc" },
    });
  }

  static async create(data: CreatePemasukanInput) {
    await requireRole(["super_user", "staff"]);
    return prisma.pemasukan.create({
      data: {
        tanggal: data.tanggal,
        kategori: data.kategori,
        jumlah: data.jumlah,
        keterangan: data.keterangan,
      },
    });
  }

  static async update(id: string, data: UpdatePemasukanInput) {
    await requireRole(["super_user", "staff"]);
    const existing = await prisma.pemasukan.findUnique({ where: { id } });
    if (!existing) {
      throw new Error("Pemasukan tidak ditemukan");
    }

    return prisma.pemasukan.update({
      where: { id },
      data: {
        tanggal: data.tanggal ?? existing.tanggal,
        kategori: data.kategori ?? existing.kategori,
        jumlah: data.jumlah ?? existing.jumlah,
        keterangan: data.keterangan ?? existing.keterangan,
      },
    });
  }

  static async delete(id: string) {
    await requireRole(["super_user", "staff"]);
    const existing = await prisma.pemasukan.findUnique({ where: { id } });
    if (!existing) {
      throw new Error("Pemasukan tidak ditemukan");
    }

    return prisma.pemasukan.delete({ where: { id } });
  }
}
