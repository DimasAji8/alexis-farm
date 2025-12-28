import { NextRequest } from "next/server";

import { apiError, apiResponse } from "@/app/api/shared/utils/api-response";

import { PengeluaranOperasionalService } from "./pengeluaran.service";
import {
  createPengeluaranOperasionalSchema,
  updatePengeluaranOperasionalSchema,
} from "./pengeluaran.validation";

export class PengeluaranOperasionalController {
  static async getAll() {
    try {
      const data = await PengeluaranOperasionalService.getAll();
      return apiResponse(data, "Pengeluaran operasional berhasil diambil");
    } catch (error) {
      return apiError(error);
    }
  }

  static async create(req: NextRequest) {
    try {
      const body = await req.json();
      const validated = createPengeluaranOperasionalSchema.parse(body);
      const data = await PengeluaranOperasionalService.create(validated);
      return apiResponse(data, "Pengeluaran operasional berhasil dicatat", 201);
    } catch (error) {
      return apiError(error);
    }
  }

  static async update(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const id = params.id;
      if (!id) {
        throw new Error("Parameter id wajib diisi");
      }
      const body = await req.json();
      const validated = updatePengeluaranOperasionalSchema.parse(body);
      const data = await PengeluaranOperasionalService.update(id, validated);
      return apiResponse(data, "Pengeluaran operasional berhasil diperbarui");
    } catch (error) {
      return apiError(error);
    }
  }
}
