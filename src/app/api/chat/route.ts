import { NextResponse } from "next/server";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!message || !message.trim()) {
      return NextResponse.json({
        text: "Please type a message before sending.",
      }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({
        text: "Gemini API key is not configured in the backend environment variables. Please provide a GEMINI_API_KEY in your .env file to enable the live tutor assistant.",
      });
    }

    // Call official Google AI Studio Gemini API Endpoint
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: message,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    });

    const payload = await response.json();

    if (!response.ok) {
      console.error("Gemini API error payload:", payload);
      return NextResponse.json({
        text: `Gemini API returned an error: ${payload.error?.message ?? "Unknown error"}. Please check your key configuration.`,
      });
    }

    const aiText = payload.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiText) {
      return NextResponse.json({
        text: "I received an empty response from the AI model. Please try rephrasing your question.",
      });
    }

    return NextResponse.json({ text: aiText });
  } catch (error: any) {
    console.error("Gemini connection exception:", error);
    return NextResponse.json({
      text: "Failed to connect to Gemini API. Please verify your internet connection or backend configuration.",
    }, { status: 500 });
  }
}
