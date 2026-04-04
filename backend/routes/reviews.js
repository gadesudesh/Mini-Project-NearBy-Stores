const express = require('express');
const router = express.Router();
const { addReview, getShopReviews, deleteReview } = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('customer'), addReview);
router.get('/shop/:shopId', getShopReviews);
router.delete('/:id', protect, deleteReview);

module.exports = router;