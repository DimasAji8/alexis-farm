import { NextRequest } from "next/server";

import { apiError, apiResponse } from "@/app/api/shared/utils/api-response";

import { ProduksiTelurService } from "./produksi.service";
import { createProduksiTelurSchema } from "./produksi.validation";

export class ProduksiTelurController {
  static async getAll(req: NextRequest) {
    try {
      const { searchParams } = req.nextUrl;
      const kandangId = searchParams.get("kandangId") || undefined;
      const bulan = searchParams.get("bulan") || undefined;
      
      if (!kandangId) {
        return apiResponse({ list: [], summary: null }, "Kandang ID wajib diisi");
      }
      
      const [list, summary] = await Promise.all([
        ProduksiTelurService.getAll(kandangId, bulan),
        ProduksiTelurService.getSummary(kandangId, bulan),
      ]);
      
      return apiResponse({ list, summary }, "Produksi telur berhasil diambil");
    } catch (error) {
      return apiError(error);
    }
  }

  static async create(req: NextRequest) {
    try {
      const body = await req.json();
      const validated = createProduksiTelurSchema.parse(body);
      const data = await ProduksiTelurService.create(validated);
      return apiResponse(data, "Produksi telur berhasil dicatat", 201);
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
      const validated = createProduksiTelurSchema.partial().parse(body);
      const data = await ProduksiTelurService.update(id, validated);
      return apiResponse(data, "Produksi telur berhasil diperbarui");
    } catch (error) {
      return apiError(error);
    }
  }
}
