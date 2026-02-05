const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || 'demo',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'demo'
});

// For development, use memory storage if Cloudinary is not configured
const useCloudinary = process.env.CLOUDINARY_CLOUD_NAME && 
                     process.env.CLOUDINARY_API_KEY && 
                     process.env.CLOUDINARY_API_SECRET;

let storage;

if (useCloudinary) {
  // Configure Cloudinary storage
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'sonika-karki', // Folder name in Cloudinary
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      transformation: [
        {
          width: 1200,
          height: 1200,
          crop: 'limit',
          quality: 'auto:good',
          fetch_format: 'auto'
        }
      ],
      public_id: (req, file) => {
        // Generate unique filename
        const timestamp = Date.now();
        const originalName = file.originalname.split('.')[0];
        return `${originalName}-${timestamp}`;
      }
    }
  });
} else {
  // Use memory storage for development
  storage = multer.memoryStorage();
}

// File filter function
const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
    files: 5 // Maximum 5 files at once
  }
});

// Error handling middleware for multer
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 5MB.'
      });
    }
    
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum 5 files allowed.'
      });
    }
    
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field name for file upload.'
      });
    }
  }
  
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({
      success: false,
      message: 'Only image files (JPG, PNG, WebP, GIF) are allowed.'
    });
  }
  
  // Cloudinary errors
  if (error.http_code) {
    return res.status(400).json({
      success: false,
      message: 'Image upload failed. Please try again.'
    });
  }
  
  next(error);
};

// Utility function to delete image from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
};

// Utility function to get optimized image URL
const getOptimizedImageUrl = (publicId, options = {}) => {
  const {
    width = 800,
    height = 600,
    crop = 'fill',
    quality = 'auto:good',
    format = 'auto'
  } = options;
  
  return cloudinary.url(publicId, {
    width,
    height,
    crop,
    quality,
    fetch_format: format
  });
};

// Utility function to generate image variants
const generateImageVariants = (publicId) => {
  return {
    thumbnail: getOptimizedImageUrl(publicId, { width: 150, height: 150 }),
    small: getOptimizedImageUrl(publicId, { width: 400, height: 300 }),
    medium: getOptimizedImageUrl(publicId, { width: 800, height: 600 }),
    large: getOptimizedImageUrl(publicId, { width: 1200, height: 900 }),
    original: cloudinary.url(publicId)
  };
};

module.exports = {
  upload,
  handleUploadError,
  deleteFromCloudinary,
  getOptimizedImageUrl,
  generateImageVariants,
  cloudinary
};