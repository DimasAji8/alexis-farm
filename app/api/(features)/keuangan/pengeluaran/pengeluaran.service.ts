import { prisma } from "@/app/api/db/prisma";

import { requireRole } from "@/app/api/shared/utils/auth-guard";

import type {
  CreatePengeluaranOperasionalInput,
  UpdatePengeluaranOperasionalInput,
} from "./pengeluaran.validation";

export class PengeluaranOperasionalService {
  static async getAll() {
    return prisma.pengeluaranOperasional.findMany({
      orderBy: { tanggal: "asc" },
    });
  }

  static async create(data: CreatePengeluaranOperasionalInput) {
    await requireRole(["super_user", "staff"]);
    return prisma.pengeluaranOperasional.create({
      data: {
        tanggal: data.tanggal,
        kategori: data.kategori,
        jumlah: data.jumlah,
        keterangan: data.keterangan,
        bukti: data.bukti,
      },
    });
  }

  static async update(id: string, data: UpdatePengeluaranOperasionalInput) {
    await requireRole(["super_user", "staff"]);
    const existing = await prisma.pengeluaranOperasional.findUnique({ where: { id } });
    if (!existing) {
      throw new Error("Pengeluaran tidak ditemukan");
    }

    return prisma.pengeluaranOperasional.update({
      where: { id },
      data: {
        tanggal: data.tanggal ?? existing.tanggal,
        kategori: data.kategori ?? existing.kategori,
        jumlah: data.jumlah ?? existing.jumlah,
        keterangan: data.keterangan ?? existing.keterangan,
        bukti: data.bukti ?? existing.bukti,
      },
    });
  }
}
