const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// @route   POST /api/reset-password
// @desc    Reset admin password (temporary endpoint for debugging)
// @access  Public (should be removed in production)
router.post('/', async (req, res) => {
  try {
    const { email, newPassword, secretKey } = req.body;

    // Simple security check - require a secret key
    if (secretKey !== 'reset-admin-2026') {
      return res.status(403).json({
        success: false,
        message: 'Invalid secret key'
      });
    }

    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email and new password are required'
      });
    }

    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password directly
    await User.updateOne(
      { email },
      { 
        $set: { 
          password: hashedPassword,
          loginAttempts: 0,
          lockUntil: undefined
        }
      }
    );

    res.json({
      success: true,
      message: 'Password reset successfully',
      data: {
        email,
        newPasswordHash: hashedPassword
      }
    });
  } catch (error) {
    console.error('Reset password error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to reset password',
      error: error.message
    });
  }
});

// @route   GET /api/reset-password/verify
// @desc    Verify password hash
// @access  Public
router.get('/verify', async (req, res) => {
  try {
    const { email, password } = req.query;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    res.json({
      success: true,
      data: {
        email,
        passwordMatch: isMatch,
        currentHash: user.password,
        isLocked: user.isLocked,
        loginAttempts: user.loginAttempts
      }
    });
  } catch (error) {
    console.error('Verify password error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to verify password',
      error: error.message
    });
  }
});

module.exports = router;
