import mongoose, { Schema, model, Model, Document } from "mongoose";
import {
  AdvertisementDocument,
  PlacementType,
} from "@/types";

const advertisementSchema = new Schema<AdvertisementDocument, Model<AdvertisementDocument>>(
  {
    name: { type: String, required: true, trim: true },
    smartlinkUrl: { type: String, required: true },
    placementType: {
      type: String,
      enum: ["WATCH", "DOWNLOAD", "SERVER_SELECTION", "HOMEPAGE", "DETAILS"],
      required: true,
      index: true,
    },
    campaignName: { type: String, default: undefined },
    priority: { type: Number, default: 0 },
    isEnabled: { type: Boolean, default: true },
    animeId: { type: Schema.Types.ObjectId, ref: "Anime", default: undefined },
    episodeId: { type: Schema.Types.ObjectId, ref: "Episode", default: undefined },
    totalClicks: { type: Number, default: 0 },
  },
  { timestamps: true },
);

advertisementSchema.index({ placementType: 1, isEnabled: 1, priority: -1 });
advertisementSchema.index({ animeId: 1, placementType: 1 });
advertisementSchema.index({ episodeId: 1, placementType: 1 });

export const Advertisement =
  (mongoose.models.Advertisement as Model<AdvertisementDocument>) ||
  model<AdvertisementDocument>("Advertisement", advertisementSchema);
