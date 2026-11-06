import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/database/connect";
import { Episode } from "@/models/Episode";
import { Anime } from "@/models/Anime";
import { successResponse, errorResponse, handleError } from "@/lib/api/handler";

/**
 * GET /api/downloads/episode/[id]
 * Returns the episode and its anime with enabled download sources for a download page.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await dbConnect();

    const episode = await Episode.findById(params.id).lean();
    if (!episode) return errorResponse("Episode not found", 404);

    const anime = await Anime.findById(episode.anime).lean();
    if (!anime) return errorResponse("Anime not found", 404);

    return successResponse({
      episode,
      anime: {
        _id: anime._id,
        title: anime.title,
        slug: anime.slug,
        posterUrl: anime.posterUrl,
      },
    });
  } catch (err) {
    return handleError(err);
  }
}
