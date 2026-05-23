import { NextResponse } from "next/server";

export class APIResponse {
  static success(data: any, statusCode = 200) {
    return NextResponse.json(data, { status: statusCode });
  }

  static error(message: string, statusCode = 400) {
    return NextResponse.json({ error: message }, { status: statusCode });
  }

  static unauthorized() {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  static notFound() {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  static serverError(message = "Internal server error") {
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export function validateRequired(obj: Record<string, any>, fields: string[]): string | null {
  for (const field of fields) {
    if (!obj[field]) {
      return `Missing required field: ${field}`;
    }
  }
  return null;
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}
