# Deployment Guide

## Vercel Deployment

### Prerequisites
1. Create a Vercel account at https://vercel.com
2. Install Vercel CLI: `npm i -g vercel`

### Frontend Deployment
1. Navigate to the frontend directory
2. Run `vercel` and follow the prompts
3. Set environment variables in Vercel dashboard:
   - Add your backend API URL
   - Add any other required environment variables

### Backend Deployment Options

#### Option 1: Deploy Backend to Vercel (Serverless)
1. The backend is configured to work with Vercel serverless functions
2. Environment variables needed:
   - Database connection strings
   - JWT secrets
   - Any API keys

#### Option 2: Deploy Backend to Railway/Render/Heroku
1. Create account on your preferred platform
2. Connect your GitHub repository
3. Set environment variables
4. Deploy the backend folder

### Environment Variables Setup

#### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=your-backend-url
NEXT_PUBLIC_APP_URL=your-frontend-url
```

#### Backend (.env)
```
PORT=5000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
NODE_ENV=production
```

### Database Setup
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get the connection string
4. Add it to your backend environment variables

### Steps to Deploy

1. **Push to GitHub** (Already done)
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy Frontend to Vercel**
   - Go to https://vercel.com/dashboard
   - Click "New Project"
   - Import your GitHub repository
   - Set root directory to `frontend`
   - Add environment variables
   - Deploy

3. **Deploy Backend**
   - For Vercel: Create another project, set root to `backend`
   - For other platforms: Follow their deployment guides

4. **Update Frontend API URL**
   - Update the API URL in frontend environment variables
   - Redeploy frontend if needed

### Post-Deployment Checklist
- [ ] Frontend loads correctly
- [ ] Backend API endpoints respond
- [ ] Database connection works
- [ ] Authentication flows work
- [ ] File uploads work (if applicable)
- [ ] All environment variables are set correctly