import { NextRequest } from "next/server";

import { PemakaianPakanController } from "../index";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return PemakaianPakanController.getById(req, { params: resolvedParams });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return PemakaianPakanController.update(req, { params: resolvedParams });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return PemakaianPakanController.delete(req, { params: resolvedParams });
}
