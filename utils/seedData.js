require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
const connectDB = require('../config/database');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      email: 'admin@silverstar.com',
      password: 'admin123',
      role: 'admin'
    });

    console.log('👤 Created admin user:', adminUser.email);

    // Create categories
    const categories = [
      {
        name: 'Beef',
        description: 'Delicious beef dishes',
        icon: 'UtensilsCrossed',
        color: 'from-red-600 to-red-700',
        sortOrder: 1
      },
      {
        name: 'Chicken',
        description: 'Fresh chicken preparations',
        icon: 'UtensilsCrossed',
        color: 'from-orange-500 to-red-600',
        sortOrder: 2
      },
      {
        name: 'Grill',
        description: 'Grilled specialties',
        icon: 'UtensilsCrossed',
        color: 'from-orange-400 to-red-500',
        sortOrder: 3
      },
      {
        name: 'Mandhi',
        description: 'Traditional Mandhi dishes',
        icon: 'UtensilsCrossed',
        color: 'from-yellow-500 to-orange-600',
        sortOrder: 4
      },
      {
        name: 'Fish',
        description: 'Fresh seafood dishes',
        icon: 'UtensilsCrossed',
        color: 'from-blue-500 to-cyan-600',
        sortOrder: 5
      },
      {
        name: 'Beverages',
        description: 'Refreshing drinks and beverages',
        icon: 'Coffee',
        color: 'from-purple-500 to-pink-600',
        sortOrder: 6
      },
      {
        name: 'Breakfast',
        description: 'Morning breakfast items',
        icon: 'UtensilsCrossed',
        color: 'from-green-500 to-emerald-600',
        sortOrder: 7
      },
      {
        name: 'Biriyani',
        description: 'Aromatic biriyani varieties',
        icon: 'UtensilsCrossed',
        color: 'from-indigo-500 to-purple-600',
        sortOrder: 8
      }
    ];

    const createdCategories = await Category.insertMany(categories);
    console.log(`📂 Created ${createdCategories.length} categories`);

    console.log('✅ Seed data created successfully!');
    console.log('\n🔑 Admin Login Credentials:');
    console.log('Email: admin@silverstar.com');
    console.log('Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();