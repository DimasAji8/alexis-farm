import { NextRequest } from "next/server";

import { PenjualanTelurController } from "./index";

export async function GET(req: NextRequest) {
  return PenjualanTelurController.getAll(req);
}

export async function POST(req: NextRequest) {
  return PenjualanTelurController.create(req);
}
