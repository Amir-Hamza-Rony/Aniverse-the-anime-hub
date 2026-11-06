import mongoose, { Schema, model, Model, Document } from "mongoose";
import { VideoSourceDocument, DownloadSourceDocument } from "@/types";

const videoSourceSchema = new Schema<VideoSourceDocument, Model<VideoSourceDocument>>(
  {
    name: { type: String, required: true, trim: true, index: true },
    url: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

videoSourceSchema.index({ isActive: 1 });

export const VideoSource =
  (mongoose.models.VideoSource as Model<VideoSourceDocument>) ||
  model<VideoSourceDocument>("VideoSource", videoSourceSchema);

const downloadSourceSchema = new Schema<DownloadSourceDocument, Model<DownloadSourceDocument>>(
  {
    name: { type: String, required: true, trim: true, index: true },
    url: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

downloadSourceSchema.index({ isActive: 1 });

export const DownloadSource =
  (mongoose.models.DownloadSource as Model<DownloadSourceDocument>) ||
  model<DownloadSourceDocument>("DownloadSource", downloadSourceSchema);
