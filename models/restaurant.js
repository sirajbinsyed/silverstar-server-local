const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  restaurantName: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true
  },
  logoImage: {
    type: String, // You can store Cloudinary URL, AWS S3 URL, or local path
    required: false
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  locationLink: {
    type: String,
    required: false
  },
  websiteLink: {
    type: String,
    required: false
  },
  instagramLink: {
    type: String,
    required: false
  },
  facebookLink: {
    type: String,
    required: false
  },
  whatsappNumber: {
    type: String,
    required: false
  },
  phoneNumber: {
    type: String,
    required: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  validityOfPlan: {
    type: Date,
    required: false
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    required: false
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
