const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // Site Information
  site: {
    name: {
      type: String,
      required: true,
      default: 'Sonika Karki - Professional Model'
    },
    description: {
      type: String,
      default: 'Professional model and content creator sharing my journey and experiences'
    },
    url: {
      type: String,
      default: 'https://sonikakarki.com'
    },
    logo: {
      url: String,
      publicId: String
    },
    favicon: {
      url: String,
      publicId: String
    }
  },
  
  // Social Media Settings
  socialMedia: {
    facebook: {
      url: String,
      pageId: String
    },
    instagram: {
      url: String,
      username: String
    },
    telegram: {
      url: String,
      channelName: String
    },
    twitter: {
      url: String,
      username: String
    }
  },
  
  // Content Settings
  content: {
    storiesPerPage: {
      type: Number,
      default: 6,
      min: 3,
      max: 20
    },
    galleryImagesPerPage: {
      type: Number,
      default: 12,
      min: 6,
      max: 50
    },
    enableComments: {
      type: Boolean,
      default: true
    },
    enableLikes: {
      type: Boolean,
      default: true
    },
    enableSharing: {
      type: Boolean,
      default: true
    },
    moderateComments: {
      type: Boolean,
      default: false
    },
    allowGuestComments: {
      type: Boolean,
      default: true
    }
  },
  
  // Notification Settings
  notifications: {
    email: {
      enabled: {
        type: Boolean,
        default: true
      },
      newComment: {
        type: Boolean,
        default: true
      },
      newLike: {
        type: Boolean,
        default: false
      },
      newStoryView: {
        type: Boolean,
        default: false
      }
    },
    adminEmail: {
      type: String,
      default: 'admin@sonikakarki.com'
    }
  },
  
  // Security Settings
  security: {
    requireLoginForStories: {
      type: Boolean,
      default: false
    },
    enableCaptcha: {
      type: Boolean,
      default: false
    },
    sessionTimeout: {
      type: Number,
      default: 30, // minutes
      min: 15,
      max: 480
    },
    maxLoginAttempts: {
      type: Number,
      default: 5,
      min: 3,
      max: 10
    },
    lockoutDuration: {
      type: Number,
      default: 30, // minutes
      min: 5,
      max: 1440
    }
  },
  
  // Theme Settings
  theme: {
    primaryColor: {
      type: String,
      default: '#8B5CF6'
    },
    secondaryColor: {
      type: String,
      default: '#EC4899'
    },
    accentColor: {
      type: String,
      default: '#10B981'
    },
    fontFamily: {
      type: String,
      default: 'Inter, sans-serif'
    },
    borderRadius: {
      type: String,
      default: '0px' // Neobrutalism style
    }
  },
  
  // SEO Settings
  seo: {
    metaTitle: {
      type: String,
      default: 'Sonika Karki - Professional Model & Content Creator'
    },
    metaDescription: {
      type: String,
      default: 'Professional model sharing stories, experiences, and behind-the-scenes content'
    },
    keywords: [{
      type: String,
      trim: true,
      lowercase: true
    }],
    ogImage: {
      url: String,
      publicId: String
    },
    twitterCard: {
      type: String,
      enum: ['summary', 'summary_large_image'],
      default: 'summary_large_image'
    }
  },
  
  // Analytics Settings
  analytics: {
    googleAnalyticsId: String,
    facebookPixelId: String,
    enableTracking: {
      type: Boolean,
      default: true
    }
  },
  
  // Performance Settings
  performance: {
    enableCaching: {
      type: Boolean,
      default: true
    },
    cacheTimeout: {
      type: Number,
      default: 3600 // seconds
    },
    enableCompression: {
      type: Boolean,
      default: true
    },
    maxImageSize: {
      type: Number,
      default: 5 * 1024 * 1024 // 5MB in bytes
    }
  },
  
  // Maintenance Mode
  maintenance: {
    enabled: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: 'Site is under maintenance. Please check back later.'
    },
    allowedIPs: [String]
  },
  
  // Last updated info
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
settingsSchema.index({ _id: 1 }, { unique: true });

// Static method to get current settings
settingsSchema.statics.getCurrentSettings = async function() {
  let settings = await this.findOne();
  
  if (!settings) {
    // Create default settings if none exist
    settings = new this({});
    await settings.save();
  }
  
  return settings;
};

// Method to update settings
settingsSchema.methods.updateSettings = function(updates, userId) {
  Object.assign(this, updates);
  this.lastUpdatedBy = userId;
  return this.save();
};

// Method to get public settings (safe for frontend)
settingsSchema.methods.getPublicSettings = function() {
  return {
    site: this.site,
    socialMedia: this.socialMedia,
    content: {
      storiesPerPage: this.content.storiesPerPage,
      galleryImagesPerPage: this.content.galleryImagesPerPage,
      enableComments: this.content.enableComments,
      enableLikes: this.content.enableLikes,
      enableSharing: this.content.enableSharing
    },
    theme: this.theme,
    seo: this.seo,
    analytics: {
      googleAnalyticsId: this.analytics.googleAnalyticsId,
      enableTracking: this.analytics.enableTracking
    },
    maintenance: this.maintenance
  };
};

// Pre-save middleware
settingsSchema.pre('save', function(next) {
  // Ensure SEO keywords are properly formatted
  if (this.seo.keywords) {
    this.seo.keywords = this.seo.keywords.map(keyword => 
      keyword.toLowerCase().trim()
    ).filter(keyword => keyword.length > 0);
  }
  
  // Set default keywords if none provided
  if (!this.seo.keywords || this.seo.keywords.length === 0) {
    this.seo.keywords = ['model', 'content creator', 'photography', 'lifestyle', 'stories'];
  }
  
  next();
});

module.exports = mongoose.model('Settings', settingsSchema);