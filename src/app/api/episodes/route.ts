import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/database/connect";
import { Episode } from "@/models/Episode";
import { Anime } from "@/models/Anime";
import { successResponse, errorResponse, handleError } from "@/lib/api/handler";
import { withAuth } from "@/lib/auth/middleware";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const animeId = searchParams.get("animeId");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const filter: Record<string, unknown> = { isPublished: true };
    if (animeId) filter.anime = animeId;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Episode.find(filter)
        .sort({ episodeNumber: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Episode.countDocuments(filter),
    ]);

    return successResponse({ data, total, page, limit });
  } catch (err) {
    return handleError(err);
  }
}

export const POST = withAuth(async (request) => {
  try {
    await dbConnect();
    const body = await request.json();
    const episode = await Episode.create(body);
    if (body.anime) {
      await Anime.findByIdAndUpdate(body.anime, { $inc: { totalEpisodes: 1 } });
    }
    return successResponse({ episode }, "Episode created", 201);
  } catch (err) {
    return handleError(err);
  }
}, ["ADMIN", "SUPER_ADMIN"]);
