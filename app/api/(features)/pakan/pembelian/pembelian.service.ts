import { prisma } from "@/app/api/db/prisma";

import { requireRole } from "@/app/api/shared/utils/auth-guard";
import { NotFoundError, ValidationError } from "@/app/api/shared/utils/errors";
import type { CreatePembelianPakanInput, UpdatePembelianPakanInput } from "./pembelian.validation";

export class PembelianPakanService {
  static async getAll() {
    return prisma.pembelianPakan.findMany({
      orderBy: { tanggalBeli: "desc" },
      include: {
        jenisPakan: { select: { id: true, kode: true, nama: true, satuan: true } },
      },
    });
  }

  static async getById(id: string) {
    const pembelian = await prisma.pembelianPakan.findUnique({
      where: { id },
      include: { jenisPakan: { select: { id: true, kode: true, nama: true, satuan: true } } },
    });
    if (!pembelian) {
      throw new NotFoundError("Pembelian pakan tidak ditemukan");
    }
    return pembelian;
  }

  static async create(data: CreatePembelianPakanInput) {
    const userId = await requireRole(["super_user", "staff"]);
    const jenis = await prisma.jenisPakan.findUnique({ where: { id: data.jenisPakanId } });
    if (!jenis) {
      throw new NotFoundError("Jenis pakan tidak ditemukan");
    }

    const totalHarga = data.jumlahKg * data.hargaPerKg;

    return prisma.pembelianPakan.create({
      data: {
        jenisPakanId: data.jenisPakanId,
        tanggalBeli: data.tanggalBeli,
        jumlahKg: data.jumlahKg,
        hargaPerKg: data.hargaPerKg,
        totalHarga,
        sisaStokKg: data.jumlahKg,
        keterangan: data.keterangan,
        createdBy: userId,
      },
    });
  }

  static async update(id: string, data: UpdatePembelianPakanInput) {
    const userId = await requireRole(["super_user", "staff"]);
    const existing = await prisma.pembelianPakan.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError("Pembelian pakan tidak ditemukan");
    }

    const usedKg = existing.jumlahKg - existing.sisaStokKg;
    const newJumlahKg = data.jumlahKg ?? existing.jumlahKg;
    if (newJumlahKg < usedKg) {
      throw new ValidationError("Jumlah baru tidak boleh kurang dari total yang sudah terpakai");
    }

    const jenisPakanId = data.jenisPakanId ?? existing.jenisPakanId;
    const jenis = await prisma.jenisPakan.findUnique({ where: { id: jenisPakanId } });
    if (!jenis) {
      throw new NotFoundError("Jenis pakan tidak ditemukan");
    }

    const hargaPerKg = data.hargaPerKg ?? existing.hargaPerKg;
    const totalHarga = newJumlahKg * hargaPerKg;
    const sisaStokKg = newJumlahKg - usedKg;
    const tanggalBeli = data.tanggalBeli ?? existing.tanggalBeli;

    return prisma.pembelianPakan.update({
      where: { id },
      data: {
        jenisPakanId,
        tanggalBeli,
        jumlahKg: newJumlahKg,
        hargaPerKg,
        totalHarga,
        sisaStokKg,
        keterangan: data.keterangan ?? existing.keterangan,
        updatedBy: userId ?? undefined,
      },
    });
  }
}
