import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { signToken } from "@/lib/jwt";

function getAppUrl(request: Request) {
  const requestUrl = new URL(request.url);
  return process.env.APP_URL?.replace(/\/$/, "") || requestUrl.origin;
}

function getRedirectUri(request: Request) {
  return `${getAppUrl(request)}/api/auth/google/callback`;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const error = url.searchParams.get("error");
    if (error) {
      return NextResponse.redirect(`${getAppUrl(request)}/login?error=${encodeURIComponent(error)}`);
    }

    const code = url.searchParams.get("code");
    if (!code) {
      return NextResponse.redirect(`${getAppUrl(request)}/login?error=${encodeURIComponent("Google OAuth failed")}`);
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = getRedirectUri(request);

    if (!clientId || !clientSecret) {
      console.error("Google OAuth is not configured properly.");
      return NextResponse.redirect(`${getAppUrl(request)}/login?error=${encodeURIComponent("Google login is unavailable")}`);
    }

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenJson = await tokenResponse.json();
    if (!tokenResponse.ok) {
      console.error("Google token exchange failed", tokenJson);
      return NextResponse.redirect(`${getAppUrl(request)}/login?error=${encodeURIComponent(tokenJson.error_description || tokenJson.error || "Google login failed")}`);
    }

    const idToken = tokenJson.id_token;
    if (!idToken) {
      console.error("Google ID token missing from token exchange.");
      return NextResponse.redirect(`${getAppUrl(request)}/login?error=${encodeURIComponent("Google login failed")}`);
    }

    const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
    const payload = await verifyRes.json();
    if (!verifyRes.ok) {
      console.error("Google ID token verification failed", payload);
      return NextResponse.redirect(`${getAppUrl(request)}/login?error=${encodeURIComponent("Unable to verify Google login")}`);
    }

    const expectedAud = process.env.GOOGLE_CLIENT_ID;
    if (!expectedAud || payload.aud !== expectedAud) {
      console.warn("Google token audience mismatch", { aud: payload.aud, expectedAud });
      return NextResponse.redirect(`${getAppUrl(request)}/login?error=${encodeURIComponent("Invalid Google token audience")}`);
    }

    if (payload.email_verified === "false" || payload.email_verified === false) {
      return NextResponse.redirect(`${getAppUrl(request)}/login?error=${encodeURIComponent("Please use a verified Google email address.")}`);
    }

    const email = String(payload.email || "").toLowerCase().trim();
    if (!email) {
      return NextResponse.redirect(`${getAppUrl(request)}/login?error=${encodeURIComponent("Google account missing email")}`);
    }

    let user = await db.user.findUnique({ where: { email } });
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const todayStr = today.toISOString();

    if (!user) {
      user = await db.user.create({
        data: {
          fullName: String(payload.name || "Google User"),
          nickname: String(payload.given_name || payload.name?.split(" ")[0] || "Student"),
          email,
          password: null,
          role: "student",
          avatarUrl: String(payload.picture || ""),
          xp: 0,
          streak: 0,
          lastActiveDate: null,
          theme: "dark",
          locale: "en",
        },
      });
    } else {
      const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
      let updatedStreak = user.streak;

      if (lastActive) {
        const diffDays = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          updatedStreak += 1;
        } else if (diffDays > 1) {
          updatedStreak = 1;
        }
      } else {
        updatedStreak = 1;
      }

      user = await db.user.update({
        where: { id: user.id },
        data: {
          avatarUrl: user.avatarUrl || String(payload.picture || ""),
          streak: updatedStreak,
          lastActiveDate: today,
        },
      });
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    });

    const response = NextResponse.redirect(`${getAppUrl(request)}/dashboard`);
    response.cookies.set("edupulse-session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 604800,
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Google callback error:", error);
    return NextResponse.redirect(`/login?error=${encodeURIComponent("Google login internal error")}`);
  }
}
