import { NextRequest } from "next/server";

import { PembelianPakanController } from "../index";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return PembelianPakanController.update(req, { params: resolvedParams });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return PembelianPakanController.delete(req, { params: resolvedParams });
}
