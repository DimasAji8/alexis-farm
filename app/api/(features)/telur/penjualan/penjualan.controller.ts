import { NextRequest } from "next/server";

import { apiError, apiResponse } from "@/app/api/shared/utils/api-response";

import { PenjualanTelurService } from "./penjualan.service";
import { createPenjualanTelurSchema } from "./penjualan.validation";

export class PenjualanTelurController {
  static async getAll(req: NextRequest) {
    try {
      const { searchParams } = req.nextUrl;
      const kandangId = searchParams.get("kandangId") || undefined;
      const bulan = searchParams.get("bulan") || undefined;
      
      if (!kandangId) {
        return apiResponse({ list: [], summary: null }, "Kandang ID wajib diisi");
      }
      
      const [list, summary] = await Promise.all([
        PenjualanTelurService.getAll(kandangId, bulan),
        PenjualanTelurService.getSummary(kandangId, bulan),
      ]);
      
      return apiResponse({ list, summary }, "Penjualan telur berhasil diambil");
    } catch (error) {
      return apiError(error);
    }
  }

  static async create(req: NextRequest) {
    try {
      const body = await req.json();
      const validated = createPenjualanTelurSchema.parse(body);
      const data = await PenjualanTelurService.create(validated);
      return apiResponse(data, "Penjualan telur berhasil dicatat", 201);
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
      const validated = createPenjualanTelurSchema.partial().parse(body);
      const data = await PenjualanTelurService.update(id, validated);
      return apiResponse(data, "Penjualan telur berhasil diperbarui");
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
      const data = await PenjualanTelurService.delete(id);
      return apiResponse(data, "Penjualan telur berhasil dihapus");
    } catch (error) {
      return apiError(error);
    }
  }
}
