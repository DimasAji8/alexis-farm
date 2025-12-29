import { NextResponse } from "next/server";

export function apiResponse<T>(
  data: T,
  message = "Success",
  status = 200,
) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status },
  );
}

export function apiError(error: unknown, message?: string, status = 500) {
  const errorMessage =
    message ||
    (error instanceof Error ? error.message : "Internal server error");

  // Prioritaskan status dari ApiError
  const httpStatus = (error as { status?: number })?.status ?? status;

  if (process.env.NODE_ENV === "development") {
    console.error("API Error:", error);
  }

  return NextResponse.json(
    {
      success: false,
      message: errorMessage,
    },
    { status: httpStatus },
  );
}
