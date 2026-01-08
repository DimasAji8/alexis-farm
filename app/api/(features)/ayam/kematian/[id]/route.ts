import { NextRequest } from "next/server";

import { KematianAyamController } from "../index";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return KematianAyamController.update(req, { params: resolvedParams });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return KematianAyamController.delete({ params: resolvedParams });
}
