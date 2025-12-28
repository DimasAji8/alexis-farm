import { randomUUID } from "crypto";

import { prisma } from "@/app/api/db/prisma";

import { requireRole } from "@/app/api/shared/utils/auth-guard";
import { NotFoundError, ValidationError } from "@/app/api/shared/utils/errors";
import { StockTelurService } from "../stock/stock.service";
import type { CreatePenjualanTelurInput, UpdatePenjualanTelurInput } from "./penjualan.validation";

export class PenjualanTelurService {
  static async getAll() {
    return prisma.penjualanTelur.findMany({
      orderBy: { tanggal: "desc" },
    });
  }

  private static async syncKeuangan(
    tx: Parameters<typeof prisma.$transaction>[0] extends (arg: infer T) => any ? T : never,
    penjualanId: string,
    payload: { tanggal: Date; jumlah: number; pembeli?: string | null; nomorTransaksi?: string | null; keterangan?: string | null }
  ) {
    const existingTx = await tx.transaksiKeuangan.findFirst({
      where: { referensiId: penjualanId, referensiType: "penjualan_telur" },
    });

    const keterangan =
      payload.keterangan ||
      ["Penjualan telur", payload.nomorTransaksi, payload.pembeli].filter(Boolean).join(" - ") ||
      "Penjualan telur";

    const baseData = {
      tanggal: payload.tanggal,
      jenis: "pemasukan",
      kategori: "penjualan_telur",
      jumlah: payload.jumlah,
      keterangan,
      referensiId: penjualanId,
      referensiType: "penjualan_telur",
    } as const;

    if (existingTx) {
      return tx.transaksiKeuangan.update({ where: { id: existingTx.id }, data: baseData });
    }

    return tx.transaksiKeuangan.create({ data: baseData });
  }

  private static async deleteKeuangan(tx: Parameters<typeof prisma.$transaction>[0] extends (arg: infer T) => any ? T : never, penjualanId: string) {
    const existingTx = await tx.transaksiKeuangan.findFirst({
      where: { referensiId: penjualanId, referensiType: "penjualan_telur" },
    });

    if (existingTx) {
      await tx.transaksiKeuangan.delete({ where: { id: existingTx.id } });
    }
  }

  static async create(data: CreatePenjualanTelurInput) {
    const userId = await requireRole(["super_user", "staff"]);
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
        throw new ValidationError("Stok telur tidak cukup untuk penjualan ini");
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
          createdBy: userId,
        },
      });

      // Kurangi stok
      await StockTelurService.adjustStock({
        tanggal: data.tanggal,
        deltaButir: -created.jumlahButir,
        deltaKg: -data.beratKg,
      });

      await PenjualanTelurService.syncKeuangan(tx, created.id, {
        tanggal: data.tanggal,
        jumlah: uangMasuk,
        pembeli: data.pembeli,
        nomorTransaksi,
        keterangan: data.deskripsi,
      });

      return created;
    });
  }

  static async update(id: string, data: UpdatePenjualanTelurInput) {
    const userId = await requireRole(["super_user", "staff"]);
    return prisma.$transaction(async (tx) => {
      const existing = await tx.penjualanTelur.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundError("Penjualan telur tidak ditemukan");
      }

      const tanggal = data.tanggal ?? existing.tanggal;
      const beratKg = data.beratKg ?? existing.beratKg;
      const hargaPerKg = data.hargaPerKg ?? existing.hargaPerKg;
      const totalHarga = beratKg * hargaPerKg;
      const uangMasuk = data.uangMasuk ?? totalHarga;
      const uangKeluar = data.uangKeluar ?? existing.uangKeluar ?? 0;
      const nomorTransaksi = data.nomorTransaksi ?? existing.nomorTransaksi ?? `TRX-TELUR-${randomUUID()}`;

      const saldoAwalRecord = await tx.penjualanTelur.findFirst({
        where: { tanggal: { lt: tanggal }, NOT: { id } },
        orderBy: { tanggal: "desc" },
      });
      const saldoAwal = saldoAwalRecord?.saldoAkhir ?? 0;
      const saldoAkhir = saldoAwal + uangMasuk - uangKeluar;

      // kembalikan stok lama
      await StockTelurService.adjustStock({
        tanggal: existing.tanggal,
        deltaButir: existing.jumlahButir * -1,
        deltaKg: existing.beratKg * -1,
      });

      const stockNew = await tx.stockTelur.findFirst({ where: { tanggal } });
      const currentKg = stockNew?.stockKg ?? 0;
      if (currentKg < beratKg) {
        throw new ValidationError("Stok telur tidak cukup untuk penjualan ini");
      }

      const stockButir = stockNew?.stockButir ?? 0;
      const jumlahButir =
        stockButir > 0 ? Math.min(stockButir, Math.round(beratKg * 16)) : existing.jumlahButir;

      await StockTelurService.adjustStock({
        tanggal,
        deltaButir: -jumlahButir,
        deltaKg: -beratKg,
      });

      const updated = await tx.penjualanTelur.update({
        where: { id },
        data: {
          tanggal,
          pembeli: data.pembeli ?? existing.pembeli,
          jumlahButir,
          beratKg,
          hargaPerKg,
          totalHarga,
          saldoAwal,
          uangMasuk,
          uangKeluar,
          saldoAkhir,
          metodeBayar: data.metodeBayar ?? existing.metodeBayar,
          keterangan: data.deskripsi ?? existing.keterangan,
          nomorTransaksi,
          updatedBy: userId,
        },
      });

      await PenjualanTelurService.syncKeuangan(tx, id, {
        tanggal,
        jumlah: uangMasuk,
        pembeli: data.pembeli ?? existing.pembeli,
        nomorTransaksi,
        keterangan: data.deskripsi ?? existing.keterangan,
      });

      return updated;
    });
  }

  static async delete(id: string) {
    await requireRole(["super_user", "staff"]);
    return prisma.$transaction(async (tx) => {
      const existing = await tx.penjualanTelur.findUnique({ where: { id } });
      if (!existing) {
        throw new Error("Penjualan telur tidak ditemukan");
      }

      await StockTelurService.adjustStock({
        tanggal: existing.tanggal,
        deltaButir: existing.jumlahButir,
        deltaKg: existing.beratKg,
      });

      await PenjualanTelurService.deleteKeuangan(tx, id);

      return tx.penjualanTelur.delete({ where: { id } });
    });
  }
}
