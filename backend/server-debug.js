const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

console.log('Starting server...');

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

console.log('Middleware configured...');

// Test route
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is working!'
  });
});

// Try importing routes one by one
try {
  console.log('Importing auth routes...');
  const authRoutes = require('./routes/auth');
  app.use('/api/auth', authRoutes);
  console.log('Auth routes loaded successfully');
} catch (error) {
  console.error('Error loading auth routes:', error.message);
}

try {
  console.log('Importing story routes...');
  const storyRoutes = require('./routes/stories');
  app.use('/api/stories', storyRoutes);
  console.log('Story routes loaded successfully');
} catch (error) {
  console.error('Error loading story routes:', error.message);
}

try {
  console.log('Importing profile routes...');
  const profileRoutes = require('./routes/profile');
  app.use('/api/profile', profileRoutes);
  console.log('Profile routes loaded successfully');
} catch (error) {
  console.error('Error loading profile routes:', error.message);
}

try {
  console.log('Importing gallery routes...');
  const galleryRoutes = require('./routes/gallery');
  app.use('/api/gallery', galleryRoutes);
  console.log('Gallery routes loaded successfully');
} catch (error) {
  console.error('Error loading gallery routes:', error.message);
}

try {
  console.log('Importing settings routes...');
  const settingsRoutes = require('./routes/settings');
  app.use('/api/settings', settingsRoutes);
  console.log('Settings routes loaded successfully');
} catch (error) {
  console.error('Error loading settings routes:', error.message);
}

console.log('Routes configured...');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

console.log('Server setup complete...');