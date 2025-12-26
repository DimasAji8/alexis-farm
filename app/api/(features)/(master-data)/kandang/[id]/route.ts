import { NextRequest } from "next/server";

import { KandangController } from "../index";

type Params = { params: { id: string } };

export async function GET(req: NextRequest, { params }: Params) {
  return KandangController.getById(req, { params });
}

export async function PUT(req: NextRequest, { params }: Params) {
  return KandangController.update(req, { params });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  return KandangController.delete(req, { params });
}
