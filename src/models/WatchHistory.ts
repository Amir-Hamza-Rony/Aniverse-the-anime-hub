import mongoose, { Schema, model, Model, Document } from "mongoose";
import { WatchHistoryDocument } from "@/types";

const watchHistorySchema = new Schema<WatchHistoryDocument, Model<WatchHistoryDocument>>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    anime: { type: Schema.Types.ObjectId, ref: "Anime", required: true, index: true },
    episode: { type: Schema.Types.ObjectId, ref: "Episode", required: true, index: true },
    watchedAt: { type: Date, default: Date.now },
    progress: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

watchHistorySchema.index({ user: 1, watchedAt: -1 });
watchHistorySchema.index({ user: 1, anime: 1, episode: 1 });

export const WatchHistory =
  (mongoose.models.WatchHistory as Model<WatchHistoryDocument>) ||
  model<WatchHistoryDocument>("WatchHistory", watchHistorySchema);
