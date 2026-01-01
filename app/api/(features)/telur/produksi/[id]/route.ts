import { NextRequest } from "next/server";

import { ProduksiTelurController } from "../index";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return ProduksiTelurController.update(req, { params: resolvedParams });
}
