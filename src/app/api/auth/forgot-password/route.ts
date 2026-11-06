import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/database/connect";
import { User } from "@/models";
import { validateBody, successResponse, errorResponse, handleError } from "@/lib/api/handler";
import { forgotPasswordSchema } from "@/lib/validation/schemas";
import { ActivityLog } from "@/models";

export async function POST(request: NextRequest) {
  try {
    const validation = await validateBody(request, forgotPasswordSchema);
    if ("error" in validation) return validation.error;

    const { email } = validation.data;

    await dbConnect();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal whether email exists
      return successResponse({}, "If an account exists, a reset link has been sent");
    }

    // Generate reset token
    const resetToken = require("crypto").randomBytes(32).toString("hex");
    user.passwordResetToken = require("crypto")
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    await user.save();

    await ActivityLog.create({
      userId: user._id,
      action: "PASSWORD_RESET_REQUEST",
      entity: "User",
      entityId: user._id.toString(),
    });

    // In production, send email here with the reset token link
    return successResponse(
      { token: process.env.NODE_ENV === "development" ? resetToken : undefined },
      "If an account exists, a reset link has been sent",
    );
  } catch (err) {
    return handleError(err);
  }
}
