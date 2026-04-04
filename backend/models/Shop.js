const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shopName: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, maxlength: 500, default: '' },
  address: { type: String, required: true },
  phone: { type: String, default: '' },
  image: { type: String, default: '' },
  category: {
    type: String,
    enum: [
      'home_appliances', 'hardware', 'electronics', 'sports', 'accessories',
      'stationery', 'personal_care', 'fitness',
      'grocery', 'clothing', 'pharmacy', 'bakery', 'restaurant', 'general', 'other'
    ],
    default: 'general'
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true, index: '2dsphere' }
  },
  isActive: { type: Boolean, default: true },

  // ========== VERIFICATION SYSTEM ==========
  verification: {
    status: {
      type: String,
      enum: ['unverified', 'pending', 'verified', 'rejected'],
      default: 'unverified'
    },
    // Documents submitted by shop owner
    gstNumber: { type: String, default: '' },
    panNumber: { type: String, default: '' },
    shopLicenseNumber: { type: String, default: '' },
    shopLicenseImage: { type: String, default: '' },  // URL to uploaded image
    gstCertificateImage: { type: String, default: '' },
    shopFrontPhoto: { type: String, default: '' },     // Photo of actual shop
    aadharNumber: { type: String, default: '' },
    // Admin review
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    verifiedAt: { type: Date, default: null },
    rejectionReason: { type: String, default: '' },
    adminNotes: { type: String, default: '' },
    // Verification request date
    submittedAt: { type: Date, default: null }
  },

  analytics: {
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 }
  }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

shopSchema.index({ location: '2dsphere' });

// Virtual: is this shop verified?
shopSchema.virtual('isVerified').get(function () {
  return this.verification?.status === 'verified';
});

module.exports = mongoose.model('Shop', shopSchema);