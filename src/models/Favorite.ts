import mongoose, { Schema, model, Model, Document } from "mongoose";
import { FavoriteDocument } from "@/types";

const favoriteSchema = new Schema<FavoriteDocument, Model<FavoriteDocument>>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    anime: { type: Schema.Types.ObjectId, ref: "Anime", required: true, index: true },
  },
  { timestamps: true },
);

favoriteSchema.index({ user: 1, anime: 1 }, { unique: true });

export const Favorite =
  (mongoose.models.Favorite as Model<FavoriteDocument>) ||
  model<FavoriteDocument>("Favorite", favoriteSchema);
