import { NextRequest } from "next/server";

import { PengeluaranOperasionalController } from "../index";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return PengeluaranOperasionalController.update(req, { params: resolvedParams });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return PengeluaranOperasionalController.delete({ params: resolvedParams });
}
