import { NextRequest } from "next/server";

import { apiError, apiResponse } from "@/app/api/shared/utils/api-response";

import { PembelianPakanService } from "./pembelian.service";
import { createPembelianPakanSchema } from "./pembelian.validation";

export class PembelianPakanController {
  static async getAll(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const bulan = searchParams.get("bulan") || undefined;
      const jenisPakanId = searchParams.get("jenisPakanId") || undefined;
      
      const [data, summary] = await Promise.all([
        PembelianPakanService.getAll(bulan, jenisPakanId),
        PembelianPakanService.getSummary(bulan, jenisPakanId),
      ]);
      
      return apiResponse({ list: data, summary }, "Pembelian pakan berhasil diambil");
    } catch (error) {
      return apiError(error);
    }
  }

  static async create(req: NextRequest) {
    try {
      const body = await req.json();
      const validated = createPembelianPakanSchema.parse(body);
      const data = await PembelianPakanService.create(validated);
      return apiResponse(data, "Pembelian pakan berhasil dicatat", 201);
    } catch (error) {
      return apiError(error);
    }
  }

  static async update(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const id = params.id;
      if (!id) {
        throw new Error("Parameter id wajib diisi");
      }
      const body = await req.json();
      const validated = createPembelianPakanSchema.partial().parse(body);
      const data = await PembelianPakanService.update(id, validated);
      return apiResponse(data, "Pembelian pakan berhasil diperbarui");
    } catch (error) {
      return apiError(error);
    }
  }

  static async delete(_req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const id = params.id;
      if (!id) {
        throw new Error("Parameter id wajib diisi");
      }
      await PembelianPakanService.delete(id);
      return apiResponse(null, "Pembelian pakan berhasil dihapus");
    } catch (error) {
      return apiError(error);
    }
  }
}
