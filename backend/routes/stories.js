const express = require('express');
const Story = require('../models/Story');
const { auth, adminAuth } = require('../middleware/auth');
const { validateStory, validateComment } = require('../utils/validation');

const router = express.Router();

// @route   GET /api/stories
// @desc    Get published stories with pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      category = 'all',
      page = 1,
      limit = 10,
      sort = 'publishedAt'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = sort === 'popular' ? { views: -1, likes: -1 } : { publishedAt: -1 };

    const query = { status: 'published' };
    if (category && category !== 'all') {
      query.category = category;
    }

    const stories = await Story.find(query)
      .populate('author', 'email')
      .sort(sortOrder)
      .limit(parseInt(limit))
      .skip(skip)
      .select('-comments.user.email');

    const total = await Story.countDocuments(query);

    res.json({
      success: true,
      data: {
        stories: stories.map(story => ({
          ...story.toObject(),
          likeCount: story.likes.length,
          commentCount: story.comments.length,
          isNew: story.isNew
        })),
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / parseInt(limit)),
          count: stories.length,
          totalStories: total
        }
      }
    });
  } catch (error) {
    console.error('Get stories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stories'
    });
  }
});

// @route   GET /api/stories/popular
// @desc    Get popular stories
// @access  Public
router.get('/popular', async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const stories = await Story.aggregate([
      { $match: { status: 'published' } },
      { $addFields: { likeCount: { $size: '$likes' } } },
      { $sort: { likeCount: -1, views: -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.json({
      success: true,
      data: {
        stories: stories.map(story => ({
          ...story,
          commentCount: story.comments ? story.comments.length : 0,
          isNew: story.isNew
        }))
      }
    });
  } catch (error) {
    console.error('Get popular stories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch popular stories'
    });
  }
});

// @route   GET /api/stories/admin
// @desc    Get all stories for admin
// @access  Private/Admin
router.get('/admin', auth, adminAuth, async (req, res) => {
  try {
    const {
      status = 'all',
      category = 'all',
      page = 1,
      limit = 10
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (category && category !== 'all') {
      query.category = category;
    }

    const stories = await Story.find(query)
      .populate('author', 'email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Story.countDocuments(query);

    res.json({
      success: true,
      data: {
        stories: stories.map(story => ({
          ...story.toObject(),
          likeCount: story.likes.length,
          commentCount: story.comments.length,
          isNew: story.isNew
        })),
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / parseInt(limit)),
          count: stories.length,
          totalStories: total
        }
      }
    });
  } catch (error) {
    console.error('Get admin stories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stories'
    });
  }
});

// @route   GET /api/stories/:identifier
// @desc    Get single story by slug or ID
// @access  Public
router.get('/:identifier', async (req, res) => {
  try {
    const story = await Story.findBySlugOrId(req.params.identifier)
      .populate('author', 'email')
      .select('-comments.user.email');

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    // Increment views for published stories
    if (story.status === 'published') {
      await story.incrementViews();
    }

    res.json({
      success: true,
      data: {
        story: {
          ...story.toObject(),
          likeCount: story.likes.length,
          commentCount: story.comments.length,
          isNew: story.isNew
        }
      }
    });
  } catch (error) {
    console.error('Get story error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch story'
    });
  }
});

// @route   POST /api/stories
// @desc    Create new story
// @access  Private/Admin
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    // Validate input
    const { error } = validateStory(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const storyData = {
      ...req.body,
      author: req.user._id
    };

    const story = new Story(storyData);
    await story.save();

    res.status(201).json({
      success: true,
      message: 'Story created successfully',
      data: { story }
    });
  } catch (error) {
    console.error('Create story error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create story'
    });
  }
});

// @route   PUT /api/stories/:id
// @desc    Update story
// @access  Private/Admin
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    // Validate input
    const { error } = validateStory(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const story = await Story.findById(req.params.id);
    
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    // Update story fields
    Object.assign(story, req.body);
    
    // Set publishedAt if status is being changed to published
    if (req.body.status === 'published' && story.status !== 'published') {
      story.publishedAt = new Date();
    }

    await story.save();

    res.json({
      success: true,
      message: 'Story updated successfully',
      data: { story }
    });
  } catch (error) {
    console.error('Update story error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update story'
    });
  }
});

// @route   DELETE /api/stories/:id
// @desc    Delete story
// @access  Private/Admin
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    await Story.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Story deleted successfully'
    });
  } catch (error) {
    console.error('Delete story error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete story'
    });
  }
});

// @route   POST /api/stories/:identifier/like
// @desc    Toggle like on story
// @access  Public
router.post('/:identifier/like', async (req, res) => {
  try {
    const story = await Story.findBySlugOrId(req.params.identifier);
    
    if (!story || story.status !== 'published') {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    // Use IP address as user identifier for anonymous likes
    const userIdentifier = req.ip || req.connection.remoteAddress || 'anonymous';
    const result = story.addLike(userIdentifier);
    
    // Save the story after modifying likes
    await story.save();

    res.json({
      success: true,
      message: `Story ${result.action}`,
      data: {
        action: result.action,
        likeCount: result.count
      }
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle like'
    });
  }
});

// @route   POST /api/stories/:identifier/comments
// @desc    Add comment to story
// @access  Public
router.post('/:identifier/comments', async (req, res) => {
  try {
    // Validate input
    const { error } = validateComment(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const story = await Story.findBySlugOrId(req.params.identifier);
    
    if (!story || story.status !== 'published') {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    const commentData = {
      user: {
        name: req.body.name,
        email: req.body.email
      },
      text: req.body.text
    };

    await story.addComment(commentData);

    // Get the newly added comment (last one in the array)
    const newComment = story.comments[story.comments.length - 1];

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: { comment: newComment }
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add comment'
    });
  }
});

// @route   POST /api/stories/:identifier/comments/:commentId/replies
// @desc    Add reply to a comment
// @access  Public
router.post('/:identifier/comments/:commentId/replies', async (req, res) => {
  try {
    console.log('Reply request:', {
      storyIdentifier: req.params.identifier,
      commentId: req.params.commentId,
      body: req.body
    });

    // Validate input
    const { error } = validateComment(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const story = await Story.findBySlugOrId(req.params.identifier);
    
    if (!story || story.status !== 'published') {
      return res.status(404).json({
        success: false,
        message: 'Story not found'
      });
    }

    const replyData = {
      user: {
        name: req.body.name,
        email: req.body.email
      },
      text: req.body.text
    };

    await story.addReply(req.params.commentId, replyData);

    // Get the updated comment with the new reply
    const updatedComment = story.comments.id(req.params.commentId);

    console.log('Reply added successfully:', {
      commentId: req.params.commentId,
      repliesCount: updatedComment.replies.length
    });

    res.status(201).json({
      success: true,
      message: 'Reply added successfully',
      data: { 
        comment: updatedComment,
        reply: updatedComment.replies[updatedComment.replies.length - 1]
      }
    });
  } catch (error) {
    console.error('Add reply error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add reply'
    });
  }
});

module.exports = router;