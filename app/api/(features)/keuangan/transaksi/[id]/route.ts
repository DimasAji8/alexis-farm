import { NextRequest } from "next/server";

import { TransaksiKeuanganController } from "../index";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return TransaksiKeuanganController.update(req, params);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  return TransaksiKeuanganController.delete(req, params);
}
