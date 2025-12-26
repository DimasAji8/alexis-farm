import { randomUUID } from "crypto";

import { prisma } from "@/app/api/db/prisma";

import { StockTelurService } from "../stock/stock.service";
import type { CreatePenjualanTelurInput } from "./penjualan.validation";

export class PenjualanTelurService {
  static async getAll() {
    return prisma.penjualanTelur.findMany({
      orderBy: { tanggal: "desc" },
    });
  }

  static async create(data: CreatePenjualanTelurInput) {
    const totalHarga = data.beratKg * data.hargaPerKg;
    const uangMasuk = data.uangMasuk ?? totalHarga;
    const uangKeluar = data.uangKeluar ?? 0;
    const nomorTransaksi = data.nomorTransaksi ?? `TRX-TELUR-${randomUUID()}`;

    return prisma.$transaction(async (tx) => {
      const saldoAwalRecord = await tx.penjualanTelur.findFirst({
        where: { tanggal: { lt: data.tanggal } },
        orderBy: { tanggal: "desc" },
      });
      const saldoAwal = saldoAwalRecord?.saldoAkhir ?? 0;
      const saldoAkhir = saldoAwal + uangMasuk - uangKeluar;

      const stock = await tx.stockTelur.findUnique({
        where: { tanggal: data.tanggal },
      });

      const currentKg = stock?.stockKg ?? 0;
      const currentButir = stock?.stockButir ?? 0;

      if (currentKg < data.beratKg) {
        throw new Error("Stok telur tidak cukup untuk penjualan ini");
      }

      const created = await tx.penjualanTelur.create({
        data: {
          tanggal: data.tanggal,
          pembeli: data.pembeli ?? "",
          jumlahButir: currentButir > 0 ? Math.min(currentButir, Math.round(data.beratKg * 16)) : 0, // perkiraan jika butir tersedia
          beratKg: data.beratKg,
          hargaPerKg: data.hargaPerKg,
          totalHarga,
          saldoAwal,
          uangMasuk,
          uangKeluar,
          saldoAkhir,
          metodeBayar: data.metodeBayar,
          keterangan: data.deskripsi,
          nomorTransaksi,
        },
      });

      // Kurangi stok
      await StockTelurService.adjustStock({
        tanggal: data.tanggal,
        deltaButir: -created.jumlahButir,
        deltaKg: -data.beratKg,
      });

      return created;
    });
  }
}
