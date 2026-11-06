import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { UserDocument } from "@/types";
import { JWT_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN, COOKIE_NAME, COOKIE_REFRESH_NAME, APP_URL } from "@/config";

if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");

const jwts = jwt as any;

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export const signAccessToken = (user: SessionUser): string => {
  return jwts.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN, subject: user.id },
  );
};

export const signRefreshToken = (user: SessionUser): string => {
  if (!JWT_REFRESH_SECRET) throw new Error("JWT_REFRESH_SECRET is not defined");
  return jwts.sign(
    { id: user.id },
    JWT_REFRESH_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRES_IN, subject: user.id },
  );
};

export const setAuthCookies = (accessToken: string, refreshToken: string) => {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  cookieStore.set(COOKIE_REFRESH_NAME, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
};

export const clearAuthCookies = () => {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, "", { httpOnly: true, path: "/", maxAge: 0 });
  cookieStore.set(COOKIE_REFRESH_NAME, "", { httpOnly: true, path: "/", maxAge: 0 });
};

export const getAccessToken = (): string | undefined => {
  const cookieStore = cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
};

export const verifyAccessToken = (token: string): SessionUser | null => {
  try {
    const payload = jwts.verify(token, JWT_SECRET) as {
      id: string; email: string; role: string;
    };
    return { id: payload.id, email: payload.email, name: "", role: payload.role };
  } catch {
    return null;
  }
};

export const verifyRefreshToken = (token: string): string | null => {
  if (!JWT_REFRESH_SECRET) return null;
  try {
    const payload = jwts.verify(token, JWT_REFRESH_SECRET) as { id: string };
    return payload.id;
  } catch {
    return null;
  }
};

export const getServerUser = async (): Promise<SessionUser | null> => {
  const token = getAccessToken();
  if (!token) return null;
  return verifyAccessToken(token);
};

export const requireRole = (user: SessionUser | null, allowed: string[]): boolean => {
  if (!user) return false;
  return allowed.includes(user.role);
};

export { COOKIE_NAME, COOKIE_REFRESH_NAME } from "@/config";
