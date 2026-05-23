# EduPulse LMS - Step-by-Step Implementation Plan

## ⚠️ CRITICAL: Before You Start
1. Ensure `.env.local` is properly configured (copy from `.env.example`)
2. Run `npx prisma migrate dev` to create/update database
3. Run `npx prisma generate` to regenerate Prisma client
4. Test with `npm run dev` to ensure no build errors

---

## 🔴 CRITICAL FEATURE 1: Google OAuth (HIGH PRIORITY)
**Est. Time**: 2-3 hours | **Impact**: User acquisition blocker

### Step 1.1: Get Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URIs:
   - http://localhost:3000/api/auth/google/callback (dev)
   - https://yourdomain.com/api/auth/google/callback (prod)
6. Copy Client ID and Client Secret

### Step 1.2: Update Environment Variables
```bash
# Add to .env.local
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<CLIENT_ID>
GOOGLE_CLIENT_SECRET=<CLIENT_SECRET>
```

### Step 1.3: Install Required Package
```bash
npm install google-auth-library
```

### Step 1.4: Implement Backend Endpoint
Create file: `src/app/api/auth/google/route.ts`

```typescript
import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { db } from "@/lib/db";
import { signToken } from "@/lib/jwt";

const oauth2Client = new OAuth2Client(
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { idToken } = body;

    // Verify token
    const ticket = await oauth2Client.verifyIdToken({
      idToken,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    const { email, name, picture } = payload;

    // Find or create user
    let user = await db.user.findUnique({
      where: { email: email as string },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          email: email as string,
          fullName: name || "Student",
          nickname: name?.split(" ")[0] || "Student",
          avatarUrl: picture,
          role: "student",
          password: null, // No password for OAuth users
        },
      });
    } else if (!user.avatarUrl) {
      // Update avatar if missing
      user = await db.user.update({
        where: { email: email as string },
        data: { avatarUrl: picture },
      });
    }

    // Issue JWT
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        nickname: user.nickname,
        role: user.role,
      },
    });

    response.cookies.set("edupulse-session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 604800,
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error: any) {
    console.error("Google OAuth error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
```

### Step 1.5: Implement Frontend Login Handler
Update `src/app/login/page.tsx`:
```typescript
import { GoogleLogin } from "@react-oauth/google";

// Inside LoginPage component:
const handleGoogleSuccess = async (credentialResponse: any) => {
  setIsLoading(true);
  try {
    const res = await fetch("/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: credentialResponse.credential }),
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      setError("Google login failed");
    }
  } catch (err) {
    setError("Error during login");
  }
  setIsLoading(false);
};

return (
  <GoogleLogin
    onSuccess={handleGoogleSuccess}
    onError={() => setError("Google login failed")}
    text="signin_with"
  />
);
```

### Step 1.6: Test
1. Run `npm run dev`
2. Click "Continue with Google" on login page
3. Complete Google login flow
4. Verify you're redirected to dashboard
5. Check that user is created in database

---

## 🔴 CRITICAL FEATURE 2: File Upload (HIGH PRIORITY)
**Est. Time**: 2-3 hours | **Impact**: Core feature

### Step 2.1: Choose Storage Provider

#### Option A: Supabase (RECOMMENDED)
```bash
npm install @supabase/supabase-js
```

Add to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=<your-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

#### Option B: AWS S3
```bash
npm install aws-sdk
```

Add to `.env.local`:
```
AWS_ACCESS_KEY_ID=<key>
AWS_SECRET_ACCESS_KEY=<secret>
AWS_S3_BUCKET=edupulse-files
AWS_REGION=us-east-1
```

### Step 2.2: Create Upload Endpoint

File: `src/app/api/upload/route.ts`

```typescript
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth-helper";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_TYPES = ["application/pdf", "image/png", "image/jpeg"];

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

    // Validate file
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large (max 100MB)" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "File type not allowed" },
        { status: 400 }
      );
    }

    // Upload to Supabase
    const fileName = `${user.userId}/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("student-files")
      .upload(fileName, file);

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("student-files")
      .getPublicUrl(fileName);

    // Save to database
    const dbFile = await db.file.create({
      data: {
        userId: user.userId,
        fileName: file.name,
        filePath: data.path,
        fileSize: file.size,
        fileType: file.type,
      },
    });

    return NextResponse.json({
      success: true,
      file: {
        id: dbFile.id,
        name: dbFile.fileName,
        url: urlData.publicUrl,
        size: dbFile.fileSize,
      },
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
```

### Step 2.3: Create Upload Component

File: `src/components/ui/file-upload.tsx`

```typescript
"use client";

import { useState } from "react";
import { Upload } from "lucide-react";

export function FileUpload({ onUpload }: { onUpload: (file: any) => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Upload failed");
        return;
      }

      const data = await res.json();
      onUpload(data.file);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 px-4 py-3 rounded-lg border border-dashed cursor-pointer hover:bg-white/5">
        <Upload className="w-5 h-5" />
        <span>{isLoading ? "Uploading..." : "Click to upload"}</span>
        <input
          type="file"
          onChange={handleChange}
          disabled={isLoading}
          className="hidden"
        />
      </label>
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
```

### Step 2.4: Test Upload
1. Add `<FileUpload />` to dashboard
2. Select a PDF or image
3. Verify upload completes
4. Check file appears in database
5. Verify file URL is accessible

---

## 🟠 CRITICAL FEATURE 3: AI Chat Integration (MEDIUM PRIORITY)
**Est. Time**: 2-3 hours | **Impact**: Core USP

### Step 3.1: Get Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create API key
3. Add to `.env.local`: `GEMINI_API_KEY=<key>`

### Step 3.2: Install Gemini SDK
```bash
npm install @google/generative-ai
```

### Step 3.3: Create AI Endpoint

File: `src/app/api/ai/chat/route.ts`

```typescript
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-helper";
import { db } from "@/lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { message } = await request.json();

    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: message }],
        },
      ],
    });

    const response = result.response.text();

    // Save to database
    await db.aIInsight.create({
      data: {
        userId: user.userId,
        type: "chat",
        title: "AI Chat",
        content: JSON.stringify({ userMessage: message, aiResponse: response }),
      },
    });

    return NextResponse.json({
      success: true,
      response,
    });
  } catch (error: any) {
    console.error("AI error:", error);
    return NextResponse.json(
      { error: "AI service unavailable" },
      { status: 503 }
    );
  }
}
```

### Step 3.4: Create Chat Component

File: `src/components/ai/chat-box.tsx`

```typescript
"use client";

import { useState } from "react";
import { Send, Loader } from "lucide-react";

export function ChatBox() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
      }
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  return (
    <div className="space-y-4 p-4 rounded-lg border border-[var(--border)]">
      <div className="h-64 overflow-y-auto space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className={`text-sm ${msg.role === "user" ? "text-right" : ""}`}>
            <p className={`inline-block px-3 py-2 rounded-lg max-w-xs ${
              msg.role === "user" ? "bg-accent text-white" : "bg-white/5"
            }`}>
              {msg.content}
            </p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask AI..."
          className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-[var(--border)] outline-none"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="px-4 py-2 rounded-lg bg-accent text-white disabled:opacity-50"
        >
          {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
```

### Step 3.5: Test AI Chat
1. Add `<ChatBox />` to dashboard
2. Send a message to AI
3. Verify response appears
4. Check database for saved interactions

---

## 🟠 CRITICAL FEATURE 4: Notifications (MEDIUM PRIORITY)
**Est. Time**: 1-2 hours | **Impact**: User engagement

### Step 4.1: Create Notification Component

File: `src/components/notification-bell.tsx`

```typescript
"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { useApp } from "@/context/app-context";

export function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useApp();

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchNotifications = async () => {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    };

    fetchNotifications();
    // Poll every 10 seconds (replace with WebSockets for real-time)
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const markAsRead = async (id: string) => {
    await fetch(`/api/notifications/${id}`, { method: "PUT" });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-white/5"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-danger text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-[var(--bg-card)] rounded-lg shadow-lg border border-[var(--border)] z-50">
          <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-sm text-muted">No notifications</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={`p-3 rounded cursor-pointer ${
                    n.read ? "opacity-50" : "bg-accent/10"
                  }`}
                >
                  <p className="font-semibold text-sm">{n.title}</p>
                  <p className="text-sm text-muted">{n.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

### Step 4.2: Create Notifications API

File: `src/app/api/notifications/route.ts`

```typescript
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth-helper";

export async function GET(request: Request) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const notifications = await db.notification.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const unreadCount = await db.notification.count({
      where: { userId: user.userId, read: false },
    });

    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
```

File: `src/app/api/notifications/[id]/route.ts`

```typescript
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth-helper";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const notification = await db.notification.update({
      where: { id: params.id },
      data: { read: true, readAt: new Date() },
    });

    return NextResponse.json(notification);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
```

---

## 🟡 FOLLOW-UP FEATURES (MEDIUM PRIORITY)

### 5. Rate Limiting
```bash
npm install express-rate-limit
```

Create `src/lib/rate-limit.ts`:
```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10s"),
});
```

### 6. API Key Security
- Never log sensitive data
- Validate all inputs
- Use HTTPS in production
- Set CORS headers properly
- Implement request signing if needed

---

## ✅ Final Checklist

- [ ] Google OAuth working end-to-end
- [ ] File uploads functional (< 100MB)
- [ ] AI Chat responding to messages
- [ ] Notifications displaying correctly
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Database migrations successful
- [ ] Environment variables secured
- [ ] All APIs returning proper error codes
- [ ] Data properly persisted

---

## 🚀 Next Steps After Implementation

1. **Test Thoroughly**: Write tests for each feature
2. **Monitor Performance**: Add monitoring/logging
3. **Gather Feedback**: Get user feedback on UX
4. **Iterate**: Fix bugs and improve based on feedback
5. **Scale**: Add admin features, advanced analytics
6. **Deploy**: Move to production with proper CI/CD

---

## 📞 Troubleshooting

### Google OAuth Not Working
- Verify Client ID/Secret in .env.local
- Check redirect URI matches exactly
- Ensure Google+ API is enabled
- Check browser console for errors

### File Upload Fails
- Verify Supabase/S3 credentials
- Check file size < 100MB
- Verify ALLOWED_TYPES includes your file
- Check storage bucket is public

### AI Not Responding
- Verify API key is valid
- Check GEMINI_API_KEY in .env.local
- Monitor rate limits
- Check error logs

### Performance Issues
- Profile with DevTools
- Check database query performance
- Enable caching headers
- Consider CDN for static files

---

**Remember**: Start with one feature, test it thoroughly, then move to the next. Don't try to implement everything at once!
