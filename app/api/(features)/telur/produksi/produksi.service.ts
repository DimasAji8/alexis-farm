import { prisma } from "@/app/api/db/prisma";

import { StockTelurService } from "../stock/stock.service";
import type { CreateProduksiTelurInput } from "./produksi.validation";

export class ProduksiTelurService {
  static async getAll() {
    return prisma.produksiTelur.findMany({
      orderBy: [{ tanggal: "desc" }, { kandangId: "asc" }],
      include: {
        kandang: { select: { id: true, kode: true, nama: true, jumlahAyam: true } },
      },
    });
  }

  static async create(data: CreateProduksiTelurInput) {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.produksiTelur.findFirst({
        where: {
          kandangId: data.kandangId,
          tanggal: data.tanggal,
        },
      });

      if (existing) {
        throw new Error("Produksi telur untuk tanggal ini sudah ada");
      }

      const kandang = await tx.kandang.findUnique({ where: { id: data.kandangId } });
      if (!kandang) {
        throw new Error("Kandang tidak ditemukan");
      }

      const totalButir = data.jumlahBagusButir + data.jumlahTidakBagusButir;
      const totalKg = data.beratBagusKg + data.beratTidakBagusKg;

      const created = await tx.produksiTelur.create({
        data: {
          kandangId: data.kandangId,
          tanggal: data.tanggal,
          jumlahBagusButir: data.jumlahBagusButir,
          jumlahTidakBagusButir: data.jumlahTidakBagusButir,
          totalButir,
          totalKg,
          keterangan: data.keterangan,
        },
        include: {
          kandang: {
            select: { id: true, kode: true, nama: true, jumlahAyam: true },
          },
        },
      });

      // Update stok telur global
      await StockTelurService.adjustStock({
        tanggal: data.tanggal,
        deltaButir: totalButir,
        deltaKg: totalKg,
      });

      return created;
    });
  }
}
