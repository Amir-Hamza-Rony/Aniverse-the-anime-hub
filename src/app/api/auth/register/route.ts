import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/database/connect";
import { User } from "@/models";
import { validateBody, successResponse, errorResponse, handleError } from "@/lib/api/handler";
import { registerSchema } from "@/lib/validation/schemas";
import bcrypt from "bcryptjs";
import { signAccessToken, signRefreshToken, setAuthCookies } from "@/lib/auth";
import { ActivityLog } from "@/models";

export async function POST(request: NextRequest) {
  try {
    const validation = await validateBody(request, registerSchema);
    if ("error" in validation) return validation.error;

    const { name, email, password } = validation.data;

    await dbConnect();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return errorResponse("Email already registered", 409);
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: "USER",
    });

    const sessionUser = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const accessToken = signAccessToken(sessionUser);
    const refreshToken = signRefreshToken(sessionUser);
    setAuthCookies(accessToken, refreshToken);

    await ActivityLog.create({
      userId: user._id,
      action: "USER_REGISTER",
      entity: "User",
      entityId: user._id.toString(),
    });

    return successResponse(
      { user: { id: user._id, name: user.name, email: user.email, role: user.role } },
      "Registration successful",
      201,
    );
  } catch (err) {
    return handleError(err);
  }
}
