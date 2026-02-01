import { NextRequest } from "next/server";
import { LaporanKeuanganController } from "./index";

export async function GET(req: NextRequest) {
  return LaporanKeuanganController.getLaporan(req);
}
