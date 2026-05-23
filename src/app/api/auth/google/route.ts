import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { signToken } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: "Missing Google ID token" }, { status: 400 });
    }

    // Verify token with Google API endpoint (Secure & dependency-free method)
    const verificationUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`;
    const verifyRes = await fetch(verificationUrl);
    
    if (!verifyRes.ok) {
      return NextResponse.json({ error: "Invalid Google token" }, { status: 400 });
    }

    const payload = await verifyRes.json();
    const { email, name, picture } = payload;

    if (!email) {
      return NextResponse.json({ error: "Google account missing email" }, { status: 400 });
    }

    let user = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      // Create a new user with Google Auth
      user = await db.user.create({
        data: {
          fullName: name || "Google User",
          nickname: name ? name.split(" ")[0] : "GoogleUser",
          email: email.toLowerCase().trim(),
          password: null, // Logged in via OAuth
          role: "student", // Default role
          avatarUrl: picture || null,
          grade: "Grade 11",
          xp: 0,
          streak: 1,
          lastActive: new Date().toISOString().slice(0, 10),
        },
      });
    } else {
      // Update existing user avatar if empty and set lastActive/streak
      const today = new Date().toISOString().slice(0, 10);
      let updatedStreak = user.streak;
      
      if (user.lastActive) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().slice(0, 10);
        
        if (user.lastActive === yesterdayStr) {
          updatedStreak += 1;
        } else if (user.lastActive !== today) {
          updatedStreak = 1;
        }
      } else {
        updatedStreak = 1;
      }

      user = await db.user.update({
        where: { id: user.id },
        data: {
          avatarUrl: user.avatarUrl || picture || null,
          lastActive: today,
          streak: updatedStreak,
        },
      });
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        nickname: user.nickname,
        email: user.email,
        role: user.role,
        grade: user.grade,
        xp: user.xp,
        streak: user.streak,
        theme: user.theme,
        locale: user.locale,
        birthDate: user.birthDate,
        aiPersonality: user.aiPersonality,
      },
    });

    response.cookies.set("edupulse-session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 604800, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Google login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
