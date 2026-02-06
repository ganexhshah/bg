const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Reset admin password
const resetAdminPassword = async () => {
  try {
    await connectDB();

    const User = require('../models/User');
    
    const adminEmail = process.env.ADMIN_EMAIL || 'hello.ganeshshah@gmail.com';
    const newPassword = process.env.ADMIN_PASSWORD || 'anukarki';

    // Find admin user
    const admin = await User.findOne({ email: adminEmail });
    
    if (!admin) {
      console.log('❌ Admin user not found');
      process.exit(1);
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password directly (bypass pre-save hook)
    await User.updateOne(
      { email: adminEmail },
      { 
        $set: { 
          password: hashedPassword,
          loginAttempts: 0,
          lockUntil: undefined
        }
      }
    );

    console.log('✅ Admin password reset successfully');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${newPassword}`);
    console.log(`🔐 Hash: ${hashedPassword}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting password:', error);
    process.exit(1);
  }
};

resetAdminPassword();
