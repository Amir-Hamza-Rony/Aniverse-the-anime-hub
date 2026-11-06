import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAccessToken, verifyAccessToken, COOKIE_NAME, COOKIE_REFRESH_NAME } from "@/lib/auth";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/api/auth",
  "/api/anime",
  "/api/genres",
  "/api/episodes",
  "/watch",
  "/download",
  "/go",
];

const ADMIN_PATH_PREFIX = "/admin";

export const middleware = (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  // Allow static assets and Next internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/storage") ||
    pathname.match(/\.(png|jpg|jpeg|webp|ico|svg|css|js)$/)
  ) {
    return NextResponse.next();
  }

  const token = getAccessToken();
  const user = token ? verifyAccessToken(token) : null;

  // Admin routes require ADMIN or SUPER_ADMIN
  if (pathname.startsWith(ADMIN_PATH_PREFIX)) {
    if (!user || !["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Protected user-only routes
  const protectedPaths = ["/profile", "/watch-history", "/downloads", "/favorites"];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (isProtected && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated and on login/register, redirect to home
  if (user && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
