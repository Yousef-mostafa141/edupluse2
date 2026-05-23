import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth-helper";
import fs from "fs/promises";
import path from "path";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";

export async function GET(request: Request) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const files = await db.file.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(files);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Create upload directory if it does not exist
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    
    // Sanitize file name and create dynamic paths
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFileName = `${Date.now()}-${sanitizedName}`;
    const filePath = `/uploads/${uniqueFileName}`;
    const fullPath = path.join(uploadDir, uniqueFileName);

    // Save file locally
    await fs.writeFile(fullPath, buffer);

    // Try to extract text if it is text, otherwise generate smart summary based on filename
    let fileText = "";
    if (file.type === "text/plain" || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
      fileText = buffer.toString("utf-8").slice(0, 3000); // Grab first 3000 chars
    }

    // Call Gemini to generate a real study summary
    let aiSummary = `This is a summary of ${file.name}.`;
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const promptText = fileText 
          ? `You are an expert tutor. Please summarize the following study material:\n\n${fileText}`
          : `You are an expert tutor. A student in ${user.grade || "Grade 11"} uploaded a study file named "${file.name}". Please generate a comprehensive, structured study summary and key concepts list for this topic so they can learn it.`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: promptText,
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (response.ok) {
          const payload = await response.json();
          if (payload.candidates?.[0]?.content?.parts?.[0]?.text) {
            aiSummary = payload.candidates[0].content.parts[0].text;
          }
        }
      } catch (err) {
        console.error("Gemini failed during upload analysis:", err);
      }
    }

    // Save to Database
    const savedFile = await db.file.create({
      data: {
        userId: user.userId,
        fileName: file.name,
        filePath,
        fileSize: file.size,
        fileType: file.type || "application/octet-stream",
        aiSummary,
      },
    });

    // Reward XP for uploading study files!
    await db.user.update({
      where: { id: user.userId },
      data: {
        xp: { increment: 20 },
      },
    });

    return NextResponse.json(savedFile);
  } catch (error: any) {
    console.error("File upload API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
