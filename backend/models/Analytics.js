const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  browser: {
    name: String,
    version: String
  },
  os: {
    name: String,
    version: String
  },
  device: {
    type: String,
    enum: ['desktop', 'mobile', 'tablet'],
    default: 'desktop'
  },
  location: {
    country: String,
    countryCode: String,
    region: String,
    city: String,
    timezone: String,
    latitude: Number,
    longitude: Number
  },
  referrer: String,
  landingPage: String,
  currentPage: String,
  visitedPages: [{
    url: String,
    title: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    timeSpent: Number // in seconds
  }],
  sessionStart: {
    type: Date,
    default: Date.now
  },
  sessionEnd: Date,
  totalTimeSpent: {
    type: Number,
    default: 0 // in seconds
  },
  pageViews: {
    type: Number,
    default: 1
  },
  isReturning: {
    type: Boolean,
    default: false
  },
  lastVisit: Date
}, {
  timestamps: true
});

const pageViewSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  title: String,
  visitorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Visitor'
  },
  sessionId: String,
  ipAddress: String,
  userAgent: String,
  referrer: String,
  timeSpent: Number, // in seconds
  timestamp: {
    type: Date,
    default: Date.now
  },
  browser: String,
  os: String,
  device: String,
  country: String,
  isUnique: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const analyticsStatsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  },
  totalVisitors: {
    type: Number,
    default: 0
  },
  uniqueVisitors: {
    type: Number,
    default: 0
  },
  pageViews: {
    type: Number,
    default: 0
  },
  bounceRate: {
    type: Number,
    default: 0
  },
  avgSessionDuration: {
    type: Number,
    default: 0
  },
  topPages: [{
    url: String,
    views: Number,
    uniqueViews: Number
  }],
  topCountries: [{
    country: String,
    countryCode: String,
    visitors: Number
  }],
  topBrowsers: [{
    browser: String,
    users: Number
  }],
  topDevices: [{
    device: String,
    users: Number
  }],
  topReferrers: [{
    referrer: String,
    visitors: Number
  }]
}, {
  timestamps: true
});

const commentSchema = new mongoose.Schema({
  storyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
    required: true
  },
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
    },
    ipAddress: String
  },
  text: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 1000
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  isSpam: {
    type: Boolean,
    default: false
  },
  likes: {
    type: Number,
    default: 0
  },
  replies: [{
    user: {
      name: String,
      email: String
    },
    text: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    isApproved: {
      type: Boolean,
      default: false
    }
  }],
  moderationNotes: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better performance
visitorSchema.index({ sessionId: 1 });
visitorSchema.index({ ipAddress: 1 });
visitorSchema.index({ createdAt: -1 });
visitorSchema.index({ 'location.country': 1 });

pageViewSchema.index({ url: 1 });
pageViewSchema.index({ timestamp: -1 });
pageViewSchema.index({ visitorId: 1 });
pageViewSchema.index({ country: 1 });

analyticsStatsSchema.index({ date: -1 });

commentSchema.index({ storyId: 1 });
commentSchema.index({ isApproved: 1 });
commentSchema.index({ timestamp: -1 });

const Visitor = mongoose.model('Visitor', visitorSchema);
const PageView = mongoose.model('PageView', pageViewSchema);
const AnalyticsStats = mongoose.model('AnalyticsStats', analyticsStatsSchema);
const Comment = mongoose.model('Comment', commentSchema);

module.exports = {
  Visitor,
  PageView,
  AnalyticsStats,
  Comment
};