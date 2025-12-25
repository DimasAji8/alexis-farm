import { NextRequest } from "next/server";

import { JenisPakanController } from "../index";

type Params = { params: { id: string } };

export const GET = (req: NextRequest, context: Params) =>
  JenisPakanController.getById(req, context);
export const PUT = (req: NextRequest, context: Params) =>
  JenisPakanController.update(req, context);
export const DELETE = (req: NextRequest, context: Params) =>
  JenisPakanController.delete(req, context);
