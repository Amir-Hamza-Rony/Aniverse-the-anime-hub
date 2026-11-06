import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/database/connect";
import { WatchHistory } from "@/models/WatchHistory";
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

    const history = await WatchHistory.find(filter)
      .sort({ watchedAt: -1 })
      .populate("anime", "title posterUrl slug")
      .populate("episode", "title episodeNumber")
      .lean();

    return successResponse({ data: history });
  } catch (err) {
    return handleError(err);
  }
}

export const POST = withAuth(async (request, user) => {
  try {
    await dbConnect();
    const body = await request.json();
    const { animeId, episodeId, progress } = body;

    await WatchHistory.findOneAndUpdate(
      { user: user.id, anime: animeId, episode: episodeId },
      { watchedAt: new Date(), progress: progress || 0, completed: progress >= 100 },
      { upsert: true, new: true },
    );

    return successResponse({}, "Watch history updated");
  } catch (err) {
    return handleError(err);
  }
}, ["USER", "ADMIN", "SUPER_ADMIN"]);
