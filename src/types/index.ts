import type { Document, Types } from "mongoose";

/* ------------------------------------------------------------------ */
/* Common                                                             */
/* ------------------------------------------------------------------ */

export type Role = "USER" | "ADMIN" | "SUPER_ADMIN";

export interface PaginationInput {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

/* ------------------------------------------------------------------ */
/* User                                                               */
/* ------------------------------------------------------------------ */

export interface UserInput {
  name: string;
  email: string;
  password: string;
}

export interface UserUpdateInput {
  name?: string;
  email?: string;
  avatar?: string;
}

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role: Role;
  isActive: boolean;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLoginAt?: Date;
  watchlist: Types.ObjectId[];
  favorites: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

/* ------------------------------------------------------------------ */
/* Genre                                                              */
/* ------------------------------------------------------------------ */

export interface GenreInput {
  name: string;
  slug: string;
  description?: string;
}

export interface GenreDocument extends Document {
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

/* ------------------------------------------------------------------ */
/* Anime                                                              */
/* ------------------------------------------------------------------ */

export type AnimeStatus = "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";
export type AnimeType = "TV" | "MOVIE" | "OVA" | "ONA" | "SPECIAL";

export interface AnimeInput {
  title: string;
  alternativeTitles?: string[];
  synopsis: string;
  genres: string[]; // Genre IDs
  releaseYear: number;
  status: AnimeStatus;
  rating?: number;
  type: AnimeType;
  studio?: string;
  totalEpisodes?: number;
  totalSeasons?: number;
  posterUrl?: string;
  bannerUrl?: string;
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface AnimeDocument extends Document {
  title: string;
  alternativeTitles: string[];
  slug: string;
  synopsis: string;
  genres: Types.ObjectId[];
  releaseYear: number;
  status: AnimeStatus;
  rating?: number;
  type: AnimeType;
  studio?: string;
  totalEpisodes: number;
  totalSeasons: number;
  posterUrl?: string;
  bannerUrl?: string;
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

/* ------------------------------------------------------------------ */
/* Season                                                             */
/* ------------------------------------------------------------------ */

export interface SeasonInput {
  anime: string;
  seasonNumber: number;
  title?: string;
  description?: string;
}

export interface SeasonDocument extends Document {
  anime: Types.ObjectId;
  seasonNumber: number;
  title?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

/* ------------------------------------------------------------------ */
/* Episode                                                            */
/* ------------------------------------------------------------------ */

export interface EpisodeInput {
  anime: string;
  season?: string;
  episodeNumber: number;
  title?: string;
  description?: string;
  duration?: number;
  thumbnailUrl?: string;
  subtitles?: string[];
}

export interface VideoQuality {
  quality: "360p" | "480p" | "720p" | "1080p";
  url: string;
  fileSize?: number;
  isHls?: boolean;
}

export interface VideoSourceInput {
  serverName: string;
  serverPriority: number;
  qualities: VideoQuality[];
  isEnabled: boolean;
}

export interface DownloadSourceInput {
  serverName: string;
  serverPriority: number;
  qualities: VideoQuality[];
  isEnabled: boolean;
}

export interface EpisodeDocument extends Document {
  anime: Types.ObjectId;
  season?: Types.ObjectId;
  episodeNumber: number;
  title?: string;
  description?: string;
  slug: string;
  duration?: number;
  thumbnailUrl?: string;
  subtitles: string[];
  videoSources: VideoSourceInput[];
  downloadSources: DownloadSourceInput[];
  totalViews: number;
  totalDownloads: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/* ------------------------------------------------------------------ */
/* VideoSource / DownloadSource (standalone management)               */
/* ------------------------------------------------------------------ */

export interface VideoSourceDocument extends Document {
  name: string;
  url: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DownloadSourceDocument extends Document {
  name: string;
  url: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/* ------------------------------------------------------------------ */
/* Watch History                                                      */
/* ------------------------------------------------------------------ */

export interface WatchHistoryDocument extends Document {
  user: Types.ObjectId;
  anime: Types.ObjectId;
  episode: Types.ObjectId;
  watchedAt: Date;
  progress: number; // seconds
  completed: boolean;
}

/* ------------------------------------------------------------------ */
/* Favorite                                                           */
/* ------------------------------------------------------------------ */

export interface FavoriteDocument extends Document {
  user: Types.ObjectId;
  anime: Types.ObjectId;
  createdAt: Date;
}

/* ------------------------------------------------------------------ */
/* Advertisement                                                      */
/* ------------------------------------------------------------------ */

export type PlacementType =
  | "WATCH"
  | "DOWNLOAD"
  | "SERVER_SELECTION"
  | "HOMEPAGE"
  | "DETAILS";

export interface AdvertisementInput {
  name: string;
  smartlinkUrl: string;
  placementType: PlacementType;
  campaignName?: string;
  priority: number;
  isEnabled: boolean;
  animeId?: string;
  episodeId?: string;
}

export interface AdvertisementDocument extends Document {
  name: string;
  smartlinkUrl: string;
  placementType: PlacementType;
  campaignName?: string;
  priority: number;
  isEnabled: boolean;
  animeId?: Types.ObjectId;
  episodeId?: Types.ObjectId;
  totalClicks: number;
  createdAt: Date;
  updatedAt: Date;
}

/* ------------------------------------------------------------------ */
/* Advertisement Click                                                */
/* ------------------------------------------------------------------ */

export interface AdvertisementClickDocument extends Document {
  advertisement: Types.ObjectId;
  placementType: PlacementType;
  animeId?: Types.ObjectId;
  episodeId?: Types.ObjectId;
  userId?: Types.ObjectId;
  ipAddress?: string;
  userAgent?: string;
  clickedAt: Date;
}

/* ------------------------------------------------------------------ */
/* Streaming Activity                                                 */
/* ------------------------------------------------------------------ */

export interface StreamingActivityDocument extends Document {
  userId?: Types.ObjectId;
  anime: Types.ObjectId;
  episode: Types.ObjectId;
  server: string;
  quality: string;
  playedAt: Date;
  durationWatched?: number;
}

/* ------------------------------------------------------------------ */
/* Download Activity                                                  */
/* ------------------------------------------------------------------ */

export interface DownloadActivityDocument extends Document {
  userId?: Types.ObjectId;
  anime: Types.ObjectId;
  episode: Types.ObjectId;
  server: string;
  quality: string;
  downloadedAt: Date;
  fileSize?: number;
  completed: boolean;
}

/* ------------------------------------------------------------------ */
/* Site Settings                                                      */
/* ------------------------------------------------------------------ */

export interface SiteSettingsDocument extends Document {
  siteName: string;
  tagline: string;
  logoUrl?: string;
  faviconUrl?: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  socialLinks?: Record<string, string>;
  storageProvider: "R2" | "S3" | "NONE";
  advertisingEnabled: boolean;
  homepageSections: string[];
  updatedAt: Date;
}

/* ------------------------------------------------------------------ */
/* Activity Log                                                       */
/* ------------------------------------------------------------------ */

export interface ActivityLogDocument extends Document {
  userId?: Types.ObjectId;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: Date;
}
