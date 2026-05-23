import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth-helper";

export async function GET(request: Request) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const courses = await db.course.findMany({
      include: {
        teacher: {
          select: { fullName: true, email: true },
        },
      },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = getAuthenticatedUser(request);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { name, description, teacherId } = await request.json();

    if (!name || !teacherId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const course = await db.course.create({
      data: {
        name,
        description,
        teacherId,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const user = getAuthenticatedUser(request);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing course ID" }, { status: 400 });
    }

    await db.course.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
  }
}
