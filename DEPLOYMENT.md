# Complete Vercel Deployment Guide

## 🚀 Quick Deployment Steps

### Step 1: Deploy Backend to Vercel

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Click "New Project"

2. **Import Repository**
   - Select your GitHub repository: `ganexhshah/bg`
   - Click "Import"

3. **Configure Backend Project**
   - **Project Name**: `your-project-backend`
   - **Root Directory**: `backend`
   - **Framework Preset**: Other
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

4. **Add Environment Variables**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=your-secure-password
   ```

5. **Deploy Backend**
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy the backend URL (e.g., `https://your-project-backend.vercel.app`)

### Step 2: Deploy Frontend to Vercel

1. **Create New Project**
   - Click "New Project" again
   - Import the same repository

2. **Configure Frontend Project**
   - **Project Name**: `your-project-frontend`
   - **Root Directory**: `frontend`
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

3. **Add Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-project-backend.vercel.app
   NEXT_PUBLIC_APP_URL=https://your-project-frontend.vercel.app
   NEXT_PUBLIC_APP_NAME=Your App Name
   ```

4. **Deploy Frontend**
   - Click "Deploy"
   - Wait for deployment to complete

### Step 3: Update Backend CORS

1. **Go to Backend Project Settings**
   - Navigate to your backend project in Vercel
   - Go to Settings → Environment Variables
   - Update `FRONTEND_URL` with your actual frontend URL

2. **Redeploy Backend**
   - Go to Deployments tab
   - Click "Redeploy" on the latest deployment

## 📋 Prerequisites Setup

### 1. MongoDB Atlas Setup
1. Create account at https://cloud.mongodb.com
2. Create a new cluster (free tier available)
3. Create database user with read/write permissions
4. Get connection string from "Connect" → "Connect your application"
5. Replace `<password>` and `<dbname>` in the connection string

### 2. Environment Variables Explained

#### Backend Environment Variables
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: Random string (minimum 32 characters) for JWT signing
- `NODE_ENV`: Set to "production"
- `FRONTEND_URL`: Your frontend Vercel URL (for CORS)
- `ADMIN_EMAIL`: Email for admin account creation
- `ADMIN_PASSWORD`: Password for admin account

#### Frontend Environment Variables
- `NEXT_PUBLIC_API_URL`: Your backend Vercel URL
- `NEXT_PUBLIC_APP_URL`: Your frontend Vercel URL
- `NEXT_PUBLIC_APP_NAME`: Display name for your app

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `FRONTEND_URL` in backend matches your frontend domain
   - Check that both URLs use HTTPS

2. **Database Connection Failed**
   - Verify MongoDB URI is correct
   - Check database user permissions
   - Ensure IP whitelist includes 0.0.0.0/0 for Vercel

3. **API Routes Not Working**
   - Check backend deployment logs in Vercel
   - Verify all environment variables are set
   - Test API endpoints directly

4. **Build Failures**
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are in package.json
   - Verify Node.js version compatibility

### Testing Deployment

1. **Test Backend**
   - Visit: `https://your-backend-url.vercel.app/api/health`
   - Should return JSON with status "OK"

2. **Test Frontend**
   - Visit your frontend URL
   - Check browser console for errors
   - Test login functionality

## 📱 Post-Deployment Setup

1. **Admin Account**
   - Visit your frontend URL
   - Go to `/admin` route
   - Login with the credentials you set in environment variables

2. **Content Setup**
   - Add your profile information
   - Upload gallery images
   - Create your first story
   - Configure site settings

3. **Domain Setup (Optional)**
   - In Vercel project settings, go to "Domains"
   - Add your custom domain
   - Update environment variables with new domain

## 🔄 Future Updates

To update your deployed application:

1. **Make changes locally**
2. **Commit and push to GitHub**
   ```bash
   git add .
   git commit -m "Update description"
   git push origin main
   ```
3. **Vercel auto-deploys** from your main branch

## 📊 Monitoring

- **Vercel Analytics**: Available in project dashboard
- **Function Logs**: Check for backend errors
- **Performance**: Monitor in Vercel dashboard
- **Uptime**: Vercel provides 99.99% uptime SLA