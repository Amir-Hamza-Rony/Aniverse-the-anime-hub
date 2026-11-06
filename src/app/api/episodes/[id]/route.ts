import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/database/connect";
import { Episode } from "@/models/Episode";
import { successResponse, errorResponse, handleError } from "@/lib/api/handler";
import { withAuth } from "@/lib/auth/middleware";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await dbConnect();
    const episode = await Episode.findById(params.id).lean();
    if (!episode) return errorResponse("Episode not found", 404);
    return successResponse({ episode });
  } catch (err) {
    return handleError(err);
  }
}

export const PUT = withAuth(async (request, { params }) => {
  try {
    await dbConnect();
    const body = await request.json();
    const episode = await Episode.findByIdAndUpdate(params.id, body, { new: true });
    if (!episode) return errorResponse("Episode not found", 404);
    return successResponse({ episode }, "Episode updated");
  } catch (err) {
    return handleError(err);
  }
}, ["ADMIN", "SUPER_ADMIN"]);

export const DELETE = withAuth(async (request, { params }) => {
  try {
    await dbConnect();
    const episode = await Episode.findByIdAndDelete(params.id);
    if (!episode) return errorResponse("Episode not found", 404);
    return successResponse({}, "Episode deleted");
  } catch (err) {
    return handleError(err);
  }
}, ["ADMIN", "SUPER_ADMIN"]);
