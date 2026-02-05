const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  title: {
    type: String,
    required: [true, 'Professional title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  bio: {
    type: String,
    maxlength: [1000, 'Bio cannot exceed 1000 characters'],
    trim: true
  },
  profileImage: {
    url: {
      type: String,
      default: '/profile/default-avatar.jpg'
    },
    publicId: String, // For Cloudinary
    alt: {
      type: String,
      default: 'Profile Picture'
    }
  },
  socialMedia: {
    instagram: {
      username: {
        type: String,
        trim: true
      },
      url: {
        type: String,
        trim: true
      },
      followersCount: {
        type: Number,
        default: 0
      }
    },
    facebook: {
      url: {
        type: String,
        trim: true
      }
    },
    telegram: {
      username: {
        type: String,
        trim: true
      },
      channelName: {
        type: String,
        trim: true,
        default: 'Join our channel!'
      },
      url: {
        type: String,
        trim: true
      }
    },
    twitter: {
      username: {
        type: String,
        trim: true
      },
      url: {
        type: String,
        trim: true
      }
    }
  },
  contact: {
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    },
    location: {
      city: String,
      country: String
    }
  },
  services: {
    meetup: {
      available: {
        type: Boolean,
        default: false
      },
      description: {
        type: String,
        default: 'Meetup services currently unavailable'
      },
      pricing: {
        type: String
      }
    },
    videoCall: {
      available: {
        type: Boolean,
        default: true
      },
      packages: [{
        name: {
          type: String,
          required: true
        },
        duration: {
          type: String,
          required: true
        },
        price: {
          type: Number,
          required: true
        },
        currency: {
          type: String,
          default: 'Rs.'
        },
        description: String,
        features: [String]
      }]
    }
  },
  stats: {
    totalViews: {
      type: Number,
      default: 0
    },
    totalLikes: {
      type: Number,
      default: 0
    },
    totalStories: {
      type: Number,
      default: 0
    },
    totalComments: {
      type: Number,
      default: 0
    }
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for performance
profileSchema.index({ isActive: 1 });

// Pre-save middleware to update SEO fields
profileSchema.pre('save', function(next) {
  if (!this.seo.metaTitle) {
    this.seo.metaTitle = `${this.name} - ${this.title}`;
  }
  
  if (!this.seo.metaDescription) {
    this.seo.metaDescription = this.bio || `${this.name} is a ${this.title}. Connect and explore stories, experiences, and professional content.`;
  }
  
  next();
});

// Method to update stats
profileSchema.methods.updateStats = async function() {
  const Story = mongoose.model('Story');
  
  const stats = await Story.aggregate([
    { $match: { status: 'published' } },
    {
      $group: {
        _id: null,
        totalStories: { $sum: 1 },
        totalViews: { $sum: '$views' },
        totalLikes: { $sum: { $size: '$likes' } },
        totalComments: { $sum: { $size: '$comments' } }
      }
    }
  ]);
  
  if (stats.length > 0) {
    this.stats = {
      totalStories: stats[0].totalStories,
      totalViews: stats[0].totalViews,
      totalLikes: stats[0].totalLikes,
      totalComments: stats[0].totalComments
    };
  }
  
  return this.save();
};

// Static method to get active profile
profileSchema.statics.getActiveProfile = function() {
  return this.findOne({ isActive: true });
};

// Method to get public profile data
profileSchema.methods.getPublicData = function() {
  return {
    name: this.name,
    title: this.title,
    bio: this.bio,
    profileImage: this.profileImage,
    socialMedia: this.socialMedia,
    services: this.services,
    stats: this.stats,
    seo: this.seo
  };
};

module.exports = mongoose.model('Profile', profileSchema);