import mongoose, { Schema, model, Model, Document } from "mongoose";
import bcrypt from "bcryptjs";

const bcryptjs = bcrypt as any;
import { UserDocument, Role } from "@/types";

export interface UserModel extends Model<UserDocument> {}

const userSchema = new Schema<UserDocument, UserModel>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: { type: String, required: true },
    avatar: { type: String, default: undefined },
    role: {
      type: String,
      enum: ["USER", "ADMIN", "SUPER_ADMIN"],
      default: "USER",
    },
    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, default: undefined },
    emailVerificationExpires: { type: Date, default: undefined },
    passwordResetToken: { type: String, default: undefined },
    passwordResetExpires: { type: Date, default: undefined },
    lastLoginAt: { type: Date, default: undefined },
    watchlist: [{ type: Schema.Types.ObjectId, ref: "Anime" }],
    favorites: [{ type: Schema.Types.ObjectId, ref: "Anime" }],
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcryptjs.genSalt(12);
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcryptjs.compare(candidatePassword, this.password);
};

// Indexes for query performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });

export const User =
  (mongoose.models.User as UserModel) || model<UserDocument, UserModel>("User");
