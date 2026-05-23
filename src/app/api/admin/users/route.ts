import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth-helper";
import bcrypt from "bcryptjs";

export async function GET(request: Request) {
  const user = getAuthenticatedUser(request);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const users = await db.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        fullName: true,
        nickname: true,
        role: true,
        grade: true,
        xp: true,
        streak: true,
        createdAt: true,
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = getAuthenticatedUser(request);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { fullName, email, password, role, grade } = await request.json();

    if (!fullName || !email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.user.create({
      data: {
        fullName,
        nickname: fullName.split(" ")[0],
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role,
        grade: grade || "N/A",
      },
    });

    return NextResponse.json({
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const user = getAuthenticatedUser(request);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id, fullName, email, role, grade, xp, streak } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    const existing = await db.user.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updated = await db.user.update({
      where: { id },
      data: {
        fullName: fullName !== undefined ? fullName : existing.fullName,
        email: email !== undefined ? email.toLowerCase().trim() : existing.email,
        role: role !== undefined ? role : existing.role,
        grade: grade !== undefined ? grade : existing.grade,
        xp: xp !== undefined ? parseInt(xp) : existing.xp,
        streak: streak !== undefined ? parseInt(streak) : existing.streak,
      },
    });

    return NextResponse.json({
      id: updated.id,
      fullName: updated.fullName,
      email: updated.email,
      role: updated.role,
      grade: updated.grade,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
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
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    if (id === user.userId) {
      return NextResponse.json({ error: "Cannot delete your own admin account" }, { status: 400 });
    }

    await db.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
