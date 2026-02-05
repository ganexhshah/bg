const express = require('express');
const router = express.Router();
const { Visitor, PageView, AnalyticsStats, Comment } = require('../models/Analytics');
const auth = require('../middleware/auth');

// Helper function to get client IP
const getClientIP = (req) => {
  return req.headers['x-forwarded-for'] || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
         '127.0.0.1';
};

// Helper function to parse user agent
const parseUserAgent = (userAgent) => {
  const browser = {
    name: 'Unknown',
    version: 'Unknown'
  };
  const os = {
    name: 'Unknown',
    version: 'Unknown'
  };
  
  // Simple browser detection
  if (userAgent.includes('Chrome')) {
    browser.name = 'Chrome';
    const match = userAgent.match(/Chrome\/([0-9.]+)/);
    if (match) browser.version = match[1];
  } else if (userAgent.includes('Firefox')) {
    browser.name = 'Firefox';
    const match = userAgent.match(/Firefox\/([0-9.]+)/);
    if (match) browser.version = match[1];
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browser.name = 'Safari';
    const match = userAgent.match(/Version\/([0-9.]+)/);
    if (match) browser.version = match[1];
  } else if (userAgent.includes('Edge')) {
    browser.name = 'Edge';
    const match = userAgent.match(/Edge\/([0-9.]+)/);
    if (match) browser.version = match[1];
  }
  
  // Simple OS detection
  if (userAgent.includes('Windows')) {
    os.name = 'Windows';
  } else if (userAgent.includes('Mac OS')) {
    os.name = 'macOS';
  } else if (userAgent.includes('Linux')) {
    os.name = 'Linux';
  } else if (userAgent.includes('Android')) {
    os.name = 'Android';
  } else if (userAgent.includes('iOS')) {
    os.name = 'iOS';
  }
  
  return { browser, os };
};

// Helper function to detect device type
const getDeviceType = (userAgent) => {
  if (/Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
    if (/iPad|Tablet/i.test(userAgent)) {
      return 'tablet';
    }
    return 'mobile';
  }
  return 'desktop';
};

// Track page view (public endpoint)
router.post('/track', async (req, res) => {
  try {
    const {
      sessionId,
      url,
      title,
      referrer,
      timeSpent,
      location
    } = req.body;

    const ipAddress = getClientIP(req);
    const userAgent = req.headers['user-agent'] || '';
    const { browser, os } = parseUserAgent(userAgent);
    const device = getDeviceType(userAgent);

    // Find or create visitor
    let visitor = await Visitor.findOne({ sessionId });
    
    if (!visitor) {
      // Check if this is a returning visitor by IP
      const existingVisitor = await Visitor.findOne({ 
        ipAddress,
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
      });

      visitor = new Visitor({
        sessionId,
        ipAddress,
        userAgent,
        browser,
        os,
        device,
        location: location || {},
        referrer,
        landingPage: url,
        currentPage: url,
        isReturning: !!existingVisitor,
        lastVisit: existingVisitor ? existingVisitor.createdAt : null
      });
    } else {
      // Update existing visitor
      visitor.currentPage = url;
      visitor.pageViews += 1;
      if (timeSpent) {
        visitor.totalTimeSpent += timeSpent;
      }
    }

    // Add page to visited pages
    visitor.visitedPages.push({
      url,
      title,
      timeSpent: timeSpent || 0
    });

    await visitor.save();

    // Create page view record
    const pageView = new PageView({
      url,
      title,
      visitorId: visitor._id,
      sessionId,
      ipAddress,
      userAgent,
      referrer,
      timeSpent: timeSpent || 0,
      browser: browser.name,
      os: os.name,
      device,
      country: location?.country || 'Unknown',
      isUnique: visitor.visitedPages.filter(p => p.url === url).length === 1
    });

    await pageView.save();

    res.json({
      success: true,
      message: 'Page view tracked successfully'
    });

  } catch (error) {
    console.error('Analytics tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track page view'
    });
  }
});

// Get analytics dashboard data (admin only)
router.get('/dashboard', auth, async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    // Calculate date range
    let startDate = new Date();
    switch (period) {
      case '24h':
        startDate.setHours(startDate.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }

    // Get basic stats
    const totalVisitors = await Visitor.countDocuments({
      createdAt: { $gte: startDate }
    });

    const uniqueVisitors = await Visitor.distinct('ipAddress', {
      createdAt: { $gte: startDate }
    }).then(ips => ips.length);

    const totalPageViews = await PageView.countDocuments({
      timestamp: { $gte: startDate }
    });

    const totalComments = await Comment.countDocuments({
      timestamp: { $gte: startDate }
    });

    // Get top pages
    const topPages = await PageView.aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      {
        $group: {
          _id: '$url',
          views: { $sum: 1 },
          uniqueViews: { $sum: { $cond: ['$isUnique', 1, 0] } },
          title: { $first: '$title' }
        }
      },
      { $sort: { views: -1 } },
      { $limit: 10 }
    ]);

    // Get top countries
    const topCountries = await Visitor.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: '$location.country',
          visitors: { $sum: 1 },
          countryCode: { $first: '$location.countryCode' }
        }
      },
      { $match: { _id: { $ne: null, $ne: '' } } },
      { $sort: { visitors: -1 } },
      { $limit: 10 }
    ]);

    // Get browser stats
    const browserStats = await Visitor.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: '$browser.name',
          users: { $sum: 1 }
        }
      },
      { $sort: { users: -1 } },
      { $limit: 10 }
    ]);

    // Get device stats
    const deviceStats = await Visitor.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: '$device',
          users: { $sum: 1 }
        }
      },
      { $sort: { users: -1 } }
    ]);

    // Get daily stats for chart
    const dailyStats = await PageView.aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$timestamp'
            }
          },
          pageViews: { $sum: 1 },
          uniqueVisitors: { $addToSet: '$ipAddress' }
        }
      },
      {
        $project: {
          date: '$_id',
          pageViews: 1,
          uniqueVisitors: { $size: '$uniqueVisitors' }
        }
      },
      { $sort: { date: 1 } }
    ]);

    // Calculate average session duration
    const avgSessionDuration = await Visitor.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          avgDuration: { $avg: '$totalTimeSpent' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalVisitors,
          uniqueVisitors,
          totalPageViews,
          totalComments,
          avgSessionDuration: avgSessionDuration[0]?.avgDuration || 0,
          bounceRate: totalVisitors > 0 ? ((totalVisitors - uniqueVisitors) / totalVisitors * 100) : 0
        },
        topPages: topPages.map(page => ({
          url: page._id,
          title: page.title || page._id,
          views: page.views,
          uniqueViews: page.uniqueViews
        })),
        topCountries: topCountries.map(country => ({
          country: country._id || 'Unknown',
          countryCode: country.countryCode || 'XX',
          visitors: country.visitors
        })),
        browserStats: browserStats.map(browser => ({
          browser: browser._id || 'Unknown',
          users: browser.users
        })),
        deviceStats: deviceStats.map(device => ({
          device: device._id || 'Unknown',
          users: device.users
        })),
        dailyStats,
        period
      }
    });

  } catch (error) {
    console.error('Analytics dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data'
    });
  }
});

// Get recent visitors (admin only)
router.get('/visitors', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const visitors = await Visitor.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-visitedPages -userAgent');

    const total = await Visitor.countDocuments();

    res.json({
      success: true,
      data: {
        visitors,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get visitors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch visitors'
    });
  }
});

// Get comments management data (admin only)
router.get('/comments', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status = 'all' } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (status === 'pending') {
      filter.isApproved = false;
      filter.isSpam = false;
    } else if (status === 'approved') {
      filter.isApproved = true;
    } else if (status === 'spam') {
      filter.isSpam = true;
    }

    const comments = await Comment.find(filter)
      .populate('storyId', 'title slug')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Comment.countDocuments(filter);

    // Get comment stats
    const stats = {
      total: await Comment.countDocuments(),
      pending: await Comment.countDocuments({ isApproved: false, isSpam: false }),
      approved: await Comment.countDocuments({ isApproved: true }),
      spam: await Comment.countDocuments({ isSpam: true })
    };

    res.json({
      success: true,
      data: {
        comments,
        stats,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch comments'
    });
  }
});

// Approve/reject comment (admin only)
router.put('/comments/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { action, moderationNotes } = req.body;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    switch (action) {
      case 'approve':
        comment.isApproved = true;
        comment.isSpam = false;
        break;
      case 'reject':
        comment.isApproved = false;
        break;
      case 'spam':
        comment.isSpam = true;
        comment.isApproved = false;
        break;
    }

    if (moderationNotes) {
      comment.moderationNotes = moderationNotes;
    }

    await comment.save();

    res.json({
      success: true,
      message: `Comment ${action}ed successfully`,
      data: { comment }
    });

  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update comment'
    });
  }
});

// Delete comment (admin only)
router.delete('/comments/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findByIdAndDelete(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });

  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete comment'
    });
  }
});

module.exports = router;