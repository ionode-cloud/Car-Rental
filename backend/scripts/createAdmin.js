import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import connectDB from '../config/db.js';

dotenv.config();

const createAdminAccount = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();

    const name = process.env.ADMIN_NAME || 'RideVista Administrator';
    const email = process.env.ADMIN_EMAIL || 'admin@ridevista.com';
    const password = process.env.ADMIN_PASSWORD || 'Admin@12345';
    const phone = process.env.ADMIN_PHONE || '+919876543210';

    if (!email || !password) {
      console.error('❌ Error: ADMIN_EMAIL and ADMIN_PASSWORD must be defined in .env');
      process.exit(1);
    }

    const existingAdmin = await User.findOne({ email: email.toLowerCase() });

    if (existingAdmin) {
      console.log(`ℹ️ Admin account already exists for ${email}. Ensuring admin role...`);
      existingAdmin.role = 'admin';
      existingAdmin.isActive = true;
      await existingAdmin.save();
      console.log(`✅ Admin status confirmed for: ${email}`);
    } else {
      const admin = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        phone,
        role: 'admin',
        isVerified: true,
        isActive: true,
      });

      console.log('==================================================');
      console.log('🎉 Administrator Account Created Successfully!');
      console.log(`👤 Name:     ${admin.name}`);
      console.log(`📧 Email:    ${admin.email}`);
      console.log(`🔑 Role:     ${admin.role}`);
      console.log('==================================================');
    }

    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin account:', error.message);
    process.exit(1);
  }
};

createAdminAccount();
