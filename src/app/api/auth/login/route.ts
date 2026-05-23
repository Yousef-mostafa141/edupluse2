import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";

function getDateWithoutTime(date: Date): Date {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Update streak: increment if logged in yesterday, reset to 1 if not consecutive
    const today = getDateWithoutTime(new Date());
    let updatedStreak = user.streak;
    
    if (user.lastActiveDate) {
      const lastActiveDate = getDateWithoutTime(new Date(user.lastActiveDate));
      const dayDifference = Math.floor((today.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDifference === 1) {
        // Logged in yesterday, increment streak
        updatedStreak += 1;
      } else if (dayDifference > 1) {
        // Streak broken, reset to 1
        updatedStreak = 1;
      }
      // If dayDifference === 0 (same day), keep streak as is
    } else {
      // First login ever
      updatedStreak = 1;
    }

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        lastActiveDate: today,
        streak: updatedStreak,
      },
    });

    const token = signToken({
      userId: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
      fullName: updatedUser.fullName,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        fullName: updatedUser.fullName,
        nickname: updatedUser.nickname,
        email: updatedUser.email,
        role: updatedUser.role,
        grade: updatedUser.grade,
        xp: updatedUser.xp,
        streak: updatedUser.streak,
        theme: updatedUser.theme,
        locale: updatedUser.locale,
        birthDate: updatedUser.birthDate,
        aiPersonality: updatedUser.aiPersonality,
      },
    });

    response.cookies.set("edupulse-session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 604800, // 7 days
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
