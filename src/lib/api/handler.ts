import { NextRequest, NextResponse } from "next/server";
import { ZodError, ZodTypeAny } from "zod";

export interface ValidatedRequest<T> extends NextRequest {
  body?: T;
}

/**
 * Validate request body against a Zod schema in API route handlers.
 * Returns a 400 NextResponse on validation failure.
 */
export const validateBody = async <T>(
  request: NextRequest,
  schema: ZodTypeAny,
): Promise<{ data: T } | { error: NextResponse }> => {
  try {
    const body = (await request.json()) as unknown;
    const data = schema.parse(body);
    return { data };
  } catch (err) {
    if (err instanceof ZodError) {
      return {
        error: NextResponse.json(
          { success: false, error: "Validation error", issues: err.errors },
          { status: 400 },
        ),
      };
    }
    return {
      error: NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 },
      ),
    };
  }
};

export const handleError = (err: unknown): NextResponse => {
  console.error("API Error:", err);
  if (err instanceof Error) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
  return NextResponse.json(
    { success: false, error: "Internal server error" },
    { status: 500 },
  );
};

export const successResponse = <T>(
  data: T,
  message?: string,
  status = 200,
): NextResponse => {
  return NextResponse.json(
    { success: true, message, data },
    { status },
  );
};

export const errorResponse = (
  message: string,
  status = 400,
): NextResponse => {
  return NextResponse.json({ success: false, error: message }, { status });
};
