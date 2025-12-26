import { StockTelurController } from "./stock.controller";

export async function GET() {
  return StockTelurController.getAll();
}
