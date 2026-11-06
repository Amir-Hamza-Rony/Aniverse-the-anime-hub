import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { dbConnect } from "@/lib/database/connect";
import { User } from "@/models";
import { validateBody, successResponse, errorResponse, handleError } from "@/lib/api/handler";
import { loginSchema } from "@/lib/validation/schemas";
import bcrypt from "bcryptjs";
import { signAccessToken, signRefreshToken, setAuthCookies } from "@/lib/auth";
import { ActivityLog } from "@/models";

export async function POST(request: NextRequest) {
  try {
    const validation = await validateBody(request, loginSchema);
    if ("error" in validation) return validation.error;

    const { email, password } = validation.data;

    await dbConnect();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return errorResponse("Invalid email or password", 401);
    }

    if (!user.isActive) {
      return errorResponse("Account is deactivated", 403);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorResponse("Invalid email or password", 401);
    }

    user.lastLoginAt = new Date();
    await user.save();

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
      action: "USER_LOGIN",
      entity: "User",
      entityId: user._id.toString(),
    });

    return successResponse(
      { user: { id: user._id, name: user.name, email: user.email, role: user.role } },
      "Login successful",
    );
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE() {
  const cookieStore = cookies();
  cookieStore.set("aniverse_token", "", { path: "/", maxAge: 0 });
  cookieStore.set("aniverse_refresh_token", "", { path: "/", maxAge: 0 });
  return successResponse({}, "Logged out");
}
