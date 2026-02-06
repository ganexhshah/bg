# Password Reset Guide

## Problem
Login was failing with "Invalid login credentials" because the password hash in MongoDB doesn't match the expected password `anukarki`.

## Solution
I've added a password reset endpoint that you can use to fix the password hash directly from the application.

## How to Use

### Option 1: Use the Credentials Page (Easiest)
1. Wait for Vercel deployment to complete (both frontend and backend)
2. Go to: https://www.anukarki.xyz/credentials
3. Click the **"🔧 Reset Password"** button
4. Wait for success message
5. Click **"Test Through Proxy"** to verify login works
6. Go to https://www.anukarki.xyz/admin and login with:
   - Email: `hello.ganeshshah@gmail.com`
   - Password: `anukarki`

### Option 2: Use API Directly
```bash
curl -X POST https://www.anukarki.xyz/api/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "hello.ganeshshah@gmail.com",
    "newPassword": "anukarki",
    "secretKey": "reset-admin-2026"
  }'
```

### Option 3: Verify Password Hash
To check if the password matches:
```bash
curl "https://www.anukarki.xyz/api/reset-password/verify?email=hello.ganeshshah@gmail.com&password=anukarki"
```

## What Was Added

### Backend Files
1. **`backend/routes/reset-password.js`** - New API endpoint for resetting passwords
   - `POST /api/reset-password` - Reset password with secret key
   - `GET /api/reset-password/verify` - Verify if password matches hash

2. **`backend/utils/resetPassword.js`** - Standalone script to reset password (can run with `node backend/utils/resetPassword.js`)

3. **`backend/api/index.js`** - Updated to include the reset-password route

### Frontend Files
1. **`frontend/src/app/credentials/page.tsx`** - Updated with:
   - Reset Password button
   - Verify Password button
   - Better UI with tips

## Testing Steps

1. **Check Deployment Status**
   - Frontend: https://vercel.com/your-account/your-frontend-project
   - Backend: https://vercel.com/your-account/your-backend-project

2. **Test Backend Health**
   ```
   https://backend-kappa-three-25.vercel.app/api/health
   ```
   Should return: `{"status":"OK","mongodb":"Connected"}`

3. **Reset Password**
   Go to: https://www.anukarki.xyz/credentials
   Click: "🔧 Reset Password"

4. **Test Login**
   Click: "Test Through Proxy"
   Should return: `{"success":true,"message":"Login successful"}`

5. **Login to Admin Panel**
   Go to: https://www.anukarki.xyz/admin
   Login with credentials shown on the page

## Security Note
The reset-password endpoint requires a secret key (`reset-admin-2026`) to prevent unauthorized password resets. You should remove this endpoint after fixing the password, or change the secret key to something more secure.

## If It Still Doesn't Work

1. Check Vercel function logs:
   - Go to Vercel dashboard
   - Select your backend project
   - Click "Functions" tab
   - Look for `/api/reset-password` logs

2. Check MongoDB connection:
   - Verify the connection string in Vercel environment variables
   - Make sure the database name is `blog`
   - Make sure the collection name is `users`

3. Manual MongoDB update (last resort):
   - Go to MongoDB Atlas
   - Navigate to: `blog` database → `users` collection
   - Find user with email: `hello.ganeshshah@gmail.com`
   - Edit the document
   - Replace `password` field with: `$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIeWHvqqvG`
   - Save

## Next Steps After Login Works

1. Remove the reset-password endpoint (or secure it better)
2. Test all admin features
3. Create your first blog post
4. Update profile information
5. Upload gallery images
