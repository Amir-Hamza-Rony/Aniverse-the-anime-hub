import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/database/connect";
import { Genre } from "@/models/Genre";
import { successResponse, errorResponse, handleError } from "@/lib/api/handler";
import { withAuth } from "@/lib/auth/middleware";

export async function GET() {
  try {
    await dbConnect();
    const genres = await Genre.find().sort({ name: 1 }).lean();
    return successResponse({ data: genres });
  } catch (err) {
    return handleError(err);
  }
}

export const POST = withAuth(async (request) => {
  try {
    await dbConnect();
    const body = await request.json();
    const genre = await Genre.create(body);
    return successResponse({ genre }, "Genre created", 201);
  } catch (err) {
    return handleError(err);
  }
}, ["ADMIN", "SUPER_ADMIN"]);
