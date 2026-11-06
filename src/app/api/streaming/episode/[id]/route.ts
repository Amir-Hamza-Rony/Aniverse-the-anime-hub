import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/database/connect";
import { Episode } from "@/models/Episode";
import { Anime } from "@/models/Anime";
import { successResponse, errorResponse, handleError } from "@/lib/api/handler";

/**
 * GET /api/streaming/episode/[id]
 * Returns the anime, episode, and enabled streaming sources for a watch page.
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

    const sources = (episode.videoSources || [])
      .filter((s) => s.isEnabled)
      .map((s) => ({
        serverName: s.serverName,
        serverPriority: s.serverPriority,
        qualities: s.qualities.map((q) => ({
          quality: q.quality,
          url: q.url,
          isHls: q.isHls || false,
          fileSize: q.fileSize,
        })),
      }));

    return successResponse({ anime, episode, sources });
  } catch (err) {
    return handleError(err);
  }
}
