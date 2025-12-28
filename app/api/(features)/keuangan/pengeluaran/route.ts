import { PengeluaranOperasionalController } from "./index";

export async function GET() {
  return PengeluaranOperasionalController.getAll();
}
