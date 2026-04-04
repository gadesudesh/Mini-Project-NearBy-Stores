const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load .env from backend folder (same as your seed.js)
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');

const createAdmin = async () => {
  try {
    // Use MONGODB_URI (same variable name as your seed.js)
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;
    
    if (!mongoURI) {
      console.error('❌ No MongoDB URI found in .env file');
      console.error('   Make sure MONGODB_URI is set in backend/.env');
      process.exit(1);
    }

    await mongoose.connect(mongoURI);
    console.log('📦 Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@nearbystore.com' });

    if (existingAdmin) {
      console.log('⚠️  Admin already exists:');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Role: ${existingAdmin.role}`);

      // If user exists but is not admin, update role
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✅ Updated role to admin');
      }
    } else {
      // Create new admin
      const admin = await User.create({
        name: 'Admin',
        email: 'admin@nearbystore.com',
        password: 'admin123',
        role: 'admin',
        phone: '9999999999'
      });
      console.log('✅ Admin created successfully!');
      console.log(`   Name: ${admin.name}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Password: admin123`);
      console.log(`   Role: ${admin.role}`);
    }

    console.log('\n🔑 Admin Login Credentials:');
    console.log('   Email: admin@nearbystore.com');
    console.log('   Password: admin123');
    console.log('   URL: http://localhost:3000/login');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createAdmin();