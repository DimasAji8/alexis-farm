import { NextRequest } from "next/server";
import { PakanDashboardController } from "./index";

export async function GET(req: NextRequest) {
  return PakanDashboardController.getDashboard(req);
}
