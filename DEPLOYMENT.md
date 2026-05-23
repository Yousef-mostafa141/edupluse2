# EduPulse AI - LMS Setup & Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- SQLite (included) or PostgreSQL for production
- Git

### Installation

```bash
# Clone repository
git clone <repo-url>
cd edupulse

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Setup database
npx prisma migrate dev --name init
npx prisma db seed

# Run development server
npm run dev
```

Visit `http://localhost:3000`

## 📋 Environment Setup

### Required Environment Variables

```bash
# Database
DATABASE_URL="file:./dev.db"  # SQLite for dev, PostgreSQL for prod

# Authentication
JWT_SECRET=<generate-a-secure-random-string>
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Google OAuth (get from Google Cloud Console)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<your-client-id>.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<your-client-secret>

# AI Integration (Gemini)
GEMINI_API_KEY=<your-gemini-api-key>

# File Storage (Supabase recommended)
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

## 🔐 Authentication Flow

### Email/Password Login
1. User enters email & password on login page
2. Backend validates credentials via bcrypt
3. JWT token issued and stored in httpOnly cookie
4. Session verified via /api/auth/me on each app load

### Google OAuth (Not Yet Implemented)
1. User clicks "Continue with Google"
2. Frontend redirects to Google login
3. Google returns ID token to frontend
4. Frontend sends ID token to /api/auth/google
5. Backend verifies token and creates/updates user
6. JWT issued and stored

## 📊 Database Schema

### Core Models
- **User**: Authentication & profile
- **Task**: Student tasks with completion tracking
- **Grade**: Subject grades with scoring
- **Goal**: Study goals with progress
- **StudySession**: Study duration & focus tracking
- **StudyLog**: Daily aggregated study data
- **Assignment**: Teacher-created assignments
- **Submission**: Student submissions with scores
- **Message**: Student-teacher messaging
- **Notification**: Real-time notifications
- **File**: Uploaded study materials

## 🎯 Critical Issues Fixed ✅

### Completed
- [x] Theme system (light/dark with SSR support)
- [x] Text selection visibility in light mode
- [x] Theme & language toggles on login
- [x] Removed fake testimonials
- [x] Enhanced Prisma schema
- [x] Removed database seeding
- [x] Fixed streak calculation
- [x] Removed guest account logic
- [x] Fixed bcrypt hashing

### Remaining Critical Tasks
- [ ] Google OAuth implementation
- [ ] File upload system
- [ ] AI/Gemini integration
- [ ] Notification system
- [ ] Rate limiting
- [ ] Dashboard data cleanup

## 🔧 API Endpoints

### Authentication
```
POST /api/auth/login          # Email/password login
POST /api/auth/signup         # New user registration
POST /api/auth/google         # Google OAuth callback
POST /api/auth/logout         # Logout
GET  /api/auth/me             # Get current user & data
```

### User Data
```
PUT  /api/settings            # Update profile & preferences
POST /api/tasks               # Create task
PUT  /api/tasks               # Update task
DELETE /api/tasks?id=<id>     # Delete task
GET  /api/tasks               # List user tasks
```

### Grades & Analytics
```
POST /api/grades              # Add grade
GET  /api/grades              # List grades
POST /api/sessions            # Log study session
GET  /api/sessions            # List sessions
```

## 🚨 Security Checklist

- [x] Bcrypt password hashing
- [x] httpOnly JWT cookies
- [ ] Rate limiting (express-rate-limit needed)
- [ ] CSRF protection (csrf middleware needed)
- [ ] Input validation (partially done)
- [ ] SQL injection protection (Prisma prevents)
- [x] Environment variables protection
- [ ] API key security audit

## 📱 Responsiveness

### Current Status
- [x] Desktop (1024px+)
- [ ] Tablet (768px - 1023px) - needs testing
- [ ] Mobile (320px - 767px) - needs fixes

### Known Mobile Issues
- Sidebar overlap on small screens
- Modal positioning bugs
- Horizontal scroll issues

## 🎨 Theming

The app uses a global CSS variable system with dark/light modes:

### Colors
- Primary background: `var(--bg-primary)`
- Text: `var(--text-primary)` / `var(--text-secondary)`
- Accent: `var(--accent)` (6C63FF)
- Border: `var(--border)`

Theme is controlled by `[data-theme]` attribute on HTML element and persisted to localStorage.

## 📦 Deployment

### Production Checklist

```bash
# 1. Set production environment variables
DATABASE_URL=postgresql://...  # Use PostgreSQL
JWT_SECRET=<secure-random-string-32-chars+>
NODE_ENV=production

# 2. Build application
npm run build

# 3. Run migrations
npx prisma migrate deploy

# 4. Start server
npm start
```

### Vercel Deployment

```bash
# Connect repository to Vercel
# Set environment variables in Vercel dashboard
# Auto-deploys on push to main
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
CMD ["npm", "start"]
```

## 🐛 Debugging

### Enable debug logs
```bash
DEBUG=edupulse:* npm run dev
```

### Check JWT token
```javascript
// In browser console
document.cookie.split(';').find(c => c.includes('edupulse-session'))
```

### Database inspection
```bash
npx prisma studio
```

## 📖 Feature Documentation

### XP & Streak System
- **Streak**: Incremented on daily login (continues from yesterday)
- **XP**: Earned from grades, study sessions, task completion
- **Level**: Calculated as `Math.floor(xp / 500) + 1`

### Study Analytics
- **StudySession**: Tracks individual study periods
- **StudyLog**: Daily aggregation of sessions
- Integrated with XP system for rewards

### Assignments Flow
1. Teacher creates assignment in course
2. System sends notification to enrolled students
3. Students submit work
4. Teacher grades and provides feedback
5. Grades reflected in student dashboard

## 🔗 Related Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [next-themes](https://github.com/pacocoursey/next-themes)

## 💬 Support

For issues and questions:
1. Check existing GitHub issues
2. Review error logs
3. Check database with Prisma Studio

## 📝 License

Proprietary - All rights reserved
