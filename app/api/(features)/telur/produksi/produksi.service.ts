import { prisma } from "@/app/api/db/prisma";

import { requireRole } from "@/app/api/shared/utils/auth-guard";
import { NotFoundError, ValidationError } from "@/app/api/shared/utils/errors";
import { StockTelurService } from "../stock/stock.service";
import type { CreateProduksiTelurInput, UpdateProduksiTelurInput } from "./produksi.validation";

export class ProduksiTelurService {
  static async getAll(kandangId?: string) {
    return prisma.produksiTelur.findMany({
      where: kandangId ? { kandangId } : undefined,
      orderBy: [{ tanggal: "asc" }, { kandangId: "asc" }],
      include: {
        kandang: { select: { id: true, kode: true, nama: true, jumlahAyam: true } },
      },
    });
  }

  static async create(data: CreateProduksiTelurInput) {
    const userId = await requireRole(["super_user", "manager", "staff"]);
    return prisma.$transaction(async (tx) => {
      const existing = await tx.produksiTelur.findFirst({
        where: {
          kandangId: data.kandangId,
          tanggal: data.tanggal,
        },
      });

      if (existing) {
        throw new ValidationError("Produksi telur untuk tanggal ini sudah ada");
      }

      const kandang = await tx.kandang.findUnique({ where: { id: data.kandangId } });
      if (!kandang) {
        throw new NotFoundError("Kandang tidak ditemukan");
      }

      const totalButir = data.jumlahBagusButir + data.jumlahTidakBagusButir;
      const totalKg = data.totalKg;

      const created = await tx.produksiTelur.create({
        data: {
          kandangId: data.kandangId,
          tanggal: data.tanggal,
          jumlahBagusButir: data.jumlahBagusButir,
          jumlahTidakBagusButir: data.jumlahTidakBagusButir,
          totalButir,
          totalKg,
          keterangan: data.keterangan,
          createdBy: userId,
        },
        include: {
          kandang: {
            select: { id: true, kode: true, nama: true, jumlahAyam: true },
          },
        },
      });

      // Update stok telur per kandang
      await StockTelurService.adjustStock({
        kandangId: data.kandangId,
        tanggal: data.tanggal,
        deltaButir: totalButir,
        deltaKg: totalKg,
      });

      return created;
    });
  }

  static async update(id: string, data: UpdateProduksiTelurInput) {
    const userId = await requireRole(["super_user", "manager", "staff"]);
    return prisma.$transaction(async (tx) => {
      const existing = await tx.produksiTelur.findUnique({ where: { id } });
      if (!existing) {
        throw new Error("Produksi telur tidak ditemukan");
      }

      const targetTanggal = data.tanggal ?? existing.tanggal;
      const targetKandangId = data.kandangId ?? existing.kandangId;

      if (
        targetKandangId !== existing.kandangId ||
        targetTanggal.getTime() !== existing.tanggal.getTime()
      ) {
        const dup = await tx.produksiTelur.findFirst({
          where: { kandangId: targetKandangId, tanggal: targetTanggal, NOT: { id } },
        });
        if (dup) {
          throw new ValidationError("Produksi telur untuk tanggal ini sudah ada");
        }
      }

      const kandang = await tx.kandang.findUnique({ where: { id: targetKandangId } });
      if (!kandang) {
        throw new NotFoundError("Kandang tidak ditemukan");
      }

      const newJumlahBagus = data.jumlahBagusButir ?? existing.jumlahBagusButir;
      const newJumlahTidakBagus = data.jumlahTidakBagusButir ?? existing.jumlahTidakBagusButir;
      const newTotalButir = newJumlahBagus + newJumlahTidakBagus;
      const newTotalKg = data.totalKg ?? existing.totalKg;

      // revert stok lama
      await StockTelurService.adjustStock({
        kandangId: existing.kandangId,
        tanggal: existing.tanggal,
        deltaButir: -existing.totalButir,
        deltaKg: -existing.totalKg,
      });

      // apply stok baru
      await StockTelurService.adjustStock({
        kandangId: targetKandangId,
        tanggal: targetTanggal,
        deltaButir: newTotalButir,
        deltaKg: newTotalKg,
      });

      const updated = await tx.produksiTelur.update({
        where: { id },
        data: {
          kandangId: targetKandangId,
          tanggal: targetTanggal,
          jumlahBagusButir: newJumlahBagus,
          jumlahTidakBagusButir: newJumlahTidakBagus,
          totalButir: newTotalButir,
          totalKg: newTotalKg,
          keterangan: data.keterangan ?? existing.keterangan,
          updatedBy: userId,
        },
        include: {
          kandang: {
            select: { id: true, kode: true, nama: true, jumlahAyam: true },
          },
        },
      });

      return updated;
    });
  }
}
