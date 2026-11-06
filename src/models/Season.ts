import mongoose, { Schema, model, Model, Document } from "mongoose";
import { SeasonDocument } from "@/types";

const seasonSchema = new Schema<SeasonDocument, Model<SeasonDocument>>(
  {
    anime: { type: Schema.Types.ObjectId, ref: "Anime", required: true, index: true },
    seasonNumber: { type: Number, required: true },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { timestamps: true },
);

seasonSchema.index({ anime: 1, seasonNumber: 1 }, { unique: true });

export const Season =
  (mongoose.models.Season as Model<SeasonDocument>) ||
  model<SeasonDocument>("Season", seasonSchema);
