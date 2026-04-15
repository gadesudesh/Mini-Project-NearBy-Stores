
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import API from '../../api/axios';
// import MapView from '../../components/MapView';
// import StarRating from '../../components/StarRating';
// import LoadingSpinner from '../../components/LoadingSpinner';
// import VerifiedBadge from '../../components/VerifiedBadge';
// import { FiSearch, FiMapPin, FiNavigation, FiFilter } from 'react-icons/fi';

// // ✅ Haversine Formula for accurate frontend distance calculation
// const calculateDistance = (lat1, lon1, lat2, lon2) => {
//   const toRad = (deg) => (deg * Math.PI) / 180;
//   const R = 6371;
//   const dLat = toRad(lat2 - lat1);
//   const dLon = toRad(lon2 - lon1);
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
//     Math.sin(dLon / 2) * Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return parseFloat((R * c).toFixed(2));
// };

// const CustomerDashboard = () => {
//   const { user, location } = useAuth();
//   const navigate = useNavigate();
//   const [searchQuery, setSearchQuery] = useState('');
//   const [shops, setShops] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [sortBy, setSortBy] = useState('distance');
//   const [radius, setRadius] = useState(10);
//   const [showFilters, setShowFilters] = useState(false);

//   useEffect(() => {
//     if (location) fetchNearbyShops();
//   }, [location, radius]);

//   const fetchNearbyShops = async () => {
//     try {
//       setLoading(true);
//       const res = await API.get(
//         `/shops/nearby?lat=${location.lat}&lng=${location.lng}&radius=${radius}`
//       );

//       // ✅ Recalculate distances on frontend using actual user location
//       const shopsWithRealDistance = (res.data.shops || []).map((shop) => {
//         if (shop.location && shop.location.coordinates) {
//           const shopLng = shop.location.coordinates[0];
//           const shopLat = shop.location.coordinates[1];
//           const realDistance = calculateDistance(
//             location.lat, location.lng, shopLat, shopLng
//           );
//           return { ...shop, distance: realDistance };
//         }
//         return shop;
//       });

//       setShops(shopsWithRealDistance);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim())
//       navigate(`/customer/search?q=${encodeURIComponent(searchQuery)}`);
//   };

//   const sortedShops = [...shops].sort((a, b) => {
//     if (sortBy === 'distance') return (a.distance || 0) - (b.distance || 0);
//     if (sortBy === 'rating') return (b.averageRating || 0) - (a.averageRating || 0);
//     return a.shopName.localeCompare(b.shopName);
//   });

//   const getCategoryEmoji = (category) => {
//     const map = {
//       home_appliances: '🏠',
//       hardware: '🔧',
//       electronics: '📱',
//       sports: '🏏',
//       fitness: '💪',
//       accessories: '⌚',
//       stationery: '📝',
//       personal_care: '✨',
//       grocery: '🛒',
//       bakery: '🍰',
//       pharmacy: '💊',
//       clothing: '👕',
//       restaurant: '🍽️',
//       general: '🏪',
//       other: '🏪',
//     };
//     return map[category] || '🏪';
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//       {/* Welcome & Search */}
//       <div className="mb-8">
//         <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
//           Hello, {user?.name?.split(' ')[0]} 👋
//         </h1>
//         <p className="text-gray-500">Find products at the best prices near you</p>

//         <form onSubmit={handleSearch} className="mt-6 flex gap-3">
//           <div className="relative flex-1">
//             <FiSearch
//               className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
//               size={20}
//             />
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="input-field pl-12 py-3.5 text-lg"
//               placeholder="Search products, e.g. 'mixer', 'laptop', 'cricket bat'..."
//             />
//           </div>
//           <button type="submit" className="btn-primary px-8">
//             Search
//           </button>
//         </form>

//         <div className="flex flex-wrap gap-2 mt-4">
//           {[
//             'Refrigerator',
//             'Laptop',
//             'Cricket Bat',
//             'Headphones',
//             'Mixer Grinder',
//             'Yoga Mat',
//             'Watch',
//             'Trimmer',
//             'Drill',
//           ].map((tag) => (
//             <button
//               key={tag}
//               onClick={() => navigate(`/customer/search?q=${tag}`)}
//               className="px-4 py-1.5 bg-gray-100 hover:bg-primary-50 hover:text-primary-600 text-gray-600 rounded-full text-sm font-medium transition-colors"
//             >
//               {tag}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Map Section */}
//       <div className="mb-8">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
//             <FiMapPin className="text-primary-600" /> Shops Near You
//           </h2>
//           <div className="flex items-center gap-3">
//             {/* ✅ Show current location being used */}
//             {location && (
//               <span className="text-xs text-gray-400 hidden sm:flex items-center gap-1">
//                 <FiNavigation size={10} />
//                 📍 {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
//               </span>
//             )}
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className="flex items-center gap-2 btn-secondary py-2 px-4 text-sm"
//             >
//               <FiFilter size={16} /> Filters
//             </button>
//           </div>
//         </div>

//         {showFilters && (
//           <div className="card p-4 mb-4 flex flex-wrap gap-4 items-center">
//             <div className="flex items-center gap-2">
//               <label className="text-sm font-medium text-gray-600">Sort:</label>
//               <select
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//                 className="input-field py-2 px-3 text-sm w-auto"
//               >
//                 <option value="distance">Distance</option>
//                 <option value="rating">Rating</option>
//                 <option value="name">Name</option>
//               </select>
//             </div>
//             <div className="flex items-center gap-2">
//               <label className="text-sm font-medium text-gray-600">Radius:</label>
//               <select
//                 value={radius}
//                 onChange={(e) => setRadius(Number(e.target.value))}
//                 className="input-field py-2 px-3 text-sm w-auto"
//               >
//                 <option value={2}>2 km</option>
//                 <option value={5}>5 km</option>
//                 <option value={10}>10 km</option>
//                 <option value={25}>25 km</option>
//                 <option value={50}>50 km</option>
//               </select>
//             </div>
//           </div>
//         )}

//         {/* MAP WITH ROUTING ENABLED */}
//         {location && (
//           <MapView
//             userLocation={location}
//             shops={shops}
//             enableRouting={true}
//             height="400px"
//           />
//         )}

//         {location && shops.length > 0 && (
//           <p className="text-xs text-gray-400 mt-2 text-center">
//             💡 Click any shop marker on the map to see driving directions
//           </p>
//         )}
//       </div>

//       {/* Shop List */}
//       {loading ? (
//         <LoadingSpinner text="Finding nearby shops..." />
//       ) : sortedShops.length === 0 ? (
//         <div className="card p-12 text-center">
//           <div className="text-5xl mb-4">🏪</div>
//           <h3 className="text-lg font-bold text-gray-900 mb-2">No shops found nearby</h3>
//           <p className="text-gray-500">Try increasing the search radius</p>
//         </div>
//       ) : (
//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {sortedShops.map((shop) => (
//             <div
//               key={shop._id}
//               onClick={() => navigate(`/customer/shop/${shop._id}`)}
//               className="card overflow-hidden cursor-pointer hover:border-primary-200 group"
//             >
//               {/* Shop Image */}
//               {shop.image && (
//                 <div className="w-full h-40 overflow-hidden">
//                   <img
//                     src={shop.image}
//                     alt={shop.shopName}
//                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                   />
//                 </div>
//               )}

//               <div className="p-5">
//                 <div className="flex items-start justify-between mb-2">
//                   <div className="flex items-center gap-2 flex-wrap">
//                     {!shop.image && (
//                       <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
//                         {getCategoryEmoji(shop.category)}
//                       </div>
//                     )}
//                     <div>
//                       <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
//                         {shop.shopName}
//                       </h3>
//                       <VerifiedBadge status={shop.verification?.status} size="sm" />
//                     </div>
//                   </div>
//                   {shop.distance !== undefined && (
//                     <span className="flex items-center gap-1 text-sm text-primary-600 font-medium bg-primary-50 px-2.5 py-1 rounded-full flex-shrink-0 ml-2">
//                       <FiNavigation size={12} />
//                       {shop.distance} km
//                     </span>
//                   )}
//                 </div>

//                 <p className="text-sm text-gray-500 mb-2 line-clamp-1">{shop.address}</p>

//                 {shop.description && (
//                   <p className="text-xs text-gray-400 mb-3 line-clamp-2">
//                     {shop.description}
//                   </p>
//                 )}

//                 <div className="flex items-center justify-between">
//                   <StarRating
//                     rating={shop.averageRating || 0}
//                     count={shop.reviewCount}
//                     size={14}
//                   />
//                   <span className="text-xs text-gray-400 capitalize bg-gray-50 px-2 py-1 rounded-full">
//                     {shop.category?.replace('_', ' ')}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomerDashboard;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import MapView from '../../components/MapView';
import StarRating from '../../components/StarRating';
import LoadingSpinner from '../../components/LoadingSpinner';
import VerifiedBadge from '../../components/VerifiedBadge';
import { FiSearch, FiMapPin, FiNavigation, FiFilter } from 'react-icons/fi';

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
};

const CustomerDashboard = () => {
  const {
    user,
    location,
    locationLoading,
    locationError,
    locationPermission,
    requestLocation,
  } = useAuth();

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
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

      const shopsWithRealDistance = (res.data.shops || []).map((shop) => {
        if (shop.location && shop.location.coordinates) {
          const shopLng = shop.location.coordinates[0];
          const shopLat = shop.location.coordinates[1];
          const realDistance = calculateDistance(
            location.lat, location.lng, shopLat, shopLng
          );
          return { ...shop, distance: realDistance };
        }
        return shop;
      });

      setShops(shopsWithRealDistance);
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

  // ✅ Location Permission Screen — shown when location is not available
  if (!location && !locationLoading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20">
        <div className="card p-8 text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiMapPin className="text-primary-600" size={36} />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Enable Location Access
          </h2>

          {/* Different messages based on error type */}
          {locationError === 'denied' ? (
            <>
              <p className="text-gray-500 mb-6 leading-relaxed">
                Location access was denied. To find nearby shops, please enable
                location in your browser settings:
              </p>
              <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left text-sm text-gray-600 space-y-2">
                <p className="font-semibold text-gray-700">📱 On Mobile:</p>
                <p>
                  <strong>Android Chrome:</strong> Tap the{' '}
                  <span className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">🔒</span>{' '}
                  icon in the address bar → Permissions → Location → Allow
                </p>
                <p>
                  <strong>iPhone Safari:</strong> Settings → Safari → Location →
                  Allow
                </p>
                <hr className="my-2" />
                <p className="font-semibold text-gray-700">💻 On Desktop:</p>
                <p>
                  Click the{' '}
                  <span className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">🔒</span>{' '}
                  icon in the address bar → Site Settings → Location → Allow
                </p>
              </div>
            </>
          ) : locationError === 'timeout' ? (
            <p className="text-gray-500 mb-6 leading-relaxed">
              Location request timed out. Please make sure your GPS is turned on
              and try again.
            </p>
          ) : locationError === 'unavailable' ? (
            <p className="text-gray-500 mb-6 leading-relaxed">
              Your location could not be determined. Please make sure GPS/Location
              Services are turned on in your device settings.
            </p>
          ) : (
            <p className="text-gray-500 mb-6 leading-relaxed">
              We need your location to show nearby shops and the best prices
              around you. Click below to enable location access.
            </p>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={requestLocation}
              className="btn-primary w-full py-3.5 text-lg flex items-center justify-center gap-2"
            >
              <FiNavigation size={20} />
              {locationError === 'denied'
                ? 'Try Again'
                : 'Allow Location Access'}
            </button>

            {/* Optional: Let them search without location */}
            <button
              onClick={() => navigate('/customer/search?q=')}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Skip for now — Search products instead
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Loading screen while getting location
  if (locationLoading && !location) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20">
        <div className="card p-8 text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Getting Your Location...
          </h2>
          <p className="text-gray-500">
            Please tap <strong>"Allow"</strong> when prompted to enable location
            access.
          </p>
        </div>
      </div>
    );
  }

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
          <div className="flex items-center gap-3">
            {location && (
              <span className="text-xs text-gray-400 hidden sm:flex items-center gap-1">
                <FiNavigation size={10} />
                📍 {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </span>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 btn-secondary py-2 px-4 text-sm"
            >
              <FiFilter size={16} /> Filters
            </button>
          </div>
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

        {location && (
          <MapView
            userLocation={location}
            shops={shops}
            enableRouting={true}
            height="400px"
          />
        )}

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