import mongoose, { Schema, model, Model, Document } from "mongoose";
import { AdvertisementClickDocument, PlacementType } from "@/types";

const advertisementClickSchema = new Schema<AdvertisementClickDocument, Model<AdvertisementClickDocument>>(
  {
    advertisement: { type: Schema.Types.ObjectId, ref: "Advertisement", required: true, index: true },
    placementType: {
      type: String,
      enum: ["WATCH", "DOWNLOAD", "SERVER_SELECTION", "HOMEPAGE", "DETAILS"],
      required: true,
    },
    animeId: { type: Schema.Types.ObjectId, ref: "Anime", default: undefined },
    episodeId: { type: Schema.Types.ObjectId, ref: "Episode", default: undefined },
    userId: { type: Schema.Types.ObjectId, ref: "User", default: undefined },
    ipAddress: { type: String, default: undefined },
    userAgent: { type: String, default: undefined },
    clickedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true },
);

advertisementClickSchema.index({ clickedAt: -1 });
advertisementClickSchema.index({ advertisement: 1, clickedAt: -1 });
advertisementClickSchema.index({ placementType: 1, clickedAt: -1 });

export const AdvertisementClick =
  (mongoose.models.AdvertisementClick as Model<AdvertisementClickDocument>) ||
  model<AdvertisementClickDocument>("AdvertisementClick", advertisementClickSchema);
