import { NextRequest } from "next/server";

import { apiError, apiResponse } from "@/app/api/shared/utils/api-response";

import { TransaksiKeuanganService } from "./transaksi.service";
import {
  createTransaksiKeuanganSchema,
  updateTransaksiKeuanganSchema,
} from "./transaksi.validation";

export class TransaksiKeuanganController {
  static async getAll(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const startDate = searchParams.get("startDate");
      const endDate = searchParams.get("endDate");
      const jenis = searchParams.get("jenis");
      const kategori = searchParams.get("kategori");
      const referensiType = searchParams.get("referensiType");

      const data = await TransaksiKeuanganService.getAll({
        startDate,
        endDate,
        jenis,
        kategori,
        referensiType,
      });
      return apiResponse(data, "Transaksi keuangan berhasil diambil");
    } catch (error) {
      return apiError(error);
    }
  }

  static async create(req: NextRequest) {
    try {
      const body = await req.json();
      const validated = createTransaksiKeuanganSchema.parse(body);
      const data = await TransaksiKeuanganService.create(validated);
      return apiResponse(data, "Transaksi keuangan berhasil dicatat", 201);
    } catch (error) {
      return apiError(error);
    }
  }

  static async update(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const id = params.id;
      if (!id) throw new Error("Parameter id wajib diisi");
      const body = await req.json();
      const validated = updateTransaksiKeuanganSchema.parse(body);
      const data = await TransaksiKeuanganService.update(id, validated);
      return apiResponse(data, "Transaksi keuangan berhasil diperbarui");
    } catch (error) {
      return apiError(error);
    }
  }

  static async delete(_req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const id = params.id;
      if (!id) throw new Error("Parameter id wajib diisi");
      const data = await TransaksiKeuanganService.delete(id);
      return apiResponse(data, "Transaksi keuangan berhasil dihapus");
    } catch (error) {
      return apiError(error);
    }
  }
}
