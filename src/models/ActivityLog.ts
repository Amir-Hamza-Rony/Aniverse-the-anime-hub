import mongoose, { Schema, model, Model, Document } from "mongoose";
import { ActivityLogDocument } from "@/types";

const activityLogSchema = new Schema<ActivityLogDocument, Model<ActivityLogDocument>>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", default: undefined },
    action: { type: String, required: true },
    entity: { type: String, required: true },
    entityId: { type: String, default: undefined },
    metadata: { type: Schema.Types.Mixed, default: undefined },
    ipAddress: { type: String, default: undefined },
  },
  { timestamps: true },
);

activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ userId: 1, createdAt: -1 });
activityLogSchema.index({ action: 1 });

export const ActivityLog =
  (mongoose.models.ActivityLog as Model<ActivityLogDocument>) ||
  model<ActivityLogDocument>("ActivityLog", activityLogSchema);
