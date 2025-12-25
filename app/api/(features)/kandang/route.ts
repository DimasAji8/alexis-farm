import { NextRequest } from "next/server";

import { KandangController } from "./index";

export const GET = () => KandangController.getAll();
export const POST = (req: NextRequest) => KandangController.create(req);
