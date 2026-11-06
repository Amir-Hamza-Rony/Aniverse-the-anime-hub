import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/database/connect";
import { Genre } from "@/models/Genre";
import { successResponse, errorResponse, handleError } from "@/lib/api/handler";
import { withAuth } from "@/lib/auth/middleware";

export const PUT = withAuth(async (request, { params }) => {
  try {
    await dbConnect();
    const body = await request.json();
    const genre = await Genre.findByIdAndUpdate(params.id, body, { new: true });
    if (!genre) return errorResponse("Genre not found", 404);
    return successResponse({ genre }, "Genre updated");
  } catch (err) {
    return handleError(err);
  }
}, ["ADMIN", "SUPER_ADMIN"]);

export const DELETE = withAuth(async (request, { params }) => {
  try {
    await dbConnect();
    const genre = await Genre.findByIdAndDelete(params.id);
    if (!genre) return errorResponse("Genre not found", 404);
    return successResponse({}, "Genre deleted");
  } catch (err) {
    return handleError(err);
  }
}, ["ADMIN", "SUPER_ADMIN"]);
