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
    const recipientId = searchParams.get("recipientId");

    if (!recipientId) {
      // Return a list of other active users to message (contact list)
      const contacts = await db.user.findMany({
        where: {
          id: { not: user.userId },
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
        },
      });
      return NextResponse.json(contacts);
    }

    // Fetch conversation between the two users
    const messages = await db.message.findMany({
      where: {
        OR: [
          { senderId: user.userId, recipientId },
          { senderId: recipientId, recipientId: user.userId },
        ],
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { recipientId, content } = await request.json();

    if (!recipientId || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const message = await db.message.create({
      data: {
        senderId: user.userId,
        recipientId,
        content,
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
