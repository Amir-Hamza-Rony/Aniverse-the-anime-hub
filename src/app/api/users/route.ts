import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/database/connect";
import { User } from "@/models/User";
import { successResponse, errorResponse, handleError } from "@/lib/api/handler";
import { withAuth } from "@/lib/auth/middleware";

/**
 * GET /api/users
 * List users (ADMIN only). Query: page, limit, role.
 */
export const GET = withAuth(async (request) => {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const role = searchParams.get("role") || undefined;

    const filter: Record<string, unknown> = {};
    if (role) filter.role = role;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    return successResponse({ data, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    return handleError(err);
  }
}, ["ADMIN", "SUPER_ADMIN"]);

/**
 * PATCH /api/users
 * Update a user's role or active status (ADMIN/SUPER_ADMIN only).
 * Body: { userId, role?, isActive? }
 */
export const PATCH = withAuth(async (request) => {
  try {
    await dbConnect();
    const body = await request.json();
    const { userId, role, isActive } = body;

    if (!userId) return errorResponse("User ID is required", 400);

    const update: Record<string, unknown> = {};
    if (role) update.role = role;
    if (isActive !== undefined) update.isActive = isActive;

    const user = await User.findByIdAndUpdate(userId, update, { new: true }).select("-password");
    if (!user) return errorResponse("User not found", 404);

    return successResponse({ user }, "User updated");
  } catch (err) {
    return handleError(err);
  }
}, ["ADMIN", "SUPER_ADMIN"]);
