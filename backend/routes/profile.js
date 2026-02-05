const express = require('express');
const Profile = require('../models/Profile');
const { auth, adminAuth } = require('../middleware/auth');
const { validateProfile } = require('../utils/validation');
const { upload, handleUploadError } = require('../utils/upload');

const router = express.Router();

// @route   GET /api/profile
// @desc    Get active profile
// @access  Public
router.get('/', async (req, res) => {
  try {
    const profile = await Profile.getActiveProfile();
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.json({
      success: true,
      data: {
        profile: profile.getPublicData()
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
});

// @route   GET /api/profile/admin
// @desc    Get profile for admin (full data)
// @access  Private/Admin
router.get('/admin', auth, adminAuth, async (req, res) => {
  try {
    const profile = await Profile.getActiveProfile();
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.json({
      success: true,
      data: { profile }
    });
  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
});

// @route   PUT /api/profile
// @desc    Update profile
// @access  Private/Admin
router.put('/', auth, adminAuth, async (req, res) => {
  try {
    console.log('Profile update request body:', JSON.stringify(req.body, null, 2));
    
    // Validate input
    const { error } = validateProfile(req.body);
    if (error) {
      console.log('Validation error:', error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    let profile = await Profile.getActiveProfile();
    
    if (!profile) {
      // Create new profile if none exists
      profile = new Profile(req.body);
    } else {
      // Update existing profile
      Object.assign(profile, req.body);
    }

    await profile.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { profile }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

// @route   POST /api/profile/upload-image
// @desc    Upload profile image
// @access  Private/Admin
router.post('/upload-image', auth, adminAuth, upload.single('profileImage'), async (req, res) => {
  try {
    console.log('Upload request received:', {
      file: req.file ? 'File present' : 'No file',
      body: req.body
    });

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    let profile = await Profile.getActiveProfile();
    
    if (!profile) {
      // Create new profile if none exists
      profile = new Profile({
        name: 'Sonika Karki',
        title: 'VC Girl & Professional Model',
        bio: 'Professional model and content creator'
      });
    }

    // Update profile image
    profile.profileImage = {
      url: req.file.path, // Cloudinary URL
      publicId: req.file.filename, // Cloudinary public ID
      alt: req.body.alt || 'Profile Picture'
    };

    await profile.save();

    console.log('Profile image updated:', profile.profileImage);

    res.json({
      success: true,
      message: 'Profile image updated successfully',
      data: {
        profileImage: profile.profileImage,
        imageUrl: profile.profileImage.url // Add this for frontend compatibility
      }
    });
  } catch (error) {
    console.error('Upload profile image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload profile image'
    });
  }
});

// @route   PUT /api/profile/stats
// @desc    Update profile stats
// @access  Private/Admin
router.put('/stats', auth, adminAuth, async (req, res) => {
  try {
    const profile = await Profile.getActiveProfile();
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    await profile.updateStats();

    res.json({
      success: true,
      message: 'Profile stats updated successfully',
      data: {
        stats: profile.stats
      }
    });
  } catch (error) {
    console.error('Update profile stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile stats'
    });
  }
});

// @route   PUT /api/profile/services
// @desc    Update services configuration
// @access  Private/Admin
router.put('/services', auth, adminAuth, async (req, res) => {
  try {
    const profile = await Profile.getActiveProfile();
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Update services
    if (req.body.meetup) {
      profile.services.meetup = { ...profile.services.meetup, ...req.body.meetup };
    }
    
    if (req.body.videoCall) {
      profile.services.videoCall = { ...profile.services.videoCall, ...req.body.videoCall };
    }

    await profile.save();

    res.json({
      success: true,
      message: 'Services updated successfully',
      data: {
        services: profile.services
      }
    });
  } catch (error) {
    console.error('Update services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update services'
    });
  }
});

module.exports = router;