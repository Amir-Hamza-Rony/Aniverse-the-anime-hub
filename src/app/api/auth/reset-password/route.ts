import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/database/connect";
import { User } from "@/models";
import { validateBody, successResponse, errorResponse, handleError } from "@/lib/api/handler";
import { resetPasswordSchema } from "@/lib/validation/schemas";
import bcrypt from "bcryptjs";
import { ActivityLog } from "@/models";

export async function POST(request: NextRequest) {
  try {
    const validation = await validateBody(request, resetPasswordSchema);
    if ("error" in validation) return validation.error;

    const { token, password } = validation.data;

    await dbConnect();

    const hashedToken = require("crypto")
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      return errorResponse("Invalid or expired reset token", 400);
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    await ActivityLog.create({
      userId: user._id,
      action: "PASSWORD_RESET_COMPLETE",
      entity: "User",
      entityId: user._id.toString(),
    });

    return successResponse({}, "Password reset successful");
  } catch (err) {
    return handleError(err);
  }
}
