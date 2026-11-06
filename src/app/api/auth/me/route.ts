import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/database/connect";
import { User } from "@/models";
import { successResponse, errorResponse, handleError } from "@/lib/api/handler";
import { withAuth } from "@/lib/auth/middleware";

export const GET = withAuth(async (request, user) => {
  try {
    await dbConnect();
    const dbUser = await User.findById(user.id).select("-password");
    if (!dbUser) {
      return errorResponse("User not found", 404);
    }
    return successResponse({ user: dbUser });
  } catch (err) {
    return handleError(err);
  }
}, ["USER", "ADMIN", "SUPER_ADMIN"]);
