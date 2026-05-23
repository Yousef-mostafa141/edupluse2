import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth-helper";

export async function GET(request: Request) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const goals = await db.goal.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(goals);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch goals" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, targetGrade, subject, deadline } = body;

    if (!title || targetGrade === undefined || !subject || !deadline) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const goal = await db.goal.create({
      data: {
        userId: user.userId,
        title,
        targetGrade: parseFloat(targetGrade),
        subject,
        deadline,
        progress: 0,
      },
    });

    return NextResponse.json(goal);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create goal" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, title, targetGrade, subject, deadline, progress } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing goal ID" }, { status: 400 });
    }

    // Verify ownership
    const existing = await db.goal.findFirst({
      where: { id, userId: user.userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    const updated = await db.goal.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existing.title,
        targetGrade: targetGrade !== undefined ? parseFloat(targetGrade) : existing.targetGrade,
        subject: subject !== undefined ? subject : existing.subject,
        deadline: deadline !== undefined ? deadline : existing.deadline,
        progress: progress !== undefined ? parseFloat(progress) : existing.progress,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update goal" }, { status: 500 });
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
      return NextResponse.json({ error: "Missing goal ID" }, { status: 400 });
    }

    // Verify ownership
    const existing = await db.goal.findFirst({
      where: { id, userId: user.userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    await db.goal.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete goal" }, { status: 500 });
  }
}
