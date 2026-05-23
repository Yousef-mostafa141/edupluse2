import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth-helper";

export async function GET(request: Request) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const announcements = await db.notification.findMany({
      where: { userId: "global" }, // We store school global announcements under userId = "global"
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(announcements);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = getAuthenticatedUser(request);
  if (!user || (user.role !== "admin" && user.role !== "teacher")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const announcement = await db.notification.create({
      data: {
        userId: "global", // Global notice
        title,
        content,
        read: false,
      },
    });

    return NextResponse.json(announcement);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const user = getAuthenticatedUser(request);
  if (!user || (user.role !== "admin" && user.role !== "teacher")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing announcement ID" }, { status: 400 });
    }

    await db.notification.delete({
      where: { id, userId: "global" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete announcement" }, { status: 500 });
  }
}
