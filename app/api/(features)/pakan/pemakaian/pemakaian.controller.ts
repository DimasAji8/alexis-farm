import { NextRequest } from "next/server";

import { apiError, apiResponse } from "@/app/api/shared/utils/api-response";

import { PemakaianPakanService } from "./pemakaian.service";
import { createPemakaianPakanSchema } from "./pemakaian.validation";

export class PemakaianPakanController {
  static async getAll() {
    try {
      const data = await PemakaianPakanService.getAll();
      return apiResponse(data, "Pemakaian pakan berhasil diambil");
    } catch (error) {
      return apiError(error);
    }
  }

  static async getDailySummary(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const kandangId = searchParams.get("kandangId");
      const tanggal = searchParams.get("tanggal");

      if (!kandangId || !tanggal) {
        throw new Error("kandangId dan tanggal wajib diisi");
      }

      const data = await PemakaianPakanService.getDailySummary(kandangId, tanggal);
      return apiResponse(data, "Summary berhasil diambil");
    } catch (error) {
      return apiError(error);
    }
  }

  static async getById(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const data = await PemakaianPakanService.getById(params.id);
      return apiResponse(data, "Pemakaian pakan berhasil diambil");
    } catch (error) {
      return apiError(error);
    }
  }

  static async create(req: NextRequest) {
    try {
      const body = await req.json();
      const validated = createPemakaianPakanSchema.parse(body);
      const data = await PemakaianPakanService.create(validated);
      return apiResponse(data, "Pemakaian pakan berhasil dicatat", 201);
    } catch (error) {
      return apiError(error);
    }
  }

  static async update(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const body = await req.json();
      const validated = createPemakaianPakanSchema.partial().parse(body);
      const data = await PemakaianPakanService.update(params.id, validated);
      return apiResponse(data, "Pemakaian pakan berhasil diperbarui");
    } catch (error) {
      return apiError(error);
    }
  }

  static async delete(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      await PemakaianPakanService.delete(params.id);
      return apiResponse(null, "Pemakaian pakan berhasil dihapus");
    } catch (error) {
      return apiError(error);
    }
  }
}
