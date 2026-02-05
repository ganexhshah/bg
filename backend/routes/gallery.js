const express = require('express');
const Gallery = require('../models/Gallery');
const { auth, adminAuth, optionalAuth } = require('../middleware/auth');
const { validateGalleryImage } = require('../utils/validation');
const { upload, handleUploadError } = require('../utils/upload');

const router = express.Router();

// @route   GET /api/gallery
// @desc    Get gallery images
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      category = 'all',
      isInstagramPost,
      page = 1,
      limit = 12
    } = req.query;

    const skip = (page - 1) * limit;

    const images = await Gallery.getActiveImages({
      category: category !== 'all' ? category : undefined,
      isInstagramPost: isInstagramPost === 'true' ? true : isInstagramPost === 'false' ? false : undefined,
      limit: parseInt(limit),
      skip: skip
    });

    // Get total count for pagination
    const query = { isActive: true };
    if (category !== 'all') {
      query.category = category;
    }
    if (typeof isInstagramPost === 'string') {
      query.isInstagramPost = isInstagramPost === 'true';
    }
    
    const total = await Gallery.countDocuments(query);

    res.json({
      success: true,
      data: {
        images: images.map(image => ({
          ...image.getPublicData(),
          isLiked: req.user ? image.likes.some(like => like.user === req.user._id.toString()) : false
        })),
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get gallery error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery images'
    });
  }
});

// @route   GET /api/gallery/instagram
// @desc    Get Instagram posts for homepage
// @access  Public
router.get('/instagram', async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    
    const images = await Gallery.getInstagramPosts(parseInt(limit));
    
    res.json({
      success: true,
      data: { images }
    });
  } catch (error) {
    console.error('Get Instagram posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Instagram posts'
    });
  }
});

// @route   GET /api/gallery/admin
// @desc    Get all gallery images for admin
// @access  Private/Admin
router.get('/admin', auth, adminAuth, async (req, res) => {
  try {
    const {
      category = 'all',
      isActive = 'all',
      page = 1,
      limit = 20
    } = req.query;

    const skip = (page - 1) * limit;
    const query = {};

    if (category !== 'all') {
      query.category = category;
    }
    if (isActive !== 'all') {
      query.isActive = isActive === 'true';
    }

    const images = await Gallery.find(query)
      .populate('uploadedBy', 'email')
      .sort({ sortOrder: 1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Gallery.countDocuments(query);

    res.json({
      success: true,
      data: {
        images: images.map(image => ({
          ...image.toObject(),
          likeCount: image.likeCount
        })),
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get admin gallery error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery images'
    });
  }
});

// @route   GET /api/gallery/:id
// @desc    Get single gallery image
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id)
      .populate('uploadedBy', 'email');

    if (!image || !image.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    // Increment views
    await image.incrementViews();

    res.json({
      success: true,
      data: {
        image: {
          ...image.getPublicData(),
          isLiked: req.user ? image.likes.some(like => like.user === req.user._id.toString()) : false
        }
      }
    });
  } catch (error) {
    console.error('Get gallery image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch image'
    });
  }
});

// @route   POST /api/gallery/upload
// @desc    Upload new gallery image
// @access  Private/Admin
router.post('/upload', auth, adminAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Validate additional data
    const { error } = validateGalleryImage(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const imageData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category || 'other',
      tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [],
      isInstagramPost: req.body.isInstagramPost === 'true',
      image: {
        url: req.file.path, // Cloudinary URL
        publicId: req.file.filename, // Cloudinary public ID
        alt: req.body.alt || req.body.title || 'Gallery Image',
        width: req.file.width,
        height: req.file.height,
        format: req.file.format,
        size: req.file.bytes
      },
      uploadedBy: req.user._id,
      sortOrder: req.body.sortOrder || 0
    };

    // Add Instagram data if it's an Instagram post
    if (imageData.isInstagramPost) {
      imageData.instagramData = {
        likes: req.body.instagramLikes || 0,
        comments: req.body.instagramComments || 0,
        caption: req.body.instagramCaption,
        hashtags: req.body.instagramHashtags ? req.body.instagramHashtags.split(',').map(tag => tag.trim()) : []
      };
    }

    const image = new Gallery(imageData);
    await image.save();

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      data: { image }
    });
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image'
    });
  }
});

// @route   PUT /api/gallery/:id
// @desc    Update gallery image
// @access  Private/Admin
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    // Validate input
    const { error } = validateGalleryImage(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    // Update image data
    const updateData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : image.tags,
      isInstagramPost: req.body.isInstagramPost === 'true',
      sortOrder: req.body.sortOrder || image.sortOrder
    };

    // Update Instagram data if it's an Instagram post
    if (updateData.isInstagramPost) {
      updateData.instagramData = {
        ...image.instagramData,
        likes: req.body.instagramLikes || image.instagramData?.likes || 0,
        comments: req.body.instagramComments || image.instagramData?.comments || 0,
        caption: req.body.instagramCaption || image.instagramData?.caption,
        hashtags: req.body.instagramHashtags ? 
          req.body.instagramHashtags.split(',').map(tag => tag.trim()) : 
          image.instagramData?.hashtags || []
      };
    }

    Object.assign(image, updateData);
    await image.save();

    res.json({
      success: true,
      message: 'Image updated successfully',
      data: { image }
    });
  } catch (error) {
    console.error('Update image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update image'
    });
  }
});

// @route   DELETE /api/gallery/:id
// @desc    Delete gallery image
// @access  Private/Admin
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    // Delete from Cloudinary
    const cloudinary = require('cloudinary').v2;
    if (image.image.publicId) {
      await cloudinary.uploader.destroy(image.image.publicId);
    }

    // Delete from database
    await Gallery.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image'
    });
  }
});

// @route   POST /api/gallery/:id/like
// @desc    Toggle like on gallery image
// @access  Public
router.post('/:id/like', async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    
    if (!image || !image.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    // Use IP address as user identifier for anonymous likes
    const userIdentifier = req.ip || req.connection.remoteAddress;
    const result = image.toggleLike(userIdentifier);
    
    await image.save();

    res.json({
      success: true,
      message: `Image ${result.action}`,
      data: {
        action: result.action,
        likeCount: result.count
      }
    });
  } catch (error) {
    console.error('Toggle image like error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle like'
    });
  }
});

// @route   PUT /api/gallery/reorder
// @desc    Reorder gallery images
// @access  Private/Admin
router.put('/reorder', auth, adminAuth, async (req, res) => {
  try {
    const { imageIds } = req.body;
    
    if (!Array.isArray(imageIds)) {
      return res.status(400).json({
        success: false,
        message: 'Image IDs array is required'
      });
    }

    // Update sort order for each image
    const updatePromises = imageIds.map((imageId, index) => 
      Gallery.findByIdAndUpdate(imageId, { sortOrder: index })
    );

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: 'Gallery order updated successfully'
    });
  } catch (error) {
    console.error('Reorder gallery error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reorder gallery'
    });
  }
});

module.exports = router;