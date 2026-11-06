import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/database/connect";
import { validateBody, successResponse, handleError } from "@/lib/api/handler";
import { z } from "zod";
import { recordAdvertisementClick } from "@/lib/advertisements/redirect";

const clickSchema = z.object({
  advertisementId: z.string().min(1, "Advertisement ID is required"),
  placementType: z.enum([
    "WATCH",
    "DOWNLOAD",
    "SERVER_SELECTION",
    "HOMEPAGE",
    "DETAILS",
  ]),
  animeId: z.string().optional(),
  episodeId: z.string().optional(),
});

/**
 * POST /api/advertisements/click
 * Records an Adsterra smartlink click with deduplication and attribution.
 */
export async function POST(request: NextRequest) {
  try {
    const validation = await validateBody(request, clickSchema);
    if ("error" in validation) return validation.error;

    await dbConnect();

    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const ua = request.headers.get("user-agent") || undefined;

    await recordAdvertisementClick({
      advertisementId: validation.data.advertisementId,
      placementType: validation.data.placementType,
      animeId: validation.data.animeId,
      episodeId: validation.data.episodeId,
      ipAddress: ip,
      userAgent: ua,
    });

    return successResponse({}, "Click recorded");
  } catch (err) {
    return handleError(err);
  }
}
