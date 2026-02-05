# 🚨 QUICK FIX: Update Environment Variables

## Problem Identified
The frontend is calling backend endpoints without the `/api` prefix, causing 404 errors.

## ✅ Solution: Update Frontend Environment Variable

### Step 1: Update Frontend Environment Variable in Vercel

1. Go to **Vercel Dashboard**: https://vercel.com/dashboard
2. Find your **frontend project** (the one deployed to `https://www.anukarki.xyz`)
3. Click on the project
4. Go to **Settings** → **Environment Variables**
5. Find `NEXT_PUBLIC_API_URL`
6. **Update the value** from:
   ```
   https://backend-kappa-three-25.vercel.app
   ```
   **To:**
   ```
   https://backend-kappa-three-25.vercel.app/api
   ```
7. Click **Save**

### Step 2: Redeploy Frontend

1. Go to **Deployments** tab in your frontend project
2. Click **"Redeploy"** on the latest deployment
3. Wait for deployment to complete

### Step 3: Add Missing Backend Environment Variables

Go to your **backend project** in Vercel and ensure these environment variables are set:

```
MONGODB_URI = mongodb+srv://anukarki:3k7GpwHppDs8IU7v@cluster0.6j922hj.mongodb.net/blog?retryWrites=true&w=majority
JWT_SECRET = super-secret-jwt-key-minimum-32-characters-long-for-security-purposes
NODE_ENV = production
FRONTEND_URL = https://www.anukarki.xyz
ADMIN_EMAIL = hello.ganeshshah@gmail.com
ADMIN_PASSWORD = anukarki
```

### Step 4: Redeploy Backend

1. Go to **Deployments** tab in your backend project
2. Click **"Redeploy"** on the latest deployment
3. Wait for deployment to complete

## 🧪 Test After Fix

1. **Test Backend Health**: Visit `https://backend-kappa-three-25.vercel.app/api/health`
2. **Test Frontend**: Visit `https://www.anukarki.xyz`
3. **Test Admin Login**: Visit `https://www.anukarki.xyz/admin`

## 📋 Expected Results

After the fix:
- ✅ No more 404 errors for `/profile` and `/stories`
- ✅ Frontend loads profile data correctly
- ✅ Stories page works
- ✅ Admin panel functions properly

## 🔧 Alternative: Use Vercel CLI (Faster)

If you have Vercel CLI installed:

```bash
# Navigate to frontend folder
cd frontend

# Update the environment variable
vercel env rm NEXT_PUBLIC_API_URL production
vercel env add NEXT_PUBLIC_API_URL

# When prompted, enter: https://backend-kappa-three-25.vercel.app/api

# Redeploy
vercel --prod
```

---

**The main issue was the missing `/api` prefix in the frontend API URL!**