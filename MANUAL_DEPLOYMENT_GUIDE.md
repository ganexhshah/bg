# 📋 Manual Deployment Guide - Vercel

## 🎯 Overview
This guide will help you manually deploy both frontend and backend to Vercel through the web dashboard.

## 🔧 Prerequisites
- GitHub repository: `https://github.com/ganexhshah/bg`
- Vercel account: `https://vercel.com`
- MongoDB Atlas database with credentials

## 📝 Your Database Credentials
```
MongoDB URI: mongodb+srv://anukarki:3k7GpwHppDs8IU7v@cluster0.6j922hj.mongodb.net/blog?retryWrites=true&w=majority
Admin Email: hello.ganeshshah@gmail.com
Admin Password: anukarki
```

---

## 🚀 STEP 1: Deploy Backend

### 1.1 Go to Vercel Dashboard
- Visit: https://vercel.com/dashboard
- Click **"New Project"**

### 1.2 Import Repository
- Click **"Import Git Repository"**
- Select your GitHub account
- Choose repository: `ganexhshah/bg`
- Click **"Import"**

### 1.3 Configure Backend Project
```
Project Name: blog-backend
Framework Preset: Other
Root Directory: backend
Build Command: (leave empty)
Output Directory: (leave empty)
Install Command: npm install
```

### 1.4 Add Environment Variables
Click **"Environment Variables"** and add these:

**Production Environment:**
```
MONGODB_URI = mongodb+srv://anukarki:3k7GpwHppDs8IU7v@cluster0.6j922hj.mongodb.net/blog?retryWrites=true&w=majority
JWT_SECRET = super-secret-jwt-key-minimum-32-characters-long-for-security-purposes
NODE_ENV = production
ADMIN_EMAIL = hello.ganeshshah@gmail.com
ADMIN_PASSWORD = anukarki
FRONTEND_URL = https://your-frontend-url.vercel.app
```

### 1.5 Deploy Backend
- Click **"Deploy"**
- Wait for deployment to complete
- Copy the backend URL (e.g., `https://blog-backend-xyz.vercel.app`)

---

## 🎨 STEP 2: Deploy Frontend

### 2.1 Create New Project
- Go back to Vercel dashboard
- Click **"New Project"** again

### 2.2 Import Same Repository
- Click **"Import Git Repository"**
- Select your GitHub account
- Choose repository: `ganexhshah/bg` (same repo)
- Click **"Import"**

### 2.3 Configure Frontend Project
```
Project Name: blog-frontend
Framework Preset: Next.js
Root Directory: frontend
Build Command: npm run build
Output Directory: (leave empty - Next.js handles this)
Install Command: npm install
```

### 2.4 Add Frontend Environment Variables
Click **"Environment Variables"** and add:

**Production Environment:**
```
NEXT_PUBLIC_API_URL = https://your-backend-url.vercel.app
NEXT_PUBLIC_APP_URL = https://your-frontend-url.vercel.app
NEXT_PUBLIC_APP_NAME = Your Blog Name
```

### 2.5 Deploy Frontend
- Click **"Deploy"**
- Wait for deployment to complete
- Copy the frontend URL

---

## 🔄 STEP 3: Update Backend Environment

### 3.1 Update Backend FRONTEND_URL
- Go to your backend project in Vercel
- Navigate to **Settings** → **Environment Variables**
- Update `FRONTEND_URL` with your actual frontend URL
- Click **"Save"**

### 3.2 Redeploy Backend
- Go to **Deployments** tab
- Click **"Redeploy"** on the latest deployment

---

## 🧪 STEP 4: Test Your Deployment

### 4.1 Test Backend Health
Visit: `https://your-backend-url.vercel.app/api/health`

Should return:
```json
{
  "status": "OK",
  "message": "API is running on Vercel",
  "mongodb": "Connected"
}
```

### 4.2 Test Frontend
Visit: `https://your-frontend-url.vercel.app`

### 4.3 Test Admin Panel
Visit: `https://your-frontend-url.vercel.app/admin`
Login with:
- Email: `hello.ganeshshah@gmail.com`
- Password: `anukarki`

---

## 🔧 STEP 5: MongoDB Atlas Setup

### 5.1 Configure IP Whitelist
- Go to MongoDB Atlas dashboard
- Navigate to **Network Access**
- Click **"Add IP Address"**
- Add `0.0.0.0/0` (Allow access from anywhere)
- This is required for Vercel serverless functions

### 5.2 Verify Database Connection
- Check that your cluster is running
- Verify the connection string is correct
- Test the connection from the backend health endpoint

---

## 📋 STEP 6: Final Configuration

### 6.1 Custom Domains (Optional)
If you have custom domains:
- Go to project **Settings** → **Domains**
- Add your custom domain
- Update environment variables with new domain

### 6.2 Environment Variables Summary

**Backend Environment Variables:**
```
MONGODB_URI = mongodb+srv://anukarki:3k7GpwHppDs8IU7v@cluster0.6j922hj.mongodb.net/blog?retryWrites=true&w=majority
JWT_SECRET = super-secret-jwt-key-minimum-32-characters-long-for-security-purposes
NODE_ENV = production
ADMIN_EMAIL = hello.ganeshshah@gmail.com
ADMIN_PASSWORD = anukarki
FRONTEND_URL = https://your-frontend-url.vercel.app
```

**Frontend Environment Variables:**
```
NEXT_PUBLIC_API_URL = https://your-backend-url.vercel.app
NEXT_PUBLIC_APP_URL = https://your-frontend-url.vercel.app
NEXT_PUBLIC_APP_NAME = Your Blog Name
```

---

## 🚨 Troubleshooting

### Common Issues:

1. **Backend 500 Error**
   - Check MongoDB connection string
   - Verify all environment variables are set
   - Check deployment logs in Vercel

2. **Frontend API Errors**
   - Verify `NEXT_PUBLIC_API_URL` points to backend
   - Check CORS settings in backend
   - Ensure backend is deployed and working

3. **Build Failures**
   - Check build logs in Vercel
   - Verify all dependencies are in package.json
   - Ensure TypeScript errors are fixed

### Debug Steps:
1. Check Vercel deployment logs
2. Test backend health endpoint
3. Verify environment variables
4. Check browser console for errors
5. Test API endpoints directly

---

## ✅ Success Checklist

- [ ] Backend deployed successfully
- [ ] Frontend deployed successfully
- [ ] Backend health endpoint returns OK
- [ ] Frontend loads without errors
- [ ] Admin login works
- [ ] MongoDB connection established
- [ ] All environment variables set correctly
- [ ] CORS configured properly

---

## 🎉 Final URLs

After successful deployment, you'll have:
- **Frontend**: `https://your-frontend-url.vercel.app`
- **Backend**: `https://your-backend-url.vercel.app`
- **Admin Panel**: `https://your-frontend-url.vercel.app/admin`

Your full-stack blog application is now live on Vercel!