# 🚀 Deployment Guide - OurStory

## Vercel Deployment (Recommended for Next.js)

### Prerequisites
1. GitHub account with your code pushed
2. Vercel account (free) - https://vercel.com
3. PostgreSQL database (options below)

### Step 1: Database Setup

#### Option A: Vercel Postgres (Easiest - Recommended)
1. Go to https://vercel.com/dashboard
2. Click "Storage" → "Create Database"
3. Select "Postgres"
4. Copy the connection string

#### Option B: Neon.tech (Free Tier)
1. Go to https://neon.tech
2. Sign up (free)
3. Create a new project
4. Copy the connection string
5. Connection string format: `postgresql://user:pass@host/dbname?sslmode=require`

#### Option C: Supabase (Free Tier)
1. Go to https://supabase.com
2. Create new project
3. Go to Settings → Database
4. Copy "Connection string" (Transaction pooling for production)

### Step 2: Deploy to Vercel

1. **Push to GitHub**
```powershell
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Select "FinanceManager" repo

3. **Configure Environment Variables**
   Click "Environment Variables" and add:

```env
# Database
DATABASE_URL=your_postgres_connection_string_here

# NextAuth
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your_secret_here_generate_one

# Node Environment
NODE_ENV=production
```

**Generate NEXTAUTH_SECRET:**
```powershell
# Run this in terminal
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (2-3 minutes)

### Step 3: Run Database Migrations

After first deployment:

1. Go to your Vercel project → Settings → Environment Variables
2. Add all env variables if not done
3. Go to Deployments → Latest Deployment → Click the 3 dots → "Redeploy"
4. Check "Use existing Build Cache" is OFF
5. Click "Redeploy"

OR manually run migrations:

```powershell
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Run migration
vercel env pull .env.local
npx prisma migrate deploy
npx prisma generate
```

### Common Deployment Errors & Fixes

#### ❌ Error: "Failed to load resource: 500"

**Cause:** Database not connected or migrations not run

**Fix:**
1. Check DATABASE_URL is correct in Vercel env variables
2. Run migrations:
```powershell
npx prisma migrate deploy
```

#### ❌ Error: "NEXTAUTH_URL is not defined"

**Fix:**
Add to Vercel environment variables:
```
NEXTAUTH_URL=https://your-app.vercel.app
```

#### ❌ Error: "PrismaClient is not configured"

**Fix:**
Redeploy with fresh build:
1. Go to Vercel Dashboard
2. Settings → Environment Variables
3. Ensure DATABASE_URL exists
4. Deployments → Redeploy (uncheck cache)

#### ❌ Error: "Can't reach database server"

**Fix:**
Check database connection string:
- Must include `?sslmode=require` for most providers
- Must be in "Connection Pooling" format for Vercel
- Example: `postgresql://user:pass@host:5432/db?sslmode=require&pgbouncer=true`

### Production Environment Variables Template

```env
# Copy this to Vercel Environment Variables

# Database (Required)
DATABASE_URL="postgresql://user:password@host.region.provider.com:5432/database?sslmode=require"

# Authentication (Required)
NEXTAUTH_URL="https://your-app-name.vercel.app"
NEXTAUTH_SECRET="generate-random-32-byte-string-here"

# Optional but Recommended
NODE_ENV="production"
```

### Post-Deployment Checklist

- [ ] Database connected and accessible
- [ ] Migrations run successfully
- [ ] Can access homepage (/)
- [ ] Can sign up new user
- [ ] Can sign in
- [ ] Can create transactions
- [ ] Can access dashboard
- [ ] Can access analytics
- [ ] Dark mode works
- [ ] Mobile responsive

### Testing After Deployment

1. **Test Sign Up:**
   - Go to https://your-app.vercel.app
   - Click "Get Started"
   - Create account
   - Should redirect to dashboard

2. **Test Sign In:**
   - Sign out
   - Sign in with created account
   - Should work without errors

3. **Test Features:**
   - Create a category
   - Add a transaction
   - Go to analytics (should show data)

### Monitoring & Logs

**View Deployment Logs:**
1. Vercel Dashboard → Your Project
2. Deployments → Click latest
3. "Runtime Logs" for live errors
4. "Build Logs" for build errors

**Common Log Errors:**

```
Module not found: Can't resolve 'recharts'
```
**Fix:** Ensure package.json has recharts, redeploy

```
Prisma Client initialization error
```
**Fix:** Run `npx prisma generate` and redeploy

### Database Migration Commands

```powershell
# Create migration
npx prisma migrate dev --name your_migration_name

# Apply to production
npx prisma migrate deploy

# Reset database (CAUTION: Deletes all data)
npx prisma migrate reset

# View current migration status
npx prisma migrate status

# Generate Prisma Client
npx prisma generate
```

### Updating After Changes

```powershell
# 1. Make changes locally
# 2. Test locally
npm run dev

# 3. Push to GitHub
git add .
git commit -m "Your changes"
git push origin main

# 4. Vercel auto-deploys from main branch
# 5. Check deployment status on Vercel dashboard
```

### Alternative: Deploy to Railway

1. Go to https://railway.app
2. "New Project" → "Deploy from GitHub"
3. Select your repo
4. Add environment variables (same as Vercel)
5. Railway provides database + hosting in one

### Alternative: Deploy to Render

1. Go to https://render.com
2. "New" → "Web Service"
3. Connect GitHub repo
4. Build Command: `npm install && npx prisma generate && npm run build`
5. Start Command: `npm start`
6. Add environment variables

### Troubleshooting Deployment

**Still getting 500 error after deployment?**

1. Check Vercel Runtime Logs:
   - Vercel Dashboard → Deployments → Latest → Runtime Logs
   - Look for actual error message

2. Common fixes:
```powershell
# Update dependencies
npm update

# Regenerate Prisma client
npx prisma generate

# Check .env format
# Make sure no quotes around values in Vercel env vars

# Rebuild from scratch
# Vercel → Settings → General → Delete Project
# Redeploy fresh
```

3. Database Connection Test:
```javascript
// Add to app/api/test-db/route.ts
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    await prisma.$connect()
    return NextResponse.json({ status: "Connected!" })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
```

### Mobile Optimization

The app is already mobile-first with:
- Responsive breakpoints (sm, md, lg)
- Touch-friendly buttons (min 44px)
- Mobile navigation
- Optimized layouts

Test on mobile:
- Chrome DevTools → Toggle Device Toolbar
- Test on actual device
- Use Vercel Preview Deployments for testing

### Performance Tips

1. **Optimize Images:** Already using CSS gradients (no images)
2. **Code Splitting:** Next.js does this automatically
3. **Caching:** Vercel Edge Network handles this
4. **Database:** Use connection pooling (already in connection string)

### Need Help?

**Check these first:**
1. Vercel Logs (Runtime & Build)
2. Browser Console (F12)
3. Network Tab (for API errors)

**Common Issues:**
- 500 Error = Database not connected
- 404 Error = Route doesn't exist
- CORS Error = NEXTAUTH_URL wrong
- Build Error = Check Build Logs

---

## 🎉 Deployment Complete!

Your app should now be live at:
`https://your-app-name.vercel.app`

Share with your partner and start tracking! 💑
