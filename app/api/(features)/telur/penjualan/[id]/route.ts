import { NextRequest } from "next/server";

import { PenjualanTelurController } from "../index";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return PenjualanTelurController.update(req, { params: resolvedParams });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return PenjualanTelurController.delete(req, { params: resolvedParams });
}
