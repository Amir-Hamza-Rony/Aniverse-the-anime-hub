import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/database/connect";
import { SiteSettings } from "@/models/SiteSettings";
import { successResponse, errorResponse, handleError } from "@/lib/api/handler";
import { withAuth } from "@/lib/auth/middleware";

export async function GET() {
  try {
    await dbConnect();
    let settings = await SiteSettings.findOne().lean();
    if (!settings) {
      settings = await SiteSettings.create({
        siteName: "AniVerse",
        tagline: "Your Universe of Anime",
        storageProvider: "NONE",
        advertisingEnabled: false,
        homepageSections: ["featured", "trending", "popular", "recentlyUpdated", "latestEpisodes", "latestReleases", "recommended", "recentlyAdded"],
      });
    }
    return successResponse({ settings });
  } catch (err) {
    return handleError(err);
  }
}

export const PUT = withAuth(async (request) => {
  try {
    await dbConnect();
    const body = await request.json();
    const settings = await SiteSettings.findOneAndUpdate({}, body, { new: true, upsert: true });
    return successResponse({ settings }, "Settings updated");
  } catch (err) {
    return handleError(err);
  }
}, ["ADMIN", "SUPER_ADMIN"]);
