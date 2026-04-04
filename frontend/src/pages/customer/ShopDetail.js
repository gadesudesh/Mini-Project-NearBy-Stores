// frontend/src/pages/customer/ShopDetail.js
// FEATURE 1: Route Directions + Travel Time
// FEATURE 4: Map with shop marker + route polyline
// FEATURE: Verification Badge

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import MapView from '../../components/MapView';
import StarRating from '../../components/StarRating';
import LoadingSpinner from '../../components/LoadingSpinner';
import DirectionsModal from '../../components/DirectionsModal';
import VerifiedBadge from '../../components/VerifiedBadge';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiMapPin, FiPhone, FiStar, FiShoppingBag, FiNavigation } from 'react-icons/fi';

const ShopDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { location } = useAuth();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('products');

  // Directions state
  const [showDirections, setShowDirections] = useState(false);
  const [activeRoute, setActiveRoute] = useState(null);

  useEffect(() => {
    fetchShopData();
  }, [id]);

  const fetchShopData = async () => {
    try {
      setLoading(true);
      const [s, p, r] = await Promise.all([
        API.get(`/shops/${id}`),
        API.get(`/products/shop/${id}`),
        API.get(`/reviews/shop/${id}`),
      ]);
      setShop(s.data.shop);
      setProducts(p.data.products);
      setReviews(r.data.reviews);
    } catch (err) {
      toast.error('Failed to load shop details');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post('/reviews', { shopId: id, ...reviewForm });
      toast.success('Review submitted!');
      setReviewForm({ rating: 5, comment: '' });
      fetchShopData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectRoute = (routeData) => {
    setActiveRoute(routeData);
    toast.success(
      `${routeData.mode === 'drive' ? '🚗' : routeData.mode === 'walk' ? '🚶' : routeData.mode === 'bicycle' ? '🚴' : '🚌'} ${routeData.distance} km • ${routeData.time} min`,
      { autoClose: 2000 }
    );
  };

  if (loading) return <LoadingSpinner text="Loading shop details..." />;
  if (!shop) return <div className="text-center py-20 text-gray-500">Shop not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-primary-600 mb-6 transition-colors"
      >
        <FiArrowLeft size={18} /> Back
      </button>

      {/* Shop Header */}
      <div className="card overflow-hidden mb-6">
        {shop.image && (
          <div className="w-full h-48 sm:h-56 overflow-hidden">
            <img src={shop.image} alt={shop.shopName} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              {/* ✅ SHOP NAME + VERIFIED BADGE */}
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{shop.shopName}</h1>
                <VerifiedBadge status={shop.verification?.status} size="md" />
              </div>

              {/* Verified trust message */}
              {shop.verification?.status === 'verified' && (
                <p className="text-xs text-green-600 mb-2 flex items-center gap-1">
                  ✅ This shop has been verified by Near By Store. Documents and identity confirmed.
                </p>
              )}

              <p className="text-gray-500 mb-3">{shop.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <FiMapPin size={14} className="text-primary-600" /> {shop.address}
                </span>
                {shop.phone && (
                  <span className="flex items-center gap-1">
                    <FiPhone size={14} className="text-primary-600" /> {shop.phone}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 mt-3">
                <StarRating rating={shop.averageRating || 0} count={shop.reviewCount} />
                <span className="capitalize text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                  {shop.category?.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* GET DIRECTIONS BUTTON */}
            <button
              onClick={() => setShowDirections(true)}
              className="btn-primary flex items-center gap-2 flex-shrink-0"
            >
              <FiNavigation size={16} />
              Get Directions
            </button>
          </div>
        </div>
      </div>

      {/* Route Info Bar (if route is active) */}
      {activeRoute && (
        <div className="card p-4 mb-4 flex items-center justify-between bg-primary-50 border-primary-200">
          <div className="flex items-center gap-4">
            <span className="text-xl">
              {activeRoute.mode === 'drive' ? '🚗' : activeRoute.mode === 'walk' ? '🚶' : activeRoute.mode === 'bicycle' ? '🚴' : '🚌'}
            </span>
            <div>
              <p className="font-bold text-gray-900">
                {activeRoute.distance} km • {activeRoute.time < 60 ? `${activeRoute.time} min` : `${Math.floor(activeRoute.time / 60)}h ${activeRoute.time % 60}m`}
              </p>
              <p className="text-xs text-gray-500 capitalize">{activeRoute.mode} route</p>
            </div>
          </div>
          <button
            onClick={() => setActiveRoute(null)}
            className="text-xs bg-white text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 font-medium border border-red-200"
          >
            ✕ Clear Route
          </button>
        </div>
      )}

      {/* Map with Route Polyline */}
      <div className="mb-6">
        <MapView
          center={{
            lat: shop.location.coordinates[1],
            lng: shop.location.coordinates[0],
          }}
          shops={[shop]}
          userLocation={location}
          enableRouting={true}
          activeRouteCoords={activeRoute?.coordinates || []}
          height="350px"
        />
      </div>

      {/* Directions Modal */}
      <DirectionsModal
        isOpen={showDirections}
        onClose={() => setShowDirections(false)}
        userLocation={location}
        shop={shop}
        onSelectRoute={handleSelectRoute}
      />

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
        {[
          { key: 'products', label: `Products (${products.length})`, icon: FiShoppingBag },
          { key: 'reviews', label: `Reviews (${reviews.length})`, icon: FiStar },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab.key
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div>
          {products.length === 0 ? (
            <div className="card p-8 text-center text-gray-500">No products listed yet</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <div key={p._id} className="card overflow-hidden">
                  {p.image && (
                    <div className="w-full h-40 overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.productName}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900">{p.productName}</h3>
                        {p.brand && <span className="text-xs text-blue-600 font-medium">{p.brand}</span>}
                      </div>
                      <span className="text-lg font-bold text-primary-600 flex-shrink-0 ml-2">
                        ₹{p.price.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{p.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="capitalize bg-gray-100 px-2 py-1 rounded-full text-gray-500">
                        {p.category?.replace('_', ' ')}
                      </span>
                      <span className={`font-medium ${p.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {p.stock > 0 ? `${p.stock} ${p.unit}` : 'Out of stock'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div>
          <div className="card p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-4">Write a Review</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className={`text-2xl transition-transform hover:scale-110 ${
                        star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Comment</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="input-field h-24 resize-none"
                  placeholder="Share your experience..."
                />
              </div>
              <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>

          {reviews.length === 0 ? (
            <div className="card p-8 text-center text-gray-500">No reviews yet. Be the first!</div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="card p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-sm font-bold text-primary-600">
                        {review.user?.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{review.user?.name || 'Anonymous'}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric', month: 'short', day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <StarRating rating={review.rating} size={14} showNumber={false} />
                  </div>
                  {review.comment && <p className="text-gray-600 text-sm mt-2">{review.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShopDetail;