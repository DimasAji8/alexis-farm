import { NextRequest } from "next/server";

import { PengeluaranOperasionalController } from "../index";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return PengeluaranOperasionalController.update(req, { params: resolvedParams });
}
