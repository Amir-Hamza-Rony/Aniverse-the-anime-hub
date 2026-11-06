import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/database/connect";
import { StreamingActivity } from "@/models/StreamingActivity";
import { Anime } from "@/models/Anime";
import { Episode } from "@/models/Episode";
import { successResponse, errorResponse, handleError } from "@/lib/api/handler";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const episodeId = searchParams.get("episodeId");

    if (!episodeId) return errorResponse("Episode ID required", 400);

    const episode = await Episode.findById(episodeId).lean();
    if (!episode) return errorResponse("Episode not found", 404);

    // Return available streaming sources (quality options)
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

    return successResponse({ episode, sources });
  } catch (err) {
    return handleError(err);
  }
}

export const POST = async (request: NextRequest) => {
  try {
    await dbConnect();
    const body = await request.json();
    const { animeId, episodeId, server, quality, userId } = body;

    await StreamingActivity.create({
      userId: userId || undefined,
      anime: animeId,
      episode: episodeId,
      server: server || "",
      quality: quality || "",
      playedAt: new Date(),
    });

    await Episode.findByIdAndUpdate(episodeId, { $inc: { totalViews: 1 } });
    await Anime.findByIdAndUpdate(animeId, { $inc: { totalViews: 1 } });

    return successResponse({}, "Streaming activity recorded", 201);
  } catch (err) {
    return handleError(err);
  }
};
