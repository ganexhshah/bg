const User = require('../models/User');
const Profile = require('../models/Profile');
const Settings = require('../models/Settings');

const initializeAdmin = async () => {
  try {
    console.log('🔧 Initializing admin user and default data...');
    
    // Check if admin user exists
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      // Create admin user
      const adminUser = new User({
        email: process.env.ADMIN_EMAIL || 'admin@sonikakarki.com',
        password: process.env.ADMIN_PASSWORD || 'admin123',
        role: 'admin'
      });
      
      await adminUser.save();
      console.log('✅ Admin user created successfully');
      console.log(`📧 Email: ${adminUser.email}`);
      console.log(`🔑 Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    } else {
      console.log('✅ Admin user already exists');
    }
    
    // Check if profile exists
    const profileExists = await Profile.findOne({ isActive: true });
    
    if (!profileExists) {
      // Create default profile
      const defaultProfile = new Profile({
        name: 'Sonika Karki',
        title: 'VC Girl & Professional Model',
        bio: 'Professional model and content creator sharing my journey and experiences in the modeling industry.',
        profileImage: {
          url: '/profile/photo_2025-04-22_12-57-51.jpg',
          alt: 'Sonika Karki Profile Picture'
        },
        socialMedia: {
          instagram: {
            username: '@cloudy_manishaa',
            url: 'https://instagram.com/cloudy_manishaa',
            followersCount: 0
          },
          facebook: {
            url: 'https://facebook.com/sonikakarki'
          },
          telegram: {
            channelName: 'Join our channel!',
            url: 'https://t.me/sonikakarki'
          }
        },
        contact: {
          email: 'contact@sonikakarki.com',
          location: {
            city: 'Kathmandu',
            country: 'Nepal'
          }
        },
        services: {
          meetup: {
            available: false,
            description: 'Meetup services currently unavailable. Please check back later or try our video call service.',
            pricing: 'Contact for pricing'
          },
          videoCall: {
            available: true,
            packages: [
              {
                name: 'Demo Session',
                duration: '1 Minute',
                price: 100,
                currency: 'Rs.',
                description: 'Quick demo session',
                features: ['Basic video call', 'No sound']
              },
              {
                name: 'Full VC (Without Sound)',
                duration: '20 minutes',
                price: 800,
                currency: 'Rs.',
                description: 'Full video call without audio',
                features: ['20 minute session', 'Video only', 'No sound']
              },
              {
                name: 'Premium VC (With Sound & Face)',
                duration: '1 Hour',
                price: 2500,
                currency: 'Rs.',
                description: 'Premium video call with full features',
                features: ['1 hour session', 'Video and audio', 'Face-to-face interaction']
              }
            ]
          }
        },
        isActive: true
      });
      
      await defaultProfile.save();
      console.log('✅ Default profile created successfully');
    } else {
      console.log('✅ Profile already exists');
    }
    
    // Check if settings exist
    const settingsExist = await Settings.findOne();
    
    if (!settingsExist) {
      // Create default settings
      const defaultSettings = new Settings({
        site: {
          name: 'Sonika Karki - Professional Model',
          description: 'Professional model and content creator sharing my journey and experiences',
          url: 'https://sonikakarki.com'
        },
        socialMedia: {
          instagram: {
            url: 'https://instagram.com/cloudy_manishaa',
            username: '@cloudy_manishaa'
          },
          facebook: {
            url: 'https://facebook.com/sonikakarki'
          },
          telegram: {
            url: 'https://t.me/sonikakarki',
            channelName: 'Join our channel!'
          }
        },
        content: {
          storiesPerPage: 6,
          galleryImagesPerPage: 12,
          enableComments: true,
          enableLikes: true,
          enableSharing: true,
          moderateComments: false,
          allowGuestComments: true
        },
        notifications: {
          email: {
            enabled: true,
            newComment: true,
            newLike: false,
            newStoryView: false
          },
          adminEmail: process.env.ADMIN_EMAIL || 'admin@sonikakarki.com'
        },
        security: {
          requireLoginForStories: false,
          enableCaptcha: false,
          sessionTimeout: 30,
          maxLoginAttempts: 5,
          lockoutDuration: 30
        },
        theme: {
          primaryColor: '#8B5CF6',
          secondaryColor: '#EC4899',
          accentColor: '#10B981',
          fontFamily: 'Inter, sans-serif',
          borderRadius: '0px'
        },
        seo: {
          metaTitle: 'Sonika Karki - Professional Model & Content Creator',
          metaDescription: 'Professional model sharing stories, experiences, and behind-the-scenes content',
          keywords: ['model', 'content creator', 'photography', 'lifestyle', 'stories'],
          twitterCard: 'summary_large_image'
        },
        analytics: {
          enableTracking: true
        },
        performance: {
          enableCaching: true,
          cacheTimeout: 3600,
          enableCompression: true,
          maxImageSize: 5 * 1024 * 1024
        },
        maintenance: {
          enabled: false,
          message: 'Site is under maintenance. Please check back later.',
          allowedIPs: []
        }
      });
      
      await defaultSettings.save();
      console.log('✅ Default settings created successfully');
    } else {
      console.log('✅ Settings already exist');
    }
    
    console.log('🎉 Initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Initialization error:', error);
  }
};

module.exports = initializeAdmin;