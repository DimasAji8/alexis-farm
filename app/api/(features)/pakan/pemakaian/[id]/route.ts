import { NextRequest } from "next/server";

import { PemakaianPakanController } from "../index";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return PemakaianPakanController.update(req, { params: resolvedParams });
}
