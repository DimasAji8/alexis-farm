import { NextRequest } from "next/server";
import { apiError, apiResponse } from "@/app/api/shared/utils/api-response";
import { LaporanKeuanganService } from "./laporan.service";

export class LaporanKeuanganController {
  static async getLaporan(req: NextRequest) {
    try {
      const { searchParams } = req.nextUrl;
      const bulan = searchParams.get("bulan");
      const kandangId = searchParams.get("kandangId") || undefined;

      if (!bulan) {
        throw new Error("Parameter bulan wajib diisi (format: YYYY-MM)");
      }

      const data = await LaporanKeuanganService.getLaporan(bulan, kandangId);
      return apiResponse(data, "Laporan keuangan berhasil diambil");
    } catch (error) {
      return apiError(error);
    }
  }
}
