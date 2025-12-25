import { NextRequest } from "next/server";

import { JenisPakanController } from "./index";

export const GET = () => JenisPakanController.getAll();
export const POST = (req: NextRequest) => JenisPakanController.create(req);
