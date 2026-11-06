import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/database/connect";
import { VideoSource } from "@/models/VideoSource";
import { DownloadSource } from "@/models/DownloadSource";
import { successResponse, errorResponse, handleError } from "@/lib/api/handler";
import { withAuth } from "@/lib/auth/middleware";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "video";

    if (type === "video") {
      const sources = await VideoSource.find().sort({ name: 1 }).lean();
      return successResponse({ data: sources });
    }
    if (type === "download") {
      const sources = await DownloadSource.find().sort({ name: 1 }).lean();
      return successResponse({ data: sources });
    }
    return errorResponse("Invalid type", 400);
  } catch (err) {
    return handleError(err);
  }
}

export const POST = withAuth(async (request) => {
  try {
    await dbConnect();
    const body = await request.json();
    const { type, name, url } = body;

    if (type === "video") {
      const source = await VideoSource.create({ name, url });
      return successResponse({ source }, "Video source created", 201);
    }
    if (type === "download") {
      const source = await DownloadSource.create({ name, url });
      return successResponse({ source }, "Download source created", 201);
    }
    return errorResponse("Invalid type", 400);
  } catch (err) {
    return handleError(err);
  }
}, ["ADMIN", "SUPER_ADMIN"]);

/**
 * DELETE /api/storage?id=<sourceId>&type=video|download
 * Delete a standalone video/download source (ADMIN only).
 */
export const DELETE = withAuth(async (request) => {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type") || "video";

    if (!id) return errorResponse("Source ID is required", 400);

    const Model = type === "video" ? VideoSource : DownloadSource;
    const source = await Model.findByIdAndDelete(id);
    if (!source) return errorResponse("Source not found", 404);

    return successResponse({}, "Source deleted");
  } catch (err) {
    return handleError(err);
  }
}, ["ADMIN", "SUPER_ADMIN"]);
