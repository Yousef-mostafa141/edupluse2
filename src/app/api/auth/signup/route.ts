import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";
import { APIResponse, sanitizeEmail, validateRequired } from "@/lib/api-utils";

const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, nickname, birthDate, grade, email, password } = body;

    const missingField = validateRequired(body, ["fullName", "email", "password"]);
    if (missingField) {
      return APIResponse.error(missingField, 400);
    }

    const normalizedEmail = sanitizeEmail(email);
    if (!emailPattern.test(normalizedEmail)) {
      return APIResponse.error("Please provide a valid email address.", 400);
    }

    if (typeof password !== "string" || password.length < 8) {
      return APIResponse.error("Password must be at least 8 characters.", 400);
    }

    const existingUser = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return APIResponse.error("Email already registered.", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    let role = "student";
    const emailLower = normalizedEmail;
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
        email: normalizedEmail,
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
    if (error?.code === "P2002") {
      return APIResponse.error("Email already registered.", 400);
    }
    return APIResponse.serverError();
  }
}
