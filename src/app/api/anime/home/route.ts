import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/database/connect";
import { Anime } from "@/models/Anime";
import { Episode } from "@/models/Episode";
import { successResponse, errorResponse, handleError } from "@/lib/api/handler";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get("sort") || "popular";
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === "popular") sortOption = { totalViews: -1 };
    if (sort === "rating") sortOption = { rating: -1 };
    if (sort === "latest") sortOption = { releaseYear: -1 };
    if (sort === "updated") sortOption = { updatedAt: -1 };
    if (sort === "added") sortOption = { createdAt: -1 };

    const [featured, trending, popular, recentlyUpdated, latestEpisodes, latestReleases, recommended, recentlyAdded] =
      await Promise.all([
        Anime.find({ featured: true }).sort(sortOption).limit(limit).populate("genres", "name").lean(),
        Anime.find({}).sort({ totalViews: -1 }).limit(limit).populate("genres", "name").lean(),
        Anime.find({}).sort({ totalViews: -1, rating: -1 }).limit(limit).populate("genres", "name").lean(),
        Anime.find({}).sort({ updatedAt: -1 }).limit(limit).populate("genres", "name").lean(),
        Episode.find({ isPublished: true }).sort({ createdAt: -1 }).limit(limit).populate("anime", "title posterUrl slug").lean(),
        Anime.find({}).sort({ createdAt: -1 }).limit(limit).populate("genres", "name").lean(),
        Anime.find({}).sort({ rating: -1 }).limit(limit).populate("genres", "name").lean(),
        Anime.find({}).sort({ createdAt: -1 }).limit(limit).populate("genres", "name").lean(),
      ]);

    return successResponse({
      featured,
      trending,
      popular,
      recentlyUpdated,
      latestEpisodes,
      latestReleases,
      recommended,
      recentlyAdded,
    });
  } catch (err) {
    return handleError(err);
  }
}
