import mongoose, { Schema, model, Model, Document } from "mongoose";
import { DownloadActivityDocument } from "@/types";

const downloadActivitySchema = new Schema<DownloadActivityDocument, Model<DownloadActivityDocument>>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", default: undefined },
    anime: { type: Schema.Types.ObjectId, ref: "Anime", required: true, index: true },
    episode: { type: Schema.Types.ObjectId, ref: "Episode", required: true, index: true },
    server: { type: String, default: "" },
    quality: { type: String, default: "" },
    downloadedAt: { type: Date, default: Date.now, index: true },
    fileSize: { type: Number, default: undefined },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

downloadActivitySchema.index({ downloadedAt: -1 });
downloadActivitySchema.index({ anime: 1, downloadedAt: -1 });
downloadActivitySchema.index({ episode: 1, downloadedAt: -1 });

export const DownloadActivity =
  (mongoose.models.DownloadActivity as Model<DownloadActivityDocument>) ||
  model<DownloadActivityDocument>("DownloadActivity", downloadActivitySchema);
