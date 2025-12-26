import { NextRequest } from "next/server";

import { JenisPakanController } from "../index";

type Params = { params: { id: string } };

export async function GET(req: NextRequest, { params }: Params) {
  return JenisPakanController.getById(req, { params });
}

export async function PUT(req: NextRequest, { params }: Params) {
  return JenisPakanController.update(req, { params });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  return JenisPakanController.delete(req, { params });
}
