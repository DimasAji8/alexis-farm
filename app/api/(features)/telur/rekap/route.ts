import { NextRequest } from "next/server";
import { RekapTelurController } from "./rekap.controller";

export async function GET(req: NextRequest) {
  return RekapTelurController.getRekapHarian(req);
}
