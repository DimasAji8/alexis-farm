import { NextRequest } from "next/server";

import { apiError, apiResponse } from "@/app/api/shared/utils/api-response";

import { PenjualanTelurService } from "./penjualan.service";
import { createPenjualanTelurSchema } from "./penjualan.validation";

export class PenjualanTelurController {
  static async getAll() {
    try {
      const data = await PenjualanTelurService.getAll();
      return apiResponse(data, "Penjualan telur berhasil diambil");
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
}
