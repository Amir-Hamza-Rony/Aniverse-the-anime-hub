import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/database/connect";
import { DownloadActivity } from "@/models/DownloadActivity";
import { Anime } from "@/models/Anime";
import { successResponse, errorResponse, handleError } from "@/lib/api/handler";
import { withAuth } from "@/lib/auth/middleware";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const filter: Record<string, unknown> = {};
    if (userId) filter.userId = userId;

    const downloads = await DownloadActivity.find(filter)
      .sort({ downloadedAt: -1 })
      .populate("anime", "title posterUrl slug")
      .populate("episode", "title episodeNumber")
      .lean();

    return successResponse({ data: downloads });
  } catch (err) {
    return handleError(err);
  }
}

export const POST = withAuth(async (request) => {
  try {
    await dbConnect();
    const body = await request.json();
    await DownloadActivity.create({
      userId: body.userId || "anonymous",
      anime: body.animeId,
      episode: body.episodeId,
      server: body.server || "",
      quality: body.quality || "",
      fileSize: body.fileSize,
      completed: true,
    });
    return successResponse({}, "Download recorded", 201);
  } catch (err) {
    return handleError(err);
  }
}, ["USER", "ADMIN", "SUPER_ADMIN"]);
