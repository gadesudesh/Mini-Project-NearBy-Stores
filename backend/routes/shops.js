// const express = require('express');
// const router = express.Router();
// const {
//   createShop, getMyShop, updateShop, getNearbyShops, getShopById, getAllShops,
//   submitVerification, getVerificationStatus,
//   getPendingShops, getAllShopsAdmin, verifyShop
// } = require('../controllers/shopController');
// const { protect, authorize } = require('../middleware/auth');

// // Public
// router.get('/nearby', getNearbyShops);
// router.get('/all', getAllShops);

// // Retailer
// router.get('/my-shop', protect, authorize('retailer'), getMyShop);
// router.post('/', protect, authorize('retailer'), createShop);
// router.put('/:id', protect, authorize('retailer'), updateShop);

// // Verification — Retailer
// router.post('/verify/submit', protect, authorize('retailer'), submitVerification);
// router.get('/verify/status', protect, authorize('retailer'), getVerificationStatus);

// // Admin verification
// router.get('/admin/pending', protect, authorize('admin'), getPendingShops);
// router.get('/admin/all', protect, authorize('admin'), getAllShopsAdmin);
// router.put('/admin/verify/:shopId', protect, authorize('admin'), verifyShop);

// // Public (keep this LAST — it has :id param that can catch other routes)
// router.get('/:id', getShopById);

// module.exports = router;

const express = require('express');
const router = express.Router();
const {
  createShop, getMyShop, updateShop, getNearbyShops, getShopById, getAllShops,
  submitVerification, getVerificationStatus,
  getPendingShops, getAllShopsAdmin, verifyShop,
  deleteShop, addShopPhoto, deleteShopPhoto
} = require('../controllers/shopController');
const { protect, authorize } = require('../middleware/auth');

// Public
router.get('/nearby', getNearbyShops);
router.get('/all', getAllShops);

// Retailer
router.get('/my-shop', protect, authorize('retailer'), getMyShop);
router.post('/', protect, authorize('retailer'), createShop);
router.put('/:id', protect, authorize('retailer'), updateShop);
router.delete('/:id', protect, authorize('retailer'), deleteShop);

// ✅ NEW: Shop Photos — Retailer
router.post('/photos', protect, authorize('retailer'), addShopPhoto);
router.delete('/photos/:photoId', protect, authorize('retailer'), deleteShopPhoto);

// Verification — Retailer
router.post('/verify/submit', protect, authorize('retailer'), submitVerification);
router.get('/verify/status', protect, authorize('retailer'), getVerificationStatus);

// Admin verification
router.get('/admin/pending', protect, authorize('admin'), getPendingShops);
router.get('/admin/all', protect, authorize('admin'), getAllShopsAdmin);
router.put('/admin/verify/:shopId', protect, authorize('admin'), verifyShop);

// Public (keep this LAST — it has :id param that can catch other routes)
router.get('/:id', getShopById);

module.exports = router;