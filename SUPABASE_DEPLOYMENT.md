# 🚀 Quick Deployment Guide for Supabase

## Your Supabase Setup

**Password:** `Vk25_uB5td9AUVv`

## Step 1: Get Database Connection String

1. Go to your Supabase project dashboard
2. Click on **"Project Settings"** (gear icon on left sidebar)
3. Click **"Database"** section
4. Scroll to **"Connection string"**
5. Select **"Transaction"** mode (for Prisma)
6. Copy the connection string

**Format will be:**
```
postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Replace `[YOUR-PASSWORD]` with:** `Vk25_uB5td9AUVv`

**Final string should look like:**
```
postgresql://postgres.xxxxx:Vk25_uB5td9AUVv@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

## Step 2: Update Local .env File

Create/update `.env.local` file:

```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres.xxxxx:Vk25_uB5td9AUVv@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-this-below"

# Environment
NODE_ENV="development"
```

## Step 3: Generate NextAuth Secret

Run this in PowerShell:
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output and paste in `.env.local` as `NEXTAUTH_SECRET`

## Step 4: Run Database Migrations

```powershell
# Generate Prisma client
npx prisma generate

# Run migrations to create tables
npx prisma migrate dev --name init

# Check if tables created
npx prisma studio
```

## Step 5: Test Locally

```powershell
npm run dev
```

Visit http://localhost:3000 and test:
- Sign up
- Sign in
- Create transaction
- Check analytics

## Step 6: Deploy to Vercel

### A. Push to GitHub (if not done)

```powershell
git add .
git commit -m "Ready for deployment with Supabase"
git push origin main
```

### B. Deploy on Vercel

1. Go to https://vercel.com
2. Click **"New Project"**
3. Import your **FinanceManager** repository
4. Click **"Deploy"** (wait for it to fail - that's expected)

### C. Add Environment Variables in Vercel

1. Go to your project on Vercel
2. Click **"Settings"** → **"Environment Variables"**
3. Add these variables:

**Variable 1:**
- Key: `DATABASE_URL`
- Value: `postgresql://postgres.xxxxx:Vk25_uB5td9AUVv@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true`
- Environment: Production, Preview, Development (select all)

**Variable 2:**
- Key: `NEXTAUTH_URL`
- Value: `https://your-project-name.vercel.app` (replace with actual Vercel URL)
- Environment: Production

**Variable 3:**
- Key: `NEXTAUTH_SECRET`
- Value: (paste the secret you generated)
- Environment: Production, Preview, Development

**Variable 4:**
- Key: `NODE_ENV`
- Value: `production`
- Environment: Production

### D. Redeploy

1. Go to **"Deployments"** tab
2. Click the 3 dots on latest deployment
3. Click **"Redeploy"**
4. **IMPORTANT:** Uncheck "Use existing Build Cache"
5. Click **"Redeploy"**

## Step 7: Run Migrations on Production

After deployment, your tables need to be created in Supabase:

**Option A: Using Vercel CLI (Recommended)**
```powershell
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link to your project
vercel link

# Pull environment variables
vercel env pull .env.production

# Run migrations
npx prisma migrate deploy
```

**Option B: Direct from Supabase SQL Editor**
1. Go to Supabase Dashboard → SQL Editor
2. Run this SQL:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create User table
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "name" TEXT,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Category table
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Create Transaction table
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "isShared" BOOLEAN NOT NULL DEFAULT false,
    "paidBy" TEXT,
    "categoryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Transaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT,
    CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Create PartnerInvite table
CREATE TABLE "PartnerInvite" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "senderId" TEXT NOT NULL,
    "recipientEmail" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PartnerInvite_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Create UserPartner table
CREATE TABLE "UserPartner" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "userId" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserPartner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    CONSTRAINT "UserPartner_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX "Category_userId_idx" ON "Category"("userId");
CREATE INDEX "Transaction_userId_idx" ON "Transaction"("userId");
CREATE INDEX "Transaction_categoryId_idx" ON "Transaction"("categoryId");
CREATE INDEX "PartnerInvite_senderId_idx" ON "PartnerInvite"("senderId");
CREATE UNIQUE INDEX "UserPartner_userId_partnerId_key" ON "UserPartner"("userId", "partnerId");
```

## Troubleshooting

### ❌ "Can't reach database server"

**Fix:** Check your connection string:
- Must have `?pgbouncer=true` at the end
- Password should be URL-encoded (no special chars issues)
- Use **Transaction** pooler, not Session pooler

### ❌ "relation does not exist"

**Fix:** Tables not created. Run migrations:
```powershell
npx prisma migrate deploy
```

### ❌ "Invalid `prisma.user.create()` invocation"

**Fix:** Prisma client not generated:
```powershell
npx prisma generate
```
Then redeploy on Vercel.

### ❌ Still getting 500 error?

**Check Vercel Logs:**
1. Vercel Dashboard → Your Project
2. Deployments → Latest
3. Click on deployment
4. Check "Runtime Logs" tab
5. Look for actual error message

**Common issues:**
- DATABASE_URL not set in Vercel
- NEXTAUTH_SECRET missing
- NEXTAUTH_URL wrong (should be https://your-app.vercel.app)

## Quick Checklist

- [ ] Supabase project created
- [ ] Database connection string copied
- [ ] Password added to connection string
- [ ] Local .env.local file created
- [ ] NEXTAUTH_SECRET generated
- [ ] Local migrations run (`npx prisma migrate dev`)
- [ ] Local testing works (npm run dev)
- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] All environment variables added in Vercel
- [ ] NEXTAUTH_URL points to Vercel URL
- [ ] Redeployed without cache
- [ ] Production migrations run
- [ ] Can sign up on production
- [ ] Can sign in on production
- [ ] Can create transactions

## After Successful Deployment

Your app will be live at:
`https://your-project-name.vercel.app`

Test these:
1. Sign up with new email
2. Sign in
3. Create category
4. Add transaction
5. Go to analytics
6. Test on mobile

## Database Management

**View your data in Supabase:**
1. Supabase Dashboard → Table Editor
2. You'll see all tables: User, Category, Transaction, etc.

**View data with Prisma Studio:**
```powershell
npx prisma studio
```

## Need Help?

Common commands:
```powershell
# Check database connection
npx prisma db pull

# View migration status
npx prisma migrate status

# Generate Prisma client
npx prisma generate

# Open Prisma Studio
npx prisma studio

# Deploy migrations
npx prisma migrate deploy
```

---

**Your Supabase Password:** `Vk25_uB5td9AUVv`

Remember to keep this safe! Don't commit to GitHub.

🚀 **Ready to deploy! Follow steps above.**
