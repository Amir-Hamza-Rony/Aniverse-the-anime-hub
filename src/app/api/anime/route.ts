import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/database/connect";
import { Anime } from "@/models/Anime";
import { successResponse, errorResponse, handleError } from "@/lib/api/handler";
import { withAuth } from "@/lib/auth/middleware";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const q = searchParams.get("q") || undefined;
    const genre = searchParams.get("genre") || undefined;
    const year = searchParams.get("year") || undefined;
    const status = searchParams.get("status") || undefined;
    const type = searchParams.get("type") || undefined;
    const sort = searchParams.get("sort") || "popular";

    const filter: Record<string, unknown> = { isPublished: { $ne: false } };

    if (q) {
      filter.$text = { $search: q };
    }
    if (genre) filter.genres = genre;
    if (year) filter.releaseYear = parseInt(year, 10);
    if (status) filter.status = status;
    if (type) filter.type = type;

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === "popular") sortOption = { totalViews: -1, createdAt: -1 };
    if (sort === "rating") sortOption = { rating: -1, createdAt: -1 };
    if (sort === "latest") sortOption = { releaseYear: -1, createdAt: -1 };
    if (sort === "updated") sortOption = { updatedAt: -1 };
    if (sort === "added") sortOption = { createdAt: -1 };

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Anime.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .populate("genres", "name slug")
        .lean(),
      Anime.countDocuments(filter),
    ]);

    return successResponse({ data, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    return handleError(err);
  }
}

export const POST = withAuth(async (request) => {
  try {
    await dbConnect();
    const body = await request.json();
    const anime = await Anime.create(body);
    return successResponse({ anime }, "Anime created", 201);
  } catch (err) {
    return handleError(err);
  }
}, ["ADMIN", "SUPER_ADMIN"]);
