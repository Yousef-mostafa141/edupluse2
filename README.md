# EduPulse AI

A futuristic AI-powered educational web platform for students — academic support and emotional wellness in one premium experience.

## Features

- **Landing Page** — Hero with AI orb, neural network, particles, features, AI demo, testimonials
- **Auth** — Split-screen login/signup with glassmorphism
- **Dashboard** — Greeting card, quick actions, animated charts, tasks, streak system
- **AI Chat** — Full chat UI with typing indicator, voice mode
- **Know Yourself** — Emotional support chat, mood meters
- **Upload Files** — Drag & drop with processing animation
- **Ask Your Book** — Summaries, quizzes, flashcards
- **Analytics, Calendar, Tasks, Focus Mode, Reports, Settings, Profile**
- **Gamification** — XP, streaks, achievements, AI pet
- **i18n** — Arabic/English with RTL support
- **Themes** — Dark/Light mode

## Tech Stack

- Next.js 15 (App Router)
- React 19
- Tailwind CSS
- Framer Motion
- Recharts
- next-themes

## Getting Started

```bash
npm install
npm run dev
```

Create a `.env.local` file with your Gemini credentials:

```env
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-pro-1.0
```

Open [http://localhost:3000](http://localhost:3000)

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login` | Login |
| `/signup` | Sign up |
| `/demo` | Demo loader → dashboard |
| `/dashboard` | Main dashboard |
| `/dashboard/chat` | AI Chat |
| `/dashboard/chat/voice` | Voice AI |
| `/dashboard/know-yourself` | Emotional support |
| `/dashboard/upload` | File upload |
| `/dashboard/books` | Ask Your Book |
| `/dashboard/analytics` | Analytics |
| `/dashboard/calendar` | Smart calendar |
| `/dashboard/tasks` | Tasks |
| `/dashboard/focus` | Focus mode |
| `/dashboard/reports` | Weekly reports |
| `/dashboard/settings` | Settings |
| `/dashboard/profile` | Profile |

## Design System

**Dark Mode:** `#0B1020` bg, `#6C63FF` primary, `#00D4FF` accent  
**Light Mode:** `#F5F7FF` bg, `#6C63FF` primary  
**Fonts:** Inter, Poppins, Sora (EN) · Cairo (AR)
