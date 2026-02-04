import { NextRequest } from "next/server";
import { PemasukanController } from "../pemasukan.controller";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const resolvedParams = await params;
  return PemasukanController.update(req, { params: resolvedParams });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const resolvedParams = await params;
  return PemasukanController.delete(req, { params: resolvedParams });
}
