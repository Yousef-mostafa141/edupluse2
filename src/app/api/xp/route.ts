import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth-helper";

export async function POST(request: Request) {
  const user = getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const amount = Number(body?.amount) || 0;
    if (amount <= 0) return NextResponse.json({ error: "Invalid amount" }, { status: 400 });

    const updated = await db.user.update({
      where: { id: user.userId },
      data: { xp: { increment: amount } },
    });

    return NextResponse.json({ success: true, xp: updated.xp });
  } catch (err) {
    console.error("XP increment error:", err);
    return NextResponse.json({ error: "Failed to increment XP" }, { status: 500 });
  }
}
