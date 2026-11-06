import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/database/connect";
import { Anime } from "@/models/Anime";
import { Episode } from "@/models/Episode";
import { successResponse, errorResponse, handleError } from "@/lib/api/handler";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  try {
    await dbConnect();
    const anime = await Anime.findOne({ slug: params.slug }).populate("genres", "name slug").lean();
    if (!anime) {
      return errorResponse("Anime not found", 404);
    }

    const episodes = await Episode.find({ anime: anime._id, isPublished: true })
      .sort({ episodeNumber: 1 })
      .lean();

    return successResponse({ anime, episodes });
  } catch (err) {
    return handleError(err);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  try {
    await dbConnect();
    const body = await request.json();
    const anime = await Anime.findOneAndUpdate({ slug: params.slug }, body, { new: true });
    if (!anime) return errorResponse("Anime not found", 404);
    return successResponse({ anime }, "Anime updated");
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  try {
    await dbConnect();
    const anime = await Anime.findOneAndDelete({ slug: params.slug });
    if (!anime) return errorResponse("Anime not found", 404);
    return successResponse({}, "Anime deleted");
  } catch (err) {
    return handleError(err);
  }
}
