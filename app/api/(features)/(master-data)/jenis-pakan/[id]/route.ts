import { NextRequest } from "next/server";

import { JenisPakanController } from "../index";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const resolvedParams = await params;
  return JenisPakanController.getById(req, { params: resolvedParams });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const resolvedParams = await params;
  return JenisPakanController.update(req, { params: resolvedParams });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const resolvedParams = await params;
  return JenisPakanController.delete(req, { params: resolvedParams });
}
