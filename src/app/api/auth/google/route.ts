import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const appUrl = process.env.APP_URL?.replace(/\/$/, "") || new URL(request.url).origin;

  if (!clientId) {
    console.error("Google OAuth configuration missing GOOGLE_CLIENT_ID.");
    return NextResponse.redirect(`${appUrl}/login?error=${encodeURIComponent("Google login is unavailable.")}`);
  }

  const redirectUri = `${appUrl}/api/auth/google/callback`;
  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "select_account");

  return NextResponse.redirect(authUrl.toString());
}
