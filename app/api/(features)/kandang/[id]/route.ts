import { NextRequest } from "next/server";

import { KandangController } from "../index";

type Params = { params: { id: string } };

export const GET = (req: NextRequest, context: Params) =>
  KandangController.getById(req, context);
export const PUT = (req: NextRequest, context: Params) =>
  KandangController.update(req, context);
export const DELETE = (req: NextRequest, context: Params) =>
  KandangController.delete(req, context);
