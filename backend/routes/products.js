const express = require('express');
const router = express.Router();
const { addProduct, updateProduct, deleteProduct, getShopProducts, getMyProducts, searchProducts, getProduct, getAnalytics } = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

router.get('/search', searchProducts);
router.get('/my-products', protect, authorize('retailer'), getMyProducts);
router.get('/analytics/summary', protect, authorize('retailer'), getAnalytics);
router.get('/shop/:shopId', getShopProducts);
router.post('/', protect, authorize('retailer'), addProduct);
router.put('/:id', protect, authorize('retailer'), updateProduct);
router.delete('/:id', protect, authorize('retailer'), deleteProduct);
router.get('/:id', getProduct);

module.exports = router;