# 🚨 FINAL FIX: Frontend API Proxy Configuration

## Problem Identified
The frontend has an API proxy that forwards requests to the backend, but it's using the wrong environment variable name.

## ✅ Solution: Update Environment Variables in Vercel

### Step 1: Update Frontend Environment Variables

Go to your **frontend project** in Vercel Dashboard and set these environment variables:

```
NEXT_PUBLIC_API_URL = /api
BACKEND_API_URL = https://backend-kappa-three-25.vercel.app/api
```

**Remove the old variable:**
- Delete `NEXT_PUBLIC_API_URL` if it has the full backend URL

### Step 2: Ensure Backend Environment Variables

Go to your **backend project** in Vercel Dashboard and ensure these are set:

```
MONGODB_URI = mongodb+srv://anukarki:3k7GpwHppDs8IU7v@cluster0.6j922hj.mongodb.net/blog?retryWrites=true&w=majority
JWT_SECRET = super-secret-jwt-key-minimum-32-characters-long-for-security-purposes
NODE_ENV = production
FRONTEND_URL = https://www.anukarki.xyz
ADMIN_EMAIL = hello.ganeshshah@gmail.com
ADMIN_PASSWORD = anukarki
```

### Step 3: Redeploy Both Projects

1. **Redeploy Frontend** (after updating environment variables)
2. **Redeploy Backend** (if environment variables were missing)

## 🔧 How It Works

1. **Frontend calls**: `https://www.anukarki.xyz/api/stories`
2. **API proxy forwards to**: `https://backend-kappa-three-25.vercel.app/api/stories`
3. **Backend responds** with data
4. **Frontend receives** the response

## 🧪 Test After Fix

1. Visit: `https://www.anukarki.xyz`
2. Check browser console - no more 404/500 errors
3. Profile data should load
4. Stories should display
5. Admin panel should work: `https://www.anukarki.xyz/admin`

## 📋 Environment Variables Summary

**Frontend Project:**
```
NEXT_PUBLIC_API_URL = /api
BACKEND_API_URL = https://backend-kappa-three-25.vercel.app/api
NEXT_PUBLIC_APP_URL = https://www.anukarki.xyz
NEXT_PUBLIC_APP_NAME = Anu Blog
NEXT_PUBLIC_CONTACT_EMAIL = hello.ganeshshah@gmail.com
```

**Backend Project:**
```
MONGODB_URI = mongodb+srv://anukarki:3k7GpwHppDs8IU7v@cluster0.6j922hj.mongodb.net/blog?retryWrites=true&w=majority
JWT_SECRET = super-secret-jwt-key-minimum-32-characters-long-for-security-purposes
NODE_ENV = production
FRONTEND_URL = https://www.anukarki.xyz
ADMIN_EMAIL = hello.ganeshshah@gmail.com
ADMIN_PASSWORD = anukarki
```

---

**This should completely fix all API connection issues!**