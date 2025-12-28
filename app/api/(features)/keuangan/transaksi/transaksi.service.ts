import { prisma } from "@/app/api/db/prisma";

import { requireRole } from "@/app/api/shared/utils/auth-guard";

import type {
  CreateTransaksiKeuanganInput,
  UpdateTransaksiKeuanganInput,
} from "./transaksi.validation";

export class TransaksiKeuanganService {
  static async getAll(params: {
    startDate?: string | null;
    endDate?: string | null;
    jenis?: string | null;
    kategori?: string | null;
    referensiType?: string | null;
  }) {
    const where: any = {};

    if (params.startDate || params.endDate) {
      where.tanggal = {};
      if (params.startDate) {
        where.tanggal.gte = new Date(params.startDate);
      }
      if (params.endDate) {
        where.tanggal.lte = new Date(params.endDate);
      }
    }

    if (params.jenis) {
      where.jenis = params.jenis;
    }
    if (params.kategori) {
      where.kategori = params.kategori;
    }
    if (params.referensiType) {
      where.referensiType = params.referensiType;
    }

    return prisma.transaksiKeuangan.findMany({
      where,
      orderBy: { tanggal: "desc" },
    });
  }

  static async create(data: CreateTransaksiKeuanganInput) {
    await requireRole(["super_user", "staff"]);
    return prisma.transaksiKeuangan.create({
      data: {
        tanggal: data.tanggal,
        jenis: data.jenis,
        kategori: data.kategori,
        jumlah: data.jumlah,
        keterangan: data.keterangan,
        referensiId: data.referensiId,
        referensiType: data.referensiType,
      },
    });
  }

  static async update(id: string, data: UpdateTransaksiKeuanganInput) {
    await requireRole(["super_user", "staff"]);
    const existing = await prisma.transaksiKeuangan.findUnique({ where: { id } });
    if (!existing) {
      throw new Error("Transaksi keuangan tidak ditemukan");
    }

    return prisma.transaksiKeuangan.update({
      where: { id },
      data: {
        tanggal: data.tanggal ?? existing.tanggal,
        jenis: data.jenis ?? existing.jenis,
        kategori: data.kategori ?? existing.kategori,
        jumlah: data.jumlah ?? existing.jumlah,
        keterangan: data.keterangan ?? existing.keterangan,
        referensiId: data.referensiId ?? existing.referensiId,
        referensiType: data.referensiType ?? existing.referensiType,
      },
    });
  }

  static async delete(id: string) {
    await requireRole(["super_user", "staff"]);
    const existing = await prisma.transaksiKeuangan.findUnique({ where: { id } });
    if (!existing) {
      throw new Error("Transaksi keuangan tidak ditemukan");
    }
    return prisma.transaksiKeuangan.delete({ where: { id } });
  }
}
