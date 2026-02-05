const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  image: {
    url: {
      type: String,
      required: [true, 'Image URL is required']
    },
    publicId: {
      type: String,
      required: true // For Cloudinary deletion
    },
    alt: {
      type: String,
      default: 'Gallery Image'
    },
    width: Number,
    height: Number,
    format: String,
    size: Number // File size in bytes
  },
  category: {
    type: String,
    enum: ['photoshoot', 'behind-scenes', 'personal', 'professional', 'events', 'other'],
    default: 'other'
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  isInstagramPost: {
    type: Boolean,
    default: true
  },
  instagramData: {
    postId: String,
    likes: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    },
    caption: String,
    hashtags: [String]
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    user: String, // IP address or user ID
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes for performance
gallerySchema.index({ isActive: 1, sortOrder: 1 });
gallerySchema.index({ category: 1, isActive: 1 });
gallerySchema.index({ isInstagramPost: 1, isActive: 1 });
gallerySchema.index({ tags: 1 });

// Virtual for like count
gallerySchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Pre-save middleware
gallerySchema.pre('save', function(next) {
  // Auto-generate title if not provided
  if (!this.title) {
    this.title = `Gallery Image ${new Date().toLocaleDateString()}`;
  }
  
  // Auto-generate alt text if not provided
  if (!this.image.alt || this.image.alt === 'Gallery Image') {
    this.image.alt = this.title || 'Professional model photo';
  }
  
  next();
});

// Method to increment views
gallerySchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to toggle like
gallerySchema.methods.toggleLike = function(userIdentifier) {
  const existingLike = this.likes.find(like => like.user === userIdentifier);
  
  if (existingLike) {
    // Remove like
    this.likes = this.likes.filter(like => like.user !== userIdentifier);
    return { action: 'unliked', count: this.likes.length };
  } else {
    // Add like
    this.likes.push({ user: userIdentifier });
    return { action: 'liked', count: this.likes.length };
  }
};

// Static method to get active gallery images
gallerySchema.statics.getActiveImages = function(options = {}) {
  const { 
    category, 
    isInstagramPost, 
    limit = 20, 
    skip = 0, 
    sort = { sortOrder: 1, createdAt: -1 } 
  } = options;
  
  const query = { isActive: true };
  
  if (category && category !== 'all') {
    query.category = category;
  }
  
  if (typeof isInstagramPost === 'boolean') {
    query.isInstagramPost = isInstagramPost;
  }
  
  return this.find(query)
    .populate('uploadedBy', 'email')
    .sort(sort)
    .limit(limit)
    .skip(skip);
};

// Static method to get Instagram posts
gallerySchema.statics.getInstagramPosts = function(limit = 6) {
  return this.find({ 
    isActive: true, 
    isInstagramPost: true 
  })
  .sort({ sortOrder: 1, createdAt: -1 })
  .limit(limit)
  .select('image title instagramData views likes');
};

// Method to get public data
gallerySchema.methods.getPublicData = function() {
  return {
    _id: this._id,
    title: this.title,
    description: this.description,
    image: this.image,
    category: this.category,
    tags: this.tags,
    isInstagramPost: this.isInstagramPost,
    instagramData: this.instagramData,
    views: this.views,
    likeCount: this.likeCount,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('Gallery', gallerySchema);