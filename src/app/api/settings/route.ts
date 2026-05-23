import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth-helper";
import bcrypt from "bcryptjs";

export async function PUT(request: Request) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { 
      fullName, nickname, birthDate, grade, 
      theme, locale, aiPersonality,
      currentPassword, newPassword 
    } = body;

    // Fetch user details from DB to verify password or check details
    const dbUser = await db.user.findUnique({
      where: { id: user.userId },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updateData: any = {};

    // Handle Profile details
    if (fullName !== undefined) updateData.fullName = fullName;
    if (nickname !== undefined) updateData.nickname = nickname;
    if (birthDate !== undefined) updateData.birthDate = birthDate;
    if (grade !== undefined) updateData.grade = grade;

    // Handle preferences
    if (theme !== undefined) updateData.theme = theme;
    if (locale !== undefined) updateData.locale = locale;
    if (aiPersonality !== undefined) updateData.aiPersonality = aiPersonality;

    // Handle password change
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Current password is required to set a new one" }, { status: 400 });
      }

      if (!dbUser.password) {
        return NextResponse.json({ error: "Account logged in via Google. Cannot change password." }, { status: 400 });
      }

      const isMatch = await bcrypt.compare(currentPassword, dbUser.password);
      if (!isMatch) {
        return NextResponse.json({ error: "Incorrect current password" }, { status: 400 });
      }

      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    const updated = await db.user.update({
      where: { id: user.userId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updated.id,
        fullName: updated.fullName,
        nickname: updated.nickname,
        email: updated.email,
        role: updated.role,
        grade: updated.grade,
        xp: updated.xp,
        streak: updated.streak,
        theme: updated.theme,
        locale: updated.locale,
        birthDate: updated.birthDate,
        aiPersonality: updated.aiPersonality,
      }
    });
  } catch (error: any) {
    console.error("Settings update error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
