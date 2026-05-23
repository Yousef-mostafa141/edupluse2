import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth-helper";

export async function GET(request: Request) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const tasks = await db.task.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, subject, dueDate, priority } = body;

    if (!title || !subject || !dueDate || !priority) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const task = await db.task.create({
      data: {
        userId: user.userId,
        title,
        description,
        subject,
        dueDate,
        priority,
        completed: false,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, title, description, subject, dueDate, priority, completed } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing task ID" }, { status: 400 });
    }

    // Verify task ownership
    const existing = await db.task.findFirst({
      where: { id, userId: user.userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const updated = await db.task.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existing.title,
        description: description !== undefined ? description : existing.description,
        subject: subject !== undefined ? subject : existing.subject,
        dueDate: dueDate !== undefined ? dueDate : existing.dueDate,
        priority: priority !== undefined ? priority : existing.priority,
        completed: completed !== undefined ? completed : existing.completed,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
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
      return NextResponse.json({ error: "Missing task ID" }, { status: 400 });
    }

    // Verify ownership
    const existing = await db.task.findFirst({
      where: { id, userId: user.userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    await db.task.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
