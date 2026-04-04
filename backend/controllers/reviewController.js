const Review = require('../models/Review');
const Shop = require('../models/Shop');

exports.addReview = async (req, res) => {
  try {
    const { shopId, rating, comment } = req.body;
    const shop = await Shop.findById(shopId);
    if (!shop) return res.status(404).json({ success: false, message: 'Shop not found' });
    const existing = await Review.findOne({ user: req.user.id, shop: shopId });
    if (existing) {
      existing.rating = rating;
      existing.comment = comment;
      await existing.save();
      return res.json({ success: true, review: existing, message: 'Review updated' });
    }
    const review = await Review.create({ user: req.user.id, shop: shopId, rating, comment });
    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getShopReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ shop: req.params.shopId }).populate('user', 'name').sort('-createdAt');
    const avgRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0;
    res.json({ success: true, count: reviews.length, averageRating: parseFloat(avgRating), reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};