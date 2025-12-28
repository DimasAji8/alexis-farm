import { NextRequest } from "next/server";

import { ProduksiTelurController } from "../index";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return ProduksiTelurController.update(req, params);
}
