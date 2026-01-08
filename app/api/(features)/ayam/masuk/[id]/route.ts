import { NextRequest } from "next/server";

import { AyamMasukController } from "../index";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return AyamMasukController.update(req, { params: resolvedParams });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return AyamMasukController.delete({ params: resolvedParams });
}
