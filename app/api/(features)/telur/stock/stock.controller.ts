import { apiError, apiResponse } from "@/app/api/shared/utils/api-response";

import { StockTelurService } from "./stock.service";

export class StockTelurController {
  static async getAll() {
    try {
      const data = await StockTelurService.getAll();
      return apiResponse(data, "Stok telur berhasil diambil");
    } catch (error) {
      return apiError(error);
    }
  }
}
