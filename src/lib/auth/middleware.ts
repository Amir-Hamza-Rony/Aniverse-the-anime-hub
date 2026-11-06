import { NextResponse } from "next/server";
import { getAccessToken, verifyAccessToken } from "@/lib/auth";

/**
 * Middleware factory for API route handlers. Extracts and verifies the
 * access token from httpOnly cookies, attaches `request.user`, and enforces
 * role-based access control.
 *
 * Usage:
 *   export const POST = withAuth(async (request) => { ... }, ["ADMIN", "SUPER_ADMIN"]);
 */
export const withAuth =
  (handler: (request: Request, user: { id: string; role: string }) => Promise<Response>, allowedRoles: string[] = ["USER", "ADMIN", "SUPER_ADMIN"]) =>
  async (request: Request): Promise<Response> => {
    const token = getAccessToken();
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = verifyAccessToken(token);
    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid or expired session" }, { status: 401 });
    }

    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    // Attach user to request for downstream use
    (request as any).user = user;

    return handler(request, user);
  };

export const optionalAuth =
  (handler: (request: Request, user: { id: string; role: string } | null) => Promise<Response>) =>
  async (request: Request): Promise<Response> => {
    const token = getAccessToken();
    let user: { id: string; role: string } | null = null;
    if (token) {
      const verified = verifyAccessToken(token);
      if (verified) user = verified;
    }
    (request as any).user = user;
    return handler(request, user);
  };
