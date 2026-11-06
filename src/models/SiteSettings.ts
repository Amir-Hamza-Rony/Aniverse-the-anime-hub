import mongoose, { Schema, model, Model, Document } from "mongoose";
import { SiteSettingsDocument } from "@/types";

const siteSettingsSchema = new Schema<SiteSettingsDocument, Model<SiteSettingsDocument>>(
  {
    siteName: { type: String, required: true, default: "AniVerse" },
    tagline: { type: String, default: "Your Universe of Anime" },
    logoUrl: { type: String, default: undefined },
    faviconUrl: { type: String, default: undefined },
    description: { type: String, default: "" },
    seoTitle: { type: String, default: undefined },
    seoDescription: { type: String, default: undefined },
    socialLinks: { type: Map, of: String, default: {} },
    storageProvider: {
      type: String,
      enum: ["R2", "S3", "NONE"],
      default: "NONE",
    },
    advertisingEnabled: { type: Boolean, default: false },
    homepageSections: [{ type: String, default: [] }],
  },
  { timestamps: true },
);

siteSettingsSchema.index({ updatedAt: -1 });

export const SiteSettings =
  (mongoose.models.SiteSettings as Model<SiteSettingsDocument>) ||
  model<SiteSettingsDocument>("SiteSettings", siteSettingsSchema);
