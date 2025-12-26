import { NextRequest } from "next/server";

import { apiError, apiResponse } from "@/app/api/shared/utils/api-response";

import { ProduksiTelurService } from "./produksi.service";
import { createProduksiTelurSchema } from "./produksi.validation";

export class ProduksiTelurController {
  static async getAll() {
    try {
      const data = await ProduksiTelurService.getAll();
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
}
