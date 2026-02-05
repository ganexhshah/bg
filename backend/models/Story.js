const mongoose = require('mongoose');

// Function to generate slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Story title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    index: true
  },
  content: {
    type: String,
    required: [true, 'Story content is required'],
    minlength: [50, 'Content must be at least 50 characters']
  },
  preview: {
    type: String,
    maxlength: [300, 'Preview cannot exceed 300 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['personal', 'work', 'lifestyle'],
    default: 'personal'
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  publishedAt: {
    type: Date
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    user: {
      type: String, // IP address or user ID
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      name: {
        type: String,
        required: true,
        trim: true
      },
      email: {
        type: String,
        trim: true,
        lowercase: true
      }
    },
    text: {
      type: String,
      required: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    isApproved: {
      type: Boolean,
      default: true
    }
  }],
  readTime: {
    type: String,
    default: function() {
      // Calculate read time based on content length (average 200 words per minute)
      const wordCount = this.content.split(' ').length;
      const minutes = Math.ceil(wordCount / 200);
      return `${minutes} min read`;
    }
  },
  seo: {
    metaTitle: {
      type: String,
      maxlength: [60, 'Meta title cannot exceed 60 characters']
    },
    metaDescription: {
      type: String,
      maxlength: [160, 'Meta description cannot exceed 160 characters']
    },
    keywords: [{
      type: String,
      trim: true,
      lowercase: true
    }]
  }
}, {
  timestamps: true
});

// Indexes for performance
storySchema.index({ status: 1, publishedAt: -1 });
storySchema.index({ category: 1, status: 1 });
storySchema.index({ tags: 1 });
storySchema.index({ 'likes.user': 1 });

// Virtual for like count
storySchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for comment count
storySchema.virtual('commentCount').get(function() {
  return this.comments.filter(comment => comment.isApproved).length;
});

// Virtual for isNew (published within last 7 days)
storySchema.virtual('isNew').get(function() {
  if (!this.publishedAt) return false;
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  return this.publishedAt > weekAgo;
});

// Pre-save middleware to generate slug and SEO fields
storySchema.pre('save', async function(next) {
  // Generate slug from title if it's new or title changed
  if (this.isNew || this.isModified('title')) {
    let baseSlug = generateSlug(this.title);
    let slug = baseSlug;
    let counter = 1;
    
    // Ensure slug is unique
    while (await this.constructor.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    this.slug = slug;
  }
  
  // Auto-generate preview if not provided
  if (!this.preview && this.content) {
    this.preview = this.content.substring(0, 150) + (this.content.length > 150 ? '...' : '');
  }
  
  // Set publishedAt when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  // Auto-generate SEO fields
  if (!this.seo.metaTitle) {
    this.seo.metaTitle = this.title.length > 60 ? this.title.substring(0, 57) + '...' : this.title;
  }
  
  if (!this.seo.metaDescription) {
    const description = this.preview || this.content.substring(0, 160);
    this.seo.metaDescription = description.length > 160 ? description.substring(0, 157) + '...' : description;
  }
  
  // Auto-generate keywords from title and tags
  if (!this.seo.keywords || this.seo.keywords.length === 0) {
    const titleWords = this.title.toLowerCase().split(' ').filter(word => word.length > 3);
    const keywords = [...new Set([...titleWords, ...this.tags])]; // Remove duplicates
    this.seo.keywords = keywords.slice(0, 10); // Limit to 10 keywords
  }
  
  next();
});

// Method to increment views
storySchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to add like
storySchema.methods.addLike = function(userIdentifier) {
  const existingLike = this.likes.find(like => like.user === userIdentifier);
  
  if (existingLike) {
    // Remove like (unlike)
    this.likes = this.likes.filter(like => like.user !== userIdentifier);
    return { action: 'unliked', count: this.likes.length };
  } else {
    // Add like
    this.likes.push({ user: userIdentifier });
    return { action: 'liked', count: this.likes.length };
  }
};

// Method to add comment
storySchema.methods.addComment = function(commentData) {
  this.comments.push(commentData);
  return this.save();
};

// Method to add reply to a comment
storySchema.methods.addReply = function(commentId, replyData) {
  const comment = this.comments.id(commentId);
  if (!comment) {
    throw new Error('Comment not found');
  }
  
  if (!comment.replies) {
    comment.replies = [];
  }
  
  comment.replies.push(replyData);
  return this.save();
};

// Static method to get published stories
storySchema.statics.getPublished = function(options = {}) {
  const { category, limit = 10, skip = 0, sort = { publishedAt: -1 } } = options;
  
  const query = { status: 'published' };
  if (category && category !== 'all') {
    query.category = category;
  }
  
  return this.find(query)
    .populate('author', 'email')
    .sort(sort)
    .limit(limit)
    .skip(skip)
    .select('-comments.user.email'); // Don't expose commenter emails
};

// Static method to find story by slug or ID
storySchema.statics.findBySlugOrId = function(identifier) {
  // Check if identifier is a valid ObjectId
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);
  
  if (isObjectId) {
    return this.findById(identifier);
  } else {
    return this.findOne({ slug: identifier });
  }
};

// Static method to get popular stories
storySchema.statics.getPopular = function(limit = 5) {
  return this.aggregate([
    { $match: { status: 'published' } },
    { $addFields: { likeCount: { $size: '$likes' } } },
    { $sort: { likeCount: -1, views: -1 } },
    { $limit: limit }
  ]);
};

module.exports = mongoose.model('Story', storySchema);