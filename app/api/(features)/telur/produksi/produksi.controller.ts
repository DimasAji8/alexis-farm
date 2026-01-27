import { NextRequest } from "next/server";

import { apiError, apiResponse } from "@/app/api/shared/utils/api-response";

import { ProduksiTelurService } from "./produksi.service";
import { createProduksiTelurSchema } from "./produksi.validation";

export class ProduksiTelurController {
  static async getAll(req: NextRequest) {
    try {
      const { searchParams } = req.nextUrl;
      const type = searchParams.get("type");
      const kandangId = searchParams.get("kandangId") || undefined;
      
      if (type === "summary" && kandangId) {
        const bulan = searchParams.get("bulan") || undefined;
        const data = await ProduksiTelurService.getSummary(kandangId, bulan);
        return apiResponse(data, "Summary berhasil diambil");
      }
      
      const data = await ProduksiTelurService.getAll(kandangId);
      return apiResponse(data, "Produksi telur berhasil diambil");
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
