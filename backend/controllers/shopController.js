const Shop = require('../models/Shop');
const Review = require('../models/Review');

// ==========================================
// EXISTING FUNCTIONS (unchanged logic)
// ==========================================

exports.createShop = async (req, res) => {
  try {
    const { shopName, description, address, phone, category, latitude, longitude, image } = req.body;
    const existingShop = await Shop.findOne({ owner: req.user.id });
    if (existingShop) {
      return res.status(400).json({ success: false, message: 'You already have a shop' });
    }
    const shop = await Shop.create({
      owner: req.user.id, shopName, description, address, phone, category, image,
      location: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] }
    });
    res.status(201).json({ success: true, shop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user.id });
    if (!shop) return res.status(404).json({ success: false, message: 'Shop not found' });
    res.json({ success: true, shop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateShop = async (req, res) => {
  try {
    let shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ success: false, message: 'Shop not found' });
    if (shop.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const { latitude, longitude, ...rest } = req.body;
    const updateData = { ...rest };
    if (latitude && longitude) {
      updateData.location = { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] };
    }
    shop = await Shop.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    res.json({ success: true, shop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getNearbyShops = async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: 'Provide latitude and longitude' });
    }
    const shops = await Shop.find({
      isActive: true,
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseFloat(radius) * 1000
        }
      }
    }).populate('owner', 'name email phone');

    const shopsWithRating = await Promise.all(
      shops.map(async (shop) => {
        const reviews = await Review.find({ shop: shop._id });
        const avgRating = reviews.length > 0
          ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0;
        const distance = getDistance(parseFloat(lat), parseFloat(lng),
          shop.location.coordinates[1], shop.location.coordinates[0]);
        return {
          ...shop.toObject(),
          averageRating: parseFloat(avgRating),
          reviewCount: reviews.length,
          distance: parseFloat(distance.toFixed(2))
        };
      })
    );
    res.json({ success: true, count: shopsWithRating.length, shops: shopsWithRating });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getShopById = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id).populate('owner', 'name email phone');
    if (!shop) return res.status(404).json({ success: false, message: 'Shop not found' });
    shop.analytics.views += 1;
    await shop.save();
    const reviews = await Review.find({ shop: shop._id }).populate('user', 'name');
    const avgRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0;
    res.json({
      success: true,
      shop: { ...shop.toObject(), averageRating: parseFloat(avgRating), reviewCount: reviews.length, reviews }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find({ isActive: true }).populate('owner', 'name');
    res.json({ success: true, count: shops.length, shops });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// NEW: VERIFICATION FUNCTIONS
// ==========================================

// @desc    Retailer submits verification documents
// @route   POST /api/shops/verify/submit
// @access  Retailer only
exports.submitVerification = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user.id });
    if (!shop) {
      return res.status(404).json({ success: false, message: 'Create a shop first' });
    }

    if (shop.verification.status === 'verified') {
      return res.status(400).json({ success: false, message: 'Shop is already verified' });
    }

    if (shop.verification.status === 'pending') {
      return res.status(400).json({ success: false, message: 'Verification is already under review' });
    }

    const {
      gstNumber, panNumber, shopLicenseNumber,
      shopLicenseImage, gstCertificateImage, shopFrontPhoto, aadharNumber
    } = req.body;

    // Validate: at least GST or shop license required
    if (!gstNumber && !shopLicenseNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least GST number or Shop License number'
      });
    }

    if (!shopFrontPhoto) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a photo of your shop front'
      });
    }

    // Update verification data
    shop.verification.gstNumber = gstNumber || '';
    shop.verification.panNumber = panNumber || '';
    shop.verification.shopLicenseNumber = shopLicenseNumber || '';
    shop.verification.shopLicenseImage = shopLicenseImage || '';
    shop.verification.gstCertificateImage = gstCertificateImage || '';
    shop.verification.shopFrontPhoto = shopFrontPhoto || '';
    shop.verification.aadharNumber = aadharNumber || '';
    shop.verification.status = 'pending';
    shop.verification.submittedAt = new Date();
    shop.verification.rejectionReason = '';

    await shop.save();

    res.json({
      success: true,
      message: 'Verification documents submitted! Our team will review within 24-48 hours.',
      verification: shop.verification
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get verification status (retailer)
// @route   GET /api/shops/verify/status
// @access  Retailer only
exports.getVerificationStatus = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user.id });
    if (!shop) {
      return res.status(404).json({ success: false, message: 'Shop not found' });
    }
    res.json({
      success: true,
      verification: shop.verification,
      shopName: shop.shopName
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// ADMIN FUNCTIONS
// ==========================================

// @desc    Get all shops pending verification
// @route   GET /api/shops/admin/pending
// @access  Admin only
exports.getPendingShops = async (req, res) => {
  try {
    const shops = await Shop.find({ 'verification.status': 'pending' })
      .populate('owner', 'name email phone')
      .sort('-verification.submittedAt');

    res.json({ success: true, count: shops.length, shops });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all shops with any verification status
// @route   GET /api/shops/admin/all
// @access  Admin only
exports.getAllShopsAdmin = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter['verification.status'] = status;

    const shops = await Shop.find(filter)
      .populate('owner', 'name email phone')
      .sort('-createdAt');

    // Count by status
    const counts = {
      total: await Shop.countDocuments(),
      unverified: await Shop.countDocuments({ 'verification.status': 'unverified' }),
      pending: await Shop.countDocuments({ 'verification.status': 'pending' }),
      verified: await Shop.countDocuments({ 'verification.status': 'verified' }),
      rejected: await Shop.countDocuments({ 'verification.status': 'rejected' }),
    };

    res.json({ success: true, count: shops.length, counts, shops });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve/Reject a shop verification
// @route   PUT /api/shops/admin/verify/:shopId
// @access  Admin only
exports.verifyShop = async (req, res) => {
  try {
    const { action, rejectionReason, adminNotes } = req.body;
    // action: 'approve' or 'reject'

    if (!action || !['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Action must be "approve" or "reject"'
      });
    }

    const shop = await Shop.findById(req.params.shopId);
    if (!shop) {
      return res.status(404).json({ success: false, message: 'Shop not found' });
    }

    if (action === 'approve') {
      shop.verification.status = 'verified';
      shop.verification.verifiedBy = req.user.id;
      shop.verification.verifiedAt = new Date();
      shop.verification.rejectionReason = '';
      shop.verification.adminNotes = adminNotes || '';
    } else {
      if (!rejectionReason) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a rejection reason'
        });
      }
      shop.verification.status = 'rejected';
      shop.verification.rejectionReason = rejectionReason;
      shop.verification.adminNotes = adminNotes || '';
    }

    await shop.save();

    res.json({
      success: true,
      message: `Shop ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
      shop
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Haversine distance
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}