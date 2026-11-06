import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/database/connect";
import { Advertisement } from "@/models/Advertisement";
import { AdvertisementClick } from "@/models/AdvertisementClick";
import { successResponse, errorResponse, handleError } from "@/lib/api/handler";
import { withAuth } from "@/lib/auth/middleware";
import { getAdvertisementForPlacement } from "@/lib/advertisements/redirect";
import { PlacementType } from "@/types";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const placementType = searchParams.get("placementType") as PlacementType | undefined;
    const animeId = searchParams.get("animeId") || undefined;
    const episodeId = searchParams.get("episodeId") || undefined;

    if (placementType) {
      const ad = await getAdvertisementForPlacement({ placementType, animeId, episodeId });
      return successResponse({ advertisement: ad });
    }

    const ads = await Advertisement.find().sort({ priority: -1, createdAt: -1 }).lean();
    return successResponse({ data: ads });
  } catch (err) {
    return handleError(err);
  }
}

export const POST = withAuth(async (request) => {
  try {
    await dbConnect();
    const body = await request.json();
    const ad = await Advertisement.create(body);
    return successResponse({ advertisement: ad }, "Advertisement created", 201);
  } catch (err) {
    return handleError(err);
  }
}, ["ADMIN", "SUPER_ADMIN"]);

export const PUT = withAuth(async (request, { params }) => {
  try {
    await dbConnect();
    const body = await request.json();
    const ad = await Advertisement.findByIdAndUpdate(params.id, body, { new: true });
    if (!ad) return errorResponse("Advertisement not found", 404);
    return successResponse({ advertisement: ad }, "Advertisement updated");
  } catch (err) {
    return handleError(err);
  }
}, ["ADMIN", "SUPER_ADMIN"]);

export const DELETE = withAuth(async (request, { params }) => {
  try {
    await dbConnect();
    const ad = await Advertisement.findByIdAndDelete(params.id);
    if (!ad) return errorResponse("Advertisement not found", 404);
    return successResponse({}, "Advertisement deleted");
  } catch (err) {
    return handleError(err);
  }
}, ["ADMIN", "SUPER_ADMIN"]);
