# 🚨 IMMEDIATE ACTION REQUIRED

## Current Issue
The frontend is still calling `https://backend-kappa-three-25.vercel.app/api/profile` directly instead of using the proxy at `https://www.anukarki.xyz/api/profile`.

This means the environment variables in Vercel are NOT updated yet.

## ✅ EXACT STEPS TO FIX

### Step 1: Go to Vercel Dashboard
1. Visit: https://vercel.com/dashboard
2. Find your **frontend project** (the one that deploys to `https://www.anukarki.xyz`)
3. Click on the project name

### Step 2: Update Environment Variables
1. Click **"Settings"** in the top menu
2. Click **"Environment Variables"** in the left sidebar
3. Look for `NEXT_PUBLIC_API_URL`

**If it exists:**
- Click the **3 dots** next to it
- Click **"Edit"**
- Change the value to: `/api`
- Click **"Save"**

**If it doesn't exist:**
- Click **"Add New"**
- Name: `NEXT_PUBLIC_API_URL`
- Value: `/api`
- Environment: **Production**
- Click **"Save"**

### Step 3: Add Backend API URL
1. Click **"Add New"** again
2. Name: `BACKEND_API_URL`
3. Value: `https://backend-kappa-three-25.vercel.app/api`
4. Environment: **Production**
5. Click **"Save"**

### Step 4: Redeploy
1. Go to **"Deployments"** tab
2. Find the latest deployment
3. Click the **3 dots** next to it
4. Click **"Redeploy"**
5. Wait for deployment to complete (2-3 minutes)

## 🧪 How to Verify It's Fixed

After redeployment, the frontend should call:
- ✅ `https://www.anukarki.xyz/api/profile` (proxy)
- ❌ NOT `https://backend-kappa-three-25.vercel.app/api/profile` (direct)

## 🔧 Alternative: Use Vercel CLI

If you have Vercel CLI installed:

```bash
cd frontend

# Remove old variable
vercel env rm NEXT_PUBLIC_API_URL production

# Add new variables
vercel env add NEXT_PUBLIC_API_URL
# When prompted, enter: /api

vercel env add BACKEND_API_URL
# When prompted, enter: https://backend-kappa-three-25.vercel.app/api

# Redeploy
vercel --prod
```

---

**The code changes are already pushed. You just need to update the environment variables in Vercel!**