import { NextRequest } from "next/server";
import { apiError, apiResponse } from "@/app/api/shared/utils/api-response";
import { PakanDashboardService } from "./dashboard.service";

export class PakanDashboardController {
  static async getDashboard(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const bulan = searchParams.get("bulan");
      const kandangId = searchParams.get("kandangId");

      if (!bulan) {
        throw new Error("Parameter bulan wajib diisi (format: YYYY-MM)");
      }

      const data = await PakanDashboardService.getDashboard(bulan, kandangId || undefined);
      return apiResponse(data, "Dashboard pakan berhasil diambil");
    } catch (error) {
      return apiError(error);
    }
  }
}
