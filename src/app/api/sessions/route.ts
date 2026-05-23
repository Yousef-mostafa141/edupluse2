import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth-helper";

export async function GET(request: Request) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sessions = await db.studySession.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(sessions);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { subject, duration, date, focusLevel } = body;

    if (!subject || !duration || !date || focusLevel === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const session = await db.studySession.create({
      data: {
        userId: user.userId,
        subject,
        duration: parseInt(duration),
        date,
        focusLevel: parseInt(focusLevel),
      },
    });

    // Add XP based on study duration: 1 XP per 10 mins studied (minimum 1 XP)
    const points = Math.max(1, Math.round(parseInt(duration) / 10));
    await db.user.update({
      where: { id: user.userId },
      data: {
        xp: { increment: points },
      },
    });

    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json({ error: "Failed to log study session" }, { status: 500 });
  }
}
