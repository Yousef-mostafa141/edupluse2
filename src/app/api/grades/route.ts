import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth-helper";

export async function GET(request: Request) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");

    // If teacher/admin asks for a specific student's grades
    if (studentId && (user.role === "teacher" || user.role === "admin")) {
      const grades = await db.grade.findMany({
        where: { userId: studentId },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(grades);
    }

    // Default to logging in user's own grades
    const grades = await db.grade.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(grades);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch grades" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { subject, score, date, studentId } = body;

    if (!subject || score === undefined || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Determine whose grade is being added
    let targetUserId = user.userId;
    if (studentId && (user.role === "teacher" || user.role === "admin")) {
      targetUserId = studentId;
    }

    const grade = await db.grade.create({
      data: {
        userId: targetUserId,
        subject,
        score: parseFloat(score),
        date,
      },
    });

    // Award XP if student completes a grade
    const points = Math.max(5, Math.round(parseFloat(score) / 10));
    await db.user.update({
      where: { id: targetUserId },
      data: {
        xp: { increment: points },
      },
    });

    return NextResponse.json(grade);
  } catch (error) {
    return NextResponse.json({ error: "Failed to save grade" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing grade ID" }, { status: 400 });
    }

    const existing = await db.grade.findFirst({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Grade not found" }, { status: 404 });
    }

    // Student can delete their own grades, teacher/admin can delete any
    if (existing.userId !== user.userId && user.role !== "teacher" && user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.grade.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete grade" }, { status: 500 });
  }
}
