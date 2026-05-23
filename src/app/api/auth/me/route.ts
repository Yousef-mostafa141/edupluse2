import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";

export async function GET(request: Request) {
  try {
    const cookiesHeader = request.headers.get("cookie") || "";
    
    // Parse cookies to find edupulse-session
    const match = cookiesHeader.match(/edupulse-session=([^;]+)/);
    const token = match ? match[1] : null;

    if (!token) {
      return NextResponse.json({ authenticated: false, error: "No session found" }, { status: 401 });
    }

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json({ authenticated: false, error: "Invalid session" }, { status: 401 });
    }

    // Fetch complete user profile and related progress data
    const user = await db.user.findUnique({
      where: { id: payload.userId },
      include: {
        grades: true,
        tasks: true,
        goals: true,
        sessions: true,
        files: true,
      },
    });

    if (!user) {
      return NextResponse.json({ authenticated: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        nickname: user.nickname,
        role: user.role,
        grade: user.grade,
        xp: user.xp,
        streak: user.streak,
        theme: user.theme,
        locale: user.locale,
        birthDate: user.birthDate,
        avatarUrl: user.avatarUrl,
        aiPersonality: user.aiPersonality,
      },
      progress: {
        grades: user.grades,
        tasks: user.tasks,
        goals: user.goals,
        sessions: user.sessions,
        files: user.files,
      },
    });
  } catch (error: any) {
    console.error("Auth me error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
