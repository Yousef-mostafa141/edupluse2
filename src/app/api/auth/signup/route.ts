import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, nickname, birthDate, grade, email, password } = body;

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Determine role: default is student, unless special email prefix is used
    let role = "student";
    const emailLower = email.toLowerCase();
    if (emailLower.startsWith("admin")) {
      role = "admin";
    } else if (emailLower.startsWith("teacher")) {
      role = "teacher";
    } else if (emailLower.startsWith("parent")) {
      role = "parent";
    }

    const user = await db.user.create({
      data: {
        fullName,
        nickname: nickname || fullName,
        birthDate: birthDate || null,
        grade: grade || "N/A",
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role,
        xp: 0,
        streak: 0,
      },
    });

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
      },
    });

    // Set cookie
    response.cookies.set("edupulse-session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 604800, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
