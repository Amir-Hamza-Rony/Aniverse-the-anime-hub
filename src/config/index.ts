export const APP_NAME = "AniVerse";
export const APP_TAGLINE = "Your Universe of Anime";

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const JWT_SECRET = process.env.JWT_SECRET || "";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "";
export const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "30d";

export const MONGODB_URI = process.env.MONGODB_URI || "";

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@aniverse.local";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@123456";
export const ADMIN_NAME = process.env.ADMIN_NAME || "AniVerse Admin";

export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "";
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || "";
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || "";

export const R2_ENDPOINT = process.env.R2_ENDPOINT || "";
export const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || "";
export const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || "";
export const R2_BUCKET = process.env.R2_BUCKET || "";
export const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || "";

export const ADSTERRA_ENABLED =
  process.env.ADSTERRA_ENABLED === "true" || process.env.ADSTERRA_ENABLED === "1";

export const EMAIL_SERVICE = process.env.EMAIL_SERVICE || "";
export const EMAIL_FROM = process.env.EMAIL_FROM || "noreply@aniverse.local";

export const COOKIE_NAME = "aniverse_token";
export const COOKIE_REFRESH_NAME = "aniverse_refresh_token";

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB for images
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const ANIME_STATUSES = [
  "UPCOMING",
  "ONGOING",
  "COMPLETED",
  "CANCELLED",
] as const;

export const ANIME_TYPES = ["TV", "MOVIE", "OVA", "ONA", "SPECIAL"] as const;

export const VIDEO_QUALITIES = ["360p", "480p", "720p", "1080p"] as const;

export const PLACEMENT_TYPES = [
  "WATCH",
  "DOWNLOAD",
  "SERVER_SELECTION",
  "HOMEPAGE",
  "DETAILS",
] as const;
