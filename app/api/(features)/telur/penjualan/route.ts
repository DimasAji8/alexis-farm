import { NextRequest } from "next/server";

import { PenjualanTelurController } from "./index";

export async function GET() {
  return PenjualanTelurController.getAll();
}

export async function POST(req: NextRequest) {
  return PenjualanTelurController.create(req);
}
