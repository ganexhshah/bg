const Joi = require('joi');

// User validation schemas
const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    })
  });
  
  return schema.validate(data);
};

const validateRegister = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    }),
    role: Joi.string().valid('admin', 'user').default('user')
  });
  
  return schema.validate(data);
};

// Story validation schema
const validateStory = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(5).max(200).required().messages({
      'string.min': 'Title must be at least 5 characters long',
      'string.max': 'Title cannot exceed 200 characters',
      'any.required': 'Title is required'
    }),
    content: Joi.string().min(50).required().messages({
      'string.min': 'Content must be at least 50 characters long',
      'any.required': 'Content is required'
    }),
    preview: Joi.string().max(300).optional(),
    category: Joi.string().valid('personal', 'work', 'lifestyle').required().messages({
      'any.only': 'Category must be one of: personal, work, lifestyle',
      'any.required': 'Category is required'
    }),
    tags: Joi.array().items(Joi.string().trim()).optional(),
    status: Joi.string().valid('draft', 'published', 'archived').default('draft'),
    seo: Joi.object({
      metaTitle: Joi.string().max(60).optional(),
      metaDescription: Joi.string().max(160).optional(),
      keywords: Joi.array().items(Joi.string()).optional()
    }).optional()
  });
  
  return schema.validate(data);
};

// Comment validation schema
const validateComment = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 50 characters',
      'any.required': 'Name is required'
    }),
    email: Joi.string().email().optional().messages({
      'string.email': 'Please enter a valid email address'
    }),
    text: Joi.string().min(5).max(1000).required().messages({
      'string.min': 'Comment must be at least 5 characters long',
      'string.max': 'Comment cannot exceed 1000 characters',
      'any.required': 'Comment text is required'
    })
  });
  
  return schema.validate(data);
};

// Profile validation schema
const validateProfile = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 100 characters',
      'any.required': 'Name is required'
    }),
    title: Joi.string().min(5).max(200).required().messages({
      'string.min': 'Title must be at least 5 characters long',
      'string.max': 'Title cannot exceed 200 characters',
      'any.required': 'Professional title is required'
    }),
    bio: Joi.string().max(1000).optional().messages({
      'string.max': 'Bio cannot exceed 1000 characters'
    }),
    profileImage: Joi.alternatives().try(
      Joi.string().uri().optional(),
      Joi.object({
        url: Joi.string().uri().optional(),
        publicId: Joi.string().optional(),
        alt: Joi.string().optional()
      }).optional()
    ).optional(),
    socialMedia: Joi.object({
      instagram: Joi.object({
        username: Joi.string().optional(),
        url: Joi.string().uri().optional(),
        followersCount: Joi.number().min(0).optional()
      }).optional(),
      facebook: Joi.object({
        url: Joi.string().uri().optional()
      }).optional(),
      telegram: Joi.object({
        username: Joi.string().optional(),
        channelName: Joi.string().optional(),
        url: Joi.string().uri().optional()
      }).optional(),
      twitter: Joi.object({
        username: Joi.string().optional(),
        url: Joi.string().uri().optional()
      }).optional()
    }).optional(),
    contact: Joi.object({
      email: Joi.string().email().optional(),
      phone: Joi.string().optional(),
      location: Joi.object({
        city: Joi.string().optional(),
        country: Joi.string().optional()
      }).optional()
    }).optional(),
    services: Joi.object({
      meetup: Joi.object({
        available: Joi.boolean().optional(),
        description: Joi.string().optional(),
        pricing: Joi.string().optional()
      }).optional(),
      videoCall: Joi.object({
        available: Joi.boolean().optional(),
        packages: Joi.array().items(
          Joi.object({
            name: Joi.string().required(),
            duration: Joi.string().required(),
            price: Joi.number().required(),
            currency: Joi.string().optional(),
            description: Joi.string().optional(),
            features: Joi.array().items(Joi.string()).optional()
          })
        ).optional()
      }).optional()
    }).optional()
  });
  
  return schema.validate(data);
};

// Gallery image validation schema
const validateGalleryImage = (data) => {
  const schema = Joi.object({
    title: Joi.string().max(100).optional(),
    description: Joi.string().max(500).optional(),
    category: Joi.string().valid('photoshoot', 'behind-scenes', 'personal', 'professional', 'events', 'other').default('other'),
    tags: Joi.string().optional(), // Will be split into array
    isInstagramPost: Joi.string().valid('true', 'false').optional(),
    alt: Joi.string().optional(),
    sortOrder: Joi.number().optional(),
    instagramLikes: Joi.number().min(0).optional(),
    instagramComments: Joi.number().min(0).optional(),
    instagramCaption: Joi.string().optional(),
    instagramHashtags: Joi.string().optional() // Will be split into array
  });
  
  return schema.validate(data);
};

// Settings validation schema
const validateSettings = (data) => {
  const schema = Joi.object({
    site: Joi.object({
      name: Joi.string().min(3).max(100).optional(),
      description: Joi.string().max(500).optional(),
      url: Joi.string().uri().optional()
    }).optional(),
    socialMedia: Joi.object({
      facebook: Joi.object({
        url: Joi.string().uri().optional(),
        pageId: Joi.string().optional()
      }).optional(),
      instagram: Joi.object({
        url: Joi.string().uri().optional(),
        username: Joi.string().optional()
      }).optional(),
      telegram: Joi.object({
        url: Joi.string().uri().optional(),
        channelName: Joi.string().optional()
      }).optional(),
      twitter: Joi.object({
        url: Joi.string().uri().optional(),
        username: Joi.string().optional()
      }).optional()
    }).optional(),
    content: Joi.object({
      storiesPerPage: Joi.number().min(3).max(20).optional(),
      galleryImagesPerPage: Joi.number().min(6).max(50).optional(),
      enableComments: Joi.boolean().optional(),
      enableLikes: Joi.boolean().optional(),
      enableSharing: Joi.boolean().optional(),
      moderateComments: Joi.boolean().optional(),
      allowGuestComments: Joi.boolean().optional()
    }).optional(),
    notifications: Joi.object({
      email: Joi.object({
        enabled: Joi.boolean().optional(),
        newComment: Joi.boolean().optional(),
        newLike: Joi.boolean().optional(),
        newStoryView: Joi.boolean().optional()
      }).optional(),
      adminEmail: Joi.string().email().optional()
    }).optional(),
    security: Joi.object({
      requireLoginForStories: Joi.boolean().optional(),
      enableCaptcha: Joi.boolean().optional(),
      sessionTimeout: Joi.number().min(15).max(480).optional(),
      maxLoginAttempts: Joi.number().min(3).max(10).optional(),
      lockoutDuration: Joi.number().min(5).max(1440).optional()
    }).optional(),
    theme: Joi.object({
      primaryColor: Joi.string().pattern(/^#[0-9A-F]{6}$/i).optional(),
      secondaryColor: Joi.string().pattern(/^#[0-9A-F]{6}$/i).optional(),
      accentColor: Joi.string().pattern(/^#[0-9A-F]{6}$/i).optional(),
      fontFamily: Joi.string().optional(),
      borderRadius: Joi.string().optional()
    }).optional(),
    seo: Joi.object({
      metaTitle: Joi.string().max(60).optional(),
      metaDescription: Joi.string().max(160).optional(),
      keywords: Joi.array().items(Joi.string()).optional(),
      twitterCard: Joi.string().valid('summary', 'summary_large_image').optional()
    }).optional(),
    analytics: Joi.object({
      googleAnalyticsId: Joi.string().optional(),
      facebookPixelId: Joi.string().optional(),
      enableTracking: Joi.boolean().optional()
    }).optional(),
    performance: Joi.object({
      enableCaching: Joi.boolean().optional(),
      cacheTimeout: Joi.number().min(300).max(86400).optional(),
      enableCompression: Joi.boolean().optional(),
      maxImageSize: Joi.number().min(1048576).max(52428800).optional() // 1MB to 50MB
    }).optional(),
    maintenance: Joi.object({
      enabled: Joi.boolean().optional(),
      message: Joi.string().max(200).optional(),
      allowedIPs: Joi.array().items(Joi.string()).optional()
    }).optional()
  });
  
  return schema.validate(data);
};

module.exports = {
  validateLogin,
  validateRegister,
  validateStory,
  validateComment,
  validateProfile,
  validateGalleryImage,
  validateSettings
};