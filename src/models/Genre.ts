import mongoose, { Schema, model, Model, Document } from "mongoose";
import { GenreDocument } from "@/types";

const genreSchema = new Schema<GenreDocument, Model<GenreDocument>>(
  {
    name: { type: String, required: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: "" },
  },
  { timestamps: true },
);

genreSchema.index({ slug: 1 }, { unique: true });

export const Genre =
  (mongoose.models.Genre as Model<GenreDocument>) ||
  model<GenreDocument>("Genre", genreSchema);
