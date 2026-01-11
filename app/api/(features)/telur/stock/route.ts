import { NextRequest } from "next/server";

import { StockTelurController } from "./stock.controller";

export async function GET(req: NextRequest) {
  return StockTelurController.getAll(req);
}
