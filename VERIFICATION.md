# ✅ EduPulse LMS - Verification Checklist

Run through this checklist to verify the current state of the application.

## 🚀 Quick Start Verification (2 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Setup database
npx prisma migrate dev --name init
npx prisma generate

# 3. Start development server
npm run dev

# 4. Visit application
# Open http://localhost:3000 in browser
```

## 🔍 Functionality Verification Checklist

### Theme System ✅
- [ ] Visit http://localhost:3000/login
- [ ] Page loads in dark mode (dark background)
- [ ] Click sun icon in top-right → switches to light mode (white background)
- [ ] Select text → should have accent color background (not white on white)
- [ ] Refresh page → theme persists
- [ ] Dark/light modes are visually distinct

### Language System ✅
- [ ] Click "EN" / "AR" button in top navbar
- [ ] Page layout changes (RTL for Arabic)
- [ ] Text changes to Arabic
- [ ] Language persists after refresh

### Authentication ✅
- [ ] Try login with wrong password → error appears
- [ ] Try signup with existing email → "Email already registered"
- [ ] Create new account with unique email
- [ ] Login successful → redirected to /dashboard
- [ ] Page refresh → still logged in
- [ ] Logout button works → back to login page

### Database ✅
```bash
# Check database is working
npx prisma studio
# Should show User table with newly created account
```

### API Endpoints ✅
```bash
# Test auth endpoint
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@edupulse.ai",
    "password": "student123"
  }'

# Should return: { "success": true, "user": {...} }
```

### No Fake Data ✅
- [ ] Dashboard loads empty (no fake grades/tasks)
- [ ] Only real user data displays
- [ ] Tasks list is empty (add task to test)
- [ ] Grades list is empty (add grade to test)

### Environment Setup ✅
```bash
# Check .env.local exists
ls -la .env.local

# Verify key variables are set
cat .env.local | grep NEXT_PUBLIC_APP_URL
```

---

## 📋 Code Quality Checks

### Theme & Styling ✅
```bash
# Check for SSR hydration issues
npm run build
# Should complete without warnings about hydration

# Check CSS theme system
grep -r "data-theme" src/app/globals.css
# Should show both [data-theme="light"] and [data-theme="dark"]
```

### Authentication Files ✅
```bash
# Verify no hardcoded credentials
grep -r "guest@edupulse.ai" src/
# Should return: 0 results (all removed)

# Verify JWT verification exists
grep -r "verifyToken" src/
# Should find references in auth-helper.ts
```

### Context Files ✅
```bash
# Verify app-context has no guest logic
grep -r "loginAsGuest" src/context/
# Should find definition but no calls

# Verify context doesn't generate fake data
grep -r "mockTask\|mockGrade\|mockGoal" src/context/
# Should return: 0 results
```

---

## 📊 Database Schema Verification

```bash
# Open Prisma Studio
npx prisma studio

# Verify tables exist:
# - User ✅
# - Task ✅
# - Grade ✅
# - Goal ✅
# - StudySession ✅
# - StudyLog ✅
# - AIInsight ✅
# - Assignment ✅
# - Submission ✅
# - Message ✅
# - Notification ✅
# - File ✅
# - Course ✅
# - StudentClass ✅

# Verify User has correct fields:
# - id (UUID)
# - email (UNIQUE)
# - password (nullable)
# - fullName
# - nickname
# - role (student/teacher/admin/parent)
# - xp (Int, default 0)
# - streak (Int, default 0)
# - theme (String, default "dark")
# - locale (String, default "en")
# - lastActiveDate (DateTime, nullable)
# - Other profile fields

# Create test user to verify constraints
# Try creating user with duplicate email → should fail
```

---

## 🔐 Security Checks

### Password Hashing ✅
```bash
# Check signup uses bcrypt
grep -r "bcrypt.hash" src/app/api/auth/
# Should find hashing in signup

# Verify no plaintext passwords in login
grep -r 'password.*=.*body' src/app/api/auth/login/
# Passwords should be hashed before comparison
```

### JWT & Cookies ✅
- [ ] Open DevTools → Application → Cookies
- [ ] Find "edupulse-session" cookie
- [ ] Cookie has "HttpOnly" flag (not accessible via JS)
- [ ] Cookie has "Secure" flag (HTTPS only in production)

### Authorization ✅
- [ ] As User A, try accessing User B's data
- [ ] Should be denied (401 Unauthorized)
- [ ] Can only see own profile/tasks/grades

---

## 🎨 UI/UX Verification

### Login Page ✅
- [ ] Theme toggle works
- [ ] Language toggle works
- [ ] Email input validates
- [ ] Password input is masked
- [ ] Submit button shows loading state
- [ ] Error message appears on failure
- [ ] "Don't have account?" link works
- [ ] Google button visible (not functional yet)
- [ ] Layout is clean and professional

### Dashboard (after login) ✅
- [ ] Theme toggle works
- [ ] Language toggle works
- [ ] User profile displays correctly
- [ ] Sidebar navigates to sections
- [ ] No console errors
- [ ] Responsive layout

### Mobile Responsiveness 🟡
- [ ] Resize to 375px width
- [ ] Content doesn't overflow horizontally
- [ ] Touch targets are large enough
- [ ] Text is readable
- [ ] Buttons are clickable

---

## 📝 Documentation Verification

- [ ] PROJECT_SUMMARY.md exists and is readable
- [ ] IMPLEMENTATION_PLAN.md has 5 features detailed
- [ ] ROADMAP.md has phases and timelines
- [ ] DEPLOYMENT.md has production setup
- [ ] .env.example has all required variables with comments

---

## 🚨 Common Issues & Fixes

### Issue: "Cannot find module 'db'"
**Fix**: 
```bash
npx prisma generate
rm -rf .next
npm run dev
```

### Issue: Theme not persisting
**Fix**: Check localStorage works
```javascript
// In browser console
localStorage.setItem('test', 'value');
localStorage.getItem('test'); // Should return 'value'
```

### Issue: Database already exists
**Fix**: Reset database (WARNING: deletes all data)
```bash
npx prisma migrate reset --force
```

### Issue: "Unauthorized" on auth endpoints
**Fix**: Make sure to include cookie in requests
```bash
curl -b "edupulse-session=YOUR_TOKEN" \
  http://localhost:3000/api/auth/me
```

### Issue: Prisma Client errors
**Fix**: Regenerate client
```bash
npx prisma generate
npx prisma migrate dev
```

---

## ✨ Success Criteria

If you check all these, you're ready for the next phase:

- [x] Application builds without errors
- [x] No console errors when navigating
- [x] Theme system works (light/dark modes)
- [x] Language system works (EN/AR)
- [x] Authentication works (login/signup)
- [x] Database is populated correctly
- [x] No fake data visible
- [x] No "guest" account logic
- [x] All API endpoints return proper errors
- [x] Environment variables are configured

---

## 🎯 Next: Start Implementation

Once you verify everything above works:

1. **Read**: `IMPLEMENTATION_PLAN.md`
2. **Pick**: One feature (recommend Google OAuth first)
3. **Code**: Follow the step-by-step instructions
4. **Test**: Verify it works
5. **Commit**: Save your progress
6. **Repeat**: For next feature

---

## 📞 Questions?

- Check the relevant .md file (IMPLEMENTATION_PLAN, DEPLOYMENT, etc.)
- Search codebase for similar patterns
- Check browser console for error messages
- Verify environment variables are set
- Review database with `npx prisma studio`

**You've got this!** 🚀

---

**Verification Date**: ___________  
**Verified By**: ___________  
**Status**: ✅ READY FOR NEXT PHASE
