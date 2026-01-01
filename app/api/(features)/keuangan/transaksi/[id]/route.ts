import { NextRequest } from "next/server";

import { TransaksiKeuanganController } from "../index";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return TransaksiKeuanganController.update(req, { params: resolvedParams });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return TransaksiKeuanganController.delete(req, { params: resolvedParams });
}
