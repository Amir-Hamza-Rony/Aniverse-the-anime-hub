import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const animeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  alternativeTitles: z.array(z.string()).optional(),
  synopsis: z.string().min(1, "Synopsis is required"),
  genres: z.array(z.string()).optional(),
  releaseYear: z.number().int().min(1900).max(2100),
  status: z.enum(["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"]),
  rating: z.number().min(0).max(10).optional(),
  type: z.enum(["TV", "MOVIE", "OVA", "ONA", "SPECIAL"]),
  studio: z.string().optional(),
  totalEpisodes: z.number().int().nonnegative().optional(),
  totalSeasons: z.number().int().nonnegative().optional(),
  posterUrl: z.string().url().optional().or(z.literal("")),
  bannerUrl: z.string().url().optional().or(z.literal("")),
  featured: z.boolean().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export const episodeSchema = z.object({
  anime: z.string().min(1, "Anime is required"),
  season: z.string().optional(),
  episodeNumber: z.number().int().positive(),
  title: z.string().optional(),
  description: z.string().optional(),
  duration: z.number().int().positive().optional(),
  thumbnailUrl: z.string().url().optional().or(z.literal("")),
  subtitles: z.array(z.string()).optional(),
});

export const genreSchema = z.object({
  name: z.string().min(1, "Genre name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
});

export const advertisementSchema = z.object({
  name: z.string().min(1, "Name is required"),
  smartlinkUrl: z.string().url("Invalid smartlink URL"),
  placementType: z.enum([
    "WATCH",
    "DOWNLOAD",
    "SERVER_SELECTION",
    "HOMEPAGE",
    "DETAILS",
  ]),
  campaignName: z.string().optional(),
  priority: z.number().int().nonnegative().default(0),
  isEnabled: z.boolean().default(true),
  animeId: z.string().optional(),
  episodeId: z.string().optional(),
});

export const siteSettingsSchema = z.object({
  siteName: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  storageProvider: z.enum(["R2", "S3", "NONE"]),
  advertisingEnabled: z.boolean(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type AnimeInput = z.infer<typeof animeSchema>;
export type EpisodeInput = z.infer<typeof episodeSchema>;
export type GenreInput = z.infer<typeof genreSchema>;
export type AdvertisementInput = z.infer<typeof advertisementSchema>;
export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
