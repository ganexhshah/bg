const express = require('express');
const Settings = require('../models/Settings');
const { auth, adminAuth } = require('../middleware/auth');
const { validateSettings } = require('../utils/validation');

const router = express.Router();

// @route   GET /api/settings
// @desc    Get public settings
// @access  Public
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.getCurrentSettings();
    
    res.json({
      success: true,
      data: {
        settings: settings.getPublicSettings()
      }
    });
  } catch (error) {
    console.error('Get public settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings'
    });
  }
});

// @route   GET /api/settings/admin
// @desc    Get all settings for admin
// @access  Private/Admin
router.get('/admin', auth, adminAuth, async (req, res) => {
  try {
    const settings = await Settings.getCurrentSettings();
    
    res.json({
      success: true,
      data: { settings }
    });
  } catch (error) {
    console.error('Get admin settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings'
    });
  }
});

// @route   PUT /api/settings
// @desc    Update settings
// @access  Private/Admin
router.put('/', auth, adminAuth, async (req, res) => {
  try {
    // Validate input
    const { error } = validateSettings(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const settings = await Settings.getCurrentSettings();
    await settings.updateSettings(req.body, req.user._id);

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: { settings }
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update settings'
    });
  }
});

// @route   PUT /api/settings/site
// @desc    Update site settings
// @access  Private/Admin
router.put('/site', auth, adminAuth, async (req, res) => {
  try {
    const settings = await Settings.getCurrentSettings();
    
    if (req.body.site) {
      settings.site = { ...settings.site, ...req.body.site };
    }
    
    settings.lastUpdatedBy = req.user._id;
    await settings.save();

    res.json({
      success: true,
      message: 'Site settings updated successfully',
      data: {
        site: settings.site
      }
    });
  } catch (error) {
    console.error('Update site settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update site settings'
    });
  }
});

// @route   PUT /api/settings/social-media
// @desc    Update social media settings
// @access  Private/Admin
router.put('/social-media', auth, adminAuth, async (req, res) => {
  try {
    const settings = await Settings.getCurrentSettings();
    
    if (req.body.socialMedia) {
      settings.socialMedia = { ...settings.socialMedia, ...req.body.socialMedia };
    }
    
    settings.lastUpdatedBy = req.user._id;
    await settings.save();

    res.json({
      success: true,
      message: 'Social media settings updated successfully',
      data: {
        socialMedia: settings.socialMedia
      }
    });
  } catch (error) {
    console.error('Update social media settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update social media settings'
    });
  }
});

// @route   PUT /api/settings/content
// @desc    Update content settings
// @access  Private/Admin
router.put('/content', auth, adminAuth, async (req, res) => {
  try {
    const settings = await Settings.getCurrentSettings();
    
    if (req.body.content) {
      settings.content = { ...settings.content, ...req.body.content };
    }
    
    settings.lastUpdatedBy = req.user._id;
    await settings.save();

    res.json({
      success: true,
      message: 'Content settings updated successfully',
      data: {
        content: settings.content
      }
    });
  } catch (error) {
    console.error('Update content settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update content settings'
    });
  }
});

// @route   PUT /api/settings/notifications
// @desc    Update notification settings
// @access  Private/Admin
router.put('/notifications', auth, adminAuth, async (req, res) => {
  try {
    const settings = await Settings.getCurrentSettings();
    
    if (req.body.notifications) {
      settings.notifications = { ...settings.notifications, ...req.body.notifications };
    }
    
    settings.lastUpdatedBy = req.user._id;
    await settings.save();

    res.json({
      success: true,
      message: 'Notification settings updated successfully',
      data: {
        notifications: settings.notifications
      }
    });
  } catch (error) {
    console.error('Update notification settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notification settings'
    });
  }
});

// @route   PUT /api/settings/security
// @desc    Update security settings
// @access  Private/Admin
router.put('/security', auth, adminAuth, async (req, res) => {
  try {
    const settings = await Settings.getCurrentSettings();
    
    if (req.body.security) {
      settings.security = { ...settings.security, ...req.body.security };
    }
    
    settings.lastUpdatedBy = req.user._id;
    await settings.save();

    res.json({
      success: true,
      message: 'Security settings updated successfully',
      data: {
        security: settings.security
      }
    });
  } catch (error) {
    console.error('Update security settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update security settings'
    });
  }
});

// @route   PUT /api/settings/theme
// @desc    Update theme settings
// @access  Private/Admin
router.put('/theme', auth, adminAuth, async (req, res) => {
  try {
    const settings = await Settings.getCurrentSettings();
    
    if (req.body.theme) {
      settings.theme = { ...settings.theme, ...req.body.theme };
    }
    
    settings.lastUpdatedBy = req.user._id;
    await settings.save();

    res.json({
      success: true,
      message: 'Theme settings updated successfully',
      data: {
        theme: settings.theme
      }
    });
  } catch (error) {
    console.error('Update theme settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update theme settings'
    });
  }
});

// @route   PUT /api/settings/seo
// @desc    Update SEO settings
// @access  Private/Admin
router.put('/seo', auth, adminAuth, async (req, res) => {
  try {
    const settings = await Settings.getCurrentSettings();
    
    if (req.body.seo) {
      settings.seo = { ...settings.seo, ...req.body.seo };
    }
    
    settings.lastUpdatedBy = req.user._id;
    await settings.save();

    res.json({
      success: true,
      message: 'SEO settings updated successfully',
      data: {
        seo: settings.seo
      }
    });
  } catch (error) {
    console.error('Update SEO settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update SEO settings'
    });
  }
});

// @route   PUT /api/settings/maintenance
// @desc    Toggle maintenance mode
// @access  Private/Admin
router.put('/maintenance', auth, adminAuth, async (req, res) => {
  try {
    const settings = await Settings.getCurrentSettings();
    
    settings.maintenance.enabled = req.body.enabled;
    if (req.body.message) {
      settings.maintenance.message = req.body.message;
    }
    if (req.body.allowedIPs) {
      settings.maintenance.allowedIPs = req.body.allowedIPs;
    }
    
    settings.lastUpdatedBy = req.user._id;
    await settings.save();

    res.json({
      success: true,
      message: `Maintenance mode ${settings.maintenance.enabled ? 'enabled' : 'disabled'}`,
      data: {
        maintenance: settings.maintenance
      }
    });
  } catch (error) {
    console.error('Update maintenance settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update maintenance settings'
    });
  }
});

// @route   POST /api/settings/reset
// @desc    Reset settings to default
// @access  Private/Admin
router.post('/reset', auth, adminAuth, async (req, res) => {
  try {
    // Delete current settings
    await Settings.deleteMany({});
    
    // Create new default settings
    const settings = new Settings({});
    settings.lastUpdatedBy = req.user._id;
    await settings.save();

    res.json({
      success: true,
      message: 'Settings reset to default successfully',
      data: { settings }
    });
  } catch (error) {
    console.error('Reset settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset settings'
    });
  }
});

module.exports = router;