import mongoose, { Schema, model, Model, Document } from "mongoose";
import { AnimeDocument } from "@/types";

const animeSchema = new Schema<AnimeDocument, Model<AnimeDocument>>(
  {
    title: { type: String, required: true, trim: true, index: "text" },
    alternativeTitles: [{ type: String, default: [] }],
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    synopsis: { type: String, required: true },
    genres: [{ type: Schema.Types.ObjectId, ref: "Genre", default: [] }],
    releaseYear: { type: Number, required: true },
    status: {
      type: String,
      enum: ["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"],
      required: true,
      index: true,
    },
    rating: { type: Number, default: 0, min: 0, max: 10 },
    type: {
      type: String,
      enum: ["TV", "MOVIE", "OVA", "ONA", "SPECIAL"],
      required: true,
    },
    studio: { type: String, default: "" },
    totalEpisodes: { type: Number, default: 0 },
    totalSeasons: { type: Number, default: 0 },
    posterUrl: { type: String, default: undefined },
    bannerUrl: { type: String, default: undefined },
    featured: { type: Boolean, default: false, index: true },
    seoTitle: { type: String, default: undefined },
    seoDescription: { type: String, default: undefined },
  },
  { timestamps: true },
);

animeSchema.index({ slug: 1 }, { unique: true });
animeSchema.index({ status: 1, releaseYear: -1 });
animeSchema.index({ featured: 1, createdAt: -1 });
animeSchema.index({ rating: -1 });

export const Anime =
  (mongoose.models.Anime as Model<AnimeDocument>) ||
  model<AnimeDocument>("Anime", animeSchema);
