# Sonika Karki Backend API

A complete Node.js backend API for Sonika Karki's professional model website with admin management system.

## 🚀 Features

- **Authentication & Authorization** with JWT
- **Story Management** (CRUD operations)
- **Profile Management** with image uploads
- **Gallery Management** with Cloudinary integration
- **Settings Management** for site configuration
- **Admin Dashboard** with full control
- **Image Upload** with optimization
- **Comment System** with moderation
- **Like System** for stories and images
- **SEO Management** with meta tags
- **Security Features** (rate limiting, validation)

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication tokens
- **Cloudinary** - Image storage and optimization
- **Multer** - File upload handling
- **Joi** - Data validation
- **Bcrypt** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Database
   MONGODB_URI=mongodb+srv://anukarki:3k7GpwHppDs8IU7v@cluster0.6j922hj.mongodb.net/sonika-karki?retryWrites=true&w=majority&appName=Cluster0

   # JWT
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d

   # Server
   PORT=5000
   NODE_ENV=development

   # Cloudinary (for image uploads)
   CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret

   # Admin Credentials
   ADMIN_EMAIL=admin@sonikakarki.com
   ADMIN_PASSWORD=admin123
   ```

4. **Start the server**
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user (admin only)
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/change-password` - Change password
- `GET /api/auth/verify-token` - Verify JWT token

### Stories
- `GET /api/stories` - Get published stories
- `GET /api/stories/popular` - Get popular stories
- `GET /api/stories/admin` - Get all stories (admin)
- `GET /api/stories/:id` - Get single story
- `POST /api/stories` - Create new story (admin)
- `PUT /api/stories/:id` - Update story (admin)
- `DELETE /api/stories/:id` - Delete story (admin)
- `POST /api/stories/:id/like` - Toggle like on story
- `POST /api/stories/:id/comments` - Add comment to story

### Profile
- `GET /api/profile` - Get public profile
- `GET /api/profile/admin` - Get full profile (admin)
- `PUT /api/profile` - Update profile (admin)
- `POST /api/profile/upload-image` - Upload profile image (admin)
- `PUT /api/profile/stats` - Update profile stats (admin)
- `PUT /api/profile/services` - Update services (admin)

### Gallery
- `GET /api/gallery` - Get gallery images
- `GET /api/gallery/instagram` - Get Instagram posts
- `GET /api/gallery/admin` - Get all images (admin)
- `GET /api/gallery/:id` - Get single image
- `POST /api/gallery/upload` - Upload new image (admin)
- `PUT /api/gallery/:id` - Update image (admin)
- `DELETE /api/gallery/:id` - Delete image (admin)
- `POST /api/gallery/:id/like` - Toggle like on image
- `PUT /api/gallery/reorder` - Reorder gallery images (admin)

### Settings
- `GET /api/settings` - Get public settings
- `GET /api/settings/admin` - Get all settings (admin)
- `PUT /api/settings` - Update all settings (admin)
- `PUT /api/settings/site` - Update site settings (admin)
- `PUT /api/settings/social-media` - Update social media (admin)
- `PUT /api/settings/content` - Update content settings (admin)
- `PUT /api/settings/notifications` - Update notifications (admin)
- `PUT /api/settings/security` - Update security settings (admin)
- `PUT /api/settings/theme` - Update theme settings (admin)
- `PUT /api/settings/seo` - Update SEO settings (admin)
- `PUT /api/settings/maintenance` - Toggle maintenance mode (admin)
- `POST /api/settings/reset` - Reset to default settings (admin)

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Default Admin Credentials
- **Email:** admin@sonikakarki.com
- **Password:** admin123

## 📊 Database Models

### User
- Email, password, role (admin/user)
- Login attempts and account locking
- JWT token generation

### Story
- Title, content, category, tags
- Status (draft/published/archived)
- Views, likes, comments
- SEO metadata

### Profile
- Personal information and bio
- Social media links
- Services configuration
- Statistics tracking

### Gallery
- Image metadata and Cloudinary info
- Categories and tags
- Instagram post data
- Views and likes

### Settings
- Site configuration
- Theme customization
- Security settings
- SEO configuration

## 🛡️ Security Features

- **JWT Authentication** with expiration
- **Password Hashing** with bcrypt
- **Rate Limiting** for API endpoints
- **Input Validation** with Joi
- **CORS Configuration** for frontend
- **Helmet** for security headers
- **Account Locking** after failed attempts

## 📁 Project Structure

```
backend/
├── models/           # Database models
├── routes/           # API routes
├── middleware/       # Custom middleware
├── utils/           # Utility functions
├── .env             # Environment variables
├── server.js        # Main server file
└── package.json     # Dependencies
```

## 🚀 Deployment

1. **Set environment variables** for production
2. **Configure MongoDB** connection
3. **Set up Cloudinary** for image storage
4. **Deploy to your preferred platform** (Heroku, DigitalOcean, AWS, etc.)

## 📝 API Response Format

All API responses follow this format:

```json
{
  "success": true/false,
  "message": "Response message",
  "data": {
    // Response data
  }
}
```

## 🔧 Development

- **Nodemon** for auto-restart during development
- **Environment-based configuration**
- **Comprehensive error handling**
- **Input validation and sanitization**
- **Structured logging**

## 📞 Support

For support or questions, contact: admin@sonikakarki.com

---

Built with ❤️ for Sonika Karki's Professional Model Website