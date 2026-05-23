import { NextResponse } from "next/server";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-pro-1.0";

function extractResponseText(data: any) {
  if (!data) return null;
  if (typeof data === "string") return data;
  if (data.candidates?.[0]?.content && typeof data.candidates[0].content[0]?.text === "string") {
    return data.candidates[0].content[0].text;
  }
  if (data.output?.[0]?.content && typeof data.output[0].content[0]?.text === "string") {
    return data.output[0].content[0].text;
  }
  if (data.response?.output?.[0]?.content && typeof data.response.output[0].content[0]?.text === "string") {
    return data.response.output[0].content[0].text;
  }
  return null;
}

export async function POST(request: Request) {
  const { message } = await request.json();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      text: "Gemini API key is not configured. Using offline AI mode for now. Ask any study question and the assistant will respond with local guidance.",
    });
  }

  try {
    const response = await fetch(`https://gemini.googleapis.com/v1/models/${GEMINI_MODEL}:generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: {
          text: message,
        },
        temperature: 0.7,
        maxOutputTokens: 512,
      }),
    });

    const payload = await response.json();

    if (!response.ok) {
      return NextResponse.json({
        text: payload.error?.message ?? "Gemini returned an error.",
      });
    }

    const text = extractResponseText(payload) ?? "Gemini did not return a valid response.";
    return NextResponse.json({ text });
  } catch (error) {
    return NextResponse.json({
      text: "Failed to connect to Gemini. Please verify your API key and network.",
    });
  }
}
