import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/database/connect";
import { AdvertisementClick } from "@/models/AdvertisementClick";
import { StreamingActivity } from "@/models/StreamingActivity";
import { DownloadActivity } from "@/models/DownloadActivity";
import { Anime } from "@/models/Anime";
import { successResponse, errorResponse, handleError } from "@/lib/api/handler";
import { withAuth } from "@/lib/auth/middleware";
import { getClickStats, getTopClickedAnime } from "@/lib/analytics";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "30d";

    const now = new Date();
    let startDate: Date;
    if (range === "7d") startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    else if (range === "90d") startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    else startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const clickStats = await getClickStats({ startDate, endDate: now });

    const [streamCount, downloadCount, totalAnime, totalUsers] = await Promise.all([
      StreamingActivity.countDocuments({ playedAt: { $gte: startDate } }),
      DownloadActivity.countDocuments({ downloadedAt: { $gte: startDate } }),
      Anime.countDocuments(),
    ]);

    const topAnime = await getTopClickedAnime(startDate, now);

    return successResponse({
      range,
      period: { startDate, endDate: now },
      adClicks: clickStats.total,
      clicksByDay: clickStats.byDay,
      clicksByPlacement: clickStats.byPlacement,
      streamCount,
      downloadCount,
      totalAnime,
      topClickedAnime: topAnime,
    });
  } catch (err) {
    return handleError(err);
  }
}
