import { NextRequest } from "next/server";

import { PenjualanTelurController } from "../index";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return PenjualanTelurController.update(req, params);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  return PenjualanTelurController.delete(req, params);
}
