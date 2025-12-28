import { NextRequest } from "next/server";

import { RekapPakanController } from "./rekap.controller";

export async function GET(req: NextRequest) {
  return RekapPakanController.get(req);
}
