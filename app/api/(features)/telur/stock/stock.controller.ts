import { NextRequest } from "next/server";

import { apiError, apiResponse } from "@/app/api/shared/utils/api-response";

import { StockTelurService } from "./stock.service";

export class StockTelurController {
  static async getAll(req: NextRequest) {
    try {
      const kandangId = req.nextUrl.searchParams.get("kandangId") || undefined;
      const data = await StockTelurService.getAll(kandangId);
      return apiResponse(data, "Stok telur berhasil diambil");
    } catch (error) {
      return apiError(error);
    }
  }
}
