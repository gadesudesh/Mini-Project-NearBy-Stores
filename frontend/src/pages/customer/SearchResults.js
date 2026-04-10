// // frontend/src/pages/customer/SearchResults.js
// // FEATURE 2: Multiple shops comparison
// // FEATURE 3: Grouped by shop view
// // Enhanced with sorting, brand badges, shop ratings

// import React, { useState, useEffect } from 'react';
// import { useSearchParams, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import API from '../../api/axios';
// import LoadingSpinner from '../../components/LoadingSpinner';
// import SortControls from '../../components/SortControls';
// import ShopGroupCard from '../../components/ShopGroupCard';
// import StarRating from '../../components/StarRating';
// import { FiSearch, FiNavigation, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';

// const SearchResults = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const { location } = useAuth();

//   const [query, setQuery] = useState(searchParams.get('q') || '');
//   const [products, setProducts] = useState([]);
//   const [groupedData, setGroupedData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [sort, setSort] = useState('price');
//   const [viewMode, setViewMode] = useState('list'); // 'list' or 'grouped'

//   useEffect(() => {
//     const q = searchParams.get('q');
//     if (q) {
//       setQuery(q);
//       fetchResults(q);
//     }
//   }, [searchParams, location, sort, viewMode]);

//   const fetchResults = async (q) => {
//     try {
//       setLoading(true);

//       const params = { q, sort };
//       if (location) {
//         params.lat = location.lat;
//         params.lng = location.lng;
//         params.radius = 50;
//       }

//       if (viewMode === 'grouped') {
//         // Fetch grouped by shop
//         params.groupByShop = 'true';
//         const res = await API.get('/products/search', { params });
//         setGroupedData(res.data.grouped || []);
//         setProducts([]);
//       } else {
//         // Fetch flat list
//         const res = await API.get('/products/search', { params });
//         setProducts(res.data.products || []);
//         setGroupedData([]);
//       }
//     } catch (err) {
//       console.error('Search error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (query.trim()) navigate(`/customer/search?q=${encodeURIComponent(query)}`);
//   };

//   const totalCount =
//     viewMode === 'grouped'
//       ? groupedData.reduce((sum, g) => sum + g.products.length, 0)
//       : products.length;

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//       {/* Back */}
//       <button
//         onClick={() => navigate('/customer/dashboard')}
//         className="flex items-center gap-2 text-gray-500 hover:text-primary-600 mb-4 transition-colors"
//       >
//         <FiArrowLeft size={18} /> Back to Dashboard
//       </button>

//       {/* Search Bar */}
//       <form onSubmit={handleSearch} className="flex gap-3 mb-4">
//         <div className="relative flex-1">
//           <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
//           <input
//             type="text"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             className="input-field pl-12 py-3.5"
//             placeholder="Search products..."
//           />
//         </div>
//         <button type="submit" className="btn-primary px-6">
//           Search
//         </button>
//       </form>

//       {/* Sort & View Controls */}
//       <SortControls
//         sort={sort}
//         setSort={setSort}
//         viewMode={viewMode}
//         setViewMode={setViewMode}
//       />

//       {/* Results Header */}
//       <div className="mb-4 flex items-center justify-between">
//         <h2 className="text-lg font-bold text-gray-900">
//           {loading
//             ? 'Searching...'
//             : viewMode === 'grouped'
//             ? `${totalCount} products in ${groupedData.length} shops for "${searchParams.get('q')}"`
//             : `${totalCount} results for "${searchParams.get('q')}"`}
//         </h2>
//       </div>

//       {/* Loading */}
//       {loading && <LoadingSpinner text="Searching nearby shops..." />}

//       {/* No Results */}
//       {!loading && totalCount === 0 && (
//         <div className="card p-12 text-center">
//           <div className="text-5xl mb-4">🔍</div>
//           <h3 className="text-lg font-bold text-gray-900 mb-2">No products found</h3>
//           <p className="text-gray-500">Try a different search term or increase the area</p>
//         </div>
//       )}

//       {/* ========================================= */}
//       {/* GROUPED BY SHOP VIEW (Feature 3) */}
//       {/* ========================================= */}
//       {!loading && viewMode === 'grouped' && groupedData.length > 0 && (
//         <div className="space-y-6">
//           {groupedData.map((shopGroup, idx) => (
//             <ShopGroupCard key={shopGroup.shop?._id || idx} shopData={shopGroup} />
//           ))}
//         </div>
//       )}

//       {/* ========================================= */}
//       {/* LIST VIEW — All products (Feature 2) */}
//       {/* Shows ALL shops selling the product */}
//       {/* ========================================= */}
//       {!loading && viewMode === 'list' && products.length > 0 && (
//         <div className="space-y-4">
//           {products.map((product) => (
//             <div
//               key={product._id}
//               className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-primary-200 transition-colors"
//             >
//               {/* Product Image */}
//               <div className="flex-shrink-0">
//                 <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100">
//                   {product.image ? (
//                     <img
//                       src={product.image}
//                       alt={product.productName}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center">
//                       <FiShoppingBag className="text-gray-400" size={24} />
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Product Info */}
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-start gap-2 flex-wrap">
//                   <h3 className="font-bold text-gray-900 text-lg">{product.productName}</h3>
//                   {product.brand && (
//                     <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
//                       {product.brand}
//                     </span>
//                   )}
//                 </div>
//                 <p className="text-sm text-gray-500 mt-0.5">{product.description}</p>

//                 {/* Shop Info with Rating */}
//                 {product.shop && (
//                   <div className="flex flex-wrap items-center gap-3 mt-2">
//                     <span
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         navigate(`/customer/shop/${product.shop._id}`);
//                       }}
//                       className="text-sm text-primary-600 font-medium hover:underline cursor-pointer flex items-center gap-1"
//                     >
//                       🏪 {product.shop.shopName}
//                     </span>

//                     {product.shop.averageRating > 0 && (
//                       <StarRating
//                         rating={product.shop.averageRating}
//                         count={product.shop.reviewCount}
//                         size={12}
//                       />
//                     )}

//                     {product.distance !== undefined && (
//                       <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
//                         <FiNavigation size={12} />
//                         {product.distance} km
//                       </span>
//                     )}
//                   </div>
//                 )}
//               </div>

//               {/* Price & Stock */}
//               <div className="text-right flex-shrink-0">
//                 <p className="text-2xl font-bold text-gray-900">
//                   ₹{product.price.toLocaleString()}
//                 </p>
//                 <p className="text-xs text-gray-400">per {product.unit}</p>
//                 <span
//                   className={`inline-block mt-2 text-xs font-medium px-2.5 py-1 rounded-full ${
//                     product.stock > 0
//                       ? 'bg-green-50 text-green-600'
//                       : 'bg-red-50 text-red-600'
//                   }`}
//                 >
//                   {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SearchResults;

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import SortControls from '../../components/SortControls';
import ShopGroupCard from '../../components/ShopGroupCard';
import StarRating from '../../components/StarRating';
import { FiSearch, FiNavigation, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';

// ✅ Haversine Formula - Calculates real distance between two GPS coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371; // Earth's radius in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return parseFloat(distance.toFixed(2));
};

// ✅ Helper to get real distance for a product/shop using user's actual location
const getRealDistance = (shop, userLocation) => {
  if (!userLocation) return null;

  if (shop && shop.location && shop.location.coordinates) {
    const shopLng = shop.location.coordinates[0];
    const shopLat = shop.location.coordinates[1];
    return calculateDistance(
      userLocation.lat,
      userLocation.lng,
      shopLat,
      shopLng
    );
  }
  if (shop && shop.lat && shop.lng) {
    return calculateDistance(
      userLocation.lat,
      userLocation.lng,
      shop.lat,
      shop.lng
    );
  }
  if (shop && shop.latitude && shop.longitude) {
    return calculateDistance(
      userLocation.lat,
      userLocation.lng,
      shop.latitude,
      shop.longitude
    );
  }
  return null;
};

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { location } = useAuth();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [products, setProducts] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('price');
  const [viewMode, setViewMode] = useState('list');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      fetchResults(q);
    }
  }, [searchParams, location, sort, viewMode]);

  const fetchResults = async (q) => {
    try {
      setLoading(true);

      const params = { q, sort };

      // ✅ Use real user location from AuthContext (GPS or Kanjurmarg East fallback)
      if (location) {
        params.lat = location.lat;
        params.lng = location.lng;
      }
      params.radius = 50;

      if (viewMode === 'grouped') {
        params.groupByShop = 'true';
        const res = await API.get('/products/search', { params });

        // ✅ Calculate real distances using actual user location
        const groupedWithRealDistance = (res.data.grouped || []).map((shopGroup) => {
          const realDistance = getRealDistance(shopGroup.shop, location);
          return {
            ...shopGroup,
            distance: realDistance !== null ? realDistance : shopGroup.distance,
          };
        });

        groupedWithRealDistance.sort((a, b) => (a.distance || 999) - (b.distance || 999));

        setGroupedData(groupedWithRealDistance);
        setProducts([]);
      } else {
        const res = await API.get('/products/search', { params });

        // ✅ Calculate real distances using actual user location
        const productsWithRealDistance = (res.data.products || []).map((product) => {
          const realDistance = getRealDistance(product.shop, location);
          return {
            ...product,
            distance: realDistance !== null ? realDistance : product.distance,
          };
        });

        setProducts(productsWithRealDistance);
        setGroupedData([]);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/customer/search?q=${encodeURIComponent(query)}`);
  };

  const totalCount =
    viewMode === 'grouped'
      ? groupedData.reduce((sum, g) => sum + g.products.length, 0)
      : products.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back */}
      <button
        onClick={() => navigate('/customer/dashboard')}
        className="flex items-center gap-2 text-gray-500 hover:text-primary-600 mb-4 transition-colors"
      >
        <FiArrowLeft size={18} /> Back to Dashboard
      </button>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input-field pl-12 py-3.5"
            placeholder="Search products..."
          />
        </div>
        <button type="submit" className="btn-primary px-6">
          Search
        </button>
      </form>

      {/* Sort & View Controls */}
      <SortControls
        sort={sort}
        setSort={setSort}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Results Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">
          {loading
            ? 'Searching...'
            : viewMode === 'grouped'
            ? `${totalCount} products in ${groupedData.length} shops for "${searchParams.get('q')}"`
            : `${totalCount} results for "${searchParams.get('q')}"`}
        </h2>
        {/* ✅ Show actual location source */}
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <FiNavigation size={10} /> 
          {location ? `📍 ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Location not available'}
        </span>
      </div>

      {/* Loading */}
      {loading && <LoadingSpinner text="Searching nearby shops..." />}

      {/* No Results */}
      {!loading && totalCount === 0 && (
        <div className="card p-12 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500">Try a different search term or increase the area</p>
        </div>
      )}

      {/* GROUPED BY SHOP VIEW */}
      {!loading && viewMode === 'grouped' && groupedData.length > 0 && (
        <div className="space-y-6">
          {groupedData.map((shopGroup, idx) => (
            <ShopGroupCard key={shopGroup.shop?._id || idx} shopData={shopGroup} />
          ))}
        </div>
      )}

      {/* LIST VIEW — All products */}
      {!loading && viewMode === 'list' && products.length > 0 && (
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-primary-200 transition-colors"
            >
              {/* Product Image */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.productName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiShoppingBag className="text-gray-400" size={24} />
                    </div>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 flex-wrap">
                  <h3 className="font-bold text-gray-900 text-lg">{product.productName}</h3>
                  {product.brand && (
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                      {product.brand}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{product.description}</p>

                {/* Shop Info with Rating */}
                {product.shop && (
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/customer/shop/${product.shop._id}`);
                      }}
                      className="text-sm text-primary-600 font-medium hover:underline cursor-pointer flex items-center gap-1"
                    >
                      🏪 {product.shop.shopName}
                    </span>

                    {product.shop.averageRating > 0 && (
                      <StarRating
                        rating={product.shop.averageRating}
                        count={product.shop.reviewCount}
                        size={12}
                      />
                    )}

                    {/* ✅ Show real distance */}
                    {product.distance !== undefined && product.distance !== null && (
                      <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
                        <FiNavigation size={12} />
                        {product.distance} km
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Price & Stock */}
              <div className="text-right flex-shrink-0">
                <p className="text-2xl font-bold text-gray-900">
                  ₹{product.price.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400">per {product.unit}</p>
                <span
                  className={`inline-block mt-2 text-xs font-medium px-2.5 py-1 rounded-full ${
                    product.stock > 0
                      ? 'bg-green-50 text-green-600'
                      : 'bg-red-50 text-red-600'
                  }`}
                >
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;