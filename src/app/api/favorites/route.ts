import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/database/connect";
import { Favorite } from "@/models/Favorite";
import { Anime } from "@/models/Anime";
import { successResponse, errorResponse, handleError } from "@/lib/api/handler";
import { withAuth } from "@/lib/auth/middleware";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const filter: Record<string, unknown> = {};
    if (userId) filter.user = userId;

    const favorites = await Favorite.find(filter)
      .sort({ createdAt: -1 })
      .populate("anime", "title posterUrl slug rating status")
      .lean();

    return successResponse({ data: favorites });
  } catch (err) {
    return handleError(err);
  }
}

export const POST = withAuth(async (request, user) => {
  try {
    await dbConnect();
    const body = await request.json();
    const { animeId } = body;

    const existing = await Favorite.findOne({ user: user.id, anime: animeId });
    if (existing) {
      await Favorite.deleteOne({ _id: existing._id });
      return successResponse({}, "Removed from favorites");
    }

    await Favorite.create({ user: user.id, anime: animeId });
    return successResponse({}, "Added to favorites", 201);
  } catch (err) {
    return handleError(err);
  }
}, ["USER", "ADMIN", "SUPER_ADMIN"]);
