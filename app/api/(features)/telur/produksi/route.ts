import { NextRequest } from "next/server";

import { ProduksiTelurController } from "./index";

export async function GET(req: NextRequest) {
  return ProduksiTelurController.getAll(req);
}

export async function POST(req: NextRequest) {
  return ProduksiTelurController.create(req);
}
