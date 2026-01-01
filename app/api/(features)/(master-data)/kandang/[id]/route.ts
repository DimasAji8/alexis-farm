import { NextRequest } from "next/server";

import { KandangController } from "../index";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const resolvedParams = await params;
  return KandangController.getById(req, { params: resolvedParams });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const resolvedParams = await params;
  return KandangController.update(req, { params: resolvedParams });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const resolvedParams = await params;
  return KandangController.delete(req, { params: resolvedParams });
}
