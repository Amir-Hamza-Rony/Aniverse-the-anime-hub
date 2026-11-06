import mongoose, { Schema, model, Model, Document } from "mongoose";
import {
  EpisodeDocument,
  VideoQuality,
  VideoSourceInput,
  DownloadSourceInput,
} from "@/types";

const videoQualitySchema = new Schema<VideoQuality>({
  quality: {
    type: String,
    enum: ["360p", "480p", "720p", "1080p"],
    required: true,
  },
  url: { type: String, required: true },
  fileSize: { type: Number, default: undefined },
  isHls: { type: Boolean, default: false },
});

const videoSourceSchema = new Schema<VideoSourceInput>({
  serverName: { type: String, required: true },
  serverPriority: { type: Number, default: 0 },
  qualities: [videoQualitySchema],
  isEnabled: { type: Boolean, default: true },
});

const downloadSourceSchema = new Schema<DownloadSourceInput>({
  serverName: { type: String, required: true },
  serverPriority: { type: Number, default: 0 },
  qualities: [videoQualitySchema],
  isEnabled: { type: Boolean, default: true },
});

const episodeSchema = new Schema<EpisodeDocument, Model<EpisodeDocument>>(
  {
    anime: { type: Schema.Types.ObjectId, ref: "Anime", required: true, index: true },
    season: { type: Schema.Types.ObjectId, ref: "Season", default: undefined },
    episodeNumber: { type: Number, required: true },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    slug: { type: String, required: true, index: true },
    duration: { type: Number, default: undefined },
    thumbnailUrl: { type: String, default: undefined },
    subtitles: [{ type: String, default: [] }],
    videoSources: [videoSourceSchema],
    downloadSources: [downloadSourceSchema],
    totalViews: { type: Number, default: 0 },
    totalDownloads: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true },
);

episodeSchema.index({ anime: 1, episodeNumber: 1 });
episodeSchema.index({ slug: 1 }, { unique: true });
episodeSchema.index({ isPublished: 1 });

export const Episode =
  (mongoose.models.Episode as Model<EpisodeDocument>) ||
  model<EpisodeDocument>("Episode", episodeSchema);
