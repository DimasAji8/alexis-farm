import { NextRequest } from "next/server";

import { ProduksiTelurController } from "./index";

export async function GET() {
  return ProduksiTelurController.getAll();
}

export async function POST(req: NextRequest) {
  return ProduksiTelurController.create(req);
}
