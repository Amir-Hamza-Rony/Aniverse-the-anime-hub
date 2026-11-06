import mongoose, { Schema, model, Model, Document } from "mongoose";
import { StreamingActivityDocument } from "@/types";

const streamingActivitySchema = new Schema<StreamingActivityDocument, Model<StreamingActivityDocument>>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", default: undefined },
    anime: { type: Schema.Types.ObjectId, ref: "Anime", required: true, index: true },
    episode: { type: Schema.Types.ObjectId, ref: "Episode", required: true, index: true },
    server: { type: String, default: "" },
    quality: { type: String, default: "" },
    playedAt: { type: Date, default: Date.now, index: true },
    durationWatched: { type: Number, default: undefined },
  },
  { timestamps: true },
);

streamingActivitySchema.index({ playedAt: -1 });
streamingActivitySchema.index({ anime: 1, playedAt: -1 });
streamingActivitySchema.index({ episode: 1, playedAt: -1 });

export const StreamingActivity =
  (mongoose.models.StreamingActivity as Model<StreamingActivityDocument>) ||
  model<StreamingActivityDocument>("StreamingActivity", streamingActivitySchema);
