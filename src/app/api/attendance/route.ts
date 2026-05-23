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

    // If teacher/admin fetches specific student or all
    if (user.role === "teacher" || user.role === "admin") {
      if (studentId) {
        const attendance = await db.attendance.findMany({
          where: { studentId },
          orderBy: { date: "desc" },
        });
        return NextResponse.json(attendance);
      }
      const attendance = await db.attendance.findMany({
        orderBy: { date: "desc" },
      });
      return NextResponse.json(attendance);
    }

    // Default student views their own attendance
    const attendance = await db.attendance.findMany({
      where: { studentId: user.userId },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(attendance);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch attendance" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = getAuthenticatedUser(request);
  if (!user || (user.role !== "admin" && user.role !== "teacher")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { studentId, date, status } = body; // status = "present" | "absent" | "late"

    if (!studentId || !date || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Upsert attendance for that student on that date
    const existing = await db.attendance.findFirst({
      where: { studentId, date },
    });

    let record;
    if (existing) {
      record = await db.attendance.update({
        where: { id: existing.id },
        data: { status },
      });
    } else {
      record = await db.attendance.create({
        data: { studentId, date, status },
      });
    }

    return NextResponse.json(record);
  } catch (error) {
    return NextResponse.json({ error: "Failed to log attendance" }, { status: 500 });
  }
}
