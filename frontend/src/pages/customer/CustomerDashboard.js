import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import MapView from '../../components/MapView';
import StarRating from '../../components/StarRating';
import LoadingSpinner from '../../components/LoadingSpinner';
import VerifiedBadge from '../../components/VerifiedBadge';
import { FiSearch, FiMapPin, FiNavigation, FiFilter } from 'react-icons/fi';

const CustomerDashboard = () => {
  const { user, location } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('distance');
  const [radius, setRadius] = useState(10);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (location) fetchNearbyShops();
  }, [location, radius]);

  const fetchNearbyShops = async () => {
    try {
      setLoading(true);
      const res = await API.get(
        `/shops/nearby?lat=${location.lat}&lng=${location.lng}&radius=${radius}`
      );
      setShops(res.data.shops);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim())
      navigate(`/customer/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const sortedShops = [...shops].sort((a, b) => {
    if (sortBy === 'distance') return (a.distance || 0) - (b.distance || 0);
    if (sortBy === 'rating') return (b.averageRating || 0) - (a.averageRating || 0);
    return a.shopName.localeCompare(b.shopName);
  });

  const getCategoryEmoji = (category) => {
    const map = {
      home_appliances: '🏠',
      hardware: '🔧',
      electronics: '📱',
      sports: '🏏',
      fitness: '💪',
      accessories: '⌚',
      stationery: '📝',
      personal_care: '✨',
      grocery: '🛒',
      bakery: '🍰',
      pharmacy: '💊',
      clothing: '👕',
      restaurant: '🍽️',
      general: '🏪',
      other: '🏪',
    };
    return map[category] || '🏪';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Welcome & Search */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
          Hello, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500">Find products at the best prices near you</p>

        <form onSubmit={handleSearch} className="mt-6 flex gap-3">
          <div className="relative flex-1">
            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-12 py-3.5 text-lg"
              placeholder="Search products, e.g. 'mixer', 'laptop', 'cricket bat'..."
            />
          </div>
          <button type="submit" className="btn-primary px-8">
            Search
          </button>
        </form>

        <div className="flex flex-wrap gap-2 mt-4">
          {[
            'Refrigerator',
            'Laptop',
            'Cricket Bat',
            'Headphones',
            'Mixer Grinder',
            'Yoga Mat',
            'Watch',
            'Trimmer',
            'Drill',
          ].map((tag) => (
            <button
              key={tag}
              onClick={() => navigate(`/customer/search?q=${tag}`)}
              className="px-4 py-1.5 bg-gray-100 hover:bg-primary-50 hover:text-primary-600 text-gray-600 rounded-full text-sm font-medium transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Map Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FiMapPin className="text-primary-600" /> Shops Near You
          </h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 btn-secondary py-2 px-4 text-sm"
          >
            <FiFilter size={16} /> Filters
          </button>
        </div>

        {showFilters && (
          <div className="card p-4 mb-4 flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-600">Sort:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field py-2 px-3 text-sm w-auto"
              >
                <option value="distance">Distance</option>
                <option value="rating">Rating</option>
                <option value="name">Name</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-600">Radius:</label>
              <select
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="input-field py-2 px-3 text-sm w-auto"
              >
                <option value={2}>2 km</option>
                <option value={5}>5 km</option>
                <option value={10}>10 km</option>
                <option value={25}>25 km</option>
                <option value={50}>50 km</option>
              </select>
            </div>
          </div>
        )}

        {/* MAP WITH ROUTING ENABLED */}
        {location && (
          <MapView
            userLocation={location}
            shops={shops}
            enableRouting={true}
            height="400px"
          />
        )}

        {/* Routing instructions */}
        {location && shops.length > 0 && (
          <p className="text-xs text-gray-400 mt-2 text-center">
            💡 Click any shop marker on the map to see driving directions
          </p>
        )}
      </div>

      {/* Shop List */}
      {loading ? (
        <LoadingSpinner text="Finding nearby shops..." />
      ) : sortedShops.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-5xl mb-4">🏪</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No shops found nearby</h3>
          <p className="text-gray-500">Try increasing the search radius</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedShops.map((shop) => (
            <div
              key={shop._id}
              onClick={() => navigate(`/customer/shop/${shop._id}`)}
              className="card overflow-hidden cursor-pointer hover:border-primary-200 group"
            >
              {/* Shop Image */}
              {shop.image && (
                <div className="w-full h-40 overflow-hidden">
                  <img
                    src={shop.image}
                    alt={shop.shopName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {!shop.image && (
                      <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                        {getCategoryEmoji(shop.category)}
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {shop.shopName}
                      </h3>
                      {/* ✅ VERIFIED BADGE */}
                      <VerifiedBadge status={shop.verification?.status} size="sm" />
                    </div>
                  </div>
                  {shop.distance !== undefined && (
                    <span className="flex items-center gap-1 text-sm text-primary-600 font-medium bg-primary-50 px-2.5 py-1 rounded-full flex-shrink-0 ml-2">
                      <FiNavigation size={12} />
                      {shop.distance} km
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-500 mb-2 line-clamp-1">{shop.address}</p>

                {shop.description && (
                  <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                    {shop.description}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <StarRating
                    rating={shop.averageRating || 0}
                    count={shop.reviewCount}
                    size={14}
                  />
                  <span className="text-xs text-gray-400 capitalize bg-gray-50 px-2 py-1 rounded-full">
                    {shop.category?.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;