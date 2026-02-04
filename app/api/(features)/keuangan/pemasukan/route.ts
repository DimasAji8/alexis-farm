import { PemasukanController } from "./pemasukan.controller";

export async function GET() {
  return PemasukanController.getAll();
}

export async function POST(req: Request) {
  return PemasukanController.create(req);
}
