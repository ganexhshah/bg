const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Trust proxy - needed for rate limiting behind reverse proxies
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, 'https://vercel.app', 'https://*.vercel.app']
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB connection with better error handling
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }

  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });

    isConnected = true;
    console.log('✅ Connected to MongoDB');

    // Initialize admin user
    try {
      require('../utils/initAdmin')();
    } catch (error) {
      console.log('Admin initialization skipped:', error.message);
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
};

// Import routes with error handling
let authRoutes, storyRoutes, profileRoutes, galleryRoutes, settingsRoutes, analyticsRoutes, resetPasswordRoutes;

try {
  authRoutes = require('../routes/auth');
  storyRoutes = require('../routes/stories');
  profileRoutes = require('../routes/profile');
  galleryRoutes = require('../routes/gallery');
  settingsRoutes = require('../routes/settings');
  analyticsRoutes = require('../routes/analytics');
  resetPasswordRoutes = require('../routes/reset-password');
} catch (error) {
  console.error('Error loading routes:', error);
}

// Routes
if (authRoutes) app.use('/api/auth', authRoutes);
if (storyRoutes) app.use('/api/stories', storyRoutes);
if (profileRoutes) app.use('/api/profile', profileRoutes);
if (galleryRoutes) app.use('/api/gallery', galleryRoutes);
if (settingsRoutes) app.use('/api/settings', settingsRoutes);
if (analyticsRoutes) app.use('/api/analytics', analyticsRoutes);
if (resetPasswordRoutes) app.use('/api/reset-password', resetPasswordRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await connectToDatabase();
    res.json({
      status: 'OK',
      message: 'API is running on Vercel',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      mongodb: isConnected ? 'Connected' : 'Disconnected'
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Database connection failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Backend API is running',
    endpoints: [
      '/api/auth',
      '/api/stories', 
      '/api/profile',
      '/api/gallery',
      '/api/settings',
      '/api/analytics',
      '/api/health'
    ]
  });
});

// Connect to database before handling requests
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('❌ Error:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

module.exports = app;